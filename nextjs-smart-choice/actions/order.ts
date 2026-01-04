'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { generatePaymentReference } from '@/lib/payment-reference';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

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

export async function createCartOrder(formData: any) {
    // Note: formData here is expected to be a plain object, not FormData, 
    // because we're passing complex arrays from the client.
    // Or we can parse json string from FormData.

    // Changing approach: This action will be called with a plain object from the client component

    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || null;
        const paymentReference = await generatePaymentReference();

        const order = await prisma.order.create({
            data: {
                customerName: formData.customerName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                totalAmount: formData.totalAmount,
                status: 'PENDING_PAYMENT',
                paymentReference,
                userId: userId || undefined,
                items: {
                    create: formData.items.map((item: CartItem) => ({
                        productId: item.id,
                        productName: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    }))
                }
            }
        });

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
        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
        });
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

export async function cleanTrash() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find old deleted orders
        const oldOrders = await prisma.order.findMany({
            where: {
                deletedAt: {
                    lt: thirtyDaysAgo
                }
            },
            select: { id: true }
        });

        for (const order of oldOrders) {
            await deletePermanently(order.id);
        }
    } catch (error) {
        console.error('Failed to clean trash', error);
    }
}

