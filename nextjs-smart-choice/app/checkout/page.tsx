'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, CreditCard, Truck, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { createCartOrder } from '@/actions/order';
import CopyButton from '@/components/CopyButton';

export default function CheckoutPage() {
    const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('transfer');
    const [paymentRef, setPaymentRef] = useState('');

    useEffect(() => {
        // Generate reference: SC - [First 2 letters of first product] - [Random Number]
        let prefix = 'GEN'; // Fallback
        if (cart.length > 0 && cart[0].name) {
            // Get first 2 chars, remove non-alphanumeric if needed, but cyrillic is fine. 
            // Just uppercase first 2 chars.
            prefix = cart[0].name.substring(0, 2).toUpperCase();
        }

        const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        setPaymentRef(`SC-${prefix}-${randomNum}`);
    }, [cart]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ... (existing imports)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createCartOrder({
                customerName: `${formData.firstName} ${formData.lastName}`,
                phoneNumber: formData.phone,
                email: formData.email,
                address: `${formData.address}, ${formData.city}`, // Pass formatted address
                totalAmount: cartTotal,
                items: cart,
                paymentReference: paymentRef, // Pass the specific reference we showed the user
                paymentMethod: selectedPayment // Pass selected payment method
            });

            if (result.success) {
                clearCart();
                router.push(`/checkout/success?ref=${result.paymentReference}`);
            } else {
                alert('Failed to create order. Please try again.');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Таны сагс хоосон байна</h2>
                    <p className="text-gray-600 mb-8">Худалдан авалт хийхийн тулд бараа нэмнэ үү.</p>
                    <Link href="/" className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                        Дэлгүүр хэсэх
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Төлбөр төлөх</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Shipping Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="flex items-center gap-2 mb-6 border-b pb-4">
                                <Truck className="text-black" />
                                <h2 className="text-xl font-bold">Хүргэлтийн мэдээлэл</h2>
                            </div>

                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Нэр</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                placeholder="Болд"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Овог</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="Дорж"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Имэйл</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="email"
                                            name="email"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Утасны дугаар</label>
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

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Хот / Орон нутаг</label>
                                        <select
                                            name="city"
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Сонгох...</option>
                                            <option value="Ulaanbaatar">Улаанбаатар хот</option>
                                            <option value="Local">Орон нутаг</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Дэлгэрэнгүй хаяг</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="Байр, тоот гэх мэт..."
                                            value={formData.address}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6 border-b pb-4">
                                <CreditCard className="text-black" />
                                <h2 className="text-xl font-bold">Төлбөрийн хэрэгсэл</h2>
                            </div>

                            <div className="space-y-3">
                                <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-colors ${selectedPayment === 'transfer' ? 'border-black bg-gray-50' : 'hover:border-black'}`}>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="transfer"
                                            checked={selectedPayment === 'transfer'}
                                            onChange={(e) => setSelectedPayment(e.target.value)}
                                            className="w-5 h-5 text-black"
                                        />
                                        <span className="ml-3 font-medium">Дансаар</span>
                                    </div>

                                    {selectedPayment === 'transfer' && (
                                        <div className="mt-4 pl-8">
                                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm space-y-3">
                                                <div className="flex justify-between border-b pb-2">
                                                    <span className="text-gray-500">Банк:</span>
                                                    <span className="font-medium text-right">Хаан Банк</span>
                                                </div>
                                                <div className="space-y-1 border-b pb-2">
                                                    <span className="text-gray-500 block">Дансны дугаар:</span>
                                                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                                        <span className="font-mono font-bold">MN420005005019333896</span>
                                                        <CopyButton text="MN420005005019333896" className="text-gray-500 hover:text-black" />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between border-b pb-2">
                                                    <span className="text-gray-500">Данс эзэмшигч:</span>
                                                    <span className="font-medium text-right">Баясгалан Цолмон</span>
                                                </div>

                                                <div className="space-y-1 pt-1">
                                                    <p className="text-xs text-gray-500 font-bold uppercase">Гүйлгээний утга (ЗААВАЛ БИЧИХ)</p>
                                                    <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md border border-gray-200">
                                                        <span className="font-mono font-bold text-lg text-black">{paymentRef}</span>
                                                        <CopyButton text={paymentRef} className="text-gray-500 hover:text-black" label="ХУУЛАХ" showLabel={true} />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2 leading-tight">
                                                        * Та төлбөр шилжүүлэхдээ гүйлгээний утга хэсэгт энэ кодыг бичнэ үү. Ингэснээр бид таны төлбөрийг автоматаар баталгаажуулах болно.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </label>
                                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-black transition-colors opacity-60">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="qpay"
                                        disabled
                                        className="w-5 h-5 text-black"
                                    />
                                    <span className="ml-3 font-medium text-gray-500">QPay /тун удахгүй/</span>
                                </label>
                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${selectedPayment === 'cash' ? 'border-black' : 'hover:border-black'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cash"
                                        checked={selectedPayment === 'cash'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="w-5 h-5 text-black"
                                    />
                                    <span className="ml-3 font-medium">Бэлнээр</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 border-b pb-4">Захиалгын тойм</h2>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-100 flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                                            <div className="text-xs text-gray-500 mt-1">Тоо: {item.quantity}</div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="font-semibold text-sm">${item.price * item.quantity}</span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                >
                                                    Устгах
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 text-sm border-t pt-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Дэд дүн</span>
                                    <span>${cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Хүргэлт</span>
                                    <span>Үнэгүй</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                    <span>Нийт</span>
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
                                    <>Боловсруулж байна...</>
                                ) : (
                                    <>Захиалах <CheckCircle size={20} /></>
                                )}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                Төлбөр найдвартай хийгдэнэ. Та манай үйлчилгээний нөхцөлийг зөвшөөрч байна.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
