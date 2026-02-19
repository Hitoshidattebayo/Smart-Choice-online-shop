import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { qpay } from '@/lib/qpay';
import { markAsPaid } from '@/actions/order';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId } = await req.json();

        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order || !order.qpayInvoiceId) {
            return NextResponse.json({ error: 'Order or Invoice not found' }, { status: 404 });
        }

        // Check status from QPay
        const checkResult = await qpay.checkInvoice(order.qpayInvoiceId);

        // Assuming QPay returns { count: number, rows: [{ payment_status: 'PAID', ... }] }
        // You might need to adjust based on actual QPay response structure
        const isPaid = checkResult.rows && checkResult.rows.length > 0 && checkResult.rows.some((row: any) => row.payment_status === 'PAID');

        if (isPaid && order.status !== 'PAID') {
            await markAsPaid(orderId);
            return NextResponse.json({ status: 'PAID' });
        }

        return NextResponse.json({ status: order.status });
    } catch (error) {
        console.error('Payment check error:', error);
        return NextResponse.json(
            { error: 'Failed to check payment status' },
            { status: 500 }
        );
    }
}
