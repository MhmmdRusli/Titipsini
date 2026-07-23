import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const TABS = [
    { key: '', label: 'Semua' },
    { key: 'pendaftar', label: 'Pendaftar' },
    { key: 'verifikasi_akun', label: 'Verifikasi Akun' },
    { key: 'terverifikasi', label: 'Akun Terverifikasi' },
    { key: 'ditolak', label: 'Ditolak' },
    { key: 'ditangguhkan', label: 'Ditangguhkan' },
];

const STATUS_STYLE = {
    pendaftar: 'bg-slate-100 text-slate-600',
    verifikasi_akun: 'bg-amber-100 text-amber-700',
    terverifikasi: 'bg-emerald-100 text-emerald-700',
    ditolak: 'bg-red-100 text-red-700',
    ditangguhkan: 'bg-orange-100 text-orange-700',
};

const STATUS_LABEL = {
    pendaftar: 'Pendaftar',
    verifikasi_akun: 'Verifikasi Akun',
    terverifikasi: 'Terverifikasi',
    ditolak: 'Ditolak',
    ditangguhkan: 'Ditangguhkan',
};

export default function Index({ partners, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const activeStatus = filters?.status ?? '';

    function applyFilters(next) {
        router.get(
            '/admin/partners',
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
        <AdminLayout title="Mitra">
            <Head title="Mitra" />

            {/* Tabs filter status */}
            <div className="mt-2 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => applyFilters({ status: tab.key })}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                            activeStatus === tab.key
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama, email, atau nomor telepon..."
                    className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button
                    type="submit"
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                    Cari
                </button>
            </form>

            {/* Tabel */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">ID Vendor</th>
                            <th className="px-4 py-3">Nama Mitra</th>
                            <th className="px-4 py-3">No. Telepon</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Kota</th>
                            <th className="px-4 py-3">Tanggal Bergabung</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {partners.data.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                                    Belum ada mitra untuk filter ini.
                                </td>
                            </tr>
                        )}
                        {partners.data.map((partner) => (
                            <tr key={partner.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-slate-500">#{partner.id}</td>
                                <td className="px-4 py-3 font-medium text-slate-800">{partner.name}</td>
                                <td className="px-4 py-3 text-slate-600">{partner.phone ?? '-'}</td>
                                <td className="px-4 py-3 text-slate-600">{partner.email}</td>
                                <td className="px-4 py-3 text-slate-600">{partner.city ?? '-'}</td>
                                <td className="px-4 py-3 text-slate-600">{formatDate(partner.created_at)}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                            STATUS_STYLE[partner.verification_status]
                                        }`}
                                    >
                                        {STATUS_LABEL[partner.verification_status]}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/partners/${partner.id}`}
                                        className="text-sm font-medium text-teal-600 hover:text-teal-700"
                                    >
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {partners.data.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">
                        Menampilkan {partners.from}-{partners.to} dari {partners.total} data
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {partners.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                preserveState
                                preserveScroll
                                className={`rounded-md px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'bg-green-600 text-white'
                                        : link.url
                                        ? 'bg-white text-slate-600 hover:bg-slate-100'
                                        : 'cursor-not-allowed text-slate-300'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}