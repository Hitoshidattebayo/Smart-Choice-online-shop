import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Auth check
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token');
    if (adminToken?.value !== 'true') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all data in parallel
    const [paidOrders, pendingOrders, allViews, recentViews] = await Promise.all([
        prisma.order.findMany({
            where: { status: 'PAID', deletedAt: null },
            include: { items: true },
            orderBy: { createdAt: 'asc' },
        }),
        prisma.order.findMany({
            where: { status: 'PENDING_PAYMENT', deletedAt: null },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.productView.findMany({
            where: { createdAt: { gte: thirtyDaysAgo } },
            orderBy: { createdAt: 'asc' },
        }),
        prisma.productView.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
        }),
    ]);

    // ── KPI ───────────────────────────────────────────────
    const totalRevenue = paidOrders.reduce((s, o) => s + o.totalAmount, 0);
    const weekOrders = paidOrders.filter(o => o.createdAt >= sevenDaysAgo);
    const weekRevenue = weekOrders.reduce((s, o) => s + o.totalAmount, 0);
    const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    // ── Daily revenue last 30 days ─────────────────────────
    const dailyMap: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
        dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const o of paidOrders) {
        if (o.createdAt >= thirtyDaysAgo) {
            const key = o.createdAt.toISOString().slice(0, 10);
            if (key in dailyMap) dailyMap[key] += o.totalAmount;
        }
    }
    const dailySales = Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue }));

    // ── Top Products ──────────────────────────────────────
    const productSalesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
    for (const order of paidOrders) {
        for (const item of order.items) {
            if (!productSalesMap[item.productId]) {
                productSalesMap[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
            }
            productSalesMap[item.productId].quantity += item.quantity;
            productSalesMap[item.productId].revenue += item.quantity * item.price;
        }
    }
    const topProducts = Object.entries(productSalesMap)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 8);

    // ── Payment Methods ───────────────────────────────────
    const paymentMethods: Record<string, number> = {};
    for (const o of paidOrders) {
        const method = o.paymentMethod || 'unknown';
        paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    }

    // ── Hourly order distribution ─────────────────────────
    const hourly = Array(24).fill(0);
    for (const o of paidOrders) {
        const hour = new Date(o.createdAt).getHours();
        hourly[hour]++;
    }

    // ── Funnel conversion ─────────────────────────────────
    const conversionRate = (paidOrders.length + pendingOrders.length) > 0
        ? Math.round((paidOrders.length / (paidOrders.length + pendingOrders.length)) * 100)
        : 0;

    // ── Top Viewed Products (last 30 days) ─────────────────
    const viewMap: Record<string, { name: string; views: number; unique: Set<string> }> = {};
    for (const v of allViews) {
        if (!viewMap[v.productId]) {
            viewMap[v.productId] = { name: v.productName, views: 0, unique: new Set() };
        }
        viewMap[v.productId].views++;
        if (v.sessionId) viewMap[v.productId].unique.add(v.sessionId);
    }
    const topViewed = Object.entries(viewMap)
        .map(([id, data]) => ({ id, name: data.name, views: data.views, uniqueViews: data.unique.size }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 8);

    // ── Weekly views ──────────────────────────────────────
    const totalWeekViews = recentViews.length;

    return NextResponse.json({
        kpi: {
            totalRevenue,
            weekRevenue,
            totalOrders: paidOrders.length,
            avgOrderValue,
            totalWeekViews,
            pendingCount: pendingOrders.length,
            conversionRate,
        },
        dailySales,
        topProducts,
        paymentMethods,
        hourly,
        topViewed,
    });
}
