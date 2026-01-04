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
        return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>My Account</h1>
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                <p><strong>Name:</strong> {session?.user?.name}</p>
                <p><strong>Email:</strong> {session?.user?.email}</p>
            </div>
        </div>
    );
}
