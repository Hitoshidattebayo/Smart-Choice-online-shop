import Link from 'next/link';
import { getProduct } from '@/lib/products';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }: { params: { productId: string } }) {
    const product = getProduct(params.productId);

    if (!product) {
        notFound();
    }

    return (
        <div className="container py-12 md:py-20">
            <div className="flex flex-col gap-4 mb-8">
                <Link href="/#products" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-wide">
                    ← Back to Collection
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                {/* Left Column: Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-secondary/20 relative group">
                        {/* Main Image */}
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            In Stock
                        </span>
                    </div>
                    {/* Thumbnails (Placeholder for now, using main image as single thumb) */}
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        <div className="w-20 h-20 rounded-lg border-2 border-primary overflow-hidden cursor-pointer opacity-100 transition-opacity">
                            <img src={product.image} className="w-full h-full object-cover" alt="Thumbnail" />
                        </div>
                        {/* Dummy thumbs for layout feel */}
                        <div className="w-20 h-20 rounded-lg border border-transparent bg-secondary/30 overflow-hidden cursor-pointer hover:border-primary/50 transition-all opacity-60"></div>
                        <div className="w-20 h-20 rounded-lg border border-transparent bg-secondary/30 overflow-hidden cursor-pointer hover:border-primary/50 transition-all opacity-60"></div>
                    </div>
                </div>

                {/* Right Column: Product Details */}
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2 leading-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl md:text-4xl font-bold text-accent font-sans">
                            {product.price.toLocaleString()} ₮
                        </span>
                        {/* Fake original price for discount effect */}
                        <span className="text-lg text-muted-foreground line-through decoration-2 decoration-red-400">
                            {(product.price * 1.2).toLocaleString()} ₮
                        </span>
                    </div>

                    <div className="prose prose-stone text-muted-foreground mb-8 leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    {/* Feature List */}
                    <div className="mb-10 bg-secondary/20 p-6 rounded-xl border border-secondary/50">
                        <h3 className="font-bold text-primary mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
                            <span className="w-1 h-4 bg-accent rounded-full"></span> Key Features
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {product.features?.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                                    <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-dashed border-secondary mb-10">
                        <div className="w-full sm:w-1/3">
                            {/* Quantity Selector Dummy */}
                            <div className="flex items-center justify-between border border-input rounded-full px-4 py-3 bg-white">
                                <button className="text-xl text-primary font-bold hover:text-accent">-</button>
                                <span className="font-bold">1</span>
                                <button className="text-xl text-primary font-bold hover:text-accent">+</button>
                            </div>
                        </div>
                        <Link
                            href={`/checkout/${product.id}`}
                            className="btn btn-primary flex-1 text-center py-4 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 uppercase tracking-widest"
                        >
                            Buy Now
                        </Link>
                    </div>

                    {/* Accordion Policies */}
                    <div className="space-y-2">
                        <details className="group border rounded-lg bg-white overflow-hidden">
                            <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-primary hover:bg-secondary/10 transition-colors">
                                <span>Shipping & Delivery</span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                                We offer fast delivery within Ulaanbaatar (24-48 hours). Detailed shipping rates calculated at checkout.
                            </div>
                        </details>
                        <details className="group border rounded-lg bg-white overflow-hidden">
                            <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-primary hover:bg-secondary/10 transition-colors">
                                <span>Warranty & Returns</span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                                6-month warranty included. Returns accepted within 7 days if the product is unopened and in original condition.
                            </div>
                        </details>
                    </div>

                </div>
            </div>
        </div>
    );
}
