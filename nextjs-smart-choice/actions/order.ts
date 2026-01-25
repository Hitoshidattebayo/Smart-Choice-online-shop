'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { generatePaymentReference } from '@/lib/payment-reference';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { sendEmail } from '@/lib/email';
import {
    generateAdminOrderNotificationHTML,
    generateAdminOrderNotificationText,
    generateCustomerConfirmationHTML,
    generateCustomerConfirmationText
} from '@/lib/email-templates';

// Define CartItem type locally to avoid circular deps or complex imports
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

const OrderSchema = z.object({
    customerName: z.string().min(2, "Name is required"),
    phoneNumber: z.string().min(8, "Phone number is required"),
    email: z.string().email().optional().or(z.literal("")),
    items: z.array(z.object({
        productId: z.string(),
        productName: z.string(),
        price: z.number(),
        quantity: z.number(),
        image: z.string().optional(),
    })),
    totalAmount: z.number(),
});

export async function createCartOrder(data: {
    customerName: string;
    phoneNumber: string;
    email: string;
    address: string;
    totalAmount: number;
    items: any[];
    paymentReference?: string; // Optional custom reference
    paymentMethod?: string; // Added paymentMethod
}) {
    // Note: formData here is expected to be a plain object, not FormData, 
    // because we're passing complex arrays from the client.
    // Or we can parse json string from FormData.

    // Changing approach: This action will be called with a plain object from the client component

    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || null;

        // Generate unique payment reference if not provided
        const paymentReference = data.paymentReference || `SC-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

        const order = await prisma.order.create({
            data: {
                customerName: data.customerName,
                phoneNumber: data.phoneNumber,
                email: data.email || null,
                address: data.address, // Save address
                totalAmount: data.totalAmount,
                paymentReference,
                paymentMethod: data.paymentMethod, // Save payment method
                userId,
                status: 'PENDING_PAYMENT',
                items: {
                    create: data.items.map((item: any) => ({
                        productId: item.id,
                        productName: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image,
                    })),
                },
            },
            include: {
                items: true, // Include items for email template
            },
        });

        // Send admin notification email (non-blocking - don't fail order if email fails)
        try {
            const adminEmail = process.env.ADMIN_EMAIL;

            if (adminEmail) {
                await sendEmail({
                    to: adminEmail,
                    subject: `🎉 Шинэ захиалга #${paymentReference} - Smart Choice`,
                    html: generateAdminOrderNotificationHTML({
                        orderId: order.id,
                        customerName: order.customerName,
                        phoneNumber: order.phoneNumber,
                        email: order.email || undefined,
                        address: order.address || '',
                        totalAmount: order.totalAmount,
                        items: order.items.map(item => ({
                            productName: item.productName,
                            quantity: item.quantity,
                            price: item.price,
                            image: item.image || undefined,
                        })),
                        paymentReference: order.paymentReference,
                        createdAt: order.createdAt,
                    }),
                    text: generateAdminOrderNotificationText({
                        orderId: order.id,
                        customerName: order.customerName,
                        phoneNumber: order.phoneNumber,
                        email: order.email || undefined,
                        address: order.address || '',
                        totalAmount: order.totalAmount,
                        items: order.items.map(item => ({
                            productName: item.productName,
                            quantity: item.quantity,
                            price: item.price,
                            image: item.image || undefined,
                        })),
                        paymentReference: order.paymentReference,
                        createdAt: order.createdAt,
                    }),
                });
                console.log('✅ Admin notification email sent for order:', order.id);
            } else {
                console.warn('⚠️ ADMIN_EMAIL not configured. Skipping admin notification.');
            }
        } catch (emailError) {
            // Log error but don't fail the order creation
            console.error('❌ Failed to send admin notification email:', emailError);
        }

        return { success: true, orderId: order.id, paymentReference };
    } catch (error) {
        console.error('Order creation failed:', error);
        return { success: false, error: 'Failed to create order' };
    }
}

// Keeping legacy support for single-item buy now if needed, updated to new schema
export async function createOrderSimple(formData: FormData) {
    const customerName = formData.get('customerName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const email = formData.get('email') as string;
    const productId = formData.get('productId') as string;
    const productName = formData.get('productName') as string;
    const amount = Number(formData.get('amount'));

    if (!customerName || !phoneNumber) {
        throw new Error("Missing required fields");
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;
    const paymentReference = await generatePaymentReference();

    await prisma.order.create({
        data: {
            customerName,
            phoneNumber,
            email: email || undefined,
            totalAmount: amount, // Mapped from amount
            status: 'PENDING_PAYMENT',
            paymentReference,
            userId: userId || undefined,
            items: {
                create: [{
                    productId,
                    productName,
                    price: amount,
                    quantity: 1,
                    image: '', // No image in simple flow currently
                }]
            }
        },
    });

    redirect(`/checkout/success?ref=${paymentReference}`);
}

// ... (previous code)

export async function markAsPaid(orderId: string) {
    try {
        // Update order status to PAID
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
            include: {
                items: true, // Include items for email template
            },
        });

        // Send customer confirmation email (non-blocking)
        try {
            // Only send if customer provided email
            if (order.email) {
                await sendEmail({
                    to: order.email,
                    subject: `✅ Захиалга баталгаажлаа #${order.paymentReference} - Smart Choice`,
                    html: generateCustomerConfirmationHTML({
                        orderId: order.id,
                        customerName: order.customerName,
                        phoneNumber: order.phoneNumber,
                        email: order.email,
                        address: order.address || '',
                        totalAmount: order.totalAmount,
                        items: order.items.map(item => ({
                            productName: item.productName,
                            quantity: item.quantity,
                            price: item.price,
                            image: item.image || undefined,
                        })),
                        paymentReference: order.paymentReference,
                        createdAt: order.createdAt,
                    }),
                    text: generateCustomerConfirmationText({
                        orderId: order.id,
                        customerName: order.customerName,
                        phoneNumber: order.phoneNumber,
                        email: order.email,
                        address: order.address || '',
                        totalAmount: order.totalAmount,
                        items: order.items.map(item => ({
                            productName: item.productName,
                            quantity: item.quantity,
                            price: item.price,
                            image: item.image || undefined,
                        })),
                        paymentReference: order.paymentReference,
                        createdAt: order.createdAt,
                    }),
                });
                console.log('✅ Customer confirmation email sent for order:', order.id);
            } else {
                console.log('⚠️ No customer email provided, skipping confirmation email');
            }
        } catch (emailError) {
            // Log error but don't fail the order status update
            console.error('❌ Failed to send customer confirmation email:', emailError);
        }

        // revalidatePath('/admin');
    } catch (error) {
        console.error('Failed to mark as paid', error);
        throw new Error('Failed to update order');
    }
}

export async function moveToTrash(orderId: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { deletedAt: new Date() },
        });
    } catch (error) {
        console.error('Failed to move to trash', error);
        throw new Error('Failed to update order');
    }
}

export async function restoreFromTrash(orderId: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { deletedAt: null },
        });
    } catch (error) {
        console.error('Failed to restore order', error);
        throw new Error('Failed to update order');
    }
}

export async function deletePermanently(orderId: string) {
    try {
        // First delete related items (if cascade isn't set in prisma, but it is implicitly for relation mode prisma usually, but let's be safe if needed. 
        // Actually Prisma handles Cascade if configured or if we use delete. OrderItem usually cascades.)
        // Ensure cascading delete in schema or manual delete.
        // Schema: items OrderItem[] -- implicit. 
        // Let's assume OnDelete Cascade is handled by DB or Prisma.
        // Ideally we should have defined @relation(onDelete: Cascade) in schema.
        // Let's check schema later. For now, try delete.
        await prisma.orderItem.deleteMany({ where: { orderId } }); // Manually clean items first just in case
        await prisma.order.delete({
            where: { id: orderId },
        });
    } catch (error) {
        console.error('Failed to delete order permanently', error);
        throw new Error('Failed to delete order');
    }
}

export async function emptyTrash() {
    try {
        // Find all deleted orders
        const trashedOrders = await prisma.order.findMany({
            where: {
                deletedAt: {
                    not: null
                }
            },
            select: { id: true }
        });

        for (const order of trashedOrders) {
            await deletePermanently(order.id);
        }
    } catch (error) {
        console.error('Failed to empty trash', error);
        throw new Error('Failed to empty trash');
    }
}

