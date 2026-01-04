
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function OrderDetailsPage({ params }: { params: { orderId: string } }) {
    const session = await getServerSession();

    // Note: Next.js 15 might require awaiting params also, but in current setup it should be fine. 
    // In strict environments, we assume params is accessible.

    if (!session) {
        // Technically, a guest might be trying to view it.
        // But guest session is also a session.
        redirect('/login');
    }

    const order = await prisma.order.findUnique({
        where: { id: params.orderId },
        include: { items: true }
    });

    if (!order) {
        return (
            <div className="container mx-auto p-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <Link href="/account/orders" className="text-blue-600 underline">Back to Orders</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Order Details</h1>
                <Link href="/account/orders" className="text-sm text-gray-600 hover:text-black">
                    ← Back to List
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Order Reference</p>
                        <p className="text-xl font-mono font-bold">{order.paymentReference}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold text-right">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${order.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold mb-3">Customer Information</h3>
                        <div className="space-y-1 text-gray-600">
                            <p><span className="font-medium text-black">Name:</span> {order.customerName}</p>
                            <p><span className="font-medium text-black">Phone:</span> {order.phoneNumber}</p>
                            <p><span className="font-medium text-black">Email:</span> {order.email || 'N/A'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-3">Order Summary</h3>
                        <div className="space-y-1 text-gray-600">
                            <p><span className="font-medium text-black">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><span className="font-medium text-black">Total Amount:</span> {order.totalAmount?.toLocaleString() ?? 0} ₮</p>
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="p-6">
                    <h3 className="text-lg font-bold mb-4">Items</h3>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0 border-gray-50">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.productName} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{item.productName}</h4>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{item.price.toLocaleString()} ₮</p>
                                    <p className="text-xs text-gray-400">ea</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Totals */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>Grand Total</span>
                        <span>{order.totalAmount?.toLocaleString() ?? 0} ₮</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
