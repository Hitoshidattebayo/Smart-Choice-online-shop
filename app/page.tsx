'use client';

import Image from "next/image";
import { Sprout, Leaf, Recycle, UserCircle, PartyPopper, ChevronLeft, ChevronRight, Clock, Truck, MapPin, Lightbulb, ShieldCheck, HeartHandshake } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function Home() {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const { addToCart } = useCart();

    const heroProducts = [
        {
            id: 1,
            title: "Waves Speaker",
            headline: "PURE SOUND CLARITY.",
            description: "Experience premium audio performance with our sustainable Waves Speaker. Designed for crystal clear sound in any environment.",
            price: "$129",
            originalPrice: null,
            image: "/hero-product.jpg",
            subtext: "High quality stereo speaker"
        },
        {
            id: 2,
            title: "Massager Chair",
            headline: "RELAX ANYWHERE.",
            description: "Experience ultimate comfort with our portable massage chair. Perfect for home or office use.",
            price: "$249",
            originalPrice: "$299",
            image: "/massage-chair.jpg",
            subtext: "Зөөврийн массажны сандал"
        }
    ];

    const bestSellers: { id: number; name: string; price: string; image: string; badge?: string }[] = [
        { id: 1, name: "Waves Speaker", price: "$129", image: "/hero-product.jpg" },
        { id: 2, name: "Massager Chair", price: "$249", image: "/massage-chair.jpg", badge: "NEW" }
    ];

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

    const testimonials = [
        {
            id: 1,
            text: "These are the most comfortable sneakers I've ever owned. Plus, knowing they're vegan and sustainable makes me feel even better!",
            author: "Sarah M.",
            avatar: "👩"
        },
        {
            id: 2,
            text: "QUENX has completely changed my perspective on vegan footwear. The quality is outstanding and they look incredible!",
            author: "James K.",
            avatar: "👨"
        },
        {
            id: 3,
            text: "I love that I can look good and do good at the same time. These sneakers are perfect for my active lifestyle.",
            author: "Maria L.",
            avatar: "👩"
        },
    ];

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

    // Autoplay
    useEffect(() => {
        const interval = setInterval(() => {
            nextProduct();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentProductIndex]);

    return (
        <>
            {/* Hero Section - Clean Rebuild */}
            <section className="hero">
                <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
                    {/* Delivery Info Bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '3rem',
                        marginBottom: '4rem',
                        flexWrap: 'wrap',
                        color: 'var(--color-text-light)',
                        fontSize: '1.1rem',
                        fontWeight: 500
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Clock size={24} />
                            <span>24 цагийн дотор</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Truck size={24} />
                            <span>Хот дотор хүргэлт үнэгүй</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <MapPin size={24} />
                            <span>Хөдөө орон нутгийн унаанд тавьж явуулах боломжтой</span>
                        </div>
                    </div>

                    {/* Main Hero Content */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            display: 'flex',
                            gap: '2rem',
                            marginBottom: '3rem',
                            alignItems: 'stretch',
                            flexWrap: 'wrap'
                        }}>
                            {/* Left: Text Content */}
                            <div style={{
                                flex: '1 1 450px',
                                backgroundColor: '#ffffff',
                                padding: '3rem',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignSelf: 'stretch',
                                minHeight: '550px'
                            }}>
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
                            </div>

                            {/* Right: Product Carousel */}
                            <div style={{
                                flex: '1 1 450px',
                                maxWidth: '500px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignSelf: 'stretch',
                                minHeight: '550px'
                            }}>
                                <div
                                    ref={carouselRef}
                                    onScroll={handleScroll}
                                    className="product-carousel-container"
                                >
                                    {heroProducts.map((product) => (
                                        <div key={product.id} className="hero-product-card">
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
                                                    <span style={{ textDecoration: 'line-through', color: '#888' }}>
                                                        {product.originalPrice}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                className="btn btn-primary"
                                                style={{ width: '100%' }}
                                                onClick={() => addToCart({
                                                    id: product.id.toString(),
                                                    name: product.title,
                                                    price: parseInt(product.price.replace(/[^0-9]/g, '')),
                                                    originalPrice: product.originalPrice ? parseInt(product.originalPrice.replace(/[^0-9]/g, '')) : undefined,
                                                    image: product.image
                                                })}
                                            >
                                                ADD TO CART
                                            </button>
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
                        <h2 className="section-title">Our Best Sellers</h2>
                        <p className="section-subtitle">Discover why these are customer favorites</p>
                    </div>

                    <div className="grid grid-4">
                        {bestSellers.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-card-img-wrapper">
                                    {product.badge && (
                                        <span className="product-badge">{product.badge}</span>
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
                                    <p className="product-price">{product.price}</p>
                                </div>
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

                    <div className="sustainability-grid">
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

            {/* Testimonials Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Find Out What People Are Saying About QUENX</h2>
                    </div>

                    <div className="grid grid-3">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="testimonial-card">
                                <div style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-accent-blue)' }}>
                                    <UserCircle size={80} strokeWidth={1.5} />
                                </div>
                                <p className="testimonial-text">&ldquo;{testimonial.text}&rdquo;</p>
                                <p className="testimonial-author">— {testimonial.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

