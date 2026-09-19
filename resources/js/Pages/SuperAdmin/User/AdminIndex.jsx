import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Search, ShieldAlert, ChevronRight } from 'lucide-react';

// Sesuaikan kalau kamu berpindah ke route()/Ziggy.
const BASE_PATH = '/super-admin/user/admin';

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function AdminIndex({ users, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    function applyFilters(next) {
        router.get(
            BASE_PATH,
            { ...filters, ...next },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters({ search });
    }

    return (
        <SuperAdminLayout title="Pengguna">
            <Head title="Kelola Admin" />

            {/* Admin adalah akun staf internal (bukan alur verifikasi
                KTP seperti customer/vendor), jadi tidak ada tab status —
                cukup pencarian dan badge Aktif/Nonaktif di tabel. */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2.5 max-w-md">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500 pointer-events-none">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, email, atau nomor telepon..."
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] pl-9 pr-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:border-green-700 dark:focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-700 dark:focus:ring-green-500 shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-xl bg-green-700 dark:bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 dark:hover:bg-green-500 shadow-sm transition-all select-none"
                >
                    Cari
                </button>
            </form>

            {/* Tombol tambah akun admin baru */}
            <div className="mt-4 flex justify-end">
                <Link
                    href="/super-admin/user/tambah"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-green-700 dark:bg-green-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-green-700 dark:hover:bg-green-500 transition-colors"
                >
                    + Tambah Akun Admin
                </Link>
            </div>

            {/* Tabel Data Admin */}
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm transition-colors">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/70 dark:bg-gray-900/50 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 select-none">
                        <tr>
                            <th className="px-4 py-3 font-bold">ID</th>
                            <th className="px-4 py-3 font-bold">Nama Lengkap</th>
                            <th className="px-4 py-3 font-bold">No. Telepon</th>
                            <th className="px-4 py-3 font-bold">Email</th>
                            <th className="px-4 py-3 font-bold">Tanggal Dibuat</th>
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
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Belum ada akun admin untuk pencarian ini.
                                        </p>
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
                                            user.is_active
                                                ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/60 dark:text-green-400 dark:border-green-800/50'
                                                : 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                        }`}
                                    >
                                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-right select-none">
                                    <Link
                                        href={`${BASE_PATH}/${user.id}`}
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