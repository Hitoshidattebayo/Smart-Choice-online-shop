import { prisma } from './prisma';

// Exclude confusing characters: 0, O, 1, I
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const PREFIX = 'SC';

function generateRandomString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * CHARSET.length);
        result += CHARSET[randomIndex];
    }
    return result;
}

export async function generatePaymentReference(): Promise<string> {
    let isUnique = false;
    let reference = '';

    // Retry loop to ensure uniqueness
    while (!isUnique) {
        // Format: SC-XXXX-XXXX (4 chars + 4 chars)
        const part1 = generateRandomString(4);
        const part2 = generateRandomString(4);
        reference = `${PREFIX}-${part1}-${part2}`;

        // Check against DB
        const existingOrder = await prisma.order.findUnique({
            where: {
                paymentReference: reference,
            },
        });

        if (!existingOrder) {
            isUnique = true;
        }
    }

    return reference;
}
