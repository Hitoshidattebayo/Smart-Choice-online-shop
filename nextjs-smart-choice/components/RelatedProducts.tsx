import Link from 'next/link';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: string;
    originalPrice?: string | null;
    discountPercentage?: number;
    image: string;
    badge?: string;
    badgeType?: string;
}

interface Props {
    products: Product[];
}

export default function RelatedProducts({ products }: Props) {
    if (!products || products.length === 0) return null;

    return (
        <section className="section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Бусад бараанууд</h2>
                </div>

                <div className="mobile-swipe-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <Link href={`/product/${product.id}`}>
                                <div className="product-card-img-wrapper relative">
                                    {product.badge && (
                                        <span
                                            className="product-badge"
                                            style={{
                                                backgroundColor:
                                                    product.badgeType === 'instock' ? '#4CAF50' :
                                                        product.badgeType === 'preorder' ? '#FF9800' :
                                                            product.badgeType === 'outOfStock' ? '#F44336' :
                                                                'var(--color-sale-badge)'
                                            }}
                                        >
                                            {product.badge}
                                        </span>
                                    )}
                                    {product.discountPercentage && product.discountPercentage > 0 ? (
                                        <span
                                            className="absolute top-3 right-3 bg-[#F44336] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10"
                                        >
                                            -{product.discountPercentage}%
                                        </span>
                                    ) : null}
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={400}
                                        height={400}
                                        className="product-card-img"
                                    />
                                </div>
                                <div className="product-card-body">
                                    <h3 className="product-name">{product.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="product-price">{product.price}</p>
                                        {product.originalPrice && (
                                            <p className="text-sm text-gray-400 line-through font-medium">
                                                {product.originalPrice}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
