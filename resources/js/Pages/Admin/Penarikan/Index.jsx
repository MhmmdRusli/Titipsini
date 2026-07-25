import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Wallet,
    CheckCircle2,
    X,
    AlertTriangle,
    Clock,
    Building2,
    User,
    Check,
    Ban,
} from 'lucide-react';

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

            <p className="mb-5 text-sm text-gray-500">
                Kelola dan verifikasi pengajuan pencairan dana saldo dari vendor/mitra.
            </p>

            {flash?.success && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <div className="text-xs font-medium">{flash.success}</div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="mb-5 flex flex-wrap gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => changeTab(tab.key)}
                        className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                            activeStatus === tab.key
                                ? 'bg-green-700 text-white shadow-sm'
                                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="select-none border-b border-gray-200 bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-5 py-3 font-bold">Mitra</th>
                                <th className="px-5 py-3 font-bold">Jumlah Penarikan</th>
                                <th className="px-5 py-3 font-bold">Rekening Tujuan</th>
                                <th className="px-5 py-3 font-bold">Tanggal Pengajuan</th>
                                <th className="px-5 py-3 font-bold">Status</th>
                                <th className="px-5 py-3 text-right font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {penarikan.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="select-none px-4 py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Wallet size={32} className="mb-2 text-gray-300" />
                                            <p className="text-sm font-medium text-gray-500">
                                                Tidak ditemukan data penarikan.
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Belum ada permintaan penarikan untuk kategori filter ini.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {penarikan.data.map((item) => (
                                <tr key={item.id} className="transition-colors hover:bg-gray-50/60">
                                    <td className="px-5 py-3.5">
                                        <p className="font-semibold text-gray-900">{item.user?.name ?? '-'}</p>
                                        <p className="text-[11px] text-gray-500">{item.user?.email ?? '-'}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-sm font-bold text-green-700">
                                            {formatRupiah(item.jumlah)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600">
                                        <div className="flex items-center gap-1.5 font-medium text-gray-800">
                                            <Building2 size={13} className="shrink-0 text-green-700" />
                                            <span>{item.nama_bank}</span>
                                            <span className="text-gray-300">&middot;</span>
                                            <span className="font-mono text-gray-600">{item.nomor_rekening}</span>
                                        </div>
                                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
                                            <User size={11} className="shrink-0" />
                                            <span>a.n. {item.nama_pemilik}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={13} className="text-gray-400" />
                                            {formatDate(item.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 select-none">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                STATUS_STYLE[item.status] ?? 'border border-gray-200 bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {STATUS_LABEL[item.status] ?? item.status}
                                        </span>
                                        {item.status === 'ditolak' && item.catatan && (
                                            <p className="mt-1.5 rounded-md border border-red-100 bg-red-50 p-1.5 text-[11px] italic text-red-600">
                                                "{item.catatan}"
                                            </p>
                                        )}
                                    </td>
                                    <td className="select-none px-5 py-3.5 text-right">
                                        {item.status === 'pending' ? (
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setApproveTarget(item)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                                                >
                                                    <Check size={14} />
                                                    Setujui
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setRejectTarget(item)}
                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                    title="Tolak Penarikan"
                                                >
                                                    <Ban size={15} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] text-gray-400">
                                                Diproses {formatDate(item.processed_at)}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {penarikan.data.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 select-none">
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

            {/* Modal Approve */}
            {approveTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <CheckCircle2 size={20} />
                            </div>
                            <button
                                onClick={() => setApproveTarget(null)}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <h3 className="text-base font-semibold text-gray-900">Setujui Penarikan?</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                            Saldo mitra <span className="font-semibold text-gray-800">{approveTarget.user?.name}</span> akan
                            dipotong sebesar <span className="font-semibold text-emerald-600">{formatRupiah(approveTarget.jumlah)}</span> dan
                            dana ditransfer ke rekening <span className="font-semibold text-gray-800">{approveTarget.nama_bank}</span>.
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setApproveTarget(null)}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleApprove}
                                disabled={isSubmitting}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {isSubmitting ? 'Memproses...' : 'Ya, Setujui'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Reject */}
            {rejectTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                                <AlertTriangle size={20} />
                            </div>
                            <button
                                onClick={() => {
                                    setRejectTarget(null);
                                    setCatatan('');
                                }}
                                className="text-gray-400 transition hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <h3 className="text-base font-semibold text-gray-900">Tolak Penarikan</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                            Permintaan penarikan <span className="font-semibold text-red-600">{formatRupiah(rejectTarget.jumlah)}</span> dari{' '}
                            <span className="font-semibold text-gray-800">{rejectTarget.user?.name}</span> akan ditolak.
                        </p>

                        <div className="mt-4">
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                Catatan penolakan (opsional)
                            </label>
                            <textarea
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                rows={3}
                                placeholder="Contoh: Data rekening tidak sesuai nama akun."
                                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setRejectTarget(null);
                                    setCatatan('');
                                }}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={isSubmitting}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
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