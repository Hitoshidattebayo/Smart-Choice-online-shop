'use client';

import { useState } from 'react';
import { X, ShoppingBag, Heart, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

interface MobileCartOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileCartOverlay({ isOpen, onClose }: MobileCartOverlayProps) {
    const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative w-full bg-white rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col animate-slide-up"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="w-8" /> {/* Spacer */}
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                        Сагс ({cartCount})
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto min-h-[300px] p-6">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                <ShoppingBag size={40} className="text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold uppercase tracking-tight">Таны сагс хоосон байна</h3>
                                <p className="text-gray-500 text-sm">Та хараахан бараа сонгоогүй байна</p>
                            </div>
                            <div className="flex flex-col gap-3 w-full max-w-xs pt-4">
                                <Link href="/" onClick={onClose} className="w-full bg-black text-white py-4 rounded-full text-sm font-bold uppercase tracking-wider">
                                    Худалдан авалт хийх
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={80}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                                                <button
                                                    onPointerDown={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        removeFromCart(item.id);
                                                    }}
                                                    className="p-2 -mr-2 text-gray-400 hover:text-red-500 active:text-red-600 transition-colors"
                                                    aria-label="Remove item"
                                                    type="button"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 mt-1">{item.price.toLocaleString()}₮</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                <div className="flex justify-between items-center text-base font-black uppercase">
                                    <span>Нийт:</span>
                                    <span>{cartTotal.toLocaleString()}₮</span>
                                </div>
                                <button
                                    onClick={() => {
                                        onClose();
                                        router.push('/checkout');
                                    }}
                                    className="w-full bg-black text-white py-4 rounded-full text-base font-bold uppercase tracking-wider"
                                >
                                    Худалдан авах
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
