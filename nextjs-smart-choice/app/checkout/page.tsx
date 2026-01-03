'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, CreditCard, Truck, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutPage() {
    const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Clear cart and redirect
        clearCart();
        router.push('/order-success');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Add some items to start the checkout process.</p>
                    <Link href="/" className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Shipping Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="flex items-center gap-2 mb-6 border-b pb-4">
                                <Truck className="text-black" />
                                <h2 className="text-xl font-bold">Shipping Information</h2>
                            </div>

                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="8888-8888"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="Street address, Apartment, etc."
                                            value={formData.address}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <select
                                            name="city"
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select City</option>
                                            <option value="Ulaanbaatar">Ulaanbaatar</option>
                                            <option value="Darkhan">Darkhan</option>
                                            <option value="Erdenet">Erdenet</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                        <input
                                            type="text"
                                            name="district"
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="District"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6 border-b pb-4">
                                <CreditCard className="text-black" />
                                <h2 className="text-xl font-bold">Payment Method</h2>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-black transition-colors">
                                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-black" />
                                    <span className="ml-3 font-medium">Credit Card / Debit Card</span>
                                </label>
                                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-black transition-colors">
                                    <input type="radio" name="payment" className="w-5 h-5 text-black" />
                                    <span className="ml-3 font-medium">SocialPay</span>
                                </label>
                                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-black transition-colors">
                                    <input type="radio" name="payment" className="w-5 h-5 text-black" />
                                    <span className="ml-3 font-medium">QPay</span>
                                </label>
                                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-black transition-colors">
                                    <input type="radio" name="payment" className="w-5 h-5 text-black" />
                                    <span className="ml-3 font-medium">Cash on Delivery</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-100 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                                            <div className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="font-semibold text-sm">${item.price * item.quantity}</span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 text-sm border-t pt-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                    <span>Total</span>
                                    <span>${cartTotal}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>Processing...</>
                                ) : (
                                    <>Place Order <CheckCircle size={20} /></>
                                )}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                Secure Checkout. By checking out you agree to our Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
