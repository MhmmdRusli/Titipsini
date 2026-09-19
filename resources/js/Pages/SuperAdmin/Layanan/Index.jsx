import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Search, ShieldAlert, ChevronRight, Package, Car, Building2, Truck } from 'lucide-react';

const BASE_PATH = '/super-admin/layanan';

const KATEGORI_TABS = [
    { key: '', label: 'Semua', icon: null },
    { key: 'barang', label: 'Barang', icon: Package },
    { key: 'kendaraan', label: 'Kendaraan', icon: Car },
    { key: 'bangunan', label: 'Bangunan', icon: Building2 },
    { key: 'pindahan', label: 'Pick Up', icon: Truck },
];

const STATUS_OPTIONS = [
    { value: '', label: 'Semua Status' },
    { value: 'pendaftar', label: 'Pendaftar' },
    { value: 'verifikasi_akun', label: 'Verifikasi Akun' },
    { value: 'terverifikasi', label: 'Terverifikasi' },
    { value: 'ditolak', label: 'Ditolak' },
    { value: 'ditangguhkan', label: 'Ditangguhkan' },
];

const STATUS_STYLE = {
    pendaftar: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800',
    verifikasi_akun: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/50',
    terverifikasi: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/60 dark:text-green-400 dark:border-green-800/50',
    ditolak: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800/50',
    ditangguhkan: 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-800/50',
};

const STATUS_LABEL = {
    pendaftar: 'Pendaftar',
    verifikasi_akun: 'Verifikasi Akun',
    terverifikasi: 'Terverifikasi',
    ditolak: 'Ditolak',
    ditangguhkan: 'Ditangguhkan',
};

const KATEGORI_LABEL = {
    barang: 'Barang',
    kendaraan: 'Kendaraan',
    bangunan: 'Bangunan',
    pindahan: 'Pick Up',
};

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatHarga(value) {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function LayananIndex({ layanan, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const activeKategori = filters?.kategori ?? '';
    const activeStatus = filters?.status ?? '';

    function applyFilters(next) {
        router.get(BASE_PATH, { ...filters, ...next }, { preserveState: true, preserveScroll: true, replace: true });
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters({ search });
    }

    return (
        <SuperAdminLayout title="Layanan">
            <Head title="Kelola Layanan" />

            {/* Tab Kategori */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 select-none">
                {KATEGORI_TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => applyFilters({ kategori: tab.key })}
                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 shadow-sm ${
                                activeKategori === tab.key
                                    ? 'bg-green-700 text-white shadow-green-700/20 dark:bg-green-600'
                                    : 'bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                            }`}
                        >
                            {Icon && <Icon size={13} />}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Search + Filter Status */}
            <div className="mt-5 flex flex-wrap gap-2.5">
                <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[220px] max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500 pointer-events-none">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama layanan atau nama vendor..."
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] pl-9 pr-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-green-700 dark:focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-700 dark:focus:ring-green-500 shadow-sm"
                    />
                </form>

                <select
                    value={activeStatus}
                    onChange={(e) => applyFilters({ status: e.target.value })}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] px-3 py-2 text-xs text-gray-700 dark:text-gray-200 focus:border-green-700 dark:focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-700 dark:focus:ring-green-500 shadow-sm"
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <button
                    type="submit"
                    onClick={handleSearchSubmit}
                    className="rounded-xl bg-green-700 dark:bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 dark:hover:bg-green-500 shadow-sm transition-all select-none"
                >
                    Cari
                </button>
            </div>

            {/* Tabel Data Layanan */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm transition-colors">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/70 dark:bg-gray-900/50 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 select-none">
                        <tr>
                            <th className="px-4 py-3 font-bold">ID</th>
                            <th className="px-4 py-3 font-bold">Nama Layanan</th>
                            <th className="px-4 py-3 font-bold">Kategori</th>
                            <th className="px-4 py-3 font-bold">Vendor</th>
                            <th className="px-4 py-3 font-bold">Kota</th>
                            <th className="px-4 py-3 font-bold">Harga</th>
                            <th className="px-4 py-3 font-bold">Status</th>
                            <th className="px-4 py-3 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {layanan.data.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 select-none">
                                    <div className="flex flex-col items-center justify-center">
                                        <ShieldAlert size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Belum ada layanan untuk filter ini.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {layanan.data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                                <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 font-mono">#{item.id}</td>
                                <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                                    {item.nama_usaha || item.nama}
                                </td>
                                <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                                    {KATEGORI_LABEL[item.kategori] ?? item.kategori}
                                </td>
                                <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{item.user?.name ?? '-'}</td>
                                <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{item.kota ?? '-'}</td>
                                <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{formatHarga(item.harga)}</td>
                                <td className="px-4 py-3.5 select-none">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                            STATUS_STYLE[item.verification_status] ?? STATUS_STYLE.pendaftar
                                        }`}
                                    >
                                        {STATUS_LABEL[item.verification_status] ?? item.verification_status}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-right select-none">
                                    <Link
                                        href={`${BASE_PATH}/${item.id}`}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 bg-green-50 dark:bg-green-950/60 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800/50 transition-colors"
                                    >
                                        Detail
                                        <ChevronRight size={14} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {layanan.links.length > 3 && (
                <div className="mt-5 flex flex-wrap gap-1.5 select-none">
                    {layanan.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveState
                            preserveScroll
                            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                link.active
                                    ? 'bg-green-700 dark:bg-green-600 text-white shadow-sm'
                                    : link.url
                                    ? 'bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                                    : 'cursor-not-allowed text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/30'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </SuperAdminLayout>
    );
}