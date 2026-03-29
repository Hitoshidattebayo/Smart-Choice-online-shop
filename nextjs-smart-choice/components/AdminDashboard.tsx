'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, RotateCcw, X, Check, Eye, TrendingUp, ShoppingBag, Users, BarChart2, Clock, Package, AlertCircle, RefreshCw } from 'lucide-react';
import { markAsPaid, moveToTrash, restoreFromTrash, deletePermanently, emptyTrash as cleanTrash } from '@/actions/order';
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
    address: string | null;
    status: string | null;
    totalAmount: number;
    paymentReference: string | null;
    paymentMethod: string | null;
    createdAt: Date;
    deletedAt: Date | null;
    items: OrderItem[];
}

interface Analytics {
    kpi: {
        totalRevenue: number;
        weekRevenue: number;
        totalOrders: number;
        avgOrderValue: number;
        totalWeekViews: number;
        pendingCount: number;
        conversionRate: number;
    };
    dailySales: { date: string; revenue: number }[];
    topProducts: { id: string; name: string; quantity: number; revenue: number }[];
    paymentMethods: Record<string, number>;
    hourly: number[];
    topViewed: { id: string; name: string; views: number; uniqueViews: number }[];
}

function KpiCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
            <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-black text-gray-900">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
            </div>
        </div>
    );
}

function Sparkline({ data, color = '#E8C547' }: { data: number[]; color?: string }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data, 1);
    const w = 200;
    const h = 50;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ');
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12">
            <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
        </svg>
    );
}

export default function AdminDashboard({ orders }: { orders: Order[] }) {
    const [view, setView] = useState<'analytics' | 'active' | 'trash'>('analytics');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const router = useRouter();

    const filteredOrders = orders.filter(o =>
        view === 'active' ? !o.deletedAt : o.deletedAt
    );

    useEffect(() => {
        if (view === 'analytics') {
            setLoadingAnalytics(true);
            fetch('/api/admin/analytics')
                .then(r => r.json())
                .then(data => { setAnalytics(data); setLoadingAnalytics(false); })
                .catch(() => setLoadingAnalytics(false));
        }
    }, [view]);

    async function handleAction(action: Function, orderId: string) {
        if (!confirm('Та итгэлтэй байна уу?')) return;
        await action(orderId);
        router.refresh();
        setSelectedOrder(null);
    }

    async function handleCleanTrash() {
        if (!confirm('Та хогийн сав дахь БҮХ мэдээллийг бүр мөсөн устгахдаа итгэлтэй байна уу?')) return;
        await cleanTrash();
        router.refresh();
    }


    // ── Render Helpers ────────────────────────────────────
    const fmtMnt = (v: number) => `${Math.round(v).toLocaleString()}₮`;

    const PAYMENT_LABELS: Record<string, string> = {
        qpay: '💳 QPay',
        transfer: '🏦 Шилжүүлэг',
        cash: '💵 Бэлэн',
        unknown: '❓ Тодорхойгүй',
    };

    const PEAK_HOUR = analytics ? analytics.hourly.indexOf(Math.max(...analytics.hourly)) : 0;

    return (
        <div>
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setView('analytics')}
                    className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${view === 'analytics' ? 'bg-[#1A1A2E] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    <BarChart2 size={16} /> Статистик
                </button>
                <button
                    onClick={() => setView('active')}
                    className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${view === 'active' ? 'bg-[#1A1A2E] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    <ShoppingBag size={16} /> Идэвхтэй захиалгууд
                </button>
                <button
                    onClick={() => setView('trash')}
                    className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${view === 'trash' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    <Trash2 size={16} /> Хогийн сав
                </button>
            </div>

            {/* ── ANALYTICS VIEW ─────────────────────────────── */}
            {view === 'analytics' && (
                <div>
                    {loadingAnalytics ? (
                        <div className="flex items-center justify-center py-24 text-gray-400 gap-3">
                            <RefreshCw size={24} className="animate-spin" /> Статистик ачаалж байна...
                        </div>
                    ) : analytics ? (
                        <div className="space-y-8">

                            {/* KPI Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <KpiCard
                                    icon={<TrendingUp size={20} className="text-emerald-600" />}
                                    label="Нийт борлуулалт"
                                    value={fmtMnt(analytics.kpi.totalRevenue)}
                                    sub="Бүх цаг үеийн"
                                    color="bg-emerald-50"
                                />
                                <KpiCard
                                    icon={<TrendingUp size={20} className="text-blue-600" />}
                                    label="7 хоногийн орлого"
                                    value={fmtMnt(analytics.kpi.weekRevenue)}
                                    sub="Сүүлийн 7 хоног"
                                    color="bg-blue-50"
                                />
                                <KpiCard
                                    icon={<ShoppingBag size={20} className="text-purple-600" />}
                                    label="Нийт захиалга"
                                    value={analytics.kpi.totalOrders.toString()}
                                    sub={`Дундаж: ${fmtMnt(analytics.kpi.avgOrderValue)}`}
                                    color="bg-purple-50"
                                />
                                <KpiCard
                                    icon={<Eye size={20} className="text-amber-600" />}
                                    label="7 хоногийн үзэлт"
                                    value={analytics.kpi.totalWeekViews.toLocaleString()}
                                    sub="Бараа хуудас нээсэн"
                                    color="bg-amber-50"
                                />
                            </div>

                            {/* Funnel + Conv. Rate */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-red-50">
                                        <AlertCircle size={20} className="text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Төлбөр болгоогүй</p>
                                        <p className="text-2xl font-black text-red-600">{analytics.kpi.pendingCount}</p>
                                        <p className="text-xs text-gray-400">Алдагдсан захиалга</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-green-50">
                                        <Check size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Хөрвөлтийн хувь</p>
                                        <p className="text-2xl font-black text-green-600">{analytics.kpi.conversionRate}%</p>
                                        <p className="text-xs text-gray-400">Захиалга → Төлбөр</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-orange-50">
                                        <Clock size={20} className="text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Хамгийн их захиалагддаг цаг</p>
                                        <p className="text-2xl font-black text-orange-600">{PEAK_HOUR}:00–{PEAK_HOUR + 1}:00</p>
                                        <p className="text-xs text-gray-400">{analytics.hourly[PEAK_HOUR]} захиалга</p>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Revenue Chart */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-1">Сүүлийн 30 хоногийн борлуулалт</h3>
                                <p className="text-xs text-gray-400 mb-4">Өдөр тутмын орлого (₮)</p>
                                <div className="relative">
                                    <Sparkline data={analytics.dailySales.map(d => d.revenue)} />
                                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                                        <span>{analytics.dailySales[0]?.date}</span>
                                        <span>{analytics.dailySales[analytics.dailySales.length - 1]?.date}</span>
                                    </div>
                                </div>
                                {/* Bar chart representation */}
                                <div className="flex items-end gap-[2px] h-20 mt-4">
                                    {analytics.dailySales.map((d, i) => {
                                        const max = Math.max(...analytics.dailySales.map(x => x.revenue), 1);
                                        const pct = (d.revenue / max) * 100;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col justify-end" title={`${d.date}: ${fmtMnt(d.revenue)}`}>
                                                <div
                                                    className="rounded-sm transition-all duration-300"
                                                    style={{
                                                        height: `${Math.max(pct, 2)}%`,
                                                        backgroundColor: pct > 80 ? '#10b981' : pct > 40 ? '#E8C547' : '#e5e7eb'
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Top Products + Top Viewed */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Top Selling */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Package size={18} /> Хамгийн их зарагдсан бараанууд
                                    </h3>
                                    {analytics.topProducts.length === 0 ? (
                                        <p className="text-gray-400 text-sm">Мэдээлэл байхгүй</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {analytics.topProducts.map((p, i) => {
                                                const maxQty = analytics.topProducts[0]?.quantity || 1;
                                                return (
                                                    <div key={p.id}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[65%]">
                                                                <span className="text-gray-400 mr-2">#{i + 1}</span>{p.name}
                                                            </span>
                                                            <span className="text-sm font-bold text-gray-900">{p.quantity} ш</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                                            <div
                                                                className="h-2 rounded-full bg-[#1A1A2E] transition-all duration-500"
                                                                style={{ width: `${(p.quantity / maxQty) * 100}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1 text-right">{fmtMnt(p.revenue)}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Top Viewed */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Eye size={18} /> Хамгийн их үзэгдсэн бараанууд <span className="text-xs font-normal text-gray-400">(30 хоног)</span>
                                    </h3>
                                    {analytics.topViewed.length === 0 ? (
                                        <p className="text-gray-400 text-sm">Үзэлтийн мэдээлэл цуглаагүй байна</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {analytics.topViewed.map((p, i) => {
                                                const maxViews = analytics.topViewed[0]?.views || 1;
                                                return (
                                                    <div key={p.id}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[65%]">
                                                                <span className="text-gray-400 mr-2">#{i + 1}</span>{p.name}
                                                            </span>
                                                            <span className="text-sm font-bold text-gray-900">{p.views} үзэлт</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                                            <div
                                                                className="h-2 rounded-full bg-amber-400 transition-all duration-500"
                                                                style={{ width: `${(p.views / maxViews) * 100}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1 text-right">{p.uniqueViews} давтаагүй хэрэглэгч</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Methods + Hourly Distribution */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Payment Methods */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-4">Төлбөрийн арга</h3>
                                    {Object.keys(analytics.paymentMethods).length === 0 ? (
                                        <p className="text-gray-400 text-sm">Мэдээлэл байхгүй</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {Object.entries(analytics.paymentMethods)
                                                .sort((a, b) => b[1] - a[1])
                                                .map(([method, count]) => {
                                                    const total = Object.values(analytics.paymentMethods).reduce((a, b) => a + b, 0);
                                                    const pct = Math.round((count / total) * 100);
                                                    return (
                                                        <div key={method}>
                                                            <div className="flex justify-between mb-1">
                                                                <span className="text-sm font-medium">{PAYMENT_LABELS[method] || method}</span>
                                                                <span className="text-sm font-bold">{count} ({pct}%)</span>
                                                            </div>
                                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    )}
                                </div>

                                {/* Hourly Heatmap */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-4">Цагийн захиалгын тархалт</h3>
                                    <div className="grid grid-cols-12 gap-1">
                                        {analytics.hourly.map((count, h) => {
                                            const maxH = Math.max(...analytics.hourly, 1);
                                            const intensity = count / maxH;
                                            return (
                                                <div key={h} className="flex flex-col items-center gap-1" title={`${h}:00 — ${count} захиалга`}>
                                                    <div
                                                        className="w-full rounded-md transition-all"
                                                        style={{
                                                            height: '32px',
                                                            backgroundColor: count === 0 ? '#f3f4f6' : `rgba(232,197,71,${0.2 + intensity * 0.8})`
                                                        }}
                                                    />
                                                    {h % 6 === 0 && <span className="text-[9px] text-gray-400">{h}h</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3">Шар = их захиалга, Саарал = бага</p>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-12">Статистик ачаалахад алдаа гарлаа.</p>
                    )}
                </div>
            )}

            {/* ── ORDERS TABLE (active / trash) ─────────────────── */}
            {(view === 'active' || view === 'trash') && (
                <div>
                    {view === 'trash' && (
                        <div className="flex justify-end mb-4">
                            <button onClick={handleCleanTrash} className="text-sm text-red-500 hover:underline">
                                Хогийн савыг хоослох
                            </button>
                        </div>
                    )}

                    <div className="card overflow-hidden bg-white shadow-sm rounded-2xl border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                                    <tr>
                                        <th className="p-4">Дугаар</th>
                                        <th className="p-4">Огноо</th>
                                        <th className="p-4">Харилцагч</th>
                                        <th className="p-4">Нийт дүн</th>
                                        <th className="p-4">Төлөв</th>
                                        <th className="p-4">Үйлдэл</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-400">
                                                Захиалга олдсонгүй.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <td className="p-4 font-mono text-xs">{order.paymentReference || order.id.slice(0, 8)}</td>
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
                </div>
            )}

            {/* ── ORDER DETAIL MODAL ─────────────────────────────── */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-1">Захиалгын дэлгэрэнгүй</h2>
                            <p className="text-sm text-gray-500 font-mono mb-6">Ref: {selectedOrder.paymentReference}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Харилцагч</h3>
                                    <p className="text-lg font-medium">{selectedOrder.customerName}</p>
                                    <p className="text-gray-600">📞 {selectedOrder.phoneNumber}</p>
                                    <p className="text-gray-600">✉️ {selectedOrder.email || 'Имэйл байхгүй'}</p>
                                    <p className="text-gray-600 mt-2">📍 <span className="font-semibold">Хаяг:</span><br />{selectedOrder.address || 'Хаяг байхгүй'}</p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Төлөв</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedOrder.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {selectedOrder.status}
                                        </span>
                                        <span className="text-gray-400 text-sm">
                                            {new Date(selectedOrder.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Төлбөрийн хэрэгсэл</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${selectedOrder.paymentMethod === 'cash' ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                        {PAYMENT_LABELS[selectedOrder.paymentMethod || ''] || selectedOrder.paymentMethod || '—'}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-b py-4 mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Бараанууд ({selectedOrder.items.length})</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            {item.image ? (
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                                                    <Image src={item.image} alt={item.productName} fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 text-xs">Зураггүй</div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">{item.productName}</p>
                                                <p className="text-sm text-gray-500">{item.quantity} x {item.price.toLocaleString()} ₮</p>
                                            </div>
                                            <div className="font-semibold">{(item.quantity * item.price).toLocaleString()} ₮</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                    <span className="font-bold text-lg">Нийт</span>
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
                                            Устгах (Хогийн сав)
                                        </button>
                                        {selectedOrder.status !== 'PAID' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAction(markAsPaid, selectedOrder.id); }}
                                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                                            >
                                                <Check size={18} /> Төлбөр баталгаажуулах
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAction(deletePermanently, selectedOrder.id); }}
                                            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                                        >
                                            Бүр мөсөн устгах
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAction(restoreFromTrash, selectedOrder.id); }}
                                            className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                                        >
                                            <RotateCcw size={18} /> Сэргээх
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
