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

import { client } from '@/sanity/client';
import { qpay } from '@/lib/qpay';

export async function createCartOrder(data: {
    customerName: string;
    phoneNumber: string;
    email: string;
    address: string;
    totalAmount: number; // We will ignore this from client and recalculate
    items: any[];
    paymentReference?: string;
    paymentMethod?: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || null;

        // 0. Auto-Cleanup: Delete pending orders older than 1 hour to keep DB clean
        // This runs asynchronously and doesn't block the main flow significantly
        try {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            await prisma.order.deleteMany({
                where: {
                    status: 'PENDING_PAYMENT',
                    createdAt: {
                        lt: oneHourAgo
                    }
                }
            });
        } catch (cleanupError) {
            console.error('Failed to cleanup old pending orders:', cleanupError);
            // Don't fail the new order creation because of cleanup failure
        }

        // 1. Parallel Fetch: Sanity Prices + QPay Token Warmup
        console.log('--- Order Creation Debug Start ---');
        console.log('Client Items:', JSON.stringify(data.items, null, 2));

        const productIds = data.items.map((item: any) => item.id);

        // Start both requests in parallel
        const [products] = await Promise.all([
            client.fetch(`*[_type == "product" && _id in $ids]{_id, price, name, classificationCode}`, { ids: productIds }),
            // qpay.ensureToken() removed - moved to createQPayInvoice
        ]);

        console.log('Sanity Products:', JSON.stringify(products, null, 2));

        // Create a map for faster lookup
        interface SanityProduct { _id: string; price: number; name: string; classificationCode?: string; }
        const productMap = new Map<string, SanityProduct>(
            products.map((p: any) => [p._id, p as SanityProduct])
        );

        // 2. Validate and Recalculate Total
        let calculatedTotal = 0;
        const ebarimtLines: any[] = [];

        const validatedItems = data.items.map((item: any) => {
            const product = productMap.get(item.id);
            if (!product) {
                throw new Error(`Product not found: ${item.name}`);
            }

            const freshPrice = product.price;
            calculatedTotal += freshPrice * item.quantity;

            // EBarimt Logic
            // Calculate VAT (10% inclusive)
            // VAT = TotalPrice - (TotalPrice / 1.1) = TotalPrice / 11
            const lineTotal = freshPrice * item.quantity;
            const vatAmount = lineTotal / 11;
            const classificationCode = product.classificationCode || '0111100'; // Default to generic goods if missing

            ebarimtLines.push({
                tax_product_code: "",
                line_description: product.name,
                line_quantity: item.quantity.toFixed(2),
                line_unit_price: freshPrice.toFixed(2),
                note: "",
                classification_code: classificationCode,
                taxes: [
                    {
                        tax_code: "VAT",
                        description: "НӨАТ",
                        amount: Number(vatAmount.toFixed(4)), // 4 decimal places as per example
                        note: "НӨАТ"
                    }
                ]
            });

            console.log(`Item: ${item.name} | Client Price: ${item.price} | Fresh Price: ${freshPrice} | Qty: ${item.quantity}`);

            return {
                ...item,
                price: freshPrice, // Use fresh price
                productName: product.name // Use fresh name
            };
        });

        console.log('Calculated Total:', calculatedTotal);
        console.log('--- Order Creation Debug End ---');

        // Generate unique payment reference if not provided
        const paymentReference = data.paymentReference || `SC-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

        // 3. Create Order in Database (Single Operation)
        const order = await prisma.order.create({
            data: {
                customerName: data.customerName,
                phoneNumber: data.phoneNumber,
                email: data.email || null,
                address: data.address,
                totalAmount: calculatedTotal, // Use calculated total
                paymentReference,
                paymentMethod: data.paymentMethod,
                userId,
                status: 'PENDING_PAYMENT',
                // qpayInvoiceId & qpayQrText will be generated async in next step
                items: {
                    create: validatedItems.map((item: any) => ({
                        productId: item.id,
                        productName: item.productName,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        // Admin notification email is now deferred until payment is confirmed (in markAsPaid)

        return {
            success: true,
            orderId: order.id,
            paymentReference,
            // qpayInvoice is now fetched separately
        };

    } catch (error) {
        console.error('Order creation failed:', error);
        return { success: false, error: 'Failed to create order' };
    }
}

export async function createQPayInvoice(orderId: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!order) throw new Error('Order not found');
        if (order.qpayInvoiceId) {
            // Already has invoice?
            // Logic to check expiration could go here
        }

        const description = `Order #${order.paymentReference}`;

        // EBarimt Logic (Simplified reconstruction)
        // VAT = TotalPrice - (TotalPrice / 1.1) = TotalPrice / 11
        const vatAmount = order.totalAmount / 11;
        const ebarimtLines = [{
            tax_product_code: "",
            line_description: "Order " + order.paymentReference,
            line_quantity: "1.00",
            line_unit_price: order.totalAmount.toFixed(2),
            note: "",
            classification_code: "0111100",
            taxes: [{
                tax_code: "VAT",
                description: "НӨАТ",
                amount: Number(vatAmount.toFixed(4)),
                note: "НӨАТ"
            }]
        }];

        const qpayInvoice = await qpay.createInvoice(
            order.paymentReference,
            order.totalAmount,
            description,
            {
                name: order.customerName,
                email: order.email || undefined,
                phone: order.phoneNumber
            },
            {
                taxType: "1",
                districtCode: "0101",
                lines: ebarimtLines
            }
        );

        // Update order with new invoice info
        await prisma.order.update({
            where: { id: orderId },
            data: {
                qpayInvoiceId: qpayInvoice.invoice_id,
                qpayQrText: qpayInvoice.qr_text
            }
        });

        return { success: true, qpayInvoice };

    } catch (error) {
        console.error('Failed to create QPay invoice async:', error);
        return { success: false, error: 'Failed to create QPay invoice' };
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

        // Send emails (non-blocking)
        try {
            const adminEmail = process.env.ADMIN_EMAIL;

            // 1. Send Admin Notification
            if (adminEmail) {
                const adminHTML = generateAdminOrderNotificationHTML({
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
                });
                const adminText = generateAdminOrderNotificationText({
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
                });

                await sendEmail({
                    to: adminEmail,
                    subject: `🎉 Шинэ захиалга (ТӨЛӨГДСӨН) #${order.paymentReference} - Smart Choice`,
                    html: adminHTML,
                    text: adminText,
                });
                console.log('✅ Admin notification email sent for paid order:', order.id);
            }

            // 2. Send Customer Confirmation
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

