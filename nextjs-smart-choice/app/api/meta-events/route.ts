import { NextRequest, NextResponse } from 'next/server';
import { sendMetaEvent, MetaEventData } from '@/lib/meta-capi';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Extract IP and UserAgent from request headers
        const userIp = req.headers.get('x-forwarded-for') || req.ip || '0.0.0.0';
        const userAgent = req.headers.get('user-agent') || '';

        const eventData: MetaEventData = {
            ...data,
            userIp,
            userAgent,
            email: data.email,
            phone: data.phone,
        };

        await sendMetaEvent({
            eventName: eventData.eventName,
            eventSourceUrl: eventData.eventSourceUrl,
            userIp: eventData.userIp,
            userAgent: eventData.userAgent,
            fbc: eventData.fbc,
            fbp: eventData.fbp,
            email: eventData.email,
            phone: eventData.phone,
            customData: eventData.customData,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in Meta Event API Route:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
