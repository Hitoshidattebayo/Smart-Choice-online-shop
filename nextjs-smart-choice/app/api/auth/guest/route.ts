import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        // Generate a unique 4-character alphanumeric guest ID
        let guestNumber = '';
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            guestNumber = '';
            for (let i = 0; i < 4; i++) {
                guestNumber += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            // Check if this guestNumber exists
            const existing = await prisma.user.findUnique({
                where: { guestNumber }
            });

            if (!existing) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            throw new Error('Failed to generate unique guest ID');
        }

        // Create guest user
        const guestUser = await prisma.user.create({
            data: {
                name: `Зочин#${guestNumber}`,
                isGuest: true,
                guestNumber: guestNumber,
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
