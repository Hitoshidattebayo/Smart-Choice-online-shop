import { prisma } from '@/lib/prisma';
import { markAsPaid } from '@/actions/order';
import { revalidatePath } from 'next/cache';

// Force dynamic to ensure we see latest orders
export const dynamic = 'force-dynamic';

export default async function AdminPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams.q || '';

    const orders = await prisma.order.findMany({
        where: {
            OR: [
                { paymentReference: { contains: query } }, // SQLite doesn't support case-insensitive mode easily without raw query, but standard contains works for exact matches usually.
                { customerName: { contains: query } },
            ],
        },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
    });

    async function payAction(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await markAsPaid(id);
        revalidatePath('/admin');
    }

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
                    </button>
                </form>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="p-4">Reference</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-muted/50">
                                        <td className="p-4 font-mono font-medium">{order.paymentReference}</td>
                                        <td className="p-4 text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{order.customerName}</div>
                                            <div className="text-xs text-muted-foreground">{order.phoneNumber}</div>
                                        </td>
                                        <td className="p-4">
                                            {order.items.length > 0
                                                ? `${order.items[0].productName} ${order.items.length > 1 ? `+${order.items.length - 1}` : ''}`
                                                : 'No items'}
                                        </td>
                                        <td className="p-4">{order.totalAmount.toLocaleString()} ₮</td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${order.status === 'PAID'
                                                    ? 'bg-success/10 text-success'
                                                    : 'bg-warning/10 text-warning'
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {order.status !== 'PAID' && (
                                                <form action={payAction}>
                                                    <input type="hidden" name="id" value={order.id} />
                                                    <button
                                                        type="submit"
                                                        className="text-xs btn btn-outline border-success text-success hover:bg-success hover:text-white"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                </form>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
