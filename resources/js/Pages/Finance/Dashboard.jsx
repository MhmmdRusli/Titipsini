import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    ArrowDownToLine, 
    CircleDollarSign, 
    Clock3, 
    Eye, 
    X, 
    MapPin, 
    Calendar, 
    Sparkles, 
    ChevronDown, 
    Filter 
} from 'lucide-react';
import FinanceLayout from '@/Layouts/FinanceLayout';

const statusOptions = [
    { value: 'semua', label: 'Semua Status' },
    { value: 'baru', label: 'Baru' },
    { value: 'diproses', label: 'Diproses' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
];

const PERIOD_OPTIONS = [
    { value: 'all', label: 'Semua Waktu' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'quarter', label: '3 Bulan Terakhir' },
    { value: 'year', label: 'Tahun Ini' },
];

const statusStyles = {
    baru: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    diproses: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    selesai: 'bg-green-50 text-green-700 ring-green-600/20',
    dibatalkan: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

const currency = (value) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
}).format(value || 0);

// StatCard persis seperti kode contoh (Watermark ikon besar + Border Accent Kiri)
function StatCard({ label, value, detail, icon: Icon, accent, borderAccent }) {
    return (
        <div className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 p-5 shadow-sm transition-all duration-300 hover:shadow-md ${borderAccent}`}>
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
            {detail && <p className="relative mt-1 select-none text-xs text-gray-400 dark:text-gray-500">{detail}</p>}
        </div>
    );
}

// Banner Filter Dropdown persis dari contoh kode
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

export default function Dashboard({ stats = {}, transactions, filters = {}, cities = [] }) {
    const [status, setStatus] = useState(filters.status || 'semua');
    const [city, setCity] = useState(filters.city || '');
    const [period, setPeriod] = useState(filters.period || 'all');
    const [selected, setSelected] = useState(null);

    const rows = transactions?.data || [];

    const applyStatus = (nextStatus) => {
        setStatus(nextStatus);
        router.get('/finance/dashboard', { status: nextStatus, city, period }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const applyFilters = (nextCity, nextPeriod) => {
        router.get(
            '/finance/dashboard',
            { status, city: nextCity || undefined, period: nextPeriod },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <FinanceLayout>
            <Head title="Dashboard Finance" />

            {/* Banner Selamat Datang - Menggunakan Gradien & Visual Persis dari Kode Contoh */}
            <div className="relative mb-6 rounded-2xl bg-gradient-to-r from-green-700 via-green-700 to-green-800 p-6 text-white shadow-md select-none">
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-amber-400/10" />
                    <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />
                </div>

                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/30 bg-amber-400/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                            <Sparkles size={12} />
                            Finance Dashboard
                        </span>
                        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
                            Halo, Selamat Datang di Dashboard Finance
                        </h1>
                        <p className="mt-1 text-xs text-green-100/80">
                            Pantau arus pemasukan, transaksi aktif, dan pencairan dana Titipsini dari seluruh wilayah.
                        </p>
                    </div>

                    {/* Filter Section Kapsul Melayang */}
                    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 p-2 backdrop-blur-md z-30">
                        <BannerFilterDropdown
                            icon={MapPin}
                            value={city}
                            options={[{ value: '', label: 'Semua Kota' }, ...(cities?.map((c) => ({ value: c, label: c })) || [])]}
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

            {/* Statistik Kartu Utama (Grid 3 Kolom) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    label="Total Pemasukan" 
                    value={currency(stats.totalIncome)} 
                    detail="Dari transaksi selesai" 
                    icon={CircleDollarSign} 
                    accent="bg-green-100 text-green-700 dark:bg-green-950/80 dark:text-green-400"
                    borderAccent="border-l-2 border-l-green-600"
                />
                <StatCard 
                    label="Pendapatan Hari Ini" 
                    value={currency(stats.todayIncome)} 
                    detail="Transaksi selesai hari ini" 
                    icon={ArrowDownToLine} 
                    accent="bg-green-100 text-green-700 dark:bg-green-950/80 dark:text-green-400"
                    borderAccent="border-l-2 border-l-green-600"
                />
                <StatCard 
                    label="Transaksi Pending" 
                    value={stats.pendingTransactions || 0} 
                    detail="Menunggu diproses" 
                    icon={Clock3} 
                    accent="bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400"
                    borderAccent="border-l-2 border-l-amber-500"
                />
            </div>

            {/* Tabel Transaksi Keuangan */}
            <section className="mt-6 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm transition-colors">
                <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-gray-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">Transaksi Keuangan</h2>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">Daftar transaksi terbaru berdasarkan status.</p>
                    </div>

                    <div className="relative flex items-center">
                        <Filter className="absolute left-3 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                        <select 
                            value={status} 
                            onChange={(event) => applyStatus(event.target.value)} 
                            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-9 pr-8 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 focus:border-green-600 focus:ring-green-600"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            <tr>
                                <th className="px-5 py-3.5 font-semibold">Transaksi</th>
                                <th className="px-5 py-3.5 font-semibold">Customer / Mitra</th>
                                <th className="px-5 py-3.5 font-semibold">Nominal</th>
                                <th className="px-5 py-3.5 font-semibold">Status</th>
                                <th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-12 text-center text-xs text-gray-400 dark:text-gray-500">
                                        Belum ada transaksi pada filter ini.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <p className="font-semibold text-gray-900 dark:text-white">{transaction.order_code}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.service_type} · {transaction.created_at}</p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="font-medium text-gray-800 dark:text-gray-200">{transaction.customer}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Mitra: {transaction.partner}</p>
                                        </td>
                                        <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">
                                            {currency(transaction.amount)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${statusStyles[transaction.status] || 'bg-gray-50 text-gray-600 ring-gray-500/20'}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button 
                                                type="button" 
                                                onClick={() => setSelected(transaction)} 
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-green-700 dark:hover:text-green-400"
                                            >
                                                <Eye size={14} /> Tinjau
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {transactions?.links?.length > 3 && (
                    <div className="flex flex-wrap gap-1.5 border-t border-gray-100 dark:border-gray-800 px-5 py-3.5">
                        {transactions.links.map((link, idx) => (
                            <button 
                                key={idx} 
                                type="button" 
                                disabled={!link.url} 
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })} 
                                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                                    link.active 
                                        ? 'bg-green-700 text-white' 
                                        : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`} 
                                dangerouslySetInnerHTML={{ __html: link.label }} 
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Modal Detail */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-5 py-4">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">Detail Transaksi</span>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">{selected.order_code}</h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setSelected(null)} 
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5">
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <dt className="text-gray-500 dark:text-gray-400">Customer</dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">{selected.customer}</dd>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <dt className="text-gray-500 dark:text-gray-400">Mitra</dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">{selected.partner}</dd>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                    <dt className="text-gray-500 dark:text-gray-400">Nominal</dt>
                                    <dd className="font-bold text-green-600 dark:text-green-400">{currency(selected.amount)}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                                    <dd className="capitalize font-semibold text-gray-900 dark:text-white">{selected.status}</dd>
                                </div>
                            </dl>
                            <div className="mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setSelected(null)} 
                                    className="w-full rounded-xl bg-gray-100 dark:bg-gray-800 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 transition hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </FinanceLayout>
    );
}