import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, FileDown, ShieldAlert, ChevronRight, Calendar } from 'lucide-react';

const JENIS_LAYANAN_LABEL = {
    kendaraan: 'Kendaraan',
    barang: 'Barang',
    bangunan: 'Bangunan',
};

const TABS = [
    { key: '', label: 'Semua' },
    { key: 'kendaraan', label: 'Kendaraan' },
    { key: 'barang', label: 'Barang' },
    { key: 'bangunan', label: 'Bangunan' },
];

const LAYANAN_STYLE = {
    kendaraan: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60',
    barang: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60',
    bangunan: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60',
};

export default function Index({ reports = [], filters = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const activeTab = filters?.jenis_layanan ?? '';

    function applyFilters(next) {
        router.get(
            route('admin.reports.index'),
            { ...filters, ...next },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters({ search });
    }

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return reports;
        return reports.filter((r) =>
            [r.pelapor_nama, r.vendor_nama, r.jenis_layanan, r.ulasan]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(q))
        );
    }, [search, reports]);

    return (
        <AdminLayout title="Laporan">
            <Head title="Kelola Laporan" />

            {/* Tab Navigasi Jenis Layanan & Tombol Unduh Sejajar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4 select-none">
                <div className="flex flex-wrap gap-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => applyFilters({ jenis_layanan: tab.key })}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 shadow-sm ${
                                activeTab === tab.key
                                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                                    : 'bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <a
                    href={route('admin.reports.export')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all select-none w-fit"
                >
                    <FileDown size={14} className="text-gray-500 dark:text-gray-400" />
                    Unduh Dokumen
                </a>
            </div>

            {/* Form Pencarian */}
            <form onSubmit={handleSearchSubmit} className="mt-5 flex gap-2.5 max-w-md">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500 pointer-events-none">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari pelapor, vendor, jenis layanan..."
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] pl-9 pr-3 py-2 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-sm transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all select-none"
                >
                    Cari
                </button>
            </form>

            {/* Tabel Data Laporan */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm transition-colors">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/70 dark:bg-gray-900/60 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 select-none">
                        <tr>
                            <th className="px-4 py-3 font-bold">Nama Pelapor</th>
                            <th className="px-4 py-3 font-bold">Nama Vendor</th>
                            <th className="px-4 py-3 font-bold">Jenis Layanan</th>
                            <th className="px-4 py-3 font-bold">Tanggal Laporan</th>
                            <th className="px-4 py-3 font-bold">Ulasan</th>
                            <th className="px-4 py-3 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 select-none">
                                    <div className="flex flex-col items-center justify-center">
                                        <ShieldAlert size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Belum ada laporan yang cocok.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">{r.pelapor_nama}</td>
                                    <td className="px-4 py-3.5 text-gray-700 dark:text-gray-300">{r.vendor_nama}</td>
                                    <td className="px-4 py-3.5 select-none">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                LAYANAN_STYLE[r.jenis_layanan] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                                            }`}
                                        >
                                            {JENIS_LAYANAN_LABEL[r.jenis_layanan] ?? r.jenis_layanan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={13} className="text-gray-400 dark:text-gray-500" />
                                            {r.tanggal_laporan}
                                        </div>
                                    </td>
                                    <td className="max-w-xs truncate px-4 py-3.5 text-gray-600 dark:text-gray-400" title={r.ulasan}>
                                        {r.ulasan}
                                    </td>
                                    <td className="px-4 py-3.5 text-right select-none">
                                        <Link
                                            href={route('admin.reports.show', r.id)}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 transition-colors"
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
        </AdminLayout>
    );
}