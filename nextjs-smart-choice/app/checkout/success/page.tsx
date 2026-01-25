import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // In a real RSC we can query DB directly to confirm details if needed, or just trust params for display.
// Ideally, we fetch order by reference to show details.
import CopyButton from '@/components/CopyButton';

export default async function SuccessPage({ searchParams }: { searchParams: { ref: string } }) {
    const reference = searchParams.ref;

    // Optional: Fetch order details to confirm valid reference (good UI practice)
    // const order = await prisma.order.findUnique({ where: { paymentReference: reference } });

    return (
        <div className="container py-12 max-w-xl text-center">
            <div className="card p-8 shadow-sm">
                <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold mb-2">Захиалга амжилттай хийгдлээ!</h1>
                <p className="text-muted-foreground mb-8">Та төлбөрөө 24 цагийн дотор шилжүүлнэ үү.</p>

                <div className="bg-muted p-6 rounded-lg text-left mb-8 space-y-4">
                    <p className="text-sm text-center text-muted-foreground">
                        Таны захиалга үүссэн. Төлбөрөө шилжүүлсний дараа бид тантай холбогдон хүргэлтийг баталгаажуулах болно.
                    </p>
                </div>

                <Link href="/" className="btn btn-outline w-full">
                    Нүүр хуудас руу буцах
                </Link>
            </div>
        </div>
    );
}
