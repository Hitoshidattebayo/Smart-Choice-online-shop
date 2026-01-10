'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, CreditCard, Truck, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { createCartOrder } from '@/actions/order';

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

    // ... (existing imports)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createCartOrder({
                customerName: `${formData.firstName} ${formData.lastName}`,
                phoneNumber: formData.phone,
                email: formData.email,
                address: `${formData.address}, ${formData.district}, ${formData.city}`, // Pass formatted address
                totalAmount: cartTotal,
                items: cart
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Хаяг</label>
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Хот</label>
                                        <select
                                            name="city"
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Хот сонгох</option>
                                            <option value="Ulaanbaatar">Улаанбаатар</option>
                                            <option value="Darkhan">Дархан</option>
                                            <option value="Erdenet">Эрдэнэт</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Дүүрэг</label>
                                        <input
                                            type="text"
                                            name="district"
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="Сүхбаатар дүүрэг"
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
                                <h2 className="text-xl font-bold">Төлбөрийн хэрэгсэл</h2>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-black transition-colors">
                                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-black" />
                                    <span className="ml-3 font-medium">Банкны карт</span>
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
                                    <span className="ml-3 font-medium">Бэлнээр төлөх</span>
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
