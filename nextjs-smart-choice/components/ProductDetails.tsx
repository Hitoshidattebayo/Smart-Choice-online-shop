'use client';

import { useState } from 'react';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Product } from '../lib/products';
import { useCart } from '@/context/CartContext';

import DeliveryInfoBar from './DeliveryInfoBar';

export default function ProductDetails({ product }: { product: Product }) {
    const { addToCart, openCart } = useCart();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [quantity, setQuantity] = useState(0);
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

    // Default selections setup (optional, maybe wireframe implies none selected)
    // Leaving empty to match "unselected" look if needed, but for UX usually select first.
    // user said "Just use this structure", implied visual.

    const handleAddToCart = () => {
        // Logic
        alert(`Added ${quantity} items`);
    };

    const handleSelection = (variantId: string, value: string) => {
        setSelections(prev => ({ ...prev, [variantId]: value }));
    };

    return (

        <div className="min-h-screen font-sans text-gray-900 flex justify-center py-12 bg-[var(--color-primary-bg)]">
            {/* Main Card Container */}
            <div className="container">
                <DeliveryInfoBar />
                <div className="w-full bg-[var(--color-secondary-bg)] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-8 md:p-16">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16">

                        {/* LEFT COLUMN: Images */}
                        <div className="flex flex-col gap-6">
                            {/* Desktop Stack (Hidden on Mobile) */}
                            <div className="hidden md:flex flex-col gap-6">
                                {(product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]).map((img, idx) => (
                                    <div key={idx} className="w-full bg-[#f0f0f0] rounded-3xl overflow-hidden relative shadow-lg">
                                        <img
                                            src={img}
                                            alt={`${product.name} view ${idx + 1}`}
                                            className="w-full h-auto object-cover block"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Carousel (Visible on Mobile) */}
                            <div className="md:hidden flex flex-col gap-4">
                                {/* Main Image Carousel */}
                                <div className="w-full aspect-square bg-[#f0f0f0] rounded-3xl overflow-hidden relative shadow-lg">
                                    <div
                                        className="flex overflow-x-auto snap-x snap-mandatory w-full h-full scrollbar-hide"
                                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                        onScroll={(e) => {
                                            const container = e.currentTarget;
                                            const index = Math.round(container.scrollLeft / container.clientWidth);
                                            setActiveImageIndex(index);
                                        }}
                                    >
                                        {(product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]).map((img, idx) => (
                                            <div key={idx} className="w-full h-full flex-shrink-0 snap-center">
                                                <img
                                                    src={img}
                                                    alt={`${product.name} view ${idx + 1}`}
                                                    className="w-full h-full object-cover block"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Thumbnails */}
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {(product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]).map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setActiveImageIndex(idx);
                                                // Note: Ideally we'd scroll the main container here too, but simple state update is good for visual feedback. 
                                                // For perfect sync, we'd need a ref to the container. Leaving simple for now.
                                            }}
                                            className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-black opacity-100' : 'border-transparent opacity-60'}`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Info */}
                        <div className="lg:sticky lg:top-24 h-fit py-4 space-y-10">

                            {/* Header */}
                            <div>
                                {product.stockStatus && (
                                    <span
                                        className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2 uppercase tracking-wide"
                                        style={{
                                            backgroundColor:
                                                product.stockStatus === 'instock' ? '#4CAF50' :
                                                    product.stockStatus === 'preorder' ? '#FF9800' :
                                                        product.stockStatus === 'outOfStock' ? '#F44336' :
                                                            'var(--color-sale-badge)'
                                        }}
                                    >
                                        {product.stockStatus === 'instock' ? 'Бэлэн' :
                                            product.stockStatus === 'preorder' ? 'Захиалгаар' :
                                                product.stockStatus === 'outOfStock' ? 'Дууссан' : 'SALE'}
                                    </span>
                                )}
                                <h1 className="text-5xl font-medium text-black mb-4 tracking-tight leading-tight">{product.name}</h1>
                                <div className="flex items-center gap-4">
                                    {product.originalPrice && (
                                        <span className="text-xl text-gray-400 line-through font-medium">
                                            {product.originalPrice.toLocaleString()}₮
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span className="text-4xl font-medium text-black">
                                            {product.price.toLocaleString()}₮
                                        </span>
                                        {product.originalPrice && (product.originalPrice > product.price) && (
                                            <span className="bg-[#F44336] text-white text-sm font-bold px-2 py-1 rounded-full">
                                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Variants */}
                            <div className="space-y-8">
                                {product.variants?.map((variant, idx) => (
                                    <div key={idx}>
                                        <label className="block text-sm font-bold text-black mb-4 uppercase tracking-wider">
                                            {variant.label}
                                        </label>

                                        <div className="flex flex-wrap gap-4">
                                            {variant.values?.map((val, vIdx) => {
                                                const isSelected = selections[variant.id] === val;

                                                if (variant.type === 'color') {
                                                    return (
                                                        <button
                                                            key={vIdx}
                                                            onClick={() => handleSelection(variant.id, val)}
                                                            className={`w-12 h-12 rounded-full border border-gray-200 transition-all flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-4 ring-black scale-110' : 'hover:scale-105'
                                                                }`}
                                                            style={{ backgroundColor: val }}
                                                            title={val}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <button
                                                        key={vIdx}
                                                        onClick={() => handleSelection(variant.id, val)}
                                                        className={`h-12 px-6 border-2 rounded-xl transition-all font-bold ${isSelected ? 'border-black bg-black text-white' : 'border-gray-200 bg-transparent text-black hover:border-gray-400'
                                                            }`}
                                                    >
                                                        {val || `Option ${vIdx + 1}`}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4">
                                <div className="flex w-full gap-4 items-stretch">
                                    {/* Qty */}
                                    <div className="flex items-center border border-[#18181b] rounded-lg bg-white h-14 shrink-0 overflow-hidden flex-1 sm:w-auto sm:flex-none">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="flex-1 sm:flex-none sm:w-14 h-full flex items-center justify-center bg-[#18181b] text-white hover:bg-gray-800 transition-colors"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="w-16 text-center font-bold text-lg text-[#18181b]">{quantity || 1}</span>
                                        <button
                                            onClick={() => setQuantity((quantity || 1) + 1)}
                                            className="flex-1 sm:flex-none sm:w-14 h-full flex items-center justify-center bg-[#18181b] text-white hover:bg-gray-800 transition-colors"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => {
                                            addToCart({
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                image: product.image,
                                                quantity: quantity || 1,
                                            });
                                            openCart();
                                        }}
                                        className="flex-1 h-14 border border-[#18181b] rounded-lg text-sm font-extrabold uppercase hover:bg-gray-50 transition-colors tracking-widest text-[#18181b]"
                                    >
                                        САГСЛАХ
                                    </button>
                                </div>

                                <button
                                    disabled={isBuyNowLoading}
                                    onClick={async () => {
                                        setIsBuyNowLoading(true);
                                        try {
                                            // 1. Add to cart first
                                            addToCart({
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                image: product.image,
                                                quantity: quantity || 1,
                                            });

                                            // 2. Check auth status
                                            if (status === 'authenticated') {
                                                router.push('/checkout');
                                                return;
                                            }

                                            // 3. Create guest user
                                            const res = await fetch('/api/auth/guest', {
                                                method: 'POST',
                                            });

                                            if (!res.ok) {
                                                throw new Error('Failed to create guest session');
                                            }

                                            const data = await res.json();

                                            if (data.success && data.user) {
                                                // 4. Sign in as guest
                                                const signInResult = await signIn('credentials', {
                                                    email: `guest_${data.user.id}@temp.local`,
                                                    password: 'guest',
                                                    redirect: false,
                                                });

                                                if (signInResult?.ok) {
                                                    router.push('/checkout');
                                                } else {
                                                    console.error('Guest sign in failed', signInResult);
                                                    router.push('/login?callbackUrl=/checkout');
                                                }
                                            }
                                        } catch (error) {
                                            console.error('Buy now error:', error);
                                            alert('Something went wrong. Please try again.');
                                            setIsBuyNowLoading(false);
                                        }
                                    }}
                                    className="w-full h-14 bg-[#18181b] text-white border border-[#18181b] rounded-lg text-sm font-extrabold uppercase hover:bg-gray-800 transition-colors tracking-widest shadow-lg flex items-center justify-center gap-2">
                                    {isBuyNowLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            УНШИЖ БАЙНА...
                                        </>
                                    ) : (
                                        'ЗАХИАЛАХ'
                                    )}
                                </button>
                            </div>

                            {/* Description */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <p className="font-bold text-lg">Дэлгэрэнгүй мэдээлэл</p>
                                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>

                            {/* Video Carousel */}
                            {product.productVideos && product.productVideos.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <p className="font-bold text-lg">
                                        {product.videoSectionTitle || "Product Videos"}
                                    </p>
                                    <div
                                        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                    >
                                        {/* Hide scrollbar standard compliant way via CSS class in globals usually, but inline works for now */}
                                        <style dangerouslySetInnerHTML={{
                                            __html: `
                                            .hide-scrollbar::-webkit-scrollbar { display: none; }
                                        `}} />
                                        {product.productVideos.map((videoUrl, idx) => (
                                            <div
                                                key={idx}
                                                className="snap-center shrink-0 w-[80%] sm:w-[calc(33.333%-11px)] aspect-[9/16] bg-black rounded-lg overflow-hidden relative shadow-md"
                                            >
                                                <video
                                                    src={videoUrl}
                                                    controls
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FAQs */}
                            {product.faqs && product.faqs.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    {product.faqs.map((faq, idx) => (
                                        <details key={idx} className="group border-b border-gray-100 last:border-0 pb-4">
                                            <summary className="flex justify-between items-center font-bold cursor-pointer list-none py-2 text-gray-900 group-hover:text-black hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
                                                <span>{faq.question}</span>
                                                <span className="transition-transform group-open:rotate-180">
                                                    <Minus size={16} className="hidden group-open:block" />
                                                    <Plus size={16} className="block group-open:hidden" />
                                                </span>
                                            </summary>
                                            <p className="text-gray-600 mt-2 pl-2 text-sm leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
