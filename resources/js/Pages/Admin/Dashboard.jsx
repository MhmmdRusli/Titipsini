import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Package, Users, Handshake, Activity, Box, Car, Building2, Bike } from 'lucide-react';

// Palette warna disesuaikan dengan ciri khas hijau & kuning Titipsini.com
const PIE_COLORS = ['#15803d', '#fbbf24', '#0d9488', '#16a34a'];

const PERIOD_OPTIONS = [
    { value: 'all', label: 'Semua Waktu' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'quarter', label: '3 Bulan Terakhir' },
    { value: 'year', label: 'Tahun Ini' },
];

function StatCard({ label, value, icon: Icon, accent }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
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
                    className="rounded-lg border-gray-300 text-sm focus:border-green-600 focus:ring-green-600"
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
                    className="rounded-lg border-gray-300 text-sm focus:border-green-600 focus:ring-green-600"
                >
                    {PERIOD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Pesanan" value={summary.totalOrders} icon={Package} accent="bg-green-50 text-green-700" />
                <StatCard label="Total Pelanggan" value={summary.totalCustomers} icon={Users} accent="bg-amber-50 text-amber-700" />
                <StatCard label="Total Vendor" value={summary.totalVendors} icon={Handshake} accent="bg-green-50 text-green-800" />
                <StatCard label="Layanan Aktif Berjalan" value={summary.activeServices} icon={Activity} accent="bg-amber-50 text-amber-600" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700">Tren Pesanan Bulanan</h2>
                    <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#15803d" strokeWidth={2} dot={{ r: 3, fill: '#15803d' }} name="Pesanan" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
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

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700">Layanan Vendor</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {vendorPanels.map(({ key, label, icon: Icon }) => (
                        <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
                            <Icon className="mx-auto text-green-700" size={22} />
                            <p className="mt-2 text-xl font-semibold text-gray-900">{vendorServiceCounts[key] ?? 0}</p>
                            <p className="text-xs text-gray-500">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}