import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Wallet, ChevronRight, CheckCircle2, XCircle, X, AlertTriangle } from 'lucide-react';

const TABS = [
    { key: 'pending', label: 'Menunggu' },
    { key: 'selesai', label: 'Selesai' },
    { key: 'ditolak', label: 'Ditolak' },
    { key: 'semua', label: 'Semua' },
];

const STATUS_STYLE = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    selesai: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    ditolak: 'bg-red-50 text-red-700 border border-red-200',
};

const STATUS_LABEL = {
    pending: 'Menunggu',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function PenarikanIndex({ penarikan, filter }) {
    const { flash } = usePage().props;
    const activeStatus = filter?.status ?? 'pending';

    const [approveTarget, setApproveTarget] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [catatan, setCatatan] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function changeTab(status) {
        router.get('/admin/penarikan', { status }, { preserveState: true, preserveScroll: true, replace: true });
    }

    function handleApprove() {
        if (!approveTarget) return;
        setIsSubmitting(true);
        router.post(
            `/admin/penarikan/${approveTarget.id}/approve`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setApproveTarget(null);
                },
                onError: () => setIsSubmitting(false),
            }
        );
    }

    function handleReject() {
        if (!rejectTarget) return;
        setIsSubmitting(true);
        router.post(
            `/admin/penarikan/${rejectTarget.id}/reject`,
            { catatan },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setRejectTarget(null);
                    setCatatan('');
                },
                onError: () => setIsSubmitting(false),
            }
        );
    }

    return (
        <AdminLayout title="Penarikan Saldo">
            <Head title="Penarikan Saldo" />

            <div className="space-y-6">
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900 shadow-sm transition-all">
                        <CheckCircle2 size={20} className="shrink-0 text-green-600" />
                        <div className="text-xs font-medium">{flash.success}</div>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 select-none">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => changeTab(tab.key)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition-all duration-200 ${
                                activeStatus === tab.key
                                    ? 'bg-green-700 text-white shadow-green-700/20'
                                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-xs">
                        <thead className="select-none border-b border-gray-200 bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-4 py-3 font-bold">Mitra</th>
                                <th className="px-4 py-3 font-bold">Jumlah</th>
                                <th className="px-4 py-3 font-bold">Rekening Tujuan</th>
                                <th className="px-4 py-3 font-bold">Diajukan</th>
                                <th className="px-4 py-3 font-bold">Status</th>
                                <th className="px-4 py-3 text-right font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {penarikan.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="select-none px-4 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Wallet size={32} className="mb-2 text-gray-300" />
                                            <p className="text-sm font-medium text-gray-500">
                                                Belum ada permintaan penarikan untuk filter ini.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {penarikan.data.map((item) => (
                                <tr key={item.id} className="transition-colors hover:bg-gray-50/60">
                                    <td className="px-4 py-3.5">
                                        <p className="font-semibold text-gray-900">{item.user?.name ?? '-'}</p>
                                        <p className="text-[11px] text-gray-500">{item.user?.email ?? '-'}</p>
                                    </td>
                                    <td className="px-4 py-3.5 font-bold text-gray-900">{formatRupiah(item.jumlah)}</td>
                                    <td className="px-4 py-3.5 text-gray-600">
                                        <p>{item.nama_bank} &middot; {item.nomor_rekening}</p>
                                        <p className="text-[11px] text-gray-400">a.n. {item.nama_pemilik}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-gray-500">{formatDate(item.created_at)}</td>
                                    <td className="px-4 py-3.5 select-none">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                STATUS_STYLE[item.status] ?? 'border border-slate-200 bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            {STATUS_LABEL[item.status] ?? item.status}
                                        </span>
                                        {item.status === 'ditolak' && item.catatan && (
                                            <p className="mt-1 text-[11px] italic text-red-500">{item.catatan}</p>
                                        )}
                                    </td>
                                    <td className="select-none px-4 py-3.5 text-right">
                                        {item.status === 'pending' ? (
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setApproveTarget(item)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition-colors hover:text-green-800"
                                                >
                                                    Setujui
                                                    <ChevronRight size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setRejectTarget(item)}
                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                    title="Tolak Penarikan"
                                                >
                                                    <XCircle size={15} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] text-gray-400">
                                                {formatDate(item.processed_at)}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {penarikan.data.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 select-none">
                        <p className="text-xs text-gray-500">
                            Menampilkan <span className="font-semibold text-gray-700">{penarikan.from}</span> sampai{' '}
                            <span className="font-semibold text-gray-700">{penarikan.to}</span> dari{' '}
                            <span className="font-semibold text-gray-700">{penarikan.total}</span> data
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {penarikan.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    preserveScroll
                                    preserveState
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                        link.active
                                            ? 'bg-green-700 text-white shadow-sm'
                                            : link.url
                                            ? 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                            : 'cursor-not-allowed border border-gray-100 bg-gray-50/50 text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {approveTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <CheckCircle2 size={20} />
                            </div>
                            <button
                                onClick={() => setApproveTarget(null)}
                                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-900">Setujui Penarikan?</h3>
                            <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                Saldo mitra <span className="font-semibold text-gray-800">{approveTarget.user?.name}</span> akan
                                dipotong sebesar <span className="font-semibold text-gray-800">{formatRupiah(approveTarget.jumlah)}</span> dan
                                dana ditransfer ke rekening {approveTarget.nama_bank}. Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setApproveTarget(null)}
                                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleApprove}
                                disabled={isSubmitting}
                                className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-800 disabled:opacity-60"
                            >
                                {isSubmitting ? 'Memproses...' : 'Ya, Setujui'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {rejectTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <AlertTriangle size={20} />
                            </div>
                            <button
                                onClick={() => {
                                    setRejectTarget(null);
                                    setCatatan('');
                                }}
                                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-900">Tolak Penarikan</h3>
                            <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                Permintaan penarikan <span className="font-semibold text-gray-800">{formatRupiah(rejectTarget.jumlah)}</span> dari{' '}
                                <span className="font-semibold text-gray-800">{rejectTarget.user?.name}</span> akan ditolak. Saldo mitra tidak berubah.
                            </p>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                Catatan penolakan (opsional)
                            </label>
                            <textarea
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                rows={3}
                                placeholder="Contoh: Data rekening tidak sesuai nama akun."
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setRejectTarget(null);
                                    setCatatan('');
                                }}
                                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={isSubmitting}
                                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-60"
                            >
                                {isSubmitting ? 'Memproses...' : 'Ya, Tolak'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}