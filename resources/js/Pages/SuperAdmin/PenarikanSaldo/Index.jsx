import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Search, Wallet, Clock3, CheckCircle2, XCircle, Download, TrendingUp, Building2, User } from 'lucide-react';

const FILTERS = [
    { value: 'semua', label: 'Semua' },
    { value: 'pending', label: 'Menunggu Verifikasi' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'ditolak', label: 'Ditolak' },
];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function formatDate(value) {
    if (!value) return '-';

    try {
        return new Date(value).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return value;
    }
}

export default function Index({ withdrawals, filters, summary = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? 'semua');

    const totalAmount = useMemo(
        () => withdrawals?.data?.reduce((sum, item) => sum + Number(item.jumlah || 0), 0) ?? 0,
        [withdrawals]
    );

    function applyFilters(nextStatus = status) {
        router.get('/super-admin/penarikan-saldo', {
            status: nextStatus,
            search,
        }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters();
    }

    function exportPdf() {
        const rows = withdrawals?.data ?? [];
        if (!rows.length) {
            return;
        }

        const content = `
            <html>
                <head>
                    <title>Daftar Penarikan Saldo</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
                        h1 { font-size: 24px; margin-bottom: 16px; color: #15803d; }
                        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                        th, td { border: 1px solid #d1d5db; padding: 8px 10px; font-size: 12px; text-align: left; }
                        th { background: #f0fdf4; color: #166534; }
                    </style>
                </head>
                <body>
                    <h1>Daftar Penarikan Saldo</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>User/Mitra</th>
                                <th>Nominal</th>
                                <th>Bank</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.map((item) => `
                                <tr>
                                    <td>${item.user?.name ?? '-'}</td>
                                    <td>${formatRupiah(item.jumlah)}</td>
                                    <td>${item.nama_bank} (${item.nomor_rekening})</td>
                                    <td>${item.status === 'pending' ? 'Menunggu' : item.status === 'selesai' ? 'Selesai' : 'Ditolak'}</td>
                                    <td>${formatDate(item.created_at)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) return;

        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    }

    return (
        <SuperAdminLayout title="Penarikan Saldo">
            <Head title="Penarikan Saldo" />

            {/* Header Banner - Menggunakan Gradasi Emerald & Dark Mode Support */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#15803d] to-emerald-700 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                            <TrendingUp size={12} />
                            Withdrawal Monitor
                        </div>
                        <h1 className="text-2xl font-bold">Penarikan Saldo</h1>
                        <p className="mt-1 text-sm text-emerald-50/90">Pantau semua pengajuan penarikan saldo dari mitra dan pengguna lainnya.</p>
                    </div>

                    <button
                        onClick={exportPdf}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#15803d] shadow-sm transition hover:bg-emerald-50"
                    >
                        <Download size={16} />
                        Download PDF
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <Clock3 size={14} /> Menunggu Verifikasi
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.pending ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <CheckCircle2 size={14} /> Selesai
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.selesai ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <XCircle size={14} /> Ditolak
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.ditolak ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <Wallet size={14} /> Total Menunggu
                        </div>
                        <div className="mt-2 text-lg font-bold">{formatRupiah(summary?.total_pending_amount)}</div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Section */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-gray-500" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama user / bank / rekening"
                        className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-3 text-sm text-slate-800 dark:text-gray-100 shadow-sm focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                    />
                </form>

                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => {
                                setStatus(tab.value);
                                applyFilters(tab.value);
                            }}
                            className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                status === tab.value
                                    ? 'bg-[#15803d] text-white shadow-sm dark:bg-emerald-600'
                                    : 'bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-300 ring-1 ring-slate-200 dark:ring-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wide text-slate-500 dark:text-gray-400">
                            <tr>
                                <th className="px-5 py-3">User / Mitra</th>
                                <th className="px-5 py-3">Nominal</th>
                                <th className="px-5 py-3">Rekening Tujuan</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                            {(withdrawals?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center">
                                        <div className="mx-auto max-w-md">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#15803d] dark:text-emerald-400">
                                                <Wallet size={28} />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-800 dark:text-gray-200">Belum ada pengajuan penarikan</h3>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Data penarikan saldo akan muncul ketika ada permintaan dari mitra atau pengguna lainnya.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                (withdrawals?.data ?? []).map((item) => (
                                    <tr key={item.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-[#15803d] dark:text-emerald-400 font-bold text-xs">
                                                    {item.user?.name?.charAt(0) ?? 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-gray-100">{item.user?.name ?? '-'}</div>
                                                    <div className="text-xs text-slate-500 dark:text-gray-400">{item.user?.email ?? '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-bold text-[#15803d] dark:text-emerald-400 text-base">{formatRupiah(item.jumlah)}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/60 p-2.5">
                                                <div className="flex items-center gap-2 font-semibold text-xs text-slate-800 dark:text-gray-200">
                                                    <Building2 size={14} className="text-[#15803d] dark:text-emerald-400" />
                                                    <span>{item.nama_bank}</span>
                                                    <span className="text-slate-300 dark:text-gray-700">•</span>
                                                    <span className="font-mono text-slate-600 dark:text-gray-400">{item.nomor_rekening}</span>
                                                </div>
                                                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-gray-400">
                                                    <User size={12} />
                                                    <span>a.n. {item.nama_pemilik}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div>
                                                {item.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/50 px-3 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                        Menunggu Verifikasi
                                                    </span>
                                                )}
                                                {item.status === 'selesai' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-3 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                                        <CheckCircle2 size={12} />
                                                        Selesai
                                                    </span>
                                                )}
                                                {item.status === 'ditolak' && (
                                                    <div>
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-950/50 px-3 py-1 text-[10px] font-bold text-red-700 dark:text-red-400">
                                                            <XCircle size={12} />
                                                            Ditolak
                                                        </span>
                                                        {item.catatan && (
                                                            <p className="mt-1.5 max-w-xs text-[10px] italic text-red-600 dark:text-red-400 line-clamp-1" title={item.catatan}>
                                                                Catatan: {item.catatan}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-slate-500 dark:text-gray-400">
                                            <div>{formatDate(item.created_at)}</div>
                                            {item.processed_at && (
                                                <div className="text-[10px] text-slate-400 dark:text-gray-500 mt-1">Diproses: {formatDate(item.processed_at)}</div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SuperAdminLayout>
    );
}