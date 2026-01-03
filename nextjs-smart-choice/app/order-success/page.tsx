'use client';

import Link from 'next/link';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';
import { runFireworks } from '@/lib/utils'; // We might need to create this or just skip for now if util doesn't exist

export default function OrderSuccessPage() {

    // Optional: simple confetti effect on mount
    useEffect(() => {
        // Placeholder for confetti if we want to add a library
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold mb-4 text-gray-900">Order Confirmed!</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Thank you for your purchase. We have received your order and will begin processing it right away. A confirmation email has been sent to you.
                </p>

                <div className="space-y-3">
                    <Link href="/" className="block w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                        Continue Shopping
                    </Link>
                    <Link href="/account" className="block w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                        View Order Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
