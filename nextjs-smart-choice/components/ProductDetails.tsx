'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Product } from '../lib/products';
import { useCart } from '@/context/CartContext';

export default function ProductDetails({ product }: { product: Product }) {
    const { addToCart, openCart } = useCart();
    const [quantity, setQuantity] = useState(0); // Wireframe shows 0 initially? Or empty? Assuming 0 based on "- 0 +" visual, usually 1 but let's follow standard. Wireframe says "0" actually.
    const [selections, setSelections] = useState<Record<string, string>>({});

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

        <div className="min-h-screen font-sans text-gray-900 flex justify-center py-12 px-4 bg-[#f5f1e8]">
            {/* Main Card Container */}
            <div className="container bg-white rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-8 md:p-16">
                <div className="w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16">

                    {/* LEFT COLUMN: Stacked Images */}
                    <div className="flex flex-col gap-6">
                        {(product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]).map((img, idx) => (
                            <div key={idx} className="w-full bg-[#f0f0f0] rounded-[30px] overflow-hidden relative shadow-lg">
                                <img
                                    src={img}
                                    alt={`${product.name} view ${idx + 1}`}
                                    className="w-full h-auto object-cover block"
                                />
                            </div>
                        ))}
                    </div>

                    {/* RIGHT COLUMN: Info */}
                    <div className="lg:sticky lg:top-24 h-fit py-4 space-y-10">

                        {/* Header */}
                        <div>
                            <h1 className="text-5xl font-extrabold text-black mb-4 tracking-tight leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                {product.originalPrice && (
                                    <span className="text-xl text-gray-400 line-through font-medium">
                                        {product.originalPrice.toLocaleString()}₮
                                    </span>
                                )}
                                <span className="text-4xl font-black text-black">
                                    {product.price.toLocaleString()}₮
                                </span>
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
                        <div className="flex flex-col sm:flex-row items-stretch gap-4">
                            {/* Qty */}
                            <div className="flex items-center border border-[#18181b] rounded-lg bg-white h-14 shrink-0 overflow-hidden w-full sm:w-auto">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-14 h-full flex items-center justify-center bg-[#18181b] text-white hover:bg-gray-800 transition-colors"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="w-16 text-center font-bold text-lg text-[#18181b]">{quantity || 1}</span>
                                <button
                                    onClick={() => setQuantity((quantity || 1) + 1)}
                                    className="w-14 h-full flex items-center justify-center bg-[#18181b] text-white hover:bg-gray-800 transition-colors"
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
                            <button className="flex-1 h-14 bg-[#18181b] text-white border border-[#18181b] rounded-lg text-sm font-extrabold uppercase hover:bg-gray-800 transition-colors tracking-widest shadow-lg">
                                ЗАХИАЛАХ
                            </button>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <p className="font-bold text-lg">Дэлгэрэнгүй мэдээлэл</p>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {product.description}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
