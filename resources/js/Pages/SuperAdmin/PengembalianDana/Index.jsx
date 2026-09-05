import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Search, Wallet, CheckCircle2, Clock3, Download, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

const FILTERS = [
    { value: 'semua', label: 'Semua' },
    { value: 'menunggu', label: 'Menunggu Verifikasi' },
    { value: 'terverifikasi', label: 'Terverifikasi' },
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

export default function Index({ refunds, filters, summary = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? 'semua');

    const totalRefund = useMemo(
        () => refunds?.data?.reduce((sum, item) => sum + Number(item.denda || 0), 0) ?? 0,
        [refunds]
    );

    function applyFilters(nextStatus = status) {
        router.get('/super-admin/pengembalian-dana', {
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
        const rows = refunds?.data ?? [];
        if (!rows.length) {
            return;
        }

        const content = `
            <html>
                <head>
                    <title>Daftar Pengembalian Dana</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
                        h1 { font-size: 24px; margin-bottom: 16px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                        th, td { border: 1px solid #d1d5db; padding: 8px 10px; font-size: 12px; text-align: left; }
                        th { background: #f3f4f6; }
                    </style>
                </head>
                <body>
                    <h1>Daftar Pengembalian Dana</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Kode Order</th>
                                <th>Customer</th>
                                <th>Nominal</th>
                                <th>Status</th>
                                <th>Tgl. Pengajuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.map((item) => `
                                <tr>
                                    <td>${item.order_code ?? '-'}</td>
                                    <td>${item.customer?.name ?? '-'}</td>
                                    <td>${formatRupiah(item.denda)}</td>
                                    <td>${item.denda_paid_at ? 'Terverifikasi' : 'Menunggu Verifikasi'}</td>
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
        <SuperAdminLayout title="Pengembalian Dana">
            <Head title="Pengembalian Dana" />

            {/* Banner Top */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                            <ShieldCheck size={12} />
                            Refund Review
                        </div>
                        <h1 className="text-2xl font-bold">Pengembalian Dana</h1>
                        <p className="mt-1 text-sm text-emerald-50/90">Pantau klaim pengembalian dana yang menunggu verifikasi.</p>
                    </div>

                    <button
                        onClick={exportPdf}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 dark:bg-slate-900 dark:text-emerald-400 dark:hover:bg-slate-800"
                    >
                        <Download size={16} />
                        Download PDF
                    </button>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <Clock3 size={14} /> Menunggu Verifikasi
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.menunggu ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <CheckCircle2 size={14} /> Terverifikasi
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.terverifikasi ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <Wallet size={14} /> Total Nilai
                        </div>
                        <div className="mt-2 text-2xl font-bold">{formatRupiah(totalRefund)}</div>
                    </div>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400 dark:text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari kode order / nama customer"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-800 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
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
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-slate-800/60 dark:text-slate-400">
                            <tr>
                                <th className="px-5 py-3">Order</th>
                                <th className="px-5 py-3">Customer</th>
                                <th className="px-5 py-3">Nominal</th>
                                <th className="px-5 py-3">Bukti</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {(refunds?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-16 text-center">
                                        <div className="mx-auto max-w-md">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                <FileText size={28} />
                                            </div>
                                            <h3 className="text-base font-bold text-gray-800 dark:text-slate-100">Belum ada data refund</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Data pengembalian dana akan muncul ketika customer mengirim bukti atau ada denda yang perlu diverifikasi.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                (refunds?.data ?? []).map((item) => (
                                    <tr key={item.id} className="hover:bg-emerald-50/30 dark:hover:bg-slate-800/50">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-900 dark:text-slate-100">{item.order_code}</div>
                                            <div className="text-xs text-gray-500 dark:text-slate-400">{item.service_type ?? '-'}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-800 dark:text-slate-200">{item.customer?.name ?? '-'}</div>
                                            <div className="text-xs text-gray-500 dark:text-slate-400">{item.customer?.email ?? '-'}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-bold text-emerald-700 dark:text-emerald-400">{formatRupiah(item.denda)}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            {item.bukti_denda ? (
                                                <a
                                                    href={item.bukti_denda}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60"
                                                >
                                                    <ExternalLink size={12} />
                                                    Lihat bukti
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400 dark:text-slate-500">Belum ada</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                                item.denda_paid_at
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                            }`}>
                                                {item.denda_paid_at ? 'Terverifikasi' : 'Menunggu Verifikasi'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-500 dark:text-slate-400">
                                            {formatDate(item.created_at)}
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