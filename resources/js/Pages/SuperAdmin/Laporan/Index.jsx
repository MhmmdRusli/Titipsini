import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import {
    Search, MessageSquareWarning, ChevronRight, Calendar, FileText,
    Filter, Clock, Loader, CheckCircle2, XCircle,
} from 'lucide-react';

// Penyesuaian varian status agar selaras dengan tema hijau
const STATUS_STYLE = {
    menunggu: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/50',
    diproses: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/50',
    disetujui: 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-950/60 dark:text-green-400 dark:border-green-800/50',
    ditolak: 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/50',
    selesai: 'bg-green-50 text-green-800 border border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/50',
};

const STATUS_LABEL = {
    menunggu: 'Menunggu',
    diproses: 'Diproses',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    selesai: 'Selesai',
};

const STATUS_FILTERS = [
    { key: 'semua', label: 'Semua', icon: 'Filter' },
    { key: 'menunggu', label: 'Menunggu', icon: 'Clock' },
    { key: 'diproses', label: 'Diproses', icon: 'Loader' },
    { key: 'selesai', label: 'Selesai', icon: 'CheckCircle2' },
    { key: 'ditolak', label: 'Ditolak', icon: 'XCircle' },
];

const ICON_MAP = {
    Filter: Filter,
    Clock: Clock,
    Loader: Loader,
    CheckCircle2: CheckCircle2,
    XCircle: XCircle,
};

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

            {/* Hero banner - Diubah ke Emerald Green Gradient */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 p-6 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                        <MessageSquareWarning size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Laporan Pelayanan</h1>
                        <p className="mt-1 text-sm text-green-50/90">
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

            {/* Search + status filter buttons (samakan dengan Pengembalian Dana) */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari kode order / nama customer / barang..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-800 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    />
                </form>

                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((f) => {
                        const Icon = ICON_MAP[f.icon];
                        return (
                            <button
                                key={f.key}
                                type="button"
                                onClick={() => applyFilters({ status: f.key })}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                    status === f.key
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
                                }`}
                            >
                                <Icon size={12} />
                                {f.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Table Container */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full text-left text-xs">
                    <thead className="border-b border-gray-200 bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-bold">Order</th>
                            <th className="px-4 py-3 font-bold">Customer / Vendor</th>
                            <th className="px-4 py-3 font-bold">Status</th>
                            <th className="px-4 py-3 font-bold">Tanggal</th>
                            <th className="px-4 py-3 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-14 text-center text-gray-400 dark:text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                                            <FileText size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                            Belum ada Laporan Pelayanan.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                                <tr key={r.id} className="hover:bg-green-50/30 dark:hover:bg-slate-800/50">
                                    <td className="px-4 py-3.5">
                                        <div className="font-semibold text-gray-900 dark:text-slate-100">
                                            #{r.order_code ?? '-'}
                                        </div>
                                        {r.item_name && (
                                            <div className="mt-0.5 text-[11px] text-gray-500 dark:text-slate-400">
                                                {r.item_name}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="font-medium text-gray-800 dark:text-slate-200">
                                            {r.customer_name ?? '-'}
                                        </div>
                                        <div className="text-[11px] text-gray-500 dark:text-slate-400">
                                            Vendor: {r.partner_name ?? '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                STATUS_STYLE[r.status] ?? 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                        >
                                            {STATUS_LABEL[r.status] ?? r.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-[11px] text-gray-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} className="text-gray-400 dark:text-slate-500" />
                                            {r.created_at ?? '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <Link
                                            href={route('super-admin.laporan-layanan.show', r.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-[11px] font-bold text-green-700 transition hover:bg-green-100 dark:border-green-800/60 dark:bg-green-950/60 dark:text-green-400 dark:hover:bg-green-900/60"
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
                            className={`rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold transition dark:border-slate-800 ${
                                link.active
                                    ? 'bg-green-600 text-white'
                                    : link.url
                                        ? 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                        : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600'
                            }`}
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
            <p className="text-[11px] text-green-100">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
    );
}