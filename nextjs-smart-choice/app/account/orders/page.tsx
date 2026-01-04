'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItem {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    image?: string;
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    paymentReference: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.id) {
            fetchOrders(session.user.id);
        }
    }, [status, session, router]);

    const fetchOrders = async (userId: string) => {
        try {
            const response = await fetch(`/api/orders?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    const userName = session?.user?.name || 'User';
    const isGuest = session?.user?.isGuest || false;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                {isGuest ? `${userName}'s Orders` : 'My Orders'}
            </h1>
            {isGuest && (
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                    You're browsing as a guest. Your orders will be saved to this guest account.
                </p>
            )}

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
                    <p>You haven't placed any orders yet.</p>
                    <Link href="/" style={{ display: 'inline-block', marginTop: '20px', color: '#000', textDecoration: 'underline' }}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map((order) => (
                        <Link href={`/account/orders/${order.id}`} key={order.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{
                                padding: '20px',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                            }} className="hover:shadow-md">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <h3 style={{ fontWeight: '600', fontSize: '16px' }}>
                                        Order #{order.paymentReference.slice(0, 8)}...
                                    </h3>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        backgroundColor: order.status === 'PAID' ? '#d4edda' : '#fff3cd',
                                        color: order.status === 'PAID' ? '#155724' : '#856404'
                                    }}>
                                        {order.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '14px', color: '#666' }}>
                                    <p style={{ marginBottom: '4px' }}>
                                        <strong>Items:</strong> {order.items?.length > 0 ? (
                                            `${order.items[0].productName} ${order.items.length > 1 ? `+ ${order.items.length - 1} more` : ''}`
                                        ) : 'No items'}
                                    </p>
                                    <p>Amount: <strong>{order.totalAmount?.toLocaleString() ?? 0} ₮</strong></p>
                                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
