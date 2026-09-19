import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search, Filter, X, ShieldCheck, Clock, AlertTriangle,
    AlertCircle, CheckCircle2, XCircle, FileText, User, Eye, Gavel
} from 'lucide-react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

const STATUS_CONFIG = {
    klaim_diajukan: { label: 'Klaim Diajukan', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', icon: Clock },
    menunggu_pemeriksaan_admin: { label: 'Menunggu Pemeriksaan Admin', color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400', icon: Clock },
    menunggu_klarifikasi_mitra: { label: 'Menunggu Klarifikasi Mitra', color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400', icon: Clock },
    disetujui: { label: 'Disetujui', color: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400', icon: CheckCircle2 },
    diproses_finance: { label: 'Diproses Finance', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400', icon: Clock },
    refund_berhasil: { label: 'Refund Berhasil', color: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400', icon: CheckCircle2 },
    ditolak: { label: 'Ditolak', color: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400', icon: XCircle },
    sengketa: { label: 'Sengketa', color: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400', icon: AlertTriangle },
};

const STATUS_OPTIONS = [
    { value: 'semua', label: 'Semua' },
    { value: 'sengketa', label: 'Sengketa (Perlu Keputusan)' },
    { value: 'disetujui', label: 'Disetujui Super Admin' },
    { value: 'ditolak', label: 'Ditolak Super Admin' },
    { value: 'refund_berhasil', label: 'Refund Berhasil' },
];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Index({ claims, filters, summary }) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);

    function handleSearch(e) {
        e.preventDefault();
        router.get('/super-admin/klaim-sengketa', { search, status }, { preserveScroll: true });
    }

    function handleStatusChange(value) {
        setStatus(value);
        router.get('/super-admin/klaim-sengketa', { search, status: value }, { preserveScroll: true });
    }

    function handleClearSearch() {
        setSearch('');
        router.get('/super-admin/klaim-sengketa', { status }, { preserveScroll: true });
    }

    return (
        <SuperAdminLayout title="Sengketa Klaim/Refund">
            <Head title="Sengketa Klaim - Super Admin Titipsini" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sengketa Klaim/Refund</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Keputusan final atas klaim yang ditolak Mitra</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                        <p className="text-xs font-medium text-red-700 dark:text-red-300">Sengketa Aktif</p>
                        <p className="mt-1 text-2xl font-bold text-red-800 dark:text-red-200">{summary.sengketa}</p>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30">
                        <p className="text-xs font-medium text-green-700 dark:text-green-300">Disetujui</p>
                        <p className="mt-1 text-2xl font-bold text-green-800 dark:text-green-200">{summary.disetujui_superadmin}</p>
                    </div>
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                        <p className="text-xs font-medium text-red-700 dark:text-red-300">Ditolak</p>
                        <p className="mt-1 text-2xl font-bold text-red-800 dark:text-red-200">{summary.ditolak_superadmin}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Total Diputuskan</p>
                        <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-200">{summary.total}</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nomor order, nama customer..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full sm:w-56 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </form>
                </div>

                {/* Claims Table */}
                <div className="rounded-xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <th className="px-4 py-3">Order</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Mitra</th>
                                    <th className="px-4 py-3">Alasan</th>
                                    <th className="px-4 py-3">Klaim</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Tanggal Klaim</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {claims.data.map((claim) => {
                                    const statusInfo = STATUS_CONFIG[claim.status] ?? STATUS_CONFIG.klaim_diajukan;
                                    const StatusIcon = statusInfo.icon;
                                    const isSengketa = claim.status === 'sengketa';
                                    return (
                                        <tr key={claim.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isSengketa ? 'bg-red-50/50 dark:bg-red-950/20' : ''}`}>
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{claim.order_code}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{claim.service_type}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-800 dark:text-gray-200">{claim.customer_name}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-800 dark:text-gray-200">{claim.mitra_name ?? '-'}</p>
                                            </td>
                                            <td className="px-4 py-3 max-w-xs">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 truncate" title={claim.alasan}>{claim.alasan}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {claim.jumlah_klaim ? (
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatRupiah(claim.jumlah_klaim)}</p>
                                                ) : (
                                                    <p className="text-sm text-gray-400 dark:text-gray-500">-</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${statusInfo.color}`}>
                                                    <StatusIcon size={10} />
                                                    {statusInfo.label}
                                                </span>
                                                {isSengketa && (
                                                    <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-300">
                                                        <Gavel size={8} />
                                                        PERLU KEPUTUSAN
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{claim.created_at}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => router.visit(`/super-admin/klaim-sengketa/${claim.id}`)}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                                        isSengketa
                                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                                            : 'bg-green-700 text-white hover:bg-green-700 dark:bg-green-700'
                                                    }`}
                                                >
                                                    <Eye size={14} />
                                                    {isSengketa ? 'Putuskan' : 'Detail'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {claims.links && claims.data.length > 0 && (
                        <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Menampilkan {claims.from} sampai {claims.to} dari {claims.total} data
                                </p>
                                <div className="flex items-center gap-1">
                                    {claims.links.map((link) => (
                                        <button
                                            key={link.url}
                                            onClick={() => link.url && router.get(link.url, { preserveScroll: true })}
                                            disabled={!link.url || link.active}
                                            className={`px-3 py-1.5 text-sm rounded-lg transition ${
                                                link.active
                                                    ? 'bg-green-700 text-white'
                                                    : link.url
                                                    ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            {link.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {claims.data.length === 0 && (
                        <div className="px-4 py-12 text-center">
                            <AlertCircle size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
                            <p className="mt-3 text-gray-500 dark:text-gray-400">Tidak ada sengketa ditemukan</p>
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}