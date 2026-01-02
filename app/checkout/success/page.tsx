import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // In a real RSC we can query DB directly to confirm details if needed, or just trust params for display.
// Ideally, we fetch order by reference to show details.

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

                <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
                <p className="text-muted-foreground mb-8">Please complete your payment within 24 hours.</p>

                <div className="bg-muted p-6 rounded-lg text-left mb-8 space-y-4">
                    <h2 className="font-bold text-lg border-b pb-2 border-border">Bank Details</h2>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Bank Name:</span>
                        <span className="font-medium">Khan Bank</span>

                        <span className="text-muted-foreground">Account Number:</span>
                        <span className="font-medium">5023 1234 5678</span>

                        <span className="text-muted-foreground">Account Holder:</span>
                        <span className="font-medium">Smart Choice LLC</span>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-md mt-4">
                        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Transaction Value (Must Include)</p>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-mono font-bold text-primary">{reference}</span>
                            <button
                                // In a client component we could add copy-to-clipboard functionality
                                className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded ml-2"
                            >
                                COPY
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            * Please include this code in your bank transfer description so we can verify your payment automatically.
                        </p>
                    </div>
                </div>

                <Link href="/" className="btn btn-outline w-full">
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
