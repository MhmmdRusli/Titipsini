import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { 
    Search, 
    AlertTriangle, 
    Eye, 
    FileText, 
    Calendar, 
    Building2, 
    MessageSquare
} from 'lucide-react';

function formatDate(value) {
    if (!value) return '-';
    try {
        return new Date(value).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return value;
    }
}

function truncateText(text, maxLength = 60) {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export default function Index({ reports, filters, summary = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    function applyFilters() {
        router.get('/super-admin/laporan', {
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

    return (
        <SuperAdminLayout title="Laporan Pengaduan">
            <Head title="Laporan Pengaduan" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Laporan Pengaduan
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Kelola dan pantau seluruh laporan atau keluhan pelanggan terhadap vendor.
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Total Laporan */}
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/20 p-6 shadow-sm transition hover:shadow-md dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/10">
                        {/* Watermark SVG Besar di Background */}
                        <FileText className="absolute -bottom-4 -right-4 h-36 w-36 text-emerald-600/10 dark:text-emerald-400/10 pointer-events-none stroke-1" />
                        
                        <div className="relative z-10 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                                Total Laporan
                            </span>
                            {/* Box Ikon Sesuai Referensi Gambar */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                <FileText size={24} className="stroke-[2.2]" />
                            </div>
                        </div>
                        <div className="relative z-10 mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {summary?.total_laporan ?? 0}
                            </span>
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">pengaduan</span>
                        </div>
                    </div>

                    {/* Card 2: Bulan Ini */}
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/20 p-6 shadow-sm transition hover:shadow-md dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/10">
                        <Calendar className="absolute -bottom-4 -right-4 h-36 w-36 text-emerald-600/10 dark:text-emerald-400/10 pointer-events-none stroke-1" />

                        <div className="relative z-10 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                                Bulan Ini
                            </span>
                            {/* Box Ikon Sesuai Referensi Gambar */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                <Calendar size={24} className="stroke-[2.2]" />
                            </div>
                        </div>
                        <div className="relative z-10 mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {summary?.bulan_ini ?? 0}
                            </span>
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">laporan baru</span>
                        </div>
                    </div>

                    {/* Card 3: Perhatian Khusus */}
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/20 p-6 shadow-sm transition hover:shadow-md dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/10 sm:col-span-2 lg:col-span-1">
                        <AlertTriangle className="absolute -bottom-4 -right-4 h-36 w-36 text-emerald-600/10 dark:text-emerald-400/10 pointer-events-none stroke-1" />

                        <div className="relative z-10 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                                Perhatian Khusus
                            </span>
                            {/* Box Ikon Sesuai Referensi Gambar */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                <AlertTriangle size={24} className="stroke-[2.2]" />
                            </div>
                        </div>
                        <div className="relative z-10 mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {summary?.perlu_tindakan ?? 0}
                            </span>
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">perlu ditinjau</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kata kunci, pelapor, atau vendor..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-emerald-500"
                        />
                    </form>
                </div>

                {/* Main Table Container */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Pelapor</th>
                                    <th className="px-6 py-4">Vendor</th>
                                    <th className="px-6 py-4">Layanan</th>
                                    <th className="px-6 py-4">Ulasan / Keluhan</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {(reports?.data ?? []).length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="mx-auto flex max-w-xs flex-col items-center justify-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400">
                                                    <MessageSquare size={24} />
                                                </div>
                                                <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Tidak ada laporan</h3>
                                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    Belum ada laporan pengaduan yang sesuai dengan pencarian Anda.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    (reports?.data ?? []).map((item) => (
                                        <tr 
                                            key={item.id} 
                                            className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 font-semibold text-white shadow-sm text-xs">
                                                        {item.pelapor_nama?.charAt(0)?.toUpperCase() ?? 'P'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                            {item.pelapor_nama}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                                            {item.pelapor_email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                                            {item.vendor_nama}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                                            {item.vendor_email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/30">
                                                    {item.jenis_layanan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="max-w-xs text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2" title={item.ulasan}>
                                                    {truncateText(item.ulasan, 70)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                                                {formatDate(item.tanggal_laporan)}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <Link
                                                    href={`/super-admin/laporan/${item.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-300"
                                                >
                                                    <Eye size={14} />
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Container */}
                    {reports?.links && (
                        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Menampilkan <span className="font-semibold text-slate-900 dark:text-white">{reports.from ?? 0}</span> -{' '}
                                <span className="font-semibold text-slate-900 dark:text-white">{reports.to ?? 0}</span> dari{' '}
                                <span className="font-semibold text-slate-900 dark:text-white">{reports.total ?? 0}</span> data
                            </p>
                            <div className="flex items-center gap-1 overflow-x-auto">
                                {reports.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2.5 text-xs font-medium transition ${
                                            link.active
                                                ? 'bg-emerald-600 text-white shadow-sm dark:bg-emerald-500'
                                                : link.url
                                                ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                                : 'text-slate-300 pointer-events-none dark:text-slate-600'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}