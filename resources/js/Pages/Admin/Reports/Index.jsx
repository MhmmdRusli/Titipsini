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
    kendaraan: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    barang: 'bg-blue-50 text-blue-700 border border-blue-200',
    bangunan: 'bg-amber-50 text-amber-700 border border-amber-200',
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4 select-none">
                <div className="flex flex-wrap gap-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => applyFilters({ jenis_layanan: tab.key })}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 shadow-sm ${
                                activeTab === tab.key
                                    ? 'bg-green-700 text-white shadow-green-700/20'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <a
                    href={route('admin.reports.export')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all select-none w-fit"
                >
                    <FileDown size={14} className="text-gray-500" />
                    Unduh Dokumen
                </a>
            </div>

            {/* Form Pencarian */}
            <form onSubmit={handleSearchSubmit} className="mt-5 flex gap-2.5 max-w-md">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari pelapor, vendor, jenis layanan..."
                        className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-xs text-gray-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 shadow-sm transition-all select-none"
                >
                    Cari
                </button>
            </form>

            {/* Tabel Data Laporan */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200 select-none">
                        <tr>
                            <th className="px-4 py-3 font-bold">Nama Pelapor</th>
                            <th className="px-4 py-3 font-bold">Nama Vendor</th>
                            <th className="px-4 py-3 font-bold">Jenis Layanan</th>
                            <th className="px-4 py-3 font-bold">Tanggal Laporan</th>
                            <th className="px-4 py-3 font-bold">Ulasan</th>
                            <th className="px-4 py-3 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-400 select-none">
                                    <div className="flex flex-col items-center justify-center">
                                        <ShieldAlert size={32} className="text-gray-300 mb-2" />
                                        <p className="text-sm font-medium text-gray-500">Belum ada laporan yang cocok.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filtered.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-4 py-3.5 font-semibold text-gray-900">{r.pelapor_nama}</td>
                                    <td className="px-4 py-3.5 text-gray-700">{r.vendor_nama}</td>
                                    <td className="px-4 py-3.5 select-none">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                LAYANAN_STYLE[r.jenis_layanan] ?? 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}
                                        >
                                            {JENIS_LAYANAN_LABEL[r.jenis_layanan] ?? r.jenis_layanan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={13} className="text-gray-400" />
                                            {r.tanggal_laporan}
                                        </div>
                                    </td>
                                    <td className="max-w-xs truncate px-4 py-3.5 text-gray-600" title={r.ulasan}>
                                        {r.ulasan}
                                    </td>
                                    <td className="px-4 py-3.5 text-right select-none">
                                        <Link
                                            href={route('admin.reports.show', r.id)}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 transition-colors"
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