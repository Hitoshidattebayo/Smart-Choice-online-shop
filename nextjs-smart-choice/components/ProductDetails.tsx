'use client';

import { useState, useRef, useEffect } from 'react';
import { Minus, Plus, Loader2, Heart, Star, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Product } from '../lib/products';
import { useCart } from '@/context/CartContext';


export default function ProductDetails({ product }: { product: Product }) {
    const { addToCart, openCart } = useCart();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [quantity, setQuantity] = useState(1); // Default to 1
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
    const [isSticky, setIsSticky] = useState(false); // Docking state
    // Docking logic for mobile buttons
    const staticButtonsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkSticky = () => {
            if (staticButtonsRef.current) {
                const rect = staticButtonsRef.current.getBoundingClientRect();
                // Show sticky footer ONLY if static buttons are strictly BELOW the viewport
                // Using a small buffer (0 or slightly negative) can help specific devices
                // If rect.top > window.innerHeight, it's below the fold -> show sticky
                setIsSticky(rect.top > window.innerHeight);
            }
        };

        // Check immediately and on scroll/resize
        checkSticky();
        window.addEventListener('scroll', checkSticky, { passive: true });
        window.addEventListener('resize', checkSticky, { passive: true });

        return () => {
            window.removeEventListener('scroll', checkSticky);
            window.removeEventListener('resize', checkSticky);
        };
    }, []);

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
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                                <div className="flex items-center justify-center gap-2 bg-white px-2 py-1.5 rounded-full shadow-sm border border-gray-100">
                                    {images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${activeImageIndex === idx
                                                ? 'w-6 bg-gray-800'
                                                : 'w-1.5 bg-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Badges Removed */}
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
                            {/* Product Status */}
                            {/* Product Status */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {product.stockStatus === 'outOfStock' ? (
                                    <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Дууссан
                                    </span>
                                ) : product.stockStatus === 'preOrder' ? (
                                    <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Захиалгаар
                                    </span>
                                ) : (
                                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Бэлэн байгаа
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900 leading-none">
                                    {product.name}
                                </h1>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                                    <Heart size={24} />
                                </button>
                            </div>


                            <div className="flex items-center gap-3 pt-2">
                                <span className="text-2xl font-bold text-gray-900">
                                    {product.price.toLocaleString()}₮
                                </span>
                                {product.originalPrice && (
                                    <span className="text-lg text-red-500 line-through">
                                        {product.originalPrice.toLocaleString()}₮
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1 text-sm pt-1">
                                <div className="flex text-black">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < Math.floor(product.rating || 5) ? "black" : "none"} strokeWidth={2} />
                                    ))}
                                </div>
                                <span className="text-gray-500 ml-1 font-medium underline cursor-pointer">{product.rating || 5.0} ({product.reviews || 0} Үнэлгээ)</span>
                            </div>
                        </div>


                        {/* Description Section */}
                        <div className="space-y-3 border-b border-gray-100 pb-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider">Дэлгэрэнгүй</h3>
                            <div className="text-sm text-gray-600 leading-relaxed space-y-2 whitespace-pre-wrap">
                                {product.description}
                            </div>
                        </div>

                        {/* Variants Selection */}
                        <div className="space-y-6">
                            {product.variants?.map((variant, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold uppercase tracking-wider text-gray-900">
                                            {variant.label}: <span className="text-gray-500 font-normal normal-case">{selections[variant.id] || 'Сонгоогүй'}</span>
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

                        {/* Desktop Quantity & Buttons (Restored) */}
                        <div className="hidden md:flex flex-col gap-6 pt-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-sm uppercase tracking-wider text-gray-900">Тоо ширхэг:</span>
                                <div className="flex items-center border border-gray-200 rounded-lg h-10 w-32">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="flex-1 text-center font-bold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleAction('cart')}
                                    className="flex-1 h-12 border-2 border-black bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all rounded-lg shadow-sm hover:shadow-md"
                                >
                                    Сагсанд хийх
                                </button>
                                <button
                                    onClick={() => handleAction('buy')}
                                    disabled={isBuyNowLoading}
                                    className="flex-1 h-12 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-all rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
                                >
                                    {isBuyNowLoading ? <Loader2 className="animate-spin" /> : 'ЗАХИАЛАХ'}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Sticky Footer - conditionally visible */}
                        {isSticky && (
                            <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-50 px-5 pb-8 safe-area-pb animate-fade-in-up">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAction('cart')}
                                        className="w-14 h-14 border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-900 bg-white active:scale-95 transition-transform"
                                    >
                                        <ShoppingBag size={24} strokeWidth={1.5} />
                                    </button>
                                    <button
                                        onClick={() => handleAction('buy')}
                                        disabled={isBuyNowLoading}
                                        className="flex-1 h-14 bg-black text-white text-base font-bold uppercase tracking-wider rounded-full active:scale-95 transition-transform flex items-center justify-center"
                                    >
                                        {isBuyNowLoading ? <Loader2 className="animate-spin" /> : 'ЗАХИАЛАХ'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Accordions / Description */}
                        <div className="pt-8 border-t border-gray-100 space-y-4">


                            {/* Static Mobile Buttons (The docking point) */}
                            <div ref={staticButtonsRef} className="md:hidden pt-4 pb-2">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAction('cart')}
                                        className="w-14 h-14 border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-900 bg-white active:scale-95 transition-transform"
                                    >
                                        <ShoppingBag size={24} strokeWidth={1.5} />
                                    </button>
                                    <button
                                        onClick={() => handleAction('buy')}
                                        disabled={isBuyNowLoading}
                                        className="flex-1 h-14 bg-black text-white text-base font-bold uppercase tracking-wider rounded-full active:scale-95 transition-transform flex items-center justify-center"
                                    >
                                        {isBuyNowLoading ? <Loader2 className="animate-spin" /> : 'ЗАХИАЛАХ'}
                                    </button>
                                </div>
                            </div>

                            {/* Delivery Accordion */}
                            <details className="group border-b border-gray-100 py-4 cursor-pointer">
                                <summary className="flex justify-between items-center text-sm font-bold uppercase tracking-wider list-none">
                                    <span>Хүргэлт болон буцаалт</span>
                                    <Plus size={18} className="group-open:hidden" />
                                    <Minus size={18} className="hidden group-open:block" />
                                </summary>
                                <div className="pt-3 text-sm text-gray-600 whitespace-pre-wrap">
                                    {product.deliveryAndReturns || '100,000₮-с дээш худалдан авалтад хүргэлт үнэгүй.\n14 хоногийн дотор буцаах боломжтой.'}
                                </div>
                            </details>

                        </div>

                    </div>
                </div>

                {/* Video Section (if exists) */}
                {product.productVideos && product.productVideos.length > 0 && (
                    <div className="py-12 px-5 md:px-10">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Бүтээгдэхүүний бичлэгүүд</h2>
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
