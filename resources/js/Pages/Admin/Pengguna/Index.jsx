import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const TABS = [
    { key: '', label: 'Semua' },
    { key: 'pendaftar', label: 'Pendaftar' },
    { key: 'verifikasi_akun', label: 'Verifikasi Akun' },
    { key: 'terverifikasi', label: 'Akun Terverifikasi' },
    { key: 'ditolak', label: 'Ditolak' },
];

const STATUS_STYLE = {
    pendaftar: 'bg-slate-100 text-slate-600',
    verifikasi_akun: 'bg-amber-100 text-amber-700',
    terverifikasi: 'bg-emerald-100 text-emerald-700',
    ditolak: 'bg-red-100 text-red-700',
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
            <Head title="Pengguna" />

            <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => applyFilters({ status: tab.key })}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                            activeStatus === tab.key
                                ? 'bg-green-700 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama, email, atau nomor telepon..."
                    className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                />
                <button
                    type="submit"
                    className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 shadow-sm transition"
                >
                    Cari
                </button>
            </form>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Nama Lengkap</th>
                            <th className="px-4 py-3">No. Telepon</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Tanggal Daftar</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.data.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                                    Belum ada pengguna untuk filter ini.
                                </td>
                            </tr>
                        )}
                        {users.data.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-slate-500">#{user.id}</td>
                                <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                                <td className="px-4 py-3 text-slate-600">{user.phone ?? '-'}</td>
                                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                                <td className="px-4 py-3 text-slate-600">{formatDate(user.created_at)}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                            STATUS_STYLE[user.verification_status]
                                        }`}
                                    >
                                        {STATUS_LABEL[user.verification_status]}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={route('admin.pengguna.show', user.id)}
                                        className="text-sm font-medium text-green-700 hover:text-green-800"
                                    >
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.links.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {users.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveState
                            preserveScroll
                            className={`rounded-md px-3 py-1.5 text-sm ${
                                link.active
                                    ? 'bg-green-700 text-white shadow-sm'
                                    : link.url
                                    ? 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    : 'cursor-not-allowed text-slate-300 border border-slate-100'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}