'use client';

import Image from "next/image";
import Link from 'next/link';
import { Sprout, Leaf, Recycle, UserCircle, PartyPopper, ChevronLeft, ChevronRight, Clock, Truck, MapPin, Lightbulb, ShieldCheck, HeartHandshake, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
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
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const { addToCart } = useCart();

    // Reset index when products change
    useEffect(() => {
        setCurrentProductIndex(0);
    }, [heroProducts]);

    const collections = [
        {
            name: "Active QX",
            description: "Performance meets sustainability",
            image: "/collection-active.png"
        },
        {
            name: "Artisanal",
            description: "Handcrafted with care",
            image: "/collection-artisanal.png"
        },
        {
            name: "Kids Collection",
            description: "Sustainable steps for little ones",
            image: "/collection-kids.png"
        },
    ];

    const hardcodedTestimonials: Testimonial[] = [
        {
            id: 1,
            text: "These are the most comfortable sneakers I've ever owned. Plus, knowing they're vegan and sustainable makes me feel even better!",
            author: "Sarah M.",
            avatar: null
        },
        {
            id: 2,
            text: "QUENX has completely changed my perspective on vegan footwear. The quality is outstanding and they look incredible!",
            author: "James K.",
            avatar: null
        },
        {
            id: 3,
            text: "I love that I can look good and do good at the same time. These sneakers are perfect for my active lifestyle.",
            author: "Maria L.",
            avatar: null
        },
    ];

    const displayedTestimonials = (testimonials && testimonials.length > 0) ? testimonials : hardcodedTestimonials;

    const scrollToProduct = (index: number) => {
        if (carouselRef.current) {
            const container = carouselRef.current;
            const scrollAmount = container.clientWidth * index;
            container.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
            setCurrentProductIndex(index);
        }
    };

    const handleScroll = () => {
        if (carouselRef.current) {
            const container = carouselRef.current;
            const scrollPosition = container.scrollLeft;
            const width = container.clientWidth;
            const newIndex = Math.round(scrollPosition / width);
            if (newIndex !== currentProductIndex && newIndex >= 0 && newIndex < heroProducts.length) {
                setCurrentProductIndex(newIndex);
            }
        }
    };

    const nextProduct = () => {
        const newIndex = (currentProductIndex + 1) % heroProducts.length;
        scrollToProduct(newIndex);
    };

    const prevProduct = () => {
        const newIndex = (currentProductIndex - 1 + heroProducts.length) % heroProducts.length;
        scrollToProduct(newIndex);
    };

    // Autoplay - Only runs if we have products
    useEffect(() => {
        if (heroProducts.length > 0) {
            const interval = setInterval(() => {
                nextProduct();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [currentProductIndex, heroProducts.length]);

    return (
        <>
            {/* Hero Section - Clean Rebuild */}
            <section className="hero">
                <div className="container hero-container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
                    {/* Delivery Info Bar */}
                    <DeliveryInfoBar />

                    {/* Main Hero Content */}

                    {/* Main Hero Content */}
                    <div style={{ position: 'relative' }}>
                        <div className="hero-wrapper">
                            {/* Left: Text Content */}
                            <div className="hero-card" style={{
                                padding: '20px 20px var(--spacing-xl) 20px' // Match carousel padding
                            }}>
                                <div style={{
                                    flex: 1,
                                    backgroundColor: '#ffffff',
                                    padding: '3rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}>
                                    {heroProducts[currentProductIndex] && (
                                        <div key={currentProductIndex} className="fade-enter-active">
                                            <h1 className="hero-headline">{heroProducts[currentProductIndex].headline}</h1>
                                            <p style={{
                                                fontSize: 'var(--font-size-lg)',
                                                color: 'var(--color-text-light)',
                                                lineHeight: 1.6
                                            }}>
                                                {heroProducts[currentProductIndex].description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Product Carousel */}
                            <div className="hero-card" style={{ maxWidth: '500px' }}>
                                <div
                                    ref={carouselRef}
                                    onScroll={handleScroll}
                                    className="product-carousel-container"
                                    style={{ height: '100%', flex: 1 }}
                                >
                                    {heroProducts.map((product) => (
                                        <div key={product.id} className="hero-product-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                                    <Image
                                                        src={product.image}
                                                        alt={product.title}
                                                        width={400}
                                                        height={400}
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            borderRadius: '8px',
                                                            aspectRatio: '1/1',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </div>
                                                <h3 style={{
                                                    fontSize: 'var(--font-size-xl)',
                                                    fontWeight: '700',
                                                    marginBottom: 'var(--spacing-xs)'
                                                }}>
                                                    {product.title}
                                                </h3>
                                                <p style={{
                                                    color: 'var(--color-text-light)',
                                                    marginBottom: 'var(--spacing-md)',
                                                    fontSize: 'var(--font-size-sm)'
                                                }}>
                                                    {product.subtext}
                                                </p>
                                            </div>
                                            <div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    marginBottom: 'var(--spacing-md)'
                                                }}>
                                                    <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800' }}>
                                                        {product.price}
                                                    </span>
                                                    {product.originalPrice && (
                                                        <span style={{ textDecoration: 'line-through', color: '#ef4444' }}>
                                                            {product.originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                                <Link href={`/product/${product.id}`}>
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ width: '100%' }}
                                                    >
                                                        VIEW DETAILS
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Arrows - Bottom Center */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginTop: '2rem'
                        }}>
                            <button
                                onClick={prevProduct}
                                aria-label="Previous product"
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextProduct}
                                aria-label="Next product"
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Sellers Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">ОНЦЛОХ БҮТЭЭГДЭХҮҮН</h2>
                        <p className="section-subtitle">Хэрэглэгчдийн таашаалд нийцсэн бүтээгдэхүүнүүдийг сонирхоорой</p>
                    </div>

                    <div className="mobile-swipe-grid">
                        {bestSellers.map((product) => (
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
                                        {product.discountPercentage > 0 && (
                                            <span
                                                className="absolute top-3 right-3 bg-[#F44336] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10"
                                            >
                                                -{product.discountPercentage}%
                                            </span>
                                        )}
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
                                                <p className="text-sm text-red-500 line-through font-medium">
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

            {/* Why Choose Us Section */}
            <section className="section" style={{ backgroundColor: 'var(--color-secondary-bg)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Биднийг сонгох шалтгаан</h2>
                        <p className="section-subtitle">
                            Smart Choice - Таны ухаалаг сонголт
                        </p>
                    </div>

                    <div className="grid grid-3">
                        <div className="sustainability-card">
                            <div className="sustainability-icon">
                                <Lightbulb size={64} strokeWidth={1.5} style={{ color: 'var(--color-accent-blue)' }} />
                            </div>
                            <h3>Ухаалаг сонголт</h3>
                            <p>
                                Санамсаргүй бараа биш, “амьдралыг амар болгох” ухаалаг сонголт
                            </p>
                        </div>

                        <div className="sustainability-card">
                            <div className="sustainability-icon">
                                <ShieldCheck size={64} strokeWidth={1.5} style={{ color: '#4CAF50' }} />
                            </div>
                            <h3>Найдвартай чанар</h3>
                            <p>
                                Монгол хэрэглэгчид туршиж сонгосон найдвартай чанар
                            </p>
                        </div>

                        <div className="sustainability-card">
                            <div className="sustainability-icon">
                                <HeartHandshake size={64} strokeWidth={1.5} style={{ color: '#FF9800' }} />
                            </div>
                            <h3>Итгэлтэй зөвлөгөө</h3>
                            <p>
                                Зарахаас илүү зөвлөдөг – итгэл дээр суурилсан борлуулалт
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQSection faqs={faqs} />

            {/* Testimonials Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">{reviewTitle || "ХЭРЭГЛЭГЧДИЙН СЭТГЭГДЭЛ"}</h2>
                    </div>

                    <div className="grid grid-3">
                        {displayedTestimonials.map((testimonial) => (
                            <div key={testimonial.id} className="testimonial-card">
                                <div style={{
                                    marginBottom: 'var(--spacing-md)',
                                    color: 'var(--color-accent-blue)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {testimonial.avatar ? (
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.author}
                                            width={80}
                                            height={80}
                                            className="testimonial-avatar"
                                        />
                                    ) : (
                                        <UserCircle size={80} strokeWidth={1.5} />
                                    )}
                                </div>
                                <p className="testimonial-text">&ldquo;{testimonial.text}&rdquo;</p>
                                <p className="testimonial-author">— {testimonial.author} {testimonial.role && <span style={{ fontSize: '0.8em', color: '#666' }}>({testimonial.role})</span>}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
