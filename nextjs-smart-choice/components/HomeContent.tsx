'use client';

import Image from "next/image";
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, Clock, Truck, MapPin, Lightbulb, ShieldCheck, HeartHandshake, Quote, UserCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DeliveryInfoBar from "./DeliveryInfoBar";
import FAQSection from "./FAQSection";

interface Testimonial {
    id: string | number;
    text: string;
    author: string;
    role?: string;
    avatar?: string | null;
}

interface Props {
    bestSellers: any[];
    heroProducts: any[];
    faqs?: any[];
    testimonials?: Testimonial[];
    reviewTitle?: string;
}

export default function HomeContent({ bestSellers, heroProducts, faqs = [], testimonials = [], reviewTitle }: Props) {
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    // Hardcoded testimonials fallback
    const hardcodedTestimonials: Testimonial[] = [
        {
            id: 1,
            text: "Маш сайн чанартай бараа ирлээ. Хүргэлт маш хурдан байсан, баярлалаа!",
            author: "Сарнай М.",
            avatar: null
        },
        {
            id: 2,
            text: "Smart Choice-оос байнга худалдан авалт хийдэг. Үргэлж сэтгэл хангалуун байдаг шүү.",
            author: "Жаргал К.",
            avatar: null
        },
        {
            id: 3,
            text: "Зөвлөгөө маш сайн өгсөн. Яг хүссэн бараагаа авч чадсан.",
            author: "Марал Л.",
            avatar: null
        },
    ];

    const displayedTestimonials = (testimonials && testimonials.length > 0) ? testimonials : hardcodedTestimonials;

    // Hero Auto-play
    useEffect(() => {
        if (heroProducts && heroProducts.length > 0) {
            const interval = setInterval(() => {
                setCurrentHeroIndex((prev) => (prev + 1) % heroProducts.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [heroProducts]);

    const nextHero = () => {
        if (!heroProducts || heroProducts.length === 0) return;
        setCurrentHeroIndex((prev) => (prev + 1) % heroProducts.length);
    };

    const prevHero = () => {
        if (!heroProducts || heroProducts.length === 0) return;
        setCurrentHeroIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
    };

    return (
        <div style={{ backgroundColor: 'var(--color-primary-bg)' }}>
            {/* Hero Section */}
            {heroProducts && heroProducts.length > 0 && (
                <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-[var(--color-dark-bg)]">
                    {heroProducts.map((product, index) => (
                        <div 
                            key={product.id} 
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <div className="absolute inset-0 bg-black/50 z-10" /> {/* Dark Overlay for text readability */}
                            <Image
                                src={product.image}
                                alt={product.headline}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority={index === 0}
                                className="transform scale-105 transition-transform duration-[10000ms] ease-out"
                            />
                            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-6 container mx-auto">
                                <span className="text-[var(--color-accent-gold)] font-bold tracking-widest uppercase mb-4 text-sm md:text-base animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                    {product.title}
                                </span>
                                <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                    {product.headline}
                                </h1>
                                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                                    <Link href={`/product/${product.id}`} className="px-8 py-4 bg-[var(--color-accent-gold)] text-[var(--color-dark-bg)] font-bold rounded-full hover:scale-105 hover:shadow-lg transition-transform uppercase tracking-wide">
                                        Дэлгэрэнгүй үзэх
                                    </Link>
                                    {product.price && (
                                        <div className="text-white bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                                            <span className="font-bold text-xl">{product.price}</span>
                                            {product.originalPrice && <span className="line-through text-gray-400 text-sm">{product.originalPrice}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Hero Controls */}
                    <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center items-center gap-4">
                        <button onClick={prevHero} className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-[var(--color-accent-gold)] hover:text-[var(--color-dark-bg)] transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex gap-2">
                            {heroProducts.map((_, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setCurrentHeroIndex(idx)}
                                    className={`w-3 h-3 rounded-full transition-all ${idx === currentHeroIndex ? 'bg-[var(--color-accent-gold)] w-8' : 'bg-white/50 hover:bg-white'}`}
                                />
                            ))}
                        </div>
                        <button onClick={nextHero} className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-[var(--color-accent-gold)] hover:text-[var(--color-dark-bg)] transition-colors">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </section>
            )}

            {/* Delivery Info Bar - Marquee */}
            <DeliveryInfoBar />

            {/* Best Sellers Section */}
            <section className="section bg-[var(--color-primary-bg)]">
                <div className="container mx-auto px-0 md:px-4">
                    <div className="text-center mb-10 md:mb-12 animate-fade-in-up">
                        <h2 className="text-3xl md:text-5xl font-black text-[var(--color-dark-bg)] mb-4">ОНЦЛОХ БҮТЭЭГДЭХҮҮН</h2>
                        <div className="w-24 h-1 bg-[var(--color-accent-gold)] mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 text-lg">Хэрэглэгчдийн таашаалд нийцсэн бүтээгдэхүүнүүдийг сонирхоорой</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[5px] md:gap-6 px-1.5 md:px-0">
                        {bestSellers.map((product, idx) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="group relative rounded-xl md:rounded-2xl overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: `${idx * 0.08}s` }}
                            >
                                {/* ── Unified TikTok-style Card (Mobile & Desktop) ── */}
                                <div className="relative aspect-[4/5] overflow-hidden rounded-xl md:rounded-2xl shadow-sm active:scale-[0.97] transition-all duration-300 md:group-hover:shadow-xl w-full h-full">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transform md:group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                    {/* Extra dark overlay on hover to make text/button pop on desktop */}
                                    <div className="hidden md:block absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                    {/* Status badge top-left */}
                                    {product.badge && (
                                        <span className={`absolute top-2.5 md:top-4 left-2.5 md:left-4 z-10 px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-bold rounded-full text-white shadow-lg ${
                                            product.badgeType === 'instock'    ? 'bg-emerald-500' :
                                            product.badgeType === 'preorder'   ? 'bg-orange-500'  :
                                            product.badgeType === 'outOfStock' ? 'bg-red-500'     :
                                            'bg-[var(--color-accent-gold)] text-[var(--color-dark-bg)]'
                                        }`}>
                                            {product.badge}
                                        </span>
                                    )}

                                    {/* Discount badge top-right */}
                                    {product.discountPercentage > 0 && (
                                        <span className="absolute top-2.5 md:top-4 right-2.5 md:right-4 z-10 bg-red-500 text-white text-[10px] md:text-xs font-extrabold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-lg">
                                            -{product.discountPercentage}%
                                        </span>
                                    )}

                                    {/* Info Text block (Shifts up on desktop hover) */}
                                    <div className="absolute bottom-0 left-0 right-0 z-10 px-2.5 md:px-5 py-2 md:py-4 transition-transform duration-300 ease-out md:group-hover:-translate-y-12">
                                        <p className="text-white font-semibold text-xs md:text-lg leading-snug line-clamp-2 md:line-clamp-2 mb-0.5 md:mb-1.5 drop-shadow-md">
                                            {product.name}
                                        </p>
                                        <div className="flex items-center gap-1.5 md:gap-3">
                                            <span className="font-black text-sm md:text-xl text-[var(--color-accent-gold)] drop-shadow-md">
                                                {product.price}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-[10px] md:text-sm text-white/70 line-through">
                                                    {product.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Desktop Hover Button */}
                                    <div className="hidden md:flex absolute bottom-0 left-0 right-0 z-10 justify-start px-5 pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                        <span className="text-[var(--color-accent-gold)] text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                            Дэлгэрэнгүй үзэх <span className="text-lg leading-none">→</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Gold left border accent on hover (Desktop only) */}
                                <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent-gold)] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom rounded-l-2xl z-20" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="section bg-[var(--color-dark-bg)] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent-gold)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">БИДНИЙГ СОНГОХ ШАЛТГААН</h2>
                        <div className="w-24 h-1 bg-[var(--color-accent-gold)] mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-300 text-lg">Smart Choice - Таны ухаалаг сонголт</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Lightbulb, title: 'Ухаалаг сонголт', desc: 'Санамсаргүй бараа биш, “амьдралыг амар болгох” ухаалаг сонголт' },
                            { icon: ShieldCheck, title: 'Найдвартай чанар', desc: 'Монгол хэрэглэгчид туршиж сонгосон найдвартай чанар' },
                            { icon: HeartHandshake, title: 'Итгэлтэй зөвлөгөө', desc: 'Зарахаас илүү зөвлөдөг – итгэл дээр суурилсан борлуулалт' }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 transition-colors group animate-fade-in-up" style={{ animationDelay: `${idx * 0.2}s` }}>
                                <div className="w-20 h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 transform group-hover:-translate-y-2 group-hover:rotate-6 transition-all">
                                    <feature.icon size={40} className="text-[var(--color-accent-gold)]" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="section bg-[var(--color-primary-bg)]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h2 className="text-3xl md:text-5xl font-black text-[var(--color-dark-bg)] mb-4">{reviewTitle || "ХЭРЭГЛЭГЧДИЙН СЭТГЭГДЭЛ"}</h2>
                        <div className="w-24 h-1 bg-[var(--color-accent-gold)] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayedTestimonials.map((testimonial, idx) => (
                            <div key={testimonial.id} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow relative animate-fade-in-up" style={{ animationDelay: `${idx * 0.2}s` }}>
                                <Quote className="absolute top-6 right-6 text-[var(--color-primary-bg)] opacity-50" size={60} />
                                <div className="flex gap-1 mb-6 text-[var(--color-accent-gold)]">
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                    <Star size={20} fill="currentColor" />
                                </div>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8 relative z-10 italic">&ldquo;{testimonial.text}&rdquo;</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-[var(--color-accent-gold)]">
                                        {testimonial.avatar ? (
                                            <Image src={testimonial.avatar} alt={testimonial.author} width={48} height={48} className="object-cover w-full h-full" />
                                        ) : (
                                            <UserCircle size={24} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--color-dark-bg)]">{testimonial.author}</p>
                                        {testimonial.role && <p className="text-sm text-gray-500">{testimonial.role}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQSection faqs={faqs} />
        </div>
    );
}
