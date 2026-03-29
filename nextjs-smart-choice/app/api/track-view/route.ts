import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { productId, productName } = await req.json();

        if (!productId || !productName) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const userAgent = req.headers.get('user-agent') || '';
        // Simple session fingerprint from IP + UA (no cookies needed)
        const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
        const sessionId = Buffer.from(`${ip}-${userAgent}`).toString('base64').slice(0, 32);

        await prisma.productView.create({
            data: {
                productId,
                productName,
                sessionId,
                userAgent,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking product view:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
