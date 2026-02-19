import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { qpay } from '@/lib/qpay';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId } = await req.json();

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Create QPay invoice
        const invoice = await qpay.createInvoice(
            order.id,
            order.totalAmount,
            `Order #${order.paymentReference}`
        );

        // Update order with QPay info
        await prisma.order.update({
            where: { id: orderId },
            data: {
                qpayInvoiceId: invoice.invoice_id,
                qpayQrText: invoice.qr_text,
            },
        });

        return NextResponse.json(invoice);
    } catch (error) {
        console.error('Payment creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create payment invoice' },
            { status: 500 }
        );
    }
}
