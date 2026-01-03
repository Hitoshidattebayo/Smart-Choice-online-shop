import { createOrderSimple } from '@/actions/order';
import Link from 'next/link';
import { getProduct } from '@/lib/products';
import { notFound } from 'next/navigation';

export default function CheckoutPage({ params }: { params: { productId: string } }) {
    const product = getProduct(params.productId);

    if (!product) {
        notFound();
    }

    return (
        <div className="container py-12 max-w-xl">
            <div className="mb-8">
                <Link href={`/product/${product.id}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    ← Back to Product
                </Link>
            </div>

            <div className="card p-8 md:p-10 shadow-lg border-none bg-white">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-dashed border-muted">
                    <div className="h-16 w-16 bg-secondary rounded-lg overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-xl font-serif text-primary font-bold line-clamp-1">{product.name}</h1>
                        <p className="text-lg font-medium text-accent">{product.price.toLocaleString()} ₮</p>
                    </div>
                </div>

                <form action={createOrderSimple} className="flex flex-col gap-6">
                    <input type="hidden" name="productId" value={params.productId} />
                    <input type="hidden" name="productName" value={product.name} />
                    <input type="hidden" name="amount" value={product.price} />

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="customerName" className="block text-sm font-bold text-primary mb-2 uppercase tracking-wide">Full Name</label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                required
                                className="input bg-background/50 focus:bg-white"
                                placeholder="Bat-Erdene Bold"
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-bold text-primary mb-2 uppercase tracking-wide">Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                required
                                className="input bg-background/50 focus:bg-white"
                                placeholder="88112233"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-primary mb-2 uppercase tracking-wide">Email <span className="text-muted-foreground font-normal normal-case">(Optional)</span></label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input bg-background/50 focus:bg-white"
                                placeholder="bat@example.com"
                            />
                        </div>
                    </div>

                    <div className="mt-6 bg-secondary/30 p-6 rounded-xl border border-secondary">
                        <p className="block text-sm font-bold text-primary mb-3 uppercase tracking-wide">Payment Method</p>
                        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-primary/20 shadow-sm">
                            <div className="w-5 h-5 rounded-full border-[5px] border-primary bg-white"></div>
                            <span className="font-bold text-primary">Bank Transfer</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                            We will generate a unique <strong>Reference Code</strong> for you on the next screen. Please verify your payment within 24 hours.
                        </p>
                    </div>

                    <button type="submit" className="btn btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-1 transition-all">
                        Confirm Order
                    </button>
                </form>
            </div>
        </div>
    );
}
