import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Package, Users, Handshake, Activity, Box, Car, Building2, Bike, MapPin, Calendar, Sparkles, ChevronDown, Wallet } from 'lucide-react';

// Palette warna disesuaikan dengan ciri khas hijau & kuning Titipsini.com
const PIE_COLORS = ['#15803d', '#fbbf24', '#0d9488', '#16a34a'];

const PERIOD_OPTIONS = [
    { value: 'all', label: 'Semua Waktu' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'quarter', label: '3 Bulan Terakhir' },
    { value: 'year', label: 'Tahun Ini' },
];

function StatCard({ label, value, icon: Icon, accent, borderAccent }) {
    return (
        <div className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 p-5 shadow-sm transition-all duration-300 hover:shadow-md ${borderAccent}`}>
            {/* Watermark ikon transparan */}
            <Icon
                size={88}
                strokeWidth={1}
                className="pointer-events-none absolute -bottom-4 -right-4 text-gray-900/[0.035] dark:text-white/[0.04] transition-transform duration-300 group-hover:scale-110"
            />

            <div className="relative flex select-none items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${accent}`}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="relative mt-4 select-none text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">{value}</p>
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
    const { props } = usePage();
    const adminName = props.auth?.user?.name;

    const applyFilters = (nextCity, nextPeriod) => {
        router.get(
            '/admin/dashboard',
            { city: nextCity || undefined, period: nextPeriod },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const vendorPanels = [
        { key: 'barang', label: 'Penitipan Barang', icon: Box, color: 'text-green-600 bg-green-50 dark:bg-green-950/60 dark:text-green-400' },
        { key: 'kendaraan', label: 'Penitipan Kendaraan', icon: Car, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400' },
        { key: 'bangunan', label: 'Penitipan Bangunan', icon: Building2, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400' },
        { key: 'pickup', label: 'Layanan Antar-Jemput', icon: Bike, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400' },
    ];

    // Format nilai Rupiah untuk Komisi
    const formattedKomisi = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(summary?.totalKomisiAdmin || 0);

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin" />

            {/* Banner Selamat Datang */}
            <div className="relative mb-6 rounded-2xl bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 p-6 text-white shadow-md select-none">
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-amber-400/10" />
                    <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />
                </div>

                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/30 bg-amber-400/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                            <Sparkles size={12} />
                            Admin Control Center
                        </span>
                        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
                            {adminName ? `Halo, ${adminName} ` : 'Dashboard Titipsini.com'}
                        </h1>
                        <p className="mt-1 text-xs text-green-100/80">
                            Pantau performa vendor, pesanan aktif, dan statistik layanan dari seluruh wilayah.
                        </p>
                    </div>

                    {/* Filter Section */}
                    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 p-2 backdrop-blur-md z-30">
                        <BannerFilterDropdown
                            icon={MapPin}
                            value={city}
                            options={[{ value: '', label: 'Semua Kota' }, ...cities.map((c) => ({ value: c, label: c }))]}
                            onChange={(val) => {
                                setCity(val);
                                applyFilters(val, period);
                            }}
                        />

                        <div className="h-4 w-px bg-white/20" />

                        <BannerFilterDropdown
                            icon={Calendar}
                            value={period}
                            options={PERIOD_OPTIONS}
                            onChange={(val) => {
                                setPeriod(val);
                                applyFilters(city, val);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Statistik Kartu Utama (Grid 5 Kolom) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard
                    label={`Komisi Platform (${summary?.persenKomisi ?? 10}%)`}
                    value={formattedKomisi}
                    icon={Wallet}
                    accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400"
                    borderAccent="border-l-2 border-l-emerald-600"
                />

                <StatCard
                    label="Total Pesanan"
                    value={summary.totalOrders}
                    icon={Package}
                    accent="bg-green-100 text-green-700 dark:bg-green-950/80 dark:text-green-400"
                    borderAccent="border-l-2 border-l-green-600"
                />
                <StatCard
                    label="Total Pelanggan"
                    value={summary.totalCustomers}
                    icon={Users}
                    accent="bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400"
                    borderAccent="border-l-2 border-l-amber-500"
                />
                <StatCard
                    label="Total Vendor"
                    value={summary.totalVendors}
                    icon={Handshake}
                    accent="bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-400"
                    borderAccent="border-l-2 border-l-teal-600"
                />
                <StatCard
                    label="Layanan Aktif Berjalan"
                    value={summary.activeServices}
                    icon={Activity}
                    accent="bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400"
                    borderAccent="border-l-2 border-l-amber-400"
                />
            </div>

            {/* Bagian Grafik */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Line Chart Tren Pesanan */}
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm lg:col-span-2">
                    <div className="flex select-none items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">Tren Pesanan Bulanan</h2>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">Grafik pertumbuhan transaksi penitipan masuk</p>
                        </div>
                        <span className="rounded-full border border-green-200 dark:border-green-900/60 bg-green-50 dark:bg-green-950/50 px-2.5 py-1 text-[10px] font-bold text-green-700 dark:text-green-400">
                            Real-time Analytics
                        </span>
                    </div>
                    <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyTrend}>
                                <defs>
                                    <linearGradient id="lineFade" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#15803d" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="#15803d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#9ca3af" tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#9ca3af" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        borderRadius: '12px',
                                        borderColor: '#374151',
                                        color: '#ffffff',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
                                    }}
                                />
                                <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 6 }} name="Pesanan" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart Distribusi Layanan */}
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
                    <div className="select-none">
                        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">Distribusi Jenis Layanan</h2>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">Persentase kategori favorit pelanggan</p>
                    </div>
                    <div className="mt-2 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceDistribution}
                                    dataKey="total"
                                    nameKey="service_type"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={3}
                                >
                                    {serviceDistribution.map((entry, index) => (
                                        <Cell key={entry.service_type} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="transparent" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        borderRadius: '12px',
                                        borderColor: '#374151',
                                        color: '#ffffff'
                                    }}
                                    formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bagian Layanan Vendor */}
            <div className="mt-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm transition-colors">
                <div className="select-none">
                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">Ringkasan Layanan Vendor</h2>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Jumlah total mitra aktif berdasarkan masing-masing jenis layanan</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {vendorPanels.map(({ key, label, icon: Icon, color }) => (
                        <div
                            key={key}
                            className="group rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 p-4 text-center transition-all duration-200 hover:border-green-200 dark:hover:border-green-800 hover:bg-green-50/30 dark:hover:bg-green-950/20"
                        >
                            <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105 ${color}`}>
                                <Icon size={22} />
                            </div>
                            <p className="mt-3 select-none text-2xl font-extrabold text-gray-900 dark:text-white">
                                {vendorServiceCounts[key] ?? 0}
                            </p>
                            <p className="mt-1 select-none text-xs font-medium text-gray-500 dark:text-gray-400">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

function BannerFilterDropdown({ icon: Icon, value, options, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const selectedLabel = options.find((opt) => opt.value === value)?.label ?? options[0]?.label;

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className="flex items-center gap-1.5 px-2 text-xs font-medium text-green-100"
            >
                <Icon size={14} className="text-amber-300" />
                <span className="text-white">{selectedLabel}</span>
                <ChevronDown size={12} className={`text-green-200 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 py-1 shadow-lg">
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-xs transition ${
                                    isSelected
                                        ? 'bg-green-700 font-semibold text-white'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-800 dark:hover:text-white'
                                }`}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}