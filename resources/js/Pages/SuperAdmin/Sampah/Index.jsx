import { useState } from 'react';
import { router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Trash2, RotateCcw, X, AlertTriangle, Inbox, Clock } from 'lucide-react';

const SISA_STYLE = {
    aman: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800/50',
    segera: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
    kritis: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/50',
};

function sisaTone(sisaHari) {
    if (sisaHari <= 2) return 'kritis';
    if (sisaHari <= 7) return 'segera';
    return 'aman';
}

export default function Index({ items = [], types = [], filters = null }) {
    const [activeType, setActiveType] = useState(filters?.type ?? '');
    const [restoreTarget, setRestoreTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    function applyType(type) {
        setActiveType(type);
        router.get(
            '/super-admin/sampah',
            { type: type || undefined },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function handleRestore() {
        setIsProcessing(true);
        router.patch(
            `/super-admin/sampah/${restoreTarget.type}/${restoreTarget.id}/restore`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsProcessing(false);
                    setRestoreTarget(null);
                },
                onError: () => setIsProcessing(false),
            }
        );
    }

    function handleForceDelete() {
        setIsProcessing(true);
        router.delete(`/super-admin/sampah/${deleteTarget.type}/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsProcessing(false);
                setDeleteTarget(null);
            },
            onError: () => setIsProcessing(false),
        });
    }

    return (
        <SuperAdminLayout title="Sampah">
            {/* Filter jenis data */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => applyType('')}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-sm transition-all ${
                        activeType === ''
                            ? 'border-green-700 bg-green-700 text-white dark:border-green-600 dark:bg-green-600'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800'
                    }`}
                >
                    Semua
                </button>
                {types.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => applyType(t.key)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-sm transition-all ${
                            activeType === t.key
                                ? 'border-green-700 bg-green-700 text-white dark:border-green-600 dark:bg-green-600'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tabel Sampah */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="select-none border-b border-gray-200 bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-slate-800/80 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3 font-bold">Jenis</th>
                                <th className="px-4 py-3 font-bold">Data</th>
                                <th className="px-4 py-3 font-bold">Dihapus Pada</th>
                                <th className="px-4 py-3 font-bold">Dihapus Oleh</th>
                                <th className="px-4 py-3 font-bold">Sisa Waktu</th>
                                <th className="px-4 py-3 text-right font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="select-none px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Inbox size={32} className="mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Sampah kosong.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {items.map((item) => (
                                <tr
                                    key={`${item.type}-${item.id}`}
                                    className="transition-colors hover:bg-gray-50/60 dark:hover:bg-slate-800/50"
                                >
                                    <td className="px-4 py-3.5">
                                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-gray-800 dark:bg-slate-800 dark:text-gray-300">
                                            {item.type_label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</div>
                                        {item.subtitle && (
                                            <div className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{item.subtitle}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{item.deleted_at}</td>
                                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                                        {item.deleted_by ?? <span className="italic text-gray-300 dark:text-gray-600">-</span>}
                                    </td>
                                    <td className="select-none px-4 py-3.5">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${SISA_STYLE[sisaTone(item.sisa_hari)]}`}
                                        >
                                            <Clock size={11} />
                                            {item.sisa_label}
                                        </span>
                                    </td>
                                    <td className="select-none px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setRestoreTarget(item)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-600 hover:text-white dark:border-green-800/60 dark:bg-green-950/50 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white"
                                            >
                                                <RotateCcw size={13} />
                                                Pulihkan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(item)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-600 hover:text-white dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
                                                title="Hapus Permanen"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal konfirmasi Restore */}
            {restoreTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-gray-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                                    <RotateCcw size={18} />
                                </span>
                                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Pulihkan Data?</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setRestoreTarget(null)}
                                className="text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            "{restoreTarget.title}" ({restoreTarget.type_label}) akan dikembalikan dan muncul kembali di halaman normal.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setRestoreTarget(null)}
                                disabled={isProcessing}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-60 dark:text-gray-300 dark:hover:bg-slate-800"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleRestore}
                                disabled={isProcessing}
                                className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:opacity-60 dark:bg-green-600 dark:hover:bg-green-700"
                            >
                                {isProcessing ? 'Memproses...' : 'Ya, Pulihkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal konfirmasi Hapus Permanen */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-gray-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                                    <AlertTriangle size={18} />
                                </span>
                                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Hapus Permanen?</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                className="text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            Data ini akan dihapus secara permanen dan tidak dapat dipulihkan. Lanjutkan?
                        </p>
                        <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 dark:bg-slate-800 dark:text-gray-300">
                            {deleteTarget.title} ({deleteTarget.type_label})
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                disabled={isProcessing}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-60 dark:text-gray-300 dark:hover:bg-slate-800"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleForceDelete}
                                disabled={isProcessing}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
                            >
                                {isProcessing ? 'Menghapus...' : 'Ya, Hapus Permanen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}