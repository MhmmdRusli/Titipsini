import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, ShieldAlert, ChevronRight } from 'lucide-react';

const TABS = [
    { key: '', label: 'Semua' },
    { key: 'pendaftar', label: 'Pendaftar' },
    { key: 'verifikasi_akun', label: 'Verifikasi Akun' },
    { key: 'terverifikasi', label: 'Akun Terverifikasi' },
    { key: 'ditolak', label: 'Ditolak' },
];

const STATUS_STYLE = {
    pendaftar: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800',
    verifikasi_akun: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/50',
    terverifikasi: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50',
    ditolak: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800/50',
};

const STATUS_LABEL = {
    pendaftar: 'Pendaftar',
    verifikasi_akun: 'Verifikasi Akun',
    terverifikasi: 'Terverifikasi',
    ditolak: 'Ditolak',
};

export default function Index({ users, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const activeStatus = filters?.status ?? '';

    function applyFilters(next) {
        router.get(
            route('admin.pengguna.index'),
            { ...filters, ...next },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters({ search });
    }

    function formatDate(value) {
        return new Date(value).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    return (
        <AdminLayout title="Pengguna">
            <Head title="Kelola Pengguna" />

            {/* Tab Navigasi Status */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 select-none">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => applyFilters({ status: tab.key })}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 shadow-sm ${
                            activeStatus === tab.key
                                ? 'bg-green-700 text-white shadow-green-700/20 dark:bg-emerald-600'
                                : 'bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
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
                        placeholder="Cari nama, email, atau nomor telepon..."
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] pl-9 pr-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-green-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-green-600 dark:focus:ring-emerald-500 shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-xl bg-green-700 dark:bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 dark:hover:bg-emerald-500 shadow-sm transition-all select-none"
                >
                    Cari
                </button>
            </form>

            {/* Tabel Data Pengguna */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm transition-colors">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/70 dark:bg-gray-900/50 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 select-none">
                        <tr>
                            <th className="px-4 py-3 font-bold">ID</th>
                            <th className="px-4 py-3 font-bold">Nama Lengkap</th>
                            <th className="px-4 py-3 font-bold">No. Telepon</th>
                            <th className="px-4 py-3 font-bold">Email</th>
                            <th className="px-4 py-3 font-bold">Tanggal Daftar</th>
                            <th className="px-4 py-3 font-bold">Status</th>
                            <th className="px-4 py-3 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {users.data.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 select-none">
                                    <div className="flex flex-col items-center justify-center">
                                        <ShieldAlert size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Belum ada pengguna untuk filter ini.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {users.data.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                                <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 font-mono">#{user.id}</td>
                                <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">{user.name}</td>
                                <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{user.phone ?? '-'}</td>
                                <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{user.email}</td>
                                <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">{formatDate(user.created_at)}</td>
                                <td className="px-4 py-3.5 select-none">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                            STATUS_STYLE[user.verification_status]
                                        }`}
                                    >
                                        {STATUS_LABEL[user.verification_status]}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-right select-none">
                                    <Link
                                        href={route('admin.pengguna.show', user.id)}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-green-700 dark:text-emerald-400 hover:text-green-800 dark:hover:text-emerald-300 bg-green-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-green-200 dark:border-emerald-800/50 transition-colors"
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
            {users.links.length > 3 && (
                <div className="mt-5 flex flex-wrap gap-1.5 select-none">
                    {users.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveState
                            preserveScroll
                            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                link.active
                                    ? 'bg-green-700 dark:bg-emerald-600 text-white shadow-sm'
                                    : link.url
                                    ? 'bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                                    : 'cursor-not-allowed text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/30'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}