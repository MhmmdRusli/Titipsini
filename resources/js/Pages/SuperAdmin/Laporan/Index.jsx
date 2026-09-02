import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Search, AlertTriangle, Eye, FileText, Calendar, Building2 } from 'lucide-react';

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
        <SuperAdminLayout title="Laporan">
            <Head title="Laporan" />

            {/* Header Banner - Gradasi Emerald */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#15803d] to-emerald-700 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                            <AlertTriangle size={12} />
                            Report Management
                        </div>
                        <h1 className="text-2xl font-bold">Laporan Pengaduan</h1>
                        <p className="mt-1 text-sm text-emerald-50/90">Pantau semua laporan dan pengaduan dari customer terhadap vendor.</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <FileText size={14} /> Total Laporan
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.total_laporan ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <Calendar size={14} /> Laporan Bulan Ini
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.bulan_ini ?? 0}</div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-gray-500" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari order / pelapor / vendor"
                        className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-3 text-sm text-slate-800 dark:text-gray-100 shadow-sm focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                    />
                </form>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-gray-900/50 text-[11px] uppercase tracking-wide text-slate-500 dark:text-gray-400">
                            <tr>
                                <th className="px-5 py-3">Pelapor</th>
                                <th className="px-5 py-3">Vendor</th>
                                <th className="px-5 py-3">Layanan</th>
                                <th className="px-5 py-3">Tanggal Laporan</th>
                                <th className="px-5 py-3">Ulasan</th>
                                <th className="px-5 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                            {(reports?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-16 text-center">
                                        <div className="mx-auto max-w-md">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#15803d] dark:text-emerald-400">
                                                <FileText size={28} />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-800 dark:text-gray-200">Belum ada laporan</h3>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Belum ada pengaduan atau laporan dari customer.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                (reports?.data ?? []).map((item) => (
                                    <tr key={item.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-[#15803d] dark:text-emerald-400 font-bold text-xs">
                                                    {item.pelapor_nama?.charAt(0) ?? 'P'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-gray-100">{item.pelapor_nama}</div>
                                                    <div className="text-xs text-slate-500 dark:text-gray-400">{item.pelapor_email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={14} className="text-slate-400 dark:text-gray-500" />
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-gray-100">{item.vendor_nama}</div>
                                                    <div className="text-xs text-slate-500 dark:text-gray-400">{item.vendor_email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-[#15803d] dark:text-emerald-400">
                                                {item.jenis_layanan}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
                                                <Calendar size={12} />
                                                {formatDate(item.tanggal_laporan)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="max-w-xs">
                                                <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2" title={item.ulasan}>
                                                    {truncateText(item.ulasan, 50)}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={`/super-admin/laporan/${item.id}`}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 px-3 py-2 text-xs font-semibold text-[#15803d] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
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
            </div>

            {/* Pagination */}
            {reports?.links && (
                <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                    <div className="text-xs text-slate-600 dark:text-gray-400">
                        Menampilkan <span className="font-bold text-slate-900 dark:text-gray-200">{reports.from ?? 0}</span> -{' '}
                        <span className="font-bold text-slate-900 dark:text-gray-200">{reports.to ?? 0}</span> dari{' '}
                        <span className="font-bold text-slate-900 dark:text-gray-200">{reports.total ?? 0}</span> laporan
                    </div>
                    <div className="flex gap-1">
                        {reports.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded px-2.5 py-1.5 text-xs font-medium transition ${
                                    link.active
                                        ? 'bg-[#15803d] text-white dark:bg-emerald-600'
                                        : link.url
                                        ? 'border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'
                                        : 'border border-slate-200 dark:border-gray-800 text-slate-400 dark:text-gray-600'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}
