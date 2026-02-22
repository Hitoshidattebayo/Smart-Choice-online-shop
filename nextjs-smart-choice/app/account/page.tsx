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

export default function AccountPage() {
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
        return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Уншиж байна...</div>;
    }

    const userName = session?.user?.name || 'Хэрэглэгч';
    const isGuest = session?.user?.isGuest || false;

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>

            {/* User Profile Section */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>Миний хаяг</h1>
                <div style={{ backgroundColor: '#f9f9f9', padding: '24px', borderRadius: '12px', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p style={{ margin: 0, fontSize: '16px' }}><strong>Нэр:</strong> {userName}</p>
                        {session?.user?.email && (
                            <p style={{ margin: 0, fontSize: '16px' }}><strong>Имэйл:</strong> {session.user.email}</p>
                        )}
                        {isGuest && (
                            <p style={{ margin: '8px 0 0 0', fontSize: '14px', padding: '8px 12px', backgroundColor: '#fff3cd', borderRadius: '6px', color: '#856404' }}>
                                Та зочноор нэвтэрсэн байна.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Orders Section */}
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                    {isGuest ? 'Зочны захиалгууд' : 'Миний захиалгууд'}
                </h2>

                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee', color: '#666', marginTop: '20px' }}>
                        <p>Танд одоогоор захиалга байхгүй байна.</p>
                        <Link href="/" style={{ display: 'inline-block', marginTop: '16px', color: '#0056b3', textDecoration: 'underline', fontWeight: '500' }}>
                            Дэлгүүр хэсэх
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                        {orders.map((order) => (
                            <Link href={`/account/orders/${order.id}`} key={order.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    padding: '24px',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid #eee',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }} className="hover:shadow-md hover:border-gray-300">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ fontWeight: '600', fontSize: '16px', margin: 0 }}>
                                            Захиалга #{order.paymentReference.slice(0, 8)}...
                                        </h3>
                                        <span style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            backgroundColor: order.status === 'PAID' ? '#dcfce7' : '#fef08a',
                                            color: order.status === 'PAID' ? '#166534' : '#854d0e'
                                        }}>
                                            {order.status === 'PAID' ? 'ТӨЛӨГДСӨН' : order.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <p style={{ margin: 0 }}>
                                            <strong>Бараанууд:</strong> {order.items?.length > 0 ? (
                                                `${order.items[0].productName} ${order.items.length > 1 ? `+ ${order.items.length - 1} илүү` : ''}`
                                            ) : 'Бараа алга'}
                                        </p>
                                        <p style={{ margin: 0 }}><strong>Дүн:</strong> {order.totalAmount?.toLocaleString() ?? 0} ₮</p>
                                        <p style={{ margin: 0 }}><strong>Огноо:</strong> {new Date(order.createdAt).toLocaleString('mn-MN')}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
