import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        // Get the highest guest number currently in use
        const lastGuest = await prisma.user.findFirst({
            where: { isGuest: true },
            orderBy: { guestNumber: 'desc' },
            select: { guestNumber: true }
        });

        const nextGuestNumber = (lastGuest?.guestNumber || 0) + 1;

        // Create guest user
        const guestUser = await prisma.user.create({
            data: {
                name: `Зочин#${nextGuestNumber}`,
                isGuest: true,
                guestNumber: nextGuestNumber,
                email: null,
                password: null,
            }
        });

        return NextResponse.json({
            success: true,
            user: {
                id: guestUser.id,
                name: guestUser.name,
                email: guestUser.email,
                isGuest: guestUser.isGuest,
                guestNumber: guestUser.guestNumber,
            }
        });
    } catch (error) {
        console.error('Failed to create guest user:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create guest user' },
            { status: 500 }
        );
    }
}
