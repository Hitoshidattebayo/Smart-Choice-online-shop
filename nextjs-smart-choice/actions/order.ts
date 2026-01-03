'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generatePaymentReference } from '@/lib/payment-reference';
import { redirect } from 'next/navigation';

const OrderSchema = z.object({
    customerName: z.string().min(2, "Name is required"),
    phoneNumber: z.string().min(8, "Phone number is required"),
    email: z.string().email().optional().or(z.literal("")),
    productId: z.string(),
    productName: z.string(),
    amount: z.number(),
});

export async function createOrder(prevState: any, formData: FormData) {
    const validatedFields = OrderSchema.safeParse({
        customerName: formData.get('customerName'),
        phoneNumber: formData.get('phoneNumber'),
        email: formData.get('email'),
        productId: formData.get('productId'),
        productName: formData.get('productName'),
        amount: Number(formData.get('amount')),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Order.',
        };
    }

    const { customerName, phoneNumber, email, productId, productName, amount } = validatedFields.data;

    try {
        const paymentReference = await generatePaymentReference();

        await prisma.order.create({
            data: {
                customerName,
                phoneNumber,
                email: email || undefined,
                productId,
                productName,
                amount,
                status: 'PENDING_PAYMENT',
                paymentReference,
            },
        });

    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to Create Order.',
        };
    }
}

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

    const paymentReference = await generatePaymentReference();

    await prisma.order.create({
        data: {
            customerName,
            phoneNumber,
            email: email || undefined,
            productId,
            productName,
            amount,
            status: 'PENDING_PAYMENT',
            paymentReference,
        },
    });

    redirect(`/checkout/success?ref=${paymentReference}`);
}

export async function markAsPaid(orderId: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
        });
    } catch (error) {
        console.error('Failed to mark as paid', error);
        throw new Error('Failed to update order');
    }
}
