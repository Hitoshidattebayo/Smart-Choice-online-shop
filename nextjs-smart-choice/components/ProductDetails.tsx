'use client';

import { useState, useRef, useEffect } from 'react';
import { Minus, Plus, Loader2, Heart, Star, ShoppingBag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Product } from '../lib/products';
import { useCart } from '@/context/CartContext';
import { trackMetaEvent } from '@/lib/track-meta-event';

// 60-30-10 Color tokens
const C = {
    bg: '#F8F6F2',       // 60% Cream
    navy: '#1A1A2E',     // 30% Deep Navy
    gold: '#E8C547',     // 10% Accent Gold
    navyMid: 'rgba(26,26,46,0.6)',
    navyBorder: 'rgba(26,26,46,0.12)',
};

export default function ProductDetails({ product }: { product: Product }) {
    const { addToCart, openCart } = useCart();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [quantity, setQuantity] = useState(1);
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    // Lightbox state
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
    };

    const nextImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setLightboxIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Docking logic for mobile buttons
    const staticButtonsRef = useRef<HTMLDivElement>(null);

    // Inventory check
    const isOutOfStock = product.stockQuantity !== undefined ? product.stockQuantity <= 0 : product.stockStatus === 'outOfStock';
    const maxQuantity = product.stockQuantity ?? 99;

    useEffect(() => {
        const checkSticky = () => {
            if (staticButtonsRef.current) {
                const rect = staticButtonsRef.current.getBoundingClientRect();
                setIsSticky(rect.top > window.innerHeight);
            }
        };
        checkSticky();
        window.addEventListener('scroll', checkSticky, { passive: true });
        window.addEventListener('resize', checkSticky, { passive: true });
        return () => {
            window.removeEventListener('scroll', checkSticky);
            window.removeEventListener('resize', checkSticky);
        };
    }, []);

    // Track ViewContent on mount
    useEffect(() => {
        trackMetaEvent('ViewContent', {
            content_name: product.name,
            content_type: 'product',
            content_ids: [product.id],
            value: product.price,
            currency: 'MNT',
        });
    }, [product.id, product.name, product.price]);

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
            const variantValues = Object.entries(selections).map(([variantId, value]) => {
                const variant = product.variants?.find(v => v.id === variantId);
                const labelDictionary: Record<string, string> = {
                    'color': 'Өнгө', 'size': 'Хэмжээ', 'material': 'Материал', 'undefined': 'Өнгө'
                };
                const safeVariantId = String(variantId) === 'undefined' ? 'undefined' : variantId;
                const displayLabel = variant?.label || labelDictionary[safeVariantId] || safeVariantId;
                return `${displayLabel}: ${value}`;
            });
            const variantSuffix = variantValues.length > 0 ? ` (${variantValues.join(', ')})` : '';
            const finalName = `${product.name}${variantSuffix}`;
            const selectionKey = Object.keys(selections).sort().map(key => `${key}-${selections[key]}`).join('_');
            const cartItemId = selectionKey ? `${product.id}||${selectionKey}` : product.id;
            addToCart({ id: cartItemId, name: finalName, price: product.price, image: product.image, logoImage: product.logoImage, quantity: quantity || 1 });
            if (action === 'cart') {
                trackMetaEvent('AddToCart', {
                    content_name: finalName, content_type: 'product', content_ids: [product.id],
                    value: product.price * (quantity || 1), currency: 'MNT',
                    contents: [{ id: product.id, quantity: quantity || 1 }],
                });
                openCart();
            } else if (action === 'buy') {
                if (status === 'authenticated') {
                    router.push('/checkout');
                } else {
                    const res = await fetch('/api/auth/guest', { method: 'POST' });
                    const data = await res.json();
                    if (data.success && data.user) {
                        await signIn('credentials', { email: `guest_${data.user.id}@temp.local`, password: 'guest_temp', redirect: false });
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
        <div className="min-h-screen font-sans pb-24 md:pb-0 w-full max-w-[100vw]" style={{ backgroundColor: C.bg }}>

            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 lg:gap-16 md:items-start">

                    {/* LEFT COLUMN: Images */}
                    <div className="relative w-full">
                        {/* Mobile Carousel */}
                        <div className="md:hidden relative w-full aspect-[3/4] overflow-hidden" style={{ backgroundColor: '#ede9e1' }}>
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
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={() => openLightbox(idx)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Dots */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                                <div className="flex items-center justify-center gap-2 px-2 py-1.5 rounded-full shadow-sm" style={{ backgroundColor: 'rgba(248,246,242,0.9)', border: `1px solid ${C.navyBorder}` }}>
                                    {images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className="h-1.5 rounded-full transition-all duration-300"
                                            style={{
                                                width: activeImageIndex === idx ? '24px' : '6px',
                                                backgroundColor: activeImageIndex === idx ? C.navy : 'rgba(26,26,46,0.25)'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Desktop Grid */}
                        <div className="hidden md:grid grid-cols-2 gap-2 p-4" style={{ backgroundColor: C.bg }}>
                            {images.map((img, idx) => (
                                <div key={idx} className={`relative overflow-hidden w-full aspect-[3/4] ${idx % 3 === 0 ? 'col-span-2' : 'col-span-1'}`} style={{ backgroundColor: '#ede9e1' }}>
                                    <img
                                        src={img}
                                        alt={`${product.name} ${idx}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                                        onClick={() => openLightbox(idx)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Info */}
                    <div className="px-5 py-6 md:py-10 md:pr-10 lg:pr-20 md:sticky md:top-24 h-fit space-y-8">

                        {/* Header Section */}
                        <div className="space-y-4">
                            {/* Brand Logo Overlay (if exists) */}
                            {product.logoImage && (
                                <div className="mb-2">
                                    <img 
                                        src={product.logoImage} 
                                        alt={`${product.name} logo`} 
                                        className="h-12 object-contain"
                                    />
                                </div>
                            )}

                            {/* Product Name & Status */}
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none" style={{ color: C.navy }}>
                                        {product.name}
                                    </h1>
                                    <div className="flex">
                                        {isOutOfStock ? (
                                            <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap hidden md:inline-flex">
                                                Дууссан
                                            </span>
                                        ) : product.stockStatus === 'preorder' ? (
                                            <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border whitespace-nowrap hidden md:inline-flex" style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' }}>
                                                Захиалгаар
                                            </span>
                                        ) : (
                                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap hidden md:inline-flex">
                                                Бэлэн байгаа
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button className="p-2 rounded-full transition-colors hidden md:block" style={{ color: C.navy }}>
                                    <Heart size={24} />
                                </button>
                            </div>
                            
                            {/* Mobile Status (Shown below title on mobile only for better layout) */}
                            <div className="flex md:hidden">
                                {isOutOfStock ? (
                                    <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                                        Дууссан
                                    </span>
                                ) : product.stockStatus === 'preorder' ? (
                                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border whitespace-nowrap" style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' }}>
                                        Захиалгаар
                                    </span>
                                ) : (
                                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                                        Бэлэн байгаа
                                    </span>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex flex-col gap-2 pt-1">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-black" style={{ color: C.navy }}>
                                        {product.price.toLocaleString()}₮
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-lg line-through text-red-400">
                                            {product.originalPrice.toLocaleString()}₮
                                        </span>
                                    )}
                                </div>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-xs font-bold px-3 py-1 rounded-full w-fit" style={{ backgroundColor: C.gold, color: C.navy }}>
                                        Хэмнэлт: {(product.originalPrice - product.price).toLocaleString()}₮
                                    </span>
                                )}
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-1.5 text-sm">
                                <div className="flex" style={{ color: C.gold }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'} strokeWidth={2} />
                                    ))}
                                </div>
                                <span className="font-medium underline cursor-pointer" style={{ color: C.navyMid }}>{product.rating || 5.0} ({product.reviews || 0} Үнэлгээ)</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 pb-6" style={{ borderBottom: `1px solid ${C.navyBorder}` }}>
                            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: C.navy }}>Дэлгэрэнгүй</h3>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: C.navyMid }}>
                                {product.description}
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="space-y-5">
                            {product.variants?.map((variant, idx) => (
                                <div key={idx} className="space-y-3">
                                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: C.navy }}>
                                        {variant.label}: <span style={{ color: C.navyMid, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{selections[variant.id] || 'Сонгоогүй'}</span>
                                    </span>
                                    <div className="flex flex-wrap gap-3">
                                        {variant.values?.map((val, vIdx) => {
                                            const isObject = typeof val === 'object' && val !== null;
                                            const valName = isObject ? (val as any).name : val;
                                            const valCode = isObject ? (val as any).value : val;
                                            const isSelected = selections[variant.id] === valName;

                                            if (variant.type === 'color') {
                                                return (
                                                    <button
                                                        key={vIdx}
                                                        onClick={() => handleSelection(variant.id, valName)}
                                                        className="w-10 h-10 rounded-full border-2 transition-all"
                                                        style={{ borderColor: isSelected ? C.gold : 'transparent', padding: isSelected ? '2px' : '0' }}
                                                        title={valName}
                                                    >
                                                        <span className="block w-full h-full rounded-full" style={{ backgroundColor: valCode, border: `1px solid ${C.navyBorder}` }} />
                                                    </button>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={vIdx}
                                                    onClick={() => handleSelection(variant.id, valName)}
                                                    className="min-w-[4rem] px-4 py-2.5 text-sm font-bold rounded-lg border transition-all uppercase"
                                                    style={isSelected
                                                        ? { backgroundColor: C.navy, color: C.gold, borderColor: C.navy }
                                                        : { backgroundColor: 'transparent', color: C.navy, borderColor: C.navyBorder }
                                                    }
                                                >
                                                    {valName}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Quantity & Buttons */}
                        <div className="hidden md:flex flex-col gap-5">
                            {/* Quantity */}
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: C.navy }}>Тоо ширхэг:</span>
                                <div className="flex items-center rounded-lg h-10 w-36 border" style={{ borderColor: C.navyBorder }}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-full flex items-center justify-center transition-colors"
                                        style={{ color: C.navy }}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="flex-1 text-center font-black" style={{ color: C.navy }}>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                                        disabled={isOutOfStock || quantity >= maxQuantity}
                                        className="w-10 h-full flex items-center justify-center transition-colors disabled:opacity-30"
                                        style={{ color: C.navy }}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Buttons */}
                            {isOutOfStock ? (
                                <button disabled className="w-full h-12 bg-red-50 border-2 border-red-300 text-red-600 text-sm font-bold uppercase tracking-wider rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                                    <span>❌</span> Дууссан — Худалдан авах боломжгүй
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleAction('cart')}
                                        className="flex-1 h-12 text-sm font-bold uppercase tracking-wider rounded-lg border-2 transition-all hover:opacity-80"
                                        style={{ borderColor: C.navy, backgroundColor: 'transparent', color: C.navy }}
                                    >
                                        Сагсанд хийх
                                    </button>
                                    <button
                                        onClick={() => handleAction('buy')}
                                        disabled={isBuyNowLoading}
                                        className="btn-buy flex-1 h-12 text-sm font-bold uppercase tracking-widest rounded-lg flex items-center justify-center"
                                        style={{ color: C.navy }}
                                    >
                                        {isBuyNowLoading ? <Loader2 className="animate-spin" /> : 'ЗАХИАЛАХ'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Sticky Footer */}
                        {isSticky && (
                            <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-50 px-5 pb-8 animate-fade-in-up max-w-[100vw] box-border" style={{ backgroundColor: C.bg, borderTop: `1px solid ${C.navyBorder}` }}>
                                {isOutOfStock ? (
                                    <button disabled className="w-full h-14 bg-red-50 border-2 border-red-300 text-red-600 text-base font-bold uppercase tracking-wider rounded-full cursor-not-allowed flex items-center justify-center gap-2">
                                        <span>❌</span> Дууссан
                                    </button>
                                ) : (
                                    <div className="flex gap-3 max-w-full">
                                        <button
                                            onClick={() => handleAction('cart')}
                                            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform border-2"
                                            style={{ borderColor: C.navy, color: C.navy, backgroundColor: 'transparent' }}
                                        >
                                            <ShoppingBag size={24} strokeWidth={1.5} />
                                        </button>
                                        <button
                                            onClick={() => handleAction('buy')}
                                            disabled={isBuyNowLoading}
                                            className="btn-buy flex-1 min-w-0 h-14 text-base font-bold uppercase tracking-widest rounded-full flex items-center justify-center"
                                            style={{ color: C.navy }}
                                        >
                                            {isBuyNowLoading ? <Loader2 className="animate-spin" /> : 'ЗАХИАЛАХ'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Accordions */}
                        <div className="pt-6 space-y-0" style={{ borderTop: `1px solid ${C.navyBorder}` }}>

                            {/* Static Mobile Buttons */}
                            <div ref={staticButtonsRef} className="md:hidden pt-4 pb-2 w-full max-w-[100vw] box-border">
                                {isOutOfStock ? (
                                    <button disabled className="w-full h-14 bg-red-50 border-2 border-red-300 text-red-600 text-base font-bold uppercase tracking-wider rounded-full cursor-not-allowed flex items-center justify-center gap-2">
                                        <span>❌</span> Дууссан
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-3 max-w-full">
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: C.navy }}>Тоо ширхэг:</span>
                                            <div className="flex items-center rounded-lg h-10 w-32 border" style={{ borderColor: C.navyBorder, backgroundColor: C.bg }}>
                                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center" style={{ color: C.navy }}>
                                                    <Minus size={16} />
                                                </button>
                                                <span className="flex-1 text-center font-bold" style={{ color: C.navy }}>{quantity}</span>
                                                <button onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))} disabled={isOutOfStock || quantity >= maxQuantity} className="w-10 h-full flex items-center justify-center disabled:opacity-30" style={{ color: C.navy }}>
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 max-w-full">
                                            <button
                                                onClick={() => handleAction('cart')}
                                                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform border-2"
                                                style={{ borderColor: C.navy, color: C.navy, backgroundColor: 'transparent' }}
                                            >
                                                <ShoppingBag size={24} strokeWidth={1.5} />
                                            </button>
                                            <button
                                                onClick={() => handleAction('buy')}
                                                disabled={isBuyNowLoading}
                                                className="btn-buy flex-1 min-w-0 h-14 text-base font-bold uppercase tracking-widest rounded-full flex items-center justify-center"
                                                style={{ color: C.navy }}
                                            >
                                                {isBuyNowLoading ? <Loader2 className="animate-spin" /> : 'ЗАХИАЛАХ'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Delivery Accordion */}
                            <details className="group py-4 cursor-pointer" style={{ borderBottom: `1px solid ${C.navyBorder}` }}>
                                <summary className="flex justify-between items-center text-xs font-bold uppercase tracking-widest list-none" style={{ color: C.navy }}>
                                    <span>Хүргэлт болон буцаалт</span>
                                    <Plus size={18} className="group-open:hidden" />
                                    <Minus size={18} className="hidden group-open:block" />
                                </summary>
                                <div className="pt-3 text-sm whitespace-pre-wrap" style={{ color: C.navyMid }}>
                                    {product.deliveryAndReturns || '100,000₮-с дээш худалдан авалтад хүргэлт үнэгүй.\n14 хоногийн дотор буцаах боломжтой.'}
                                </div>
                            </details>

                        </div>

                    </div>
                </div>

                {/* Video Section */}
                {product.productVideos && product.productVideos.length > 0 && (
                    <div className="py-12 px-5 md:px-10">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6" style={{ color: C.navy }}>Бүтээгдэхүүний бичлэгүүд</h2>
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

            {/* Lightbox / Popup Gallery */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in-up"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50 transition-colors"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <X size={36} />
                    </button>

                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-4 z-50 transition-colors hidden md:block"
                        onClick={prevImage}
                        disabled={images.length <= 1}
                    >
                        <ChevronLeft size={64} strokeWidth={1} />
                    </button>

                    <div className="relative w-full max-w-5xl aspect-square md:aspect-auto md:h-[85vh] p-4 flex items-center justify-center">
                        <img
                            src={images[lightboxIndex]}
                            alt={`Preview ${lightboxIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-4 z-50 transition-colors hidden md:block"
                        onClick={nextImage}
                        disabled={images.length <= 1}
                    >
                        <ChevronRight size={64} strokeWidth={1} />
                    </button>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-3 bg-black/50 rounded-2xl backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className="w-14 h-14 rounded-lg overflow-hidden transition-all"
                                    style={{ border: lightboxIndex === idx ? `2px solid ${C.gold}` : '2px solid transparent', opacity: lightboxIndex === idx ? 1 : 0.5, transform: lightboxIndex === idx ? 'scale(1.1)' : 'scale(1)' }}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
