import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search, ShieldCheck, ChevronRight, FileText,
    Clock, CheckCircle2, XCircle, Filter,
} from 'lucide-react';

const STATUS_FILTERS = [
    { key: 'semua', label: 'Semua', icon: Filter },
    { key: 'pending', label: 'Menunggu Verifikasi', icon: Clock },
    { key: 'approved', label: 'Disetujui Admin', icon: CheckCircle2 },
    { key: 'rejected', label: 'Ditolak Admin', icon: XCircle },
];

const APPROVAL_STYLE = {
    pending: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/50',
    approved: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50',
    rejected: 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/50',
};

const APPROVAL_LABEL = {
    pending: 'Menunggu',
    approved: 'Disetujui Admin',
    rejected: 'Ditolak Admin',
};

const STATUS_LABEL = {
    menunggu: 'Menunggu',
    siap_refund: 'Siap Refund (Finance)',
    disetujui: 'Disetujui Final',
    ditolak: 'Ditolak',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function SummaryCard({ icon: Icon, color, label, value, sub }) {
    const COLOR = {
        amber: 'from-amber-500 to-orange-500',
        emerald: 'from-emerald-500 to-teal-600',
        red: 'from-rose-500 to-red-600',
        blue: 'from-emerald-600 to-green-700',
    };
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ${COLOR[color]}`}>
                <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">{label}</p>
                <p className="mt-0.5 truncate text-lg font-bold text-gray-900 dark:text-slate-100">{value}</p>
                {sub && <p className="text-[11px] text-gray-500 dark:text-slate-400">{sub}</p>}
            </div>
        </div>
    );
}

export default function Index({ reports, filters = {}, summary = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const status = filters?.status ?? 'semua';

    function applyFilters(next) {
        router.get(
            route('admin.laporan-validasi.index'),
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
        <AdminLayout title="Validasi Laporan Kerugian">
            <Head title="Validasi Laporan Kerugian" />

            {/* Hero banner */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Validasi Laporan Kerugian</h1>
                        <p className="mt-1 text-sm text-emerald-50/90">
                            Verifikasi data dan foto bukti dari laporan kerugian customer.
                            Setelah Anda setujui, laporan diteruskan ke <strong>Finance</strong> untuk proses refund nominal/persen.
                            Jika ditolak, laporan tidak dapat diproses refund.
                        </p>
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                    <SummaryCard icon={Clock} color="amber"
                        label="Menunggu Verifikasi" value={summary.pending ?? 0} />
                    <SummaryCard icon={CheckCircle2} color="emerald"
                        label="Disetujui Admin" value={summary.approved ?? 0} />
                    <SummaryCard icon={XCircle} color="red"
                        label="Ditolak Admin" value={summary.rejected ?? 0} />
                    <SummaryCard icon={FileText} color="blue"
                        label="Total" value={summary.total ?? 0} />
                </div>
            </div>

            {/* Search + status filter */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400 dark:text-slate-500" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari kode order / nama customer / barang..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-xs text-gray-800 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-500"
                    />
                </form>

                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((f) => {
                        const Icon = f.icon;
                        return (
                            <button
                                key={f.key}
                                type="button"
                                onClick={() => applyFilters({ status: f.key })}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                    status === f.key
                                        ? 'bg-emerald-600 text-white shadow-sm'
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

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full text-left text-xs">
                    <thead className="border-b border-gray-200 bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-bold">Order</th>
                            <th className="px-4 py-3 font-bold">Customer / Vendor</th>
                            <th className="px-4 py-3 font-bold">Approval Admin</th>
                            <th className="px-4 py-3 font-bold">Status</th>
                            <th className="px-4 py-3 font-bold">Tanggal</th>
                            <th className="px-4 py-3 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-14 text-center text-gray-400 dark:text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                            <FileText size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                            Belum ada laporan kerugian.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                                <tr key={r.id} className="hover:bg-emerald-50/30 dark:hover:bg-slate-800/50">
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
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                            APPROVAL_STYLE[r.admin_approval] ?? 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
                                        }`}>
                                            {APPROVAL_LABEL[r.admin_approval] ?? r.admin_approval}
                                        </span>
                                        {r.admin_approver_name && (
                                            <div className="mt-0.5 text-[10px] text-gray-500 dark:text-slate-400">
                                                oleh {r.admin_approver_name} - {r.admin_approval_at}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="text-[11px] font-medium text-gray-700 dark:text-slate-300">
                                            {STATUS_LABEL[r.status] ?? r.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-[11px] text-gray-500 dark:text-slate-400">
                                        {r.created_at ?? '-'}
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <Link
                                            href={route('admin.laporan-validasi.show', r.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-400 dark:hover:bg-emerald-900/60"
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
                                    ? 'bg-emerald-600 text-white'
                                    : link.url
                                        ? 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                        : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}