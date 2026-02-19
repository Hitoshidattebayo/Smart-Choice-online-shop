'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, CreditCard, Truck, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { createCartOrder, createQPayInvoice } from '@/actions/order';
import CopyButton from '@/components/CopyButton';

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

    const [isSuccess, setIsSuccess] = useState(false);

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

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createCartOrder({
                customerName: `${formData.firstName} ${formData.lastName}`,
                phoneNumber: formData.phone,
                email: formData.email,
                address: `${formData.address}, ${formData.city}`,
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
        // ... (existing logic)
        alert('Төлбөр шалгаж байна... Түр хүлээнэ үү.');
    };

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
        <div className="min-h-screen bg-gray-50 py-12">
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
                                <div className="mt-6 p-6 border-2 border-green-500 rounded-xl bg-green-50 text-center">
                                    <h3 className="font-bold text-lg mb-4">QPay QR код</h3>
                                    <div className="flex justify-center mb-4 bg-white p-2 rounded-lg inline-block mx-auto shadow-sm">
                                        <Image
                                            src={`data:image/png;base64,${qpayInvoice.qr_image}`}
                                            alt="QPay QR Code"
                                            width={240}
                                            height={240}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 font-medium">
                                        QR кодыг банкны аппликэйшнээр уншуулж төлбөрөө төлнө үү.
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-sm font-bold animate-pulse text-green-700 bg-green-100 py-2 px-4 rounded-full inline-flex">
                                        <span className="w-2 h-2 bg-green-700 rounded-full animate-bounce"></span>
                                        Төлбөр хүлээж байна...
                                    </div>

                                    {/* Mobile Deep Links */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
                                        {qpayInvoice.urls?.map((url: any) => (
                                            <a
                                                key={url.name}
                                                href={url.link}
                                                className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img src={url.logo} alt={url.name} className="w-5 h-5 mr-2 object-contain" />
                                                <span className="truncate">{url.name}</span>
                                            </a>
                                        ))}
                                    </div>
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

                            {/* Buttons based on Step */}
                            {step === 1 ? (
                                <button
                                    type="submit"
                                    form="shipping-form"
                                    disabled={isSubmitting}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>Уншиж байна...</>
                                    ) : (
                                        <>Төлбөр төлөх <CheckCircle size={20} /></>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleCheckPayment}
                                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors mt-6 flex items-center justify-center gap-2"
                                >
                                    Төлбөр шалгах <CheckCircle size={20} />
                                </button>
                            )}

                            <p className="text-xs text-gray-400 text-center mt-4">
                                Таны мэдээлэл нууцлагдмал байх болно.
                            </p>

                            {/* Shipping info summary in Step 2 */}
                            {step === 2 && (
                                <div className="mt-6 pt-6 border-t">
                                    <h3 className="text-sm font-bold mb-2 text-gray-500">Хүргэлтийн хаяг:</h3>
                                    <p className="text-sm text-gray-800">
                                        {formData.city}, {formData.address}<br />
                                        {formData.phone}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
