import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Search, TrendingUp, DollarSign, ShoppingCart, Percent, Download, BarChart3 } from 'lucide-react';

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

export default function Index({ transactions, filters, summary = {}, monthlyData = [] }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [month, setMonth] = useState(filters?.month ?? new Date().getMonth() + 1);
    const [year, setYear] = useState(filters?.year ?? new Date().getFullYear());

    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i],
    }));

    function applyFilters() {
        router.get('/super-admin/total-transaksi', {
            month,
            year,
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
        const rows = transactions?.data ?? [];
        if (!rows.length) return;

        const content = `
            <html>
                <head>
                    <title>Laporan Total Transaksi</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
                        h1 { font-size: 24px; margin-bottom: 8px; color: #15803d; }
                        .summary { margin-bottom: 24px; }
                        .summary-item { margin-bottom: 8px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                        th, td { border: 1px solid #d1d5db; padding: 8px 10px; font-size: 12px; text-align: left; }
                        th { background: #f0fdf4; color: #166534; }
                    </style>
                </head>
                <body>
                    <h1>Laporan Total Transaksi</h1>
                    <p>Periode: ${months.find(m => m.value === month)?.label} ${year}</p>
                    
                    <div class="summary">
                        <div class="summary-item"><strong>Total Transaksi:</strong> ${formatRupiah(summary.total_transaksi)}</div>
                        <div class="summary-item"><strong>Total Komisi:</strong> ${formatRupiah(summary.total_komisi)}</div>
                        <div class="summary-item"><strong>Jumlah Order:</strong> ${summary.jumlah_order}</div>
                        <div class="summary-item"><strong>Rata-rata Komisi:</strong> ${summary.rata_komisi_persen}%</div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Order Code</th>
                                <th>Mitra</th>
                                <th>Layanan</th>
                                <th>Total Transaksi</th>
                                <th>Komisi %</th>
                                <th>Jumlah Komisi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.map((item) => `
                                <tr>
                                    <td>${item.order_code}</td>
                                    <td>${item.partner_name}</td>
                                    <td>${item.service_type}</td>
                                    <td>${formatRupiah(item.total_transaksi)}</td>
                                    <td>${item.komisi_persen}%</td>
                                    <td>${formatRupiah(item.jumlah_komisi)}</td>
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
        <SuperAdminLayout title="Total Transaksi">
            <Head title="Total Transaksi" />

            {/* Header Banner - Gradasi Emerald */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#15803d] to-emerald-700 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                            <BarChart3 size={12} />
                            Transaction Report
                        </div>
                        <h1 className="text-2xl font-bold">Total Transaksi</h1>
                        <p className="mt-1 text-sm text-emerald-50/90">Pantau ringkasan seluruh transaksi platform dan komisi yang diterima.</p>
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
                            <DollarSign size={14} /> Total Transaksi
                        </div>
                        <div className="mt-2 text-2xl font-bold">{formatRupiah(summary?.total_transaksi)}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <TrendingUp size={14} /> Total Komisi
                        </div>
                        <div className="mt-2 text-2xl font-bold">{formatRupiah(summary?.total_komisi)}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <ShoppingCart size={14} /> Jumlah Order
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.jumlah_order ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <Percent size={14} /> Rata-rata Komisi
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.rata_komisi_persen}%</div>
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
                        placeholder="Cari order / mitra"
                        className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-3 text-sm text-slate-800 dark:text-gray-100 shadow-sm focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                    />
                </form>

                <div className="flex flex-wrap gap-2">
                    <select
                        value={month}
                        onChange={(e) => {
                            setMonth(Number(e.target.value));
                            applyFilters();
                        }}
                        className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-gray-200 shadow-sm focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                    >
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={year}
                        onChange={(e) => {
                            setYear(Number(e.target.value));
                            applyFilters();
                        }}
                        className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-gray-200 shadow-sm focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                    >
                        {[2024, 2025, 2026].map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wide text-slate-500 dark:text-gray-400">
                            <tr>
                                <th className="px-5 py-3">Order Code</th>
                                <th className="px-5 py-3">Mitra / Partner</th>
                                <th className="px-5 py-3">Layanan</th>
                                <th className="px-5 py-3">Total Transaksi</th>
                                <th className="px-5 py-3">Komisi %</th>
                                <th className="px-5 py-3">Jumlah Komisi</th>
                                <th className="px-5 py-3">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                            {(transactions?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-16 text-center">
                                        <div className="mx-auto max-w-md">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#15803d] dark:text-emerald-400">
                                                <BarChart3 size={28} />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-800 dark:text-gray-200">Belum ada transaksi</h3>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Data transaksi akan muncul ketika ada order yang selesai dan komisi tercatat.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                (transactions?.data ?? []).map((item) => (
                                    <tr key={item.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-900 dark:text-gray-100">{item.order_code}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-slate-800 dark:text-gray-200">{item.partner_name}</div>
                                            <div className="text-xs text-slate-500 dark:text-gray-400">{item.partner_email}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-[#15803d] dark:text-emerald-400">
                                                {item.service_type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-bold text-[#15803d] dark:text-emerald-400">{formatRupiah(item.total_transaksi)}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-800 dark:text-gray-200">{item.komisi_persen}%</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(item.jumlah_komisi)}</div>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-slate-500 dark:text-gray-400">
                                            {formatDate(item.tanggal)}
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