import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { qpay } from '@/lib/qpay';
import { markAsPaid } from '@/actions/order';

async function checkAndProcessPayment(paymentReference: string) {
    console.log(`Processing callback for reference: ${paymentReference}`);

    const order = await prisma.order.findUnique({
        where: { paymentReference },
    });

    if (!order) {
        console.error(`Order not found for reference: ${paymentReference}`);
        return { error: 'Order not found', status: 404 };
    }

    if (order.status === 'PAID') {
        return { message: 'Already paid', status: 200 };
    }

    if (!order.qpayInvoiceId) {
        console.error(`No QPay invoice ID for order: ${order.id}`);
        return { error: 'No invoice ID', status: 400 };
    }

    // STRICT FLOW: Callback -> payment/check
    const checkResult = await qpay.checkInvoice(order.qpayInvoiceId);
    console.log('QPay Check Result:', JSON.stringify(checkResult, null, 2));

    const isPaid = checkResult.rows &&
        checkResult.rows.length > 0 &&
        checkResult.rows.some((row: any) => row.payment_status === 'PAID');

    if (isPaid) {
        console.log(`Payment confirmed for order ${order.id}. Marking as PAID.`);
        await markAsPaid(order.id);
        return { message: 'Payment processed successfully', status: 200 };
    }

    return { message: 'Payment not completed yet', status: 200 };
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const paymentReference = searchParams.get('payment_reference');
    const qpayPaymentId = searchParams.get('qpay_payment_id');

    // 1. Webhook Flow (Server-to-Server)
    if (qpayPaymentId) {
        console.log(`Received QPay Webhook for payment_id: ${qpayPaymentId}`);
        try {
            // Verify payment info from QPay
            const paymentInfo = await qpay.getPayment(qpayPaymentId);
            console.log('Payment Info:', JSON.stringify(paymentInfo, null, 2));

            if (paymentInfo.payment_status === 'PAID') {
                const invoiceId = paymentInfo.object_id;

                // Find order by Invoice ID
                const order = await prisma.order.findFirst({
                    where: { qpayInvoiceId: invoiceId }
                });

                if (order) {
                    if (order.status !== 'PAID') {
                        console.log(`Marking order ${order.id} as PAID based on webhook.`);
                        await markAsPaid(order.id);
                    } else {
                        console.log(`Order ${order.id} is already PAID.`);
                    }
                } else {
                    console.warn(`Order not found for QPay Invoice ID: ${invoiceId}`);
                }
            } else {
                console.log(`Payment status is ${paymentInfo.payment_status}, not marking as paid.`);
            }

            // STRICT RESPONSE REQ: 200 OK + "SUCCESS"
            return new NextResponse('SUCCESS', {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            });

        } catch (error) {
            console.error('Webhook processing error:', error);
            // Even on error, we might sometimes return SUCCESS to stop retries if it's a non-recoverable logic error, 
            // but for system errors, maybe 500 is ok. 
            // The spec says "Response... 200 SUCCESS". It doesn't explicitly say what to do on failure 
            // other than "prohibits returning other than above format" for THE callback.
            // But if we fail to process, maybe we SHOULD fail so they retry?
            // Usually webhooks verify success by 200.
            return new NextResponse('SUCCESS', { status: 200 });
        }
    }

    // 2. User Redirect Flow (Browser)
    if (paymentReference) {
        // Trigger check on redirect too, just in case
        await checkAndProcessPayment(paymentReference);
        return NextResponse.redirect(new URL(`/checkout/success?ref=${paymentReference}`, req.url));
    }

    return NextResponse.redirect(new URL('/', req.url));
}

export async function POST(req: NextRequest) {
    // Some implementations might send POST
    // We can try to handle it similarly if needed, or strict spec says GET.
    // Spec says "Callback http method is GET".
    // We will keep POST for legacy/other checks if any, but GET is the main one.
    return GET(req);
}

