'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Уншиж байна...</div>;
    }

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>Миний хаяг</h1>
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                <p><strong>Нэр:</strong> {session?.user?.name}</p>
                <p><strong>Имэйл:</strong> {session?.user?.email}</p>
            </div>
        </div>
    );
}
