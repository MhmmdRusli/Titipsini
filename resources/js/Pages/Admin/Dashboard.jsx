import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Package, Users, Handshake, Activity, Box, Car, Building2, Bike } from 'lucide-react';

const PIE_COLORS = ['#0d9488', '#f59e0b', '#1f2937', '#2dd4bf'];

const PERIOD_OPTIONS = [
    { value: 'all', label: 'Semua Waktu' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'quarter', label: '3 Bulan Terakhir' },
    { value: 'year', label: 'Tahun Ini' },
];

function StatCard({ label, value, icon: Icon, accent }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{label}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
                    <Icon size={18} />
                </div>
            </div>
            <p className="mt-3 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
    );
}

export default function Dashboard({
    summary,
    monthlyTrend,
    serviceDistribution,
    vendorServiceCounts,
    cities,
    filters,
}) {
    const [city, setCity] = useState(filters.city ?? '');
    const [period, setPeriod] = useState(filters.period ?? 'all');

    const applyFilters = (nextCity, nextPeriod) => {
        router.get(
            '/admin/dashboard',
            { city: nextCity || undefined, period: nextPeriod },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const vendorPanels = [
        { key: 'barang', label: 'Penitipan Barang', icon: Box },
        { key: 'kendaraan', label: 'Penitipan Kendaraan', icon: Car },
        { key: 'bangunan', label: 'Penitipan Bangunan', icon: Building2 },
        { key: 'pickup', label: 'Layanan Antar-Jemput', icon: Bike },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin" />

            <div className="mb-5 flex flex-wrap items-center gap-3">
                <select
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value);
                        applyFilters(e.target.value, period);
                    }}
                    className="rounded-lg border-gray-300 text-sm focus:border-brand-teal-500 focus:ring-brand-teal-500"
                >
                    <option value="">Semua Kota</option>
                    {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <select
                    value={period}
                    onChange={(e) => {
                        setPeriod(e.target.value);
                        applyFilters(city, e.target.value);
                    }}
                    className="rounded-lg border-gray-300 text-sm focus:border-brand-teal-500 focus:ring-brand-teal-500"
                >
                    {PERIOD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Pesanan" value={summary.totalOrders} icon={Package} accent="bg-brand-teal-50 text-brand-teal-700" />
                <StatCard label="Total Pelanggan" value={summary.totalCustomers} icon={Users} accent="bg-brand-amber-50 text-brand-amber-700" />
                <StatCard label="Total Vendor" value={summary.totalVendors} icon={Handshake} accent="bg-brand-navy-700/10 text-brand-navy-700" />
                <StatCard label="Layanan Aktif Berjalan" value={summary.activeServices} icon={Activity} accent="bg-brand-teal-50 text-brand-teal-700" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
                    <h2 className="text-sm font-semibold text-gray-700">Tren Pesanan Bulanan</h2>
                    <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} name="Pesanan" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="text-sm font-semibold text-gray-700">Distribusi Jenis Layanan</h2>
                    <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceDistribution}
                                    dataKey="total"
                                    nameKey="service_type"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                >
                                    {serviceDistribution.map((entry, index) => (
                                        <Cell key={entry.service_type} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-gray-700">Layanan Vendor</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {vendorPanels.map(({ key, label, icon: Icon }) => (
                        <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
                            <Icon className="mx-auto text-brand-teal-700" size={22} />
                            <p className="mt-2 text-xl font-semibold text-gray-900">{vendorServiceCounts[key] ?? 0}</p>
                            <p className="text-xs text-gray-500">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}