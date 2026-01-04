'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, RotateCcw, X, Check, Eye } from 'lucide-react';
import { markAsPaid, moveToTrash, restoreFromTrash, deletePermanently, cleanTrash } from '@/actions/order';
import Image from 'next/image';

interface OrderItem {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    id: string;
    customerName: string;
    phoneNumber: string;
    email: string | null;
    status: string;
    totalAmount: number;
    paymentReference: string | null;
    createdAt: Date;
    deletedAt: Date | null;
    items: OrderItem[];
}

export default function AdminDashboard({ orders }: { orders: Order[] }) {
    const [view, setView] = useState<'active' | 'trash'>('active');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const router = useRouter();

    const filteredOrders = orders.filter(o =>
        view === 'active' ? !o.deletedAt : o.deletedAt
    );

    async function handleAction(action: Function, orderId: string, refresh = true) {
        if (!confirm('Are you sure?')) return;
        await action(orderId);
        if (refresh) {
            router.refresh();
            setSelectedOrder(null);
        }
    }

    async function handleCleanTrash() {
        if (!confirm('This will delete all orders in trash older than 30 days. Continue?')) return;
        await cleanTrash();
        router.refresh();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <button
                        onClick={() => setView('active')}
                        className={`px-4 py-2 rounded-md ${view === 'active' ? 'bg-black text-white' : 'bg-gray-100'}`}
                    >
                        Active Orders
                    </button>
                    <button
                        onClick={() => setView('trash')}
                        className={`px-4 py-2 rounded-md flex items-center gap-2 ${view === 'trash' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
                    >
                        <Trash2 size={16} /> Trash Bin
                    </button>
                </div>
                {view === 'trash' && (
                    <button onClick={handleCleanTrash} className="text-sm text-red-500 hover:underline">
                        Clean Old Trash
                    </button>
                )}
            </div>

            <div className="card overflow-hidden bg-white shadow-sm rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                            <tr>
                                <th className="p-4">Ref</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <td className="p-4 font-mono">{order.paymentReference || order.id.slice(0, 8)}</td>
                                        <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div className="font-medium">{order.customerName}</div>
                                            <div className="text-xs text-gray-500">{order.phoneNumber}</div>
                                        </td>
                                        <td className="p-4 font-semibold">{order.totalAmount.toLocaleString()} ₮</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button className="p-2 hover:bg-gray-200 rounded-full">
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-1">Order Details</h2>
                            <p className="text-sm text-gray-500 font-mono mb-6">Ref: {selectedOrder.paymentReference}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Customer</h3>
                                    <p className="text-lg font-medium">{selectedOrder.customerName}</p>
                                    <p className="text-gray-600">📞 {selectedOrder.phoneNumber}</p>
                                    <p className="text-gray-600">✉️ {selectedOrder.email || 'No email'}</p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedOrder.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {selectedOrder.status}
                                        </span>
                                        <span className="text-gray-400 text-sm">
                                            {new Date(selectedOrder.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-b py-4 mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Items ({selectedOrder.items.length})</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            {item.image ? (
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                                                    <Image src={item.image} alt={item.productName} fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                                                    No Img
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">{item.productName}</p>
                                                <p className="text-sm text-gray-500">{item.quantity} x {item.price.toLocaleString()} ₮</p>
                                            </div>
                                            <div className="font-semibold">
                                                {(item.quantity * item.price).toLocaleString()} ₮
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-xl">{selectedOrder.totalAmount.toLocaleString()} ₮</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                {view === 'active' ? (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAction(moveToTrash, selectedOrder.id); }}
                                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                                        >
                                            Delete (Trash)
                                        </button>
                                        {selectedOrder.status !== 'PAID' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAction(markAsPaid, selectedOrder.id); }}
                                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                                            >
                                                <Check size={18} /> Confirm Payment
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAction(deletePermanently, selectedOrder.id); }}
                                            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                                        >
                                            Delete Permanently
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAction(restoreFromTrash, selectedOrder.id); }}
                                            className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                                        >
                                            <RotateCcw size={18} /> Restore Order
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
