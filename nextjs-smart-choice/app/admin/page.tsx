import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import AdminLoginForm from '@/components/AdminLoginForm';
import { LogOut } from 'lucide-react';
import { logoutAdmin } from '@/actions/admin-auth';
import AdminDashboard from '@/components/AdminDashboard'; // Import Dashboard

// Force dynamic to ensure we see latest orders
export const dynamic = 'force-dynamic';

export default async function AdminPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token');

    if (adminToken?.value !== 'true') {
        return <AdminLoginForm />;
    }

    const query = searchParams.q || '';

    // Fetch all matching orders (active and deleted are filtered on client, but we fetch all matching the query text)
    const orders = await prisma.order.findMany({
        where: {
            OR: [
                { paymentReference: { contains: query } },
                { customerName: { contains: query } },
            ],
            // Note: We deliberately do NOT filter by 'deletedAt' here because we want to show deleted items in the Trash view.
        },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
    });

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <form action={logoutAdmin}>
                        <button type="submit" className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                            <LogOut size={16} /> Logout
                        </button>
                    </form>
                </div>
                <div className="text-sm text-muted-foreground">
                    Total Orders: {orders.length}
                </div>
            </div>

            <div className="mb-6">
                <form className="flex gap-2 max-w-sm">
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="Search by Reference (SC-XXXX)..."
                        className="input"
                    />
                    <button type="submit" className="btn btn-outline">
                        Search
                    </button> {/* Tip: Searching works for both Active and Trash */}
                </form>
            </div>

            <AdminDashboard orders={orders as any} />
            {/* Cast to any to avoid strict type mismatch if prisma types aren't fully synced locally yet, mostly due to deletedAt optional field */}
        </div>
    );
}
