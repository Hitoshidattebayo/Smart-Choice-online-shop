'use client';

import { useState, useRef, useEffect } from 'react';
import { Minus, Plus, Loader2, Heart, Share2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Product } from '../lib/products';
import { useCart } from '@/context/CartContext';
import DeliveryInfoBar from './DeliveryInfoBar';

export default function ProductDetails({ product }: { product: Product }) {
    const { addToCart, openCart } = useCart();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [quantity, setQuantity] = useState(1); // Default to 1
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
    const [isSticky, setIsSticky] = useState(false); // To detect if sticky bar should show if we want conditional visibility

    // Images logic
    const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

    // Scroll listener for active image index on mobile
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const index = Math.round(container.scrollLeft / container.clientWidth);
            setActiveImageIndex(index);
        }
    };

    const handleSelection = (variantId: string, value: string) => {
        setSelections(prev => ({ ...prev, [variantId]: value }));
    };

    const handleAction = async (action: 'cart' | 'buy') => {
        if (action === 'buy') setIsBuyNowLoading(true);

        try {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity || 1,
            });

            if (action === 'cart') {
                openCart();
            } else if (action === 'buy') {
                if (status === 'authenticated') {
                    router.push('/checkout');
                } else {
                    // Create guest session logic
                    const res = await fetch('/api/auth/guest', { method: 'POST' });
                    const data = await res.json();
                    if (data.success && data.user) {
                        await signIn('credentials', {
                            email: `guest_${data.user.id}@temp.local`,
                            password: 'guest_temp',
                            redirect: false,
                        });
                        router.push('/checkout');
                    }
                }
            }
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            if (action === 'buy') setIsBuyNowLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans bg-white pb-24 md:pb-0">
            <DeliveryInfoBar />

            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 lg:gap-16">

                    {/* LEFT COLUMN: Images */}
                    <div className="relative w-full">
                        {/* Mobile Carousel */}
                        <div className="md:hidden relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                            <div
                                className="flex overflow-x-auto snap-x snap-mandatory w-full h-full scrollbar-hide"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                            >
                                {images.map((img, idx) => (
                                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                                        <img
                                            src={img}
                                            alt={`${product.name} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImageIndex === idx ? 'bg-black w-4' : 'bg-white/50 backdrop-blur-sm'}`}
                                    />
                                ))}
                            </div>

                            {/* Mobile Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                                {product.stockStatus === 'outOfStock' && (
                                    <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 uppercase tracking-wider">
                                        Sold Out
                                    </span>
                                )}
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="bg-[#fa3e3e] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                                        Sale
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Desktop Grid */}
                        <div className="hidden md:grid grid-cols-2 gap-2 p-4 sticky top-0 h-fit">
                            {images.map((img, idx) => (
                                <div key={idx} className={`w-full aspect-[3/4] bg-gray-50 ${idx % 3 === 0 ? 'col-span-2' : 'col-span-1'}`}>
                                    <img
                                        src={img}
                                        alt={`${product.name} ${idx}`}
                                        className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Info */}
                    <div className="px-5 py-6 md:py-10 md:pr-10 lg:pr-20 md:sticky md:top-20 h-fit space-y-8">

                        {/* Header Section */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900 leading-none">
                                    {product.name}
                                </h1>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                                    <Heart size={24} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <span>Oversized Fit</span> {/* Static for now, represents subtitle */}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <span className="text-2xl font-bold text-gray-900">
                                    {product.price.toLocaleString()}₮
                                </span>
                                {product.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through">
                                        {product.originalPrice.toLocaleString()}₮
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1 text-sm pt-1">
                                <div className="flex text-black">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < 4 ? "black" : "none"} strokeWidth={2} />
                                    ))}
                                </div>
                                <span className="text-gray-500 ml-1 font-medium underline cursor-pointer">4.8 (7 Reviews)</span>
                            </div>
                        </div>

                        {/* Variants Selection */}
                        <div className="space-y-6">
                            {product.variants?.map((variant, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold uppercase tracking-wider text-gray-900">
                                            {variant.label}: <span className="text-gray-500 font-normal normal-case">{selections[variant.id] || 'Select'}</span>
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {variant.values?.map((val, vIdx) => {
                                            const isSelected = selections[variant.id] === val;

                                            // Render logic based on type (color vs other)
                                            if (variant.type === 'color') {
                                                return (
                                                    <button
                                                        key={vIdx}
                                                        onClick={() => handleSelection(variant.id, val)}
                                                        className={`w-10 h-10 rounded-full border-2 transition-all ${isSelected ? 'border-black p-0.5' : 'border-transparent hover:border-gray-300'
                                                            }`}
                                                        title={val}
                                                    >
                                                        <span
                                                            className="block w-full h-full rounded-full border border-gray-200"
                                                            style={{ backgroundColor: val }}
                                                        />
                                                    </button>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={vIdx}
                                                    onClick={() => handleSelection(variant.id, val)}
                                                    className={`min-w-[4rem] px-4 py-3 text-sm font-bold rounded-lg border transition-all uppercase ${isSelected
                                                            ? 'border-black bg-black text-white'
                                                            : 'border-gray-200 text-gray-700 hover:border-black'
                                                        }`}
                                                >
                                                    {val}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Quantity & Add to Cart */}
                        <div className="hidden md:flex flex-col gap-3 pt-4">
                            <button
                                onClick={() => handleAction('cart')}
                                className="w-full h-14 bg-black text-white text-base font-bold uppercase tracking-wider hover:bg-gray-900 transition-all rounded-md flex items-center justify-center gap-2"
                            >
                                <span className="font-extrabold">Add To Bag</span>
                                <span className="w-1 h-1 bg-white rounded-full mx-1" />
                                <span>{product.price.toLocaleString()}₮</span>
                            </button>

                            <button
                                className="w-full py-3 text-xs font-bold uppercase underline tracking-wider text-gray-500 hover:text-black transition-colors"
                            >
                                Not sure about sizing?
                            </button>
                        </div>

                        {/* Mobile Sticky Footer - Always visible on mobile */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:hidden z-50 px-5 pb-8 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                            <div className="flex gap-3">
                                <button className="w-14 h-14 border border-gray-200 rounded-md flex items-center justify-center flex-shrink-0 text-gray-900">
                                    <Heart size={24} />
                                </button>
                                <button
                                    onClick={() => handleAction('cart')}
                                    className="flex-1 h-14 bg-black text-white text-base font-bold uppercase tracking-wider rounded-md active:scale-95 transition-transform"
                                >
                                    Add To Bag • {product.price.toLocaleString()}₮
                                </button>
                            </div>
                        </div>

                        {/* Accordions / Description */}
                        <div className="pt-8 border-t border-gray-100 space-y-4">
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider">Description</h3>
                                <div className="text-sm text-gray-600 leading-relaxed space-y-2 whitespace-pre-wrap">
                                    {product.description}
                                </div>
                            </div>

                            {/* Delivery Accordion (Static Example) */}
                            <details className="group border-b border-gray-100 py-4 cursor-pointer">
                                <summary className="flex justify-between items-center text-sm font-bold uppercase tracking-wider list-none">
                                    <span>Delivery & Returns</span>
                                    <Plus size={18} className="group-open:hidden" />
                                    <Minus size={18} className="hidden group-open:block" />
                                </summary>
                                <div className="pt-3 text-sm text-gray-600">
                                    <p>Free standard delivery on orders over 100,000₮.</p>
                                    <p>Returns accepted within 14 days.</p>
                                </div>
                            </details>

                            {/* Share */}
                            <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider py-4 mt-4">
                                <Share2 size={18} />
                                <span>Share this product</span>
                            </button>

                        </div>

                    </div>
                </div>

                {/* Video Section (if exists) */}
                {product.productVideos && product.productVideos.length > 0 && (
                    <div className="py-12 px-5 md:px-10">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Product Videos</h2>
                        <div className="flex gap-4 overflow-x-auto pb-6 snap-x">
                            {product.productVideos.map((video, i) => (
                                <div key={i} className="snap-center shrink-0 w-[280px] md:w-[350px] aspect-[9/16] bg-black rounded-lg overflow-hidden">
                                    <video src={video} controls className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
