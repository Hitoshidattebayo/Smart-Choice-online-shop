'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, CreditCard, Truck, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { createCartOrder, createQPayInvoice } from '@/actions/order';
import { MONGOLIA_DATA } from '@/lib/address-data';

// ... imports

export default function CheckoutPage() {
    const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Step state: 1 = Shipping, 2 = Payment
    const [step, setStep] = useState(1);

    // Payment is always QPay now
    const selectedPayment = 'qpay';
    const [paymentRef, setPaymentRef] = useState('');
    const [qpayInvoice, setQpayInvoice] = useState<any>(null);
    const [qpayError, setQpayError] = useState<string | null>(null);
    const [showUnpaidWarning, setShowUnpaidWarning] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Generate reference: SC - [First 2 letters of first product] - [Random Number]
        let prefix = 'GEN';
        if (cart.length > 0 && cart[0].name) {
            prefix = cart[0].name.substring(0, 2).toUpperCase();
        }
        const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        setPaymentRef(`SC-${prefix}-${randomNum}`);
    }, [cart]);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        district: '',
        khoroo: '',
        address: '', // Detailed address
    });

    // Valid options based on selection
    const currentProvince = MONGOLIA_DATA.find(p => p.id === formData.city);
    const districtOptions = currentProvince?.districts || [];
    const currentDistrict = districtOptions.find(d => d.id === formData.district);
    const khorooOptions = currentDistrict?.khoroos || [];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'city') {
            setFormData(prev => ({
                ...prev,
                city: value,
                district: '',
                khoroo: ''
            }));
        } else if (name === 'district') {
            setFormData(prev => ({
                ...prev,
                district: value,
                khoroo: ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createCartOrder({
                customerName: formData.fullName,
                phoneNumber: formData.phone,
                email: formData.email,
                address: `${currentProvince?.name || formData.city}, ${currentDistrict?.name || formData.district}, ${formData.khoroo}, ${formData.address}`,
                totalAmount: cartTotal,
                items: cart,
                paymentReference: paymentRef,
                paymentMethod: 'qpay' // Force QPay
            });

            if (result.success && result.orderId) {
                // Immediate transition to Step 2
                setStep(2);
                setIsSubmitting(false); // Stop "Reading..." state

                // Start async invoice generation
                // We don't set isSubmitting true here because we want to show Step 2 UI
                const fetchInvoice = async () => {
                    setQpayError(null);
                    try {
                        const invoiceResult = await createQPayInvoice(result.orderId);
                        if (invoiceResult.success && invoiceResult.qpayInvoice) {
                            setQpayInvoice(invoiceResult.qpayInvoice);
                        } else {
                            console.error('Failed to generate QPay invoice:', invoiceResult.error);
                            setQpayError(invoiceResult.error || 'Нэхэмжлэх үүсгэхэд алдаа гарлаа. (QPay Error)');
                        }
                    } catch (invError) {
                        console.error('Invoice generation error:', invError);
                        setQpayError('Сүлжээний алдаа гарлаа. Дахин оролдоно уу.');
                    }
                };

                fetchInvoice();

                // Start polling for payment status (same as before)
                const checkInterval = setInterval(async () => {
                    try {
                        const checkRes = await fetch('/api/payment/qpay/check', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderId: result.orderId }),
                        });
                        const checkData = await checkRes.json();

                        if (checkData.status === 'PAID') {
                            clearInterval(checkInterval);
                            setIsSuccess(true);
                            clearCart();
                            router.push(`/checkout/success?ref=${result.paymentReference}`);
                        }
                    } catch (err) {
                        console.error('Polling error', err);
                    }
                }, 3000);
            } else {
                alert('Failed to create order. Please try again.');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An unexpected error occurred.');
            setIsSubmitting(false);
        }
    };

    const handleCheckPayment = async () => {
        // Show the unpaid warning temporarily
        setShowUnpaidWarning(true);
        setTimeout(() => setShowUnpaidWarning(false), 3000);
    };

    // Prevent hydration mismatch: don't render anything until client has mounted
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 animate-pulse" />
                    <div className="h-6 bg-gray-100 rounded w-48 mx-auto animate-pulse" />
                </div>
            </div>
        );
    }

    // Show loading state if success (prevent empty cart flash)
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center animate-pulse">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Төлбөр амжилттай!</h2>
                    <p className="text-gray-600">Таныг захиалгын хуудас руу шилжүүлж байна...</p>
                </div>
            </div>
        );
    }

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
        <>
            <div className="min-h-screen bg-gray-50 py-12 pb-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Progress Steps */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                1
                            </div>
                            <div className={`w-20 h-1 ${step >= 2 ? 'bg-black' : 'bg-gray-200'} mx-2`}></div>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                2
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-7">

                            {/* Step 1: Shipping Info */}
                            <div className={`bg-white rounded-2xl shadow-sm p-6 mb-6 ${step === 1 ? 'block' : 'hidden'}`}>
                                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                                    <Truck className="text-black" />
                                    <h2 className="text-xl font-bold">Хүргэлтийн мэдээлэл</h2>
                                </div>

                                <form id="shipping-form" onSubmit={handleCreateOrder} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Овог нэр</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                required
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                placeholder="Болд Дорж"
                                                value={formData.fullName}
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
                                                minLength={8}
                                                maxLength={8}
                                                pattern="\d{8}"
                                                title="Утасны дугаар 8 оронтой байх ёстой"
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                placeholder="88888888"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                {MONGOLIA_DATA.map(province => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Сум / Дүүрэг</label>
                                            {mounted && districtOptions.length > 0 ? (
                                                <select
                                                    name="district"
                                                    required
                                                    disabled={!formData.city}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                                                    value={formData.district}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Сонгох...</option>
                                                    {districtOptions.map(d => (
                                                        <option key={d.id} value={d.id}>
                                                            {d.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    name="district"
                                                    required
                                                    disabled={!formData.city}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                                                    placeholder="Сум / Дүүрэг..."
                                                    value={formData.district}
                                                    onChange={handleInputChange}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Баг / Хороо</label>
                                            {mounted && khorooOptions.length > 0 ? (
                                                <select
                                                    name="khoroo"
                                                    required
                                                    disabled={!formData.district}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                                                    value={formData.khoroo}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Сонгох...</option>
                                                    {khorooOptions.map(k => (
                                                        <option key={k} value={k}>
                                                            {k}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    name="khoroo"
                                                    required
                                                    disabled={!formData.district}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                                                    placeholder="Баг / Хороо..."
                                                    value={formData.khoroo}
                                                    onChange={handleInputChange}
                                                />
                                            )}
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

                            {/* Step 2: Payment (QPay Only) */}
                            <div className={`bg-white rounded-2xl shadow-sm p-6 ${step === 2 ? 'block' : 'hidden'}`}>
                                <div className="flex items-center justify-between gap-2 mb-6 border-b pb-4">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="text-black" />
                                        <h2 className="text-xl font-bold">Төлбөр төлөх</h2>
                                    </div>
                                    <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-black underline">
                                        Мэдээлэл засах
                                    </button>
                                </div>

                                {/* QPay Section - Always Visible in Step 2 */}
                                {qpayError ? (
                                    <div className="p-6 border rounded-xl bg-red-50 text-center flex flex-col items-center justify-center min-h-[300px]">
                                        <div className="text-red-500 mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-lg mb-2 text-red-700">Алдаа гарлаа</h3>
                                        <p className="text-red-600 text-sm mb-4">{qpayError}</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="px-4 py-2 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium"
                                        >
                                            Дахин ачаалах
                                        </button>
                                    </div>
                                ) : !qpayInvoice ? (
                                    <div className="p-6 border rounded-xl bg-gray-50 text-center flex flex-col items-center justify-center min-h-[300px]">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
                                        <h3 className="font-bold text-lg mb-2">QR код үүсгэж байна...</h3>
                                        <p className="text-gray-600 text-sm">Түр хүлээнэ үү</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        {/* QPay Logo + Name */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                                <img src="https://qpay.mn/q/logo/qpay_logo_square.png" alt="QPay" className="w-8 h-8 object-contain" />
                                            </div>
                                            <span className="text-lg font-bold">QPay</span>
                                        </div>
                                        {/* Amount & Recipient */}
                                        <p className="text-base font-semibold text-gray-800 mb-1">
                                            ДҮН: <span className="text-black">{cartTotal.toLocaleString()}₮</span>
                                        </p>
                                        <p className="text-sm text-gray-500 mb-5">Хүлээн авагч: Баясгалан Цолмон</p>
                                        {/* QR Code */}
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-5">
                                            <Image
                                                src={`data:image/png;base64,${qpayInvoice.qr_image}`}
                                                alt="QPay QR Code"
                                                width={200}
                                                height={200}
                                            />
                                        </div>

                                        {/* Bank selection */}
                                        {qpayInvoice.urls && qpayInvoice.urls.length > 0 && (
                                            <>
                                                <p className="text-sm text-blue-600 font-medium mb-4">Та гүйлгээ хийх банкаа сонгоно уу?</p>
                                                <div className="grid grid-cols-4 gap-3 w-full">
                                                    {qpayInvoice.urls.map((url: any) => (
                                                        <a
                                                            key={url.name}
                                                            href={url.link}
                                                            className="flex flex-col items-center gap-1 group"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                                                <img src={url.logo} alt={url.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-[10px] text-gray-500 text-center leading-tight line-clamp-1">{url.name}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
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

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    Таны мэдээлэл нууцлагдмал байх болно.
                                </p>

                                {/* Shipping info summary in Step 2 */}
                                {step === 2 && (
                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="text-sm font-bold mb-2 text-gray-500">Хүргэлтийн хаяг:</h3>
                                        <p className="text-sm text-gray-800">
                                            {formData.city}, {formData.district}, {formData.khoroo}<br />
                                            {formData.address}<br />
                                            {formData.phone}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Sticky Footer */}
            {(step === 1 || (step === 2 && qpayInvoice)) && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] px-4 py-4">
                    <div className="max-w-2xl mx-auto">
                        {step === 1 ? (
                            <button
                                type="submit"
                                form="shipping-form"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>Уншиж байна...</>
                                ) : (
                                    <>Үргэлжлүүлэх <CheckCircle size={20} /></>
                                )}
                            </button>
                        ) : (
                            <div className="relative">
                                {/* Warning Message Popover */}
                                {showUnpaidWarning && (
                                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm bg-red-600 text-white text-sm py-3 px-4 rounded-xl shadow-lg animate-fade-in-up text-center leading-relaxed">
                                        Одоогоор төлбөр шилжүүлэгдээгүй байна.<br />
                                        Хэдэн секундын дараа та дахин шалгана уу...
                                        {/* Little triangle pointer at the bottom */}
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-red-600 border-x-8 border-x-transparent border-t-8"></div>
                                    </div>
                                )}
                                <button
                                    onClick={handleCheckPayment}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={20} />
                                    Төлбөр шалгах
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}