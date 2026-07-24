import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Handshake, ChevronRight, Trash2, AlertTriangle, X, CheckCircle2 } from 'lucide-react';

const TABS = [
    { key: '', label: 'Semua' },
    { key: 'pendaftar', label: 'Pendaftar' },
    { key: 'verifikasi_akun', label: 'Verifikasi Akun' },
    { key: 'terverifikasi', label: 'Akun Terverifikasi' },
    { key: 'ditolak', label: 'Ditolak' },
    { key: 'ditangguhkan', label: 'Ditangguhkan' },
];

const STATUS_STYLE = {
    pendaftar: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800',
    verifikasi_akun: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/50',
    terverifikasi: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50',
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

export default function Index({ partners, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search ?? '');

    // State untuk mode pilih banyak
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [deletingPartner, setDeletingPartner] = useState(null);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
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

    // Toggle mode pilih banyak
    function toggleSelectMode() {
        setIsBulkMode((v) => !v);
        setSelectedIds([]);
    }

    // Pilih / Batal Pilih Semua di Halaman Ini
    function handleSelectAll(e) {
        if (e.target.checked) {
            const allIds = partners.data.map((p) => p.id);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    }

    // Pilih satu baris checkbox
    function handleSelectOne(id) {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    // Hapus Single
    function handleDeleteConfirm() {
        if (!deletingPartner) return;

        router.delete(`/admin/partners/${deletingPartner.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingPartner(null);
                setSelectedIds(selectedIds.filter((id) => id !== deletingPartner.id));
            },
        });
    }

    // Hapus Banyak (Bulk Delete)
    function handleBulkDeleteConfirm() {
        if (selectedIds.length === 0) return;

        router.post(
            '/admin/partners/bulk-destroy',
            { ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setIsBulkDeleting(false);
                    setIsBulkMode(false); // Keluar dari mode bulk setelah sukses menghapus
                },
            }
        );
    }

    function formatDate(value) {
        return new Date(value).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    const isAllSelected = partners.data.length > 0 && partners.data.every((p) => selectedIds.includes(p.id));

    return (
        <AdminLayout title="Mitra">
            <Head title="Kelola Mitra" />
            <div className="space-y-6">
                {/* Notifikasi Berhasil (Flash Message) */}
                {flash?.success && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-3 text-green-900 shadow-sm transition-all dark:border-emerald-800/50 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 size={20} className="text-green-600 dark:text-emerald-400 shrink-0" />
                        <div className="text-xs font-medium">
                            {flash.success}
                        </div>
                    </div>
                )}

                {/* Tabs filter status */}
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

                {/* Search & Tombol Pilih Banyak */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <form onSubmit={handleSearchSubmit} className="flex gap-2.5 max-w-md flex-1">
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

                    {partners.data.length > 0 && (
                        <button
                            type="button"
                            onClick={toggleSelectMode}
                            className={`rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-sm transition-all ${
                                isBulkMode
                                    ? 'border-green-600 bg-green-50 text-green-700 dark:border-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            {isBulkMode ? 'Batal Pilih' : 'Pilih Banyak'}
                        </button>
                    )}
                </div>

                {/* Bar info jumlah terpilih */}
                {isBulkMode && selectedIds.length > 0 && (
                    <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 shadow-sm dark:border-emerald-800/50 dark:bg-emerald-950/60">
                        <span className="text-xs font-semibold text-green-800 dark:text-emerald-300">
                            {selectedIds.length} mitra dipilih
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedIds([])}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 transition hover:bg-white dark:hover:bg-gray-800"
                            >
                                Batalkan Pilihan
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsBulkDeleting(true)}
                                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
                            >
                                <Trash2 size={13} />
                                Hapus {selectedIds.length} Mitra
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabel */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm transition-colors">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50/70 dark:bg-gray-900/50 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 select-none">
                            <tr>
                                {isBulkMode && (
                                    <th className="px-4 py-3 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300 text-green-700 focus:ring-green-600 dark:border-gray-700 dark:bg-gray-800"
                                        />
                                    </th>
                                )}
                                <th className="px-4 py-3 font-bold">ID Vendor</th>
                                <th className="px-4 py-3 font-bold">Nama Mitra</th>
                                <th className="px-4 py-3 font-bold">No. Telepon</th>
                                <th className="px-4 py-3 font-bold">Email</th>
                                <th className="px-4 py-3 font-bold">Kota</th>
                                <th className="px-4 py-3 font-bold">Tanggal Bergabung</th>
                                <th className="px-4 py-3 font-bold">Status</th>
                                <th className="px-4 py-3 font-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {partners.data.length === 0 && (
                                <tr>
                                    <td colSpan={isBulkMode ? 9 : 8} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 select-none">
                                        <div className="flex flex-col items-center justify-center">
                                            <Handshake size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Belum ada mitra untuk filter ini.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {partners.data.map((partner) => {
                                const displayStatus = partner.suspended_at ? 'ditangguhkan' : partner.verification_status;
                                const isChecked = selectedIds.includes(partner.id);

                                return (
                                    <tr key={partner.id} className={`hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors ${isChecked ? 'bg-green-50/30 dark:bg-emerald-950/20' : ''}`}>
                                        {isBulkMode && (
                                            <td className="px-4 py-3.5 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleSelectOne(partner.id)}
                                                    className="rounded border-gray-300 text-green-700 focus:ring-green-600 dark:border-gray-700 dark:bg-gray-800"
                                                />
                                            </td>
                                        )}
                                        <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 font-mono">#{partner.id}</td>
                                        <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">{partner.name}</td>
                                        <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{partner.phone ?? '-'}</td>
                                        <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{partner.email}</td>
                                        <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{partner.city ?? '-'}</td>
                                        <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">{formatDate(partner.created_at)}</td>
                                        <td className="px-4 py-3.5 select-none">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                    STATUS_STYLE[displayStatus] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                }`}
                                            >
                                                {STATUS_LABEL[displayStatus] || displayStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right select-none">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/admin/partners/${partner.id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-green-700 dark:text-emerald-400 hover:text-green-800 dark:hover:text-emerald-300 bg-green-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-green-200 dark:border-emerald-800/50 transition-colors"
                                                >
                                                    Detail
                                                    <ChevronRight size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => setDeletingPartner(partner)}
                                                    className="inline-flex items-center text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-950/60 p-1.5 rounded-lg border border-red-200 dark:border-red-800/50 transition-colors"
                                                    title="Hapus Mitra"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {partners.data.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 select-none">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Menampilkan <span className="font-semibold text-gray-700 dark:text-gray-200">{partners.from}</span> sampai <span className="font-semibold text-gray-700 dark:text-gray-200">{partners.to}</span> dari <span className="font-semibold text-gray-700 dark:text-gray-200">{partners.total}</span> data
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {partners.links.map((link, i) => (
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
                    </div>
                )}
            </div>
            
            {/* Modal Konfirmasi Hapus Satuan */}
            {deletingPartner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] p-6 shadow-xl border border-gray-100 dark:border-gray-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                                <AlertTriangle size={20} />
                            </div>
                            <button
                                onClick={() => setDeletingPartner(null)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Hapus Akun Mitra</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                Apakah Anda yakin ingin menghapus mitra <span className="font-semibold text-gray-800 dark:text-gray-200">{deletingPartner.name}</span>? Tindakan ini permanen.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeletingPartner(null)}
                                className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 shadow-sm transition-colors"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Bulk Delete */}
            {isBulkDeleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] p-6 shadow-xl border border-gray-100 dark:border-gray-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                                <AlertTriangle size={20} />
                            </div>
                            <button
                                onClick={() => setIsBulkDeleting(false)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Hapus {selectedIds.length} Akun Mitra?</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                Apakah Anda yakin ingin menghapus seluruh mitra yang dipilih secara permanen? Data yang dihapus tidak dapat dikembalikan.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsBulkDeleting(false)}
                                className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleBulkDeleteConfirm}
                                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 shadow-sm transition-colors"
                            >
                                Ya, Hapus Semua
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}