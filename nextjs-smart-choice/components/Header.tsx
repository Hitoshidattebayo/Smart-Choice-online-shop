'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, Heart, ShoppingCart, X, Minus, Plus, LogOut, Package, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
    const { data: session } = useSession();
    const router = useRouter();
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    // const [showCartDropdown, setShowCartDropdown] = useState(false); // Refactored to global context
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const cartMenuRef = useRef<HTMLDivElement>(null);
    const {
        cartCount,
        cart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        isCartOpen,
        closeCart,
        toggleCart
    } = useCart();

    // Close menus when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setShowAccountMenu(false);
            }
            if (cartMenuRef.current && !cartMenuRef.current.contains(event.target as Node)) {
                closeCart();
            }
        }

        if (showAccountMenu || isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAccountMenu, isCartOpen, closeCart]);

    return (
        <header className="header">
            {/* Scrolling Top Banner */}
            <div className="bg-black text-white text-xs py-2 overflow-hidden flex border-b border-gray-800 uppercase tracking-widest">
                <div className="animate-marquee-reverse whitespace-nowrap flex-shrink-0 flex items-center">
                    <span className="mx-20">Таны ухаалаг худалдан авалтын гүүр</span>
                    <span className="mx-20">Таны ухаалаг худалдан авалтын гүүр</span>
                    <span className="mx-20">Таны ухаалаг худалдан авалтын гүүр</span>
                    <span className="mx-20">Таны ухаалаг худалдан авалтын гүүр</span>
                </div>
                <div className="animate-marquee-reverse whitespace-nowrap flex-shrink-0 flex items-center">
                    <span className="mx-20">Таны ухаалаг худалдан авалтын гүүр</span>
                    <span className="mx-20">Таны ухаалаг худалдан авалтын гүүр</span>
                    <span className="mx-20">Таны ухаалаг худалдан авалтын гүүр</span>
                    <span className="mx-20">Таны ухаалаг худалдан авалтын гүүр</span>
                </div>
            </div>
            <div className="container">
                <div className="header-content">
                    {/* Left Side: Logo + Nav */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                        {/* Logo */}
                        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <Image
                                src="/logo.png"
                                alt="Smart Choice"
                                width={180}
                                height={50}
                                style={{ height: 'auto', maxHeight: '45px', width: 'auto' }}
                                priority
                            />
                        </a>

                        {/* Navigation */}
                        <nav className="nav">
                            <Link href="/" className="nav-link">Home</Link>
                            <Link href="/about" className="nav-link">About Us</Link>
                            <Link href="/contact" className="nav-link">Contact</Link>
                        </nav>
                    </div>

                    {/* Search and Icons */}
                    <div className="header-icons">
                        {/* Search Bar */}
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Бүтээгдэхүүн хайх..."
                                className="search-input"
                            />
                            <button className="search-btn">
                                <Search size={18} />
                            </button>
                        </div>

                        {/* Account Icon with Dropdown */}
                        <div style={{ position: 'relative' }} ref={accountMenuRef}>
                            <button
                                className="icon-btn"
                                title="Account"
                                onClick={() => setShowAccountMenu(!showAccountMenu)}
                            >
                                <User size={20} />
                            </button>

                            {/* Account Dropdown Menu */}
                            {showAccountMenu && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 10px)',
                                    right: 0,
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    minWidth: '220px',
                                    zIndex: 1000,
                                    overflow: 'hidden'
                                }}>
                                    {session ? (
                                        <>
                                            {/* User Info Header */}
                                            <div style={{
                                                padding: '16px',
                                                borderBottom: '1px solid #e0e0e0',
                                                backgroundColor: '#f8f9fa'
                                            }}>
                                                <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                                                    {session.user?.name || 'User'}
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#666', wordBreak: 'break-all' }}>
                                                    {session.user?.isGuest ? 'Зочны хаяг' : session.user?.email}
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <Link href="/account" style={{ textDecoration: 'none' }}>
                                                <button
                                                    onClick={() => setShowAccountMenu(false)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: 'none',
                                                        backgroundColor: 'transparent',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        color: '#333',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <User size={16} />
                                                    Миний хаяг
                                                </button>
                                            </Link>

                                            <Link href="/account/orders" style={{ textDecoration: 'none' }}>
                                                <button
                                                    onClick={() => setShowAccountMenu(false)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: 'none',
                                                        backgroundColor: 'transparent',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        color: '#333',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <Package size={16} />
                                                    Миний захиалгууд
                                                </button>
                                            </Link>

                                            <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '4px 0' }} />

                                            <button
                                                onClick={() => {
                                                    setShowAccountMenu(false);
                                                    signOut({ callbackUrl: '/' });
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    color: '#e63946',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <LogOut size={16} />
                                                Гарах
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" style={{ textDecoration: 'none' }}>
                                                <button
                                                    onClick={() => setShowAccountMenu(false)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: 'none',
                                                        backgroundColor: 'transparent',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        color: '#333',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    Нэвтрэх
                                                </button>
                                            </Link>
                                            <Link href="/signup" style={{ textDecoration: 'none' }}>
                                                <button
                                                    onClick={() => setShowAccountMenu(false)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: 'none',
                                                        backgroundColor: 'transparent',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        color: '#333',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    Бүртгүүлэх
                                                </button>
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    setShowAccountMenu(false);
                                                    try {
                                                        const response = await fetch('/api/auth/guest', { method: 'POST' });
                                                        const data = await response.json();
                                                        if (data.success && data.user) {
                                                            await signIn('credentials', {
                                                                email: `guest_${data.user.id}@temp.local`,
                                                                password: 'guest_temp',
                                                                redirect: false,
                                                            });
                                                            window.location.reload();
                                                        }
                                                    } catch (error) {
                                                        console.error('Failed to create guest session:', error);
                                                    }
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    color: '#666',
                                                    transition: 'background-color 0.2s',
                                                    borderTop: '1px solid #e0e0e0'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                Зочноор үргэлжлүүлэх
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Other Icons */}
                        <button className="icon-btn" title="Wishlist">
                            <Heart size={20} />
                        </button>
                        {/* Cart Icon with Dropdown */}
                        <div style={{ position: 'relative' }} ref={cartMenuRef}>
                            <button
                                className="icon-btn"
                                title="Cart"
                                style={{ position: 'relative' }}
                                onClick={() => toggleCart()}
                            >
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        backgroundColor: '#e63946',
                                        color: '#ffffff',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        border: '2px solid #ffffff'
                                    }}>
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Cart Dropdown */}
                            {isCartOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 10px)',
                                    right: 0,
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                                    width: '380px',
                                    maxHeight: '500px',
                                    zIndex: 1000,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {/* Header */}
                                    <div style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e0e0e0',
                                        fontWeight: '600',
                                        fontSize: '16px'
                                    }}>
                                        Сагс ({cartCount} {cartCount === 1 ? 'бараа' : 'бараа'})
                                    </div>

                                    {/* Cart Items */}
                                    {cart.length === 0 ? (
                                        <div style={{
                                            padding: '40px 20px',
                                            textAlign: 'center',
                                            color: '#999'
                                        }}>
                                            Таны сагс хоосон байна
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{
                                                flex: 1,
                                                overflowY: 'auto',
                                                padding: '8px'
                                            }}>
                                                {cart.map((item) => (
                                                    <div key={item.id} style={{
                                                        display: 'flex',
                                                        gap: '12px',
                                                        padding: '12px',
                                                        borderBottom: '1px solid #f0f0f0'
                                                    }}>
                                                        {/* Product Image */}
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={80}
                                                            height={80}
                                                            style={{
                                                                borderRadius: '6px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />

                                                        {/* Product Details */}
                                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <div style={{
                                                                fontWeight: '600',
                                                                fontSize: '14px',
                                                                lineHeight: 1.4
                                                            }}>
                                                                {item.name}
                                                            </div>
                                                            <div style={{
                                                                fontSize: '14px',
                                                                fontWeight: '700',
                                                                color: '#333'
                                                            }}>
                                                                ${item.price}
                                                            </div>

                                                            {/* Quantity Controls */}
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                marginTop: '4px'
                                                            }}>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    style={{
                                                                        width: '24px',
                                                                        height: '24px',
                                                                        border: '1px solid #ddd',
                                                                        borderRadius: '4px',
                                                                        backgroundColor: '#fff',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}
                                                                >
                                                                    <Minus size={14} />
                                                                </button>
                                                                <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    style={{
                                                                        width: '24px',
                                                                        height: '24px',
                                                                        border: '1px solid #ddd',
                                                                        borderRadius: '4px',
                                                                        backgroundColor: '#fff',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                padding: '4px',
                                                                color: '#999'
                                                            }}
                                                            title="Remove"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Footer with Total */}
                                            <div style={{
                                                borderTop: '1px solid #e0e0e0',
                                                padding: '16px'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '12px',
                                                    fontSize: '16px',
                                                    fontWeight: '700'
                                                }}>
                                                    <span>Нийт:</span>
                                                    <span>${cartTotal}</span>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        closeCart();
                                                        if (session) {
                                                            router.push('/checkout');
                                                        } else {
                                                            try {
                                                                const response = await fetch('/api/auth/guest', { method: 'POST' });
                                                                const data = await response.json();
                                                                if (data.success && data.user) {
                                                                    await signIn('credentials', {
                                                                        email: `guest_${data.user.id}@temp.local`,
                                                                        password: 'guest_temp',
                                                                        redirect: false,
                                                                    });
                                                                    router.push('/checkout');
                                                                    router.refresh();
                                                                }
                                                            } catch (error) {
                                                                console.error('Failed to create guest session:', error);
                                                            }
                                                        }
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        backgroundColor: '#000',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Төлбөр төлөх
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header >
    );
}
