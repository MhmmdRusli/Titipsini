import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Wallet, 
    ChevronRight, 
    CheckCircle2, 
    XCircle, 
    X, 
    AlertTriangle, 
    Clock, 
    ArrowUpRight,
    Building2,
    User,
    Check,
    Ban
} from 'lucide-react';

const TABS = [
    { key: 'pending', label: 'Menunggu' },
    { key: 'selesai', label: 'Selesai' },
    { key: 'ditolak', label: 'Ditolak' },
    { key: 'semua', label: 'Semua' },
];

const STATUS_STYLE = {
    pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    selesai: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    ditolak: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
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
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-emerald-900/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-emerald-950/20">
                    <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-400">
                                <Wallet className="h-5 w-5" />
                                <span className="text-xs font-semibold tracking-wider uppercase">Manajemen Keuangan</span>
                            </div>
                            <h1 className="mt-1 text-2xl font-bold text-white">Penarikan Saldo Mitra</h1>
                            <p className="mt-1 text-xs text-slate-400">
                                Kelola dan verifikasi pengajuan pencairan dana saldo dari vendor/mitra.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300 shadow-lg backdrop-blur-md">
                        <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
                        <div className="text-xs font-medium">{flash.success}</div>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-4 select-none">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => changeTab(tab.key)}
                            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                                activeStatus === tab.key
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500/30'
                                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="select-none border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th className="px-5 py-4 font-bold">Mitra</th>
                                    <th className="px-5 py-4 font-bold">Jumlah Penarikan</th>
                                    <th className="px-5 py-4 font-bold">Rekening Tujuan</th>
                                    <th className="px-5 py-4 font-bold">Tanggal Pengajuan</th>
                                    <th className="px-5 py-4 font-bold">Status</th>
                                    <th className="px-5 py-4 text-right font-bold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                {penarikan.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="select-none px-4 py-16 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mb-3 rounded-full bg-slate-800/80 p-4 text-slate-600">
                                                    <Wallet size={36} />
                                                </div>
                                                <p className="text-sm font-medium text-slate-400">
                                                    Tidak ditemukan data penarikan.
                                                </p>
                                                <p className="text-xs text-slate-600 mt-1">
                                                    Belum ada permintaan penarikan untuk kategori filter ini.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {penarikan.data.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-slate-800/40">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-100">{item.user?.name ?? '-'}</p>
                                            <p className="text-[11px] text-slate-400">{item.user?.email ?? '-'}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="font-bold text-emerald-400 text-sm">
                                                {formatRupiah(item.jumlah)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-300">
                                            <div className="flex items-center gap-1.5 font-medium text-slate-200">
                                                <Building2 size={13} className="text-emerald-400 shrink-0" />
                                                <span>{item.nama_bank}</span>
                                                <span className="text-slate-500">&middot;</span>
                                                <span className="font-mono text-slate-300">{item.nomor_rekening}</span>
                                            </div>
                                            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                                                <User size={11} className="shrink-0" />
                                                <span>a.n. {item.nama_pemilik}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={13} className="text-slate-500" />
                                                {formatDate(item.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 select-none">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                                    STATUS_STYLE[item.status] ?? 'border border-slate-700 bg-slate-800 text-slate-300'
                                                }`}
                                            >
                                                {STATUS_LABEL[item.status] ?? item.status}
                                            </span>
                                            {item.status === 'ditolak' && item.catatan && (
                                                <p className="mt-1.5 text-[11px] italic text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md p-1.5">
                                                    "{item.catatan}"
                                                </p>
                                            )}
                                        </td>
                                        <td className="select-none px-5 py-4 text-right">
                                            {item.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setApproveTarget(item)}
                                                        className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-600 hover:text-white shadow-sm"
                                                    >
                                                        <Check size={14} />
                                                        Setujui
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setRejectTarget(item)}
                                                        className="inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-400 transition-all hover:bg-rose-600 hover:text-white shadow-sm"
                                                        title="Tolak Penarikan"
                                                    >
                                                        <Ban size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-slate-500">
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
                    <div className="flex flex-wrap items-center justify-between gap-3 select-none pt-2">
                        <p className="text-xs text-slate-400">
                            Menampilkan <span className="font-semibold text-slate-200">{penarikan.from}</span> sampai{' '}
                            <span className="font-semibold text-slate-200">{penarikan.to}</span> dari{' '}
                            <span className="font-semibold text-slate-200">{penarikan.total}</span> data
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
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500/30'
                                            : link.url
                                            ? 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                                            : 'cursor-not-allowed border border-slate-800/40 bg-slate-900/20 text-slate-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Approve */}
            {approveTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
                    <div className="w-full max-w-md space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-emerald-950/30">
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <CheckCircle2 size={20} />
                            </div>
                            <button
                                onClick={() => setApproveTarget(null)}
                                className="rounded-xl p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-white">Setujui Penarikan?</h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                                Saldo mitra <span className="font-semibold text-slate-200">{approveTarget.user?.name}</span> akan
                                dipotong sebesar <span className="font-semibold text-emerald-400">{formatRupiah(approveTarget.jumlah)}</span> dan
                                dana ditransfer ke rekening <span className="font-semibold text-slate-200">{approveTarget.nama_bank}</span>.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setApproveTarget(null)}
                                className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleApprove}
                                disabled={isSubmitting}
                                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500 disabled:opacity-60"
                            >
                                {isSubmitting ? 'Memproses...' : 'Ya, Setujui'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Reject */}
            {rejectTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
                    <div className="w-full max-w-md space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-rose-950/30">
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                <AlertTriangle size={20} />
                            </div>
                            <button
                                onClick={() => {
                                    setRejectTarget(null);
                                    setCatatan('');
                                }}
                                className="rounded-xl p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-white">Tolak Penarikan</h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                                Permintaan penarikan <span className="font-semibold text-rose-400">{formatRupiah(rejectTarget.jumlah)}</span> dari{' '}
                                <span className="font-semibold text-slate-200">{rejectTarget.user?.name}</span> akan ditolak.
                            </p>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-300">
                                Catatan penolakan (opsional)
                            </label>
                            <textarea
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                rows={3}
                                placeholder="Contoh: Data rekening tidak sesuai nama akun."
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setRejectTarget(null);
                                    setCatatan('');
                                }}
                                className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={isSubmitting}
                                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-500 disabled:opacity-60"
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