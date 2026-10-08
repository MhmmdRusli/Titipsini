import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { Calendar, Sparkles, RotateCcw, ChevronDown } from 'lucide-react';
import FinanceLayout from '@/Layouts/FinanceLayout';

// Helper Format Rupiah
function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

// Helper Format Tanggal
function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Card style agar konsisten di dark mode
const cardCls = 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60';

const MONTHS = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
];

const YEARS = [
    { value: '2026', label: '2026' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
];

// Dropdown capsule custom — dibuat dari div/button biasa (bukan <select> native)
// supaya tampilannya gak pernah "bocor" kena styling form-control bawaan browser,
// baik gara-gara dark mode maupun quirk browser lain.
function FilterDropdown({ label, options, value, onChange, isOpen, onToggle }) {
    const activeLabel = options.find((o) => o.value === value)?.label ?? label;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold text-white shadow-inner transition hover:bg-white/30"
            >
                <span>{activeLabel}</span>
                <ChevronDown
                    size={12}
                    className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-1.5 max-h-64 w-40 overflow-y-auto rounded-lg bg-white py-1 text-xs font-medium text-gray-800 shadow-lg ring-1 ring-gray-200">
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className={`block w-full px-3 py-1.5 text-left transition hover:bg-gray-100 ${
                            !value ? 'bg-green-50 font-bold text-green-700' : ''
                        }`}
                    >
                        {label}
                    </button>
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className={`block w-full px-3 py-1.5 text-left transition hover:bg-gray-100 ${
                                value === opt.value ? 'bg-green-50 font-bold text-green-700' : ''
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Index({ items, summary, filters }) {
    const safeItems = items ?? { data: [], links: [], total: 0 };
    const safeSummary = summary ?? { totalKomisi: 0, totalTransaksi: 0, jumlahTransaksi: 0 };
    const [bulan, setBulan] = useState(filters?.bulan || '');
    const [tahun, setTahun] = useState(filters?.tahun || new Date().getFullYear().toString());
    const [openMenu, setOpenMenu] = useState(null); // 'bulan' | 'tahun' | null
    const dropdownRef = useRef(null);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMonthChange = (value) => {
        setBulan(value);
        setOpenMenu(null);
        router.get(
            '/finance/pendapatan',
            value ? { bulan: value, tahun: tahun } : { tahun: tahun },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleYearChange = (value) => {
        setTahun(value);
        setOpenMenu(null);
        router.get(
            '/finance/pendapatan',
            bulan ? { bulan: bulan, tahun: value } : { tahun: value },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleReset = () => {
        setBulan('');
        setTahun(new Date().getFullYear().toString());
        setOpenMenu(null);
        router.get('/finance/pendapatan', {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <FinanceLayout>
            <Head title="Pendapatan Platform - Titipsini" />

            <div className="space-y-6">
                {/* Header Banner */}
                <div className="relative mb-8 rounded-2xl bg-green-700 p-8 text-white shadow-md" ref={dropdownRef}>
                    {/* Layer dekorasi — overflow-hidden cuma dipasang di sini, jadi gak ikut
                        motong elemen lain (seperti dropdown filter) yang keluar batas banner */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/5 border border-white/10"></div>
                        <div className="absolute right-20 -bottom-20 h-48 w-48 rounded-full bg-white/5 border border-white/10"></div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            {/* Badge Pill Khusus di Kiri Atas */}
                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-400/40 bg-yellow-500/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-yellow-300">
                                <Sparkles size={12} className="text-yellow-400" />
                                <span>FINANCE DASHBOARD</span>
                            </div>
                            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                Pendapatan Platform
                            </h1>
                            <p className="mt-1.5 max-w-xl text-xs text-green-100/90 leading-relaxed">
                                Rekapitulasi komisi platform Titipsini yang terkumpul dari transaksi mitra.
                            </p>
                        </div>

                        {/* Filter Capsule di Kanan Banner — dropdown custom, tampilannya tetap
                            (translucent white pill + panel navy) di kondisi apa pun. */}
                        <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white backdrop-blur-sm shadow-sm">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-yellow-400 shrink-0" />
                                <FilterDropdown
                                    label="Semua Bulan"
                                    options={MONTHS}
                                    value={bulan}
                                    onChange={handleMonthChange}
                                    isOpen={openMenu === 'bulan'}
                                    onToggle={() => setOpenMenu((prev) => (prev === 'bulan' ? null : 'bulan'))}
                                />
                            </div>

                            <span className="text-white/40">|</span>

                            <FilterDropdown
                                label={new Date().getFullYear().toString()}
                                options={YEARS}
                                value={tahun}
                                onChange={handleYearChange}
                                isOpen={openMenu === 'tahun'}
                                onToggle={() => setOpenMenu((prev) => (prev === 'tahun' ? null : 'tahun'))}
                            />

                            {bulan && (
                                <>
                                    <span className="text-white/40">|</span>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-1 rounded-lg bg-rose-500/30 px-2.5 py-1.5 text-[11px] font-semibold text-rose-100 transition hover:bg-rose-500/50"
                                    >
                                        <RotateCcw size={11} />
                                        <span>Reset</span>
                                    </button>
                                </>
                            )}
</div>
                    </div>
                </div>

            {/* 3 Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                    {/* Card 1: Total Komisi */}
                    <div className="relative flex flex-col h-full overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-green-100/40 to-white p-5 shadow-sm transition hover:shadow-md dark:border-green-900/40 dark:from-green-950/40 dark:via-green-950/20 dark:to-gray-900">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-green-800 dark:text-green-300">
                                Total Komisi Platform
                            </span>
                            <p className="mt-2 text-3xl font-extrabold text-green-950 dark:text-green-300">
                                {formatRupiah(safeSummary.totalKomisi)}
                            </p>
                            <p className="mt-1 text-xs font-medium text-green-700 dark:text-green-400">Keuntungan bersih platform</p>
                        </div>
                    </div>

                    {/* Card 2: Volume Transaksi */}
                    <div className={cardCls + " relative flex flex-col h-full p-5"}>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Volume Transaksi
                            </span>
                            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                                {formatRupiah(safeSummary.totalTransaksi)}
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">Nilai bruto seluruh transaksi</p>
                        </div>
                    </div>

                    {/* Card 3: Total Transaksi */}
                    <div className={cardCls + " relative flex flex-col h-full p-5"}>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Total Transaksi
                            </span>
                            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                                {safeSummary.jumlahTransaksi}{' '}
                                <span className="text-2xl font-normal text-slate-500 dark:text-slate-400">order</span>
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">Jumlah transaksi berhasil</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className={cardCls}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">No. Order</th>
                                    <th className="px-6 py-4">Mitra</th>
                                    <th className="px-6 py-4">Total Transaksi</th>
                                    <th className="px-6 py-4">Komisi</th>
                                    <th className="px-6 py-4">Jumlah Komisi</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-700 dark:text-slate-300">
                                {safeItems.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                            Tidak ada data pendapatan pada periode ini.
                                        </td>
                                    </tr>
                                ) : (
                                    safeItems.data.map((item) => (
                                        <tr key={item.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                                            <td className="px-6 py-4 font-mono text-xs font-normal text-slate-600 dark:text-slate-300">
                                                #{item.order_code}
                                            </td>
                                            <td className="px-6 py-4 font-normal text-slate-600 dark:text-slate-300">
                                                {item.partner_name}
                                            </td>
                                            <td className="px-6 py-4 font-normal text-slate-600 dark:text-slate-300">
                                                {formatRupiah(item.total_transaksi)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                                                    {item.komisi_persen}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-green-700 dark:text-green-400">
                                                {formatRupiah(item.jumlah_komisi)}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                                {formatDate(item.tanggal)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {safeItems.links?.length > 3 && (
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-300">{safeItems.from ?? 0}</span> - <span className="font-semibold text-slate-700 dark:text-slate-300">{safeItems.to ?? 0}</span> dari <span className="font-semibold text-slate-700 dark:text-slate-300">{safeItems.total ?? 0}</span> data
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {safeItems.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                            link.active
                                                ? 'bg-green-700 text-white shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                                        } ${!link.url ? 'cursor-not-allowed opacity-30 hover:bg-transparent' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FinanceLayout>
    );
}