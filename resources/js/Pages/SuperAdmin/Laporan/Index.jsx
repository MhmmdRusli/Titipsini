import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import {
    Search, MessageSquareWarning, ChevronRight, Calendar, FileText,
} from 'lucide-react';

const STATUS_STYLE = {
    menunggu: 'bg-amber-100 text-amber-700 border border-amber-200',
    diproses: 'bg-blue-100 text-blue-700 border border-blue-200',
    disetujui: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    ditolak: 'bg-red-100 text-red-700 border border-red-200',
    selesai: 'bg-gray-100 text-gray-700 border border-gray-200',
};

const STATUS_LABEL = {
    menunggu: 'Menunggu',
    diproses: 'Diproses',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    selesai: 'Selesai',
};

const STATUS_FILTERS = [
    { key: 'semua', label: 'Semua' },
    { key: 'menunggu', label: 'Menunggu' },
    { key: 'diproses', label: 'Diproses' },
    { key: 'selesai', label: 'Selesai' },
    { key: 'ditolak', label: 'Ditolak' },
];

function SummaryCard({ icon: Icon, color, label, value, sub }) {
    const COLOR = {
        amber: 'from-amber-500 to-orange-500',
        emerald: 'from-emerald-500 to-green-600',
        blue: 'from-blue-500 to-indigo-500',
        red: 'from-red-500 to-pink-500',
        gray: 'from-gray-500 to-slate-600',
    };
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${COLOR[color]}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
                <p className="mt-0.5 truncate text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
                {sub && <p className="text-[11px] text-gray-500 dark:text-gray-400">{sub}</p>}
            </div>
        </div>
    );
}

export default function Index({ reports, filters = {}, summary = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const status = filters?.status ?? 'semua';

    function applyFilters(next) {
        router.get(
            route('super-admin.laporan-layanan.index'),
            { status, search, ...next },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters({ search });
    }

    const rows = reports?.data ?? [];

    return (
        <SuperAdminLayout title="Laporan Pelayanan">
            <Head title="Laporan Pelayanan" />

            {/* Hero banner */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                        <MessageSquareWarning size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Laporan Pelayanan</h1>
                        <p className="mt-1 text-sm text-blue-50/90">
                            Kelola keluhan customer terkait layanan vendor (komplain pelayanan).
                            Untuk kerugian barang & refund, buka menu <strong>Pengembalian Dana</strong>.
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-5">
                    <SummaryInline label="Total" value={summary.total ?? 0} />
                    <SummaryInline label="Menunggu" value={summary.menunggu ?? 0} />
                    <SummaryInline label="Diproses" value={summary.diproses ?? 0} />
                    <SummaryInline label="Selesai" value={summary.selesai ?? 0} />
                    <SummaryInline label="Ditolak" value={summary.ditolak ?? 0} />
                </div>
            </div>

            {/* Search + status filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearchSubmit} className="flex max-w-md flex-1 gap-2">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kode order / nama customer / barang..."
                            className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-gray-800 dark:bg-[#111827] dark:text-gray-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
                    >
                        Cari
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => applyFilters({ status: f.key })}
                            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                                status === f.key
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-[#111827] dark:text-gray-300 dark:ring-gray-800 dark:hover:bg-gray-800'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111827]">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-500 dark:bg-gray-900/60 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="px-4 py-3 font-bold">Order</th>
                            <th className="px-4 py-3 font-bold">Customer / Vendor</th>
                            <th className="px-4 py-3 font-bold">Status</th>
                            <th className="px-4 py-3 font-bold">Tanggal</th>
                            <th className="px-4 py-3 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-14 text-center text-gray-400 dark:text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <FileText size={32} className="mb-2 text-gray-300 dark:text-gray-600" />
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Belum ada Laporan Pelayanan.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30">
                                    <td className="px-4 py-3.5">
                                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                                            #{r.order_code ?? '-'}
                                        </div>
                                        {r.item_name && (
                                            <div className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                                                {r.item_name}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="font-medium text-gray-800 dark:text-gray-200">
                                            {r.customer_name ?? '-'}
                                        </div>
                                        <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                            Vendor: {r.partner_name ?? '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                STATUS_STYLE[r.status] ?? 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {STATUS_LABEL[r.status] ?? r.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} className="text-gray-400" />
                                            {r.created_at ?? '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <Link
                                            href={route('super-admin.laporan-layanan.show', r.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-400"
                                        >
                                            Detail
                                            <ChevronRight size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {reports?.links && reports.links.length > 3 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
                    {reports.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url ?? '#'}
                            preserveScroll
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                link.active
                                    ? 'bg-emerald-600 text-white'
                                    : link.url
                                        ? 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-[#111827] dark:text-gray-300 dark:hover:bg-gray-800'
                                        : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800'
                            } border border-gray-200 dark:border-gray-800`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </SuperAdminLayout>
    );
}

function SummaryInline({ label, value }) {
    return (
        <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-[11px] text-blue-100">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
}
