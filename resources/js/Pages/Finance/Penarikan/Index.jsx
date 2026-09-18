import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
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
    Sparkles,
    MapPin,
    Calendar,
    AlertCircle,
} from 'lucide-react';
import FinanceLayout from '@/Layouts/FinanceLayout';

const TABS = [
    { key: 'pending', label: 'Menunggu Verifikasi' },
    { key: 'selesai', label: 'Selesai Transaksi' },
    { key: 'ditolak', label: 'Ditolak' },
    { key: 'semua', label: 'Semua Riwayat' },
];

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

const cardCls = 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800';

export default function PenarikanIndex({ penarikan, filter, hasAnyRefundDebt = false }) {
    const { flash } = usePage().props;
    const activeStatus = filter?.status ?? 'pending';

    const [approveTarget, setApproveTarget] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [catatan, setCatatan] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [approveError, setApproveError] = useState(null);

    useEffect(() => {
        if (!approveError) return;
        const t = setTimeout(() => setApproveError(null), 4000);
        return () => clearTimeout(t);
    }, [approveError]);

    const changeTab = (status) => {
        router.get('/finance/penarikan', { status }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleApprove = () => {
        if (!approveTarget) return;
        setIsSubmitting(true);
        router.post(
            `/finance/penarikan/${approveTarget.id}/approve`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => setApproveTarget(null),
                onError: (errors) => {
                    const msg =
                        errors?.approve?.[0] ??
                        errors?.message ??
                        'Gagal menyetujui penarikan.';
                    setApproveError(msg);
                    setApproveTarget(null);
                },
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    const handleReject = () => {
        if (!rejectTarget) return;
        setIsSubmitting(true);
        router.post(
            `/finance/penarikan/${rejectTarget.id}/reject`,
            { catatan },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejectTarget(null);
                    setCatatan('');
                },
                onError: () => setRejectTarget(null),
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <FinanceLayout>
            <Head title="Penarikan Saldo" />

            {/* Header Hero Banner (Sesuai Gambar) */}
            <div className="relative mb-8 overflow-hidden rounded-2xl bg-[#087847] p-8 text-white shadow-md">
                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        {/* Badge Pill Khusus di Kiri Atas */}
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-400/40 bg-yellow-500/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-yellow-300">
                            <Sparkles size={12} className="text-yellow-400" />
                            <span>FINANCE DASHBOARD</span>
                        </div>
                        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Penarikan Saldo
                        </h1>
                        <p className="mt-1.5 max-w-xl text-xs text-emerald-100/90 leading-relaxed">
                            Pantau arus pemasukan, transaksi aktif, dan pencairan dana Titipsini dari seluruh wilayah.
                        </p>
                    </div>

                    {/* Filter Capsule di Kanan Banner */}
                    <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-yellow-400" />
                            <span>Semua Kota</span>
                        </div>
                        <span className="text-white/30">|</span>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-yellow-400" />
                            <span>Semua Waktu</span>
                        </div>
                    </div>
                </div>

                {/* Bulatan Dekorasi Transparan Kanan Hero */}
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/5 border border-white/10"></div>
                <div className="absolute right-20 -bottom-20 h-48 w-48 rounded-full bg-white/5 border border-white/10"></div>
            </div>

            {/* Flash Message */}
            {flash?.success && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <CheckCircle2 size={18} />
                    </div>
                    <div className="text-xs font-semibold">{flash.success}</div>
                </div>
            )}

            {/* Notification: error ketika penyetujuan gagal (mis. saldo tidak cukup karena refund) */}
            {approveError && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                    <AlertTriangle size={18} className="shrink-0 text-red-600 dark:text-red-400" />
                    <div className="text-xs font-semibold">{approveError}</div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-100 p-1.5 border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-wrap gap-1">
                    {TABS.map((tab) => {
                        const isActive = activeStatus === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => changeTab(tab.key)}
                                className={`relative rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-white text-emerald-800 border border-slate-200 shadow-sm dark:bg-gray-800 dark:text-emerald-300 dark:border-green-900/40'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {(() => {
                if (!hasAnyRefundDebt) return null;
                return (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                        <p className="font-bold">Perhatian: Ada mitra yang memiliki utang refund</p>
                        <p className="mt-0.5">
                            Saat ini ada pengajuan penarikan yang menunggu verifikasi dari mitra yang memiliki utang refund.
                            Pastikan utang refund dipotong dari jumlah penarikan sebelum disetujui.
                        </p>
                    </div>
                );
            })()}

            {/* Main Table Card */}
            <div className={cardCls}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-400">
                                <th className="px-6 py-4">Informasi Mitra</th>
                                <th className="px-6 py-4">Nominal</th>
                                <th className="px-6 py-4">Rekening Tujuan</th>
                                <th className="px-6 py-4">Waktu Pengajuan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Utang Refund</th>
                                <th className="px-6 py-4 text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-gray-700/60">
                            {penarikan.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 dark:bg-gray-700 dark:text-slate-500 dark:border-gray-600">
                                                <Wallet size={32} />
                                            </div>
                                            <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">Tidak ada pengajuan</h3>
                                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                Belum ada data penarikan saldo yang sesuai dengan filter ini.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {penarikan.data.map((item) => (
                                <tr key={item.id} className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-gray-700/40">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                                                {item.user?.name?.charAt(0) ?? 'M'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors dark:text-slate-200 dark:group-hover:text-emerald-400">
                                                    {item.user?.name ?? '-'}
                                                </p>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500">{item.user?.email ?? '-'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-slate-900 text-base dark:text-slate-200">
                                            {formatRupiah(item.jumlah)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-gray-600 dark:bg-gray-700">
                                            <div className="flex items-center gap-2 font-semibold text-xs text-slate-800 dark:text-slate-200">
                                                <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                                                <span>{item.nama_bank}</span>
                                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                                <span className="font-mono text-slate-600 dark:text-slate-400">{item.nomor_rekening}</span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                                                <User size={12} />
                                                <span>a.n. {item.nama_pemilik}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium dark:text-slate-400">
                                            <Clock size={14} className="text-slate-400 dark:text-slate-500" />
                                            {formatDate(item.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                Menunggu
                                            </span>
                                        )}
                                        {item.status === 'selesai' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                                                <CheckCircle2 size={12} />
                                                Selesai
                                            </span>
                                        )}
                                        {item.status === 'ditolak' && (
                                            <div>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800">
                                                    <X size={12} />
                                                    Ditolak
                                                </span>
                                                {item.catatan && (
                                                    <p className="mt-1.5 max-w-xs text-[11px] italic text-red-500 dark:text-red-400 line-clamp-1" title={item.catatan}>
                                                        "{item.catatan}"
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(item.utang_refund ?? 0) > 0 ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800">
                                                <AlertTriangle size={12} />
                                                Rp {formatRupiah(item.utang_refund)}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {item.status === 'pending' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setApproveTarget(item)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#087847] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-800 active:scale-95 border border-emerald-600"
                                                >
                                                    <Check size={14} />
                                                    Setujui
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setRejectTarget(item)}
                                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-slate-300"
                                                    title="Tolak Penarikan"
                                                >
                                                    <Ban size={15} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                                Selesai {formatDate(item.processed_at)}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Container */}
            {penarikan.data.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Menampilkan <span className="font-bold text-slate-800 dark:text-slate-200">{penarikan.from}</span> -{' '}
                        <span className="font-bold text-slate-800 dark:text-slate-200">{penarikan.to}</span> dari Total{' '}
                        <span className="font-bold text-slate-800 dark:text-slate-200">{penarikan.total}</span> Data
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {penarikan.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                preserveScroll
                                preserveState
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
                                    link.active
                                        ? 'bg-[#087847] text-white border-emerald-600 shadow-sm'
                                        : link.url
                                        ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-gray-700 dark:text-slate-300 dark:border-gray-600 dark:hover:bg-gray-600'
                                        : 'cursor-not-allowed text-slate-300 border-slate-100 bg-slate-50/50 dark:text-slate-600 dark:border-gray-600 dark:bg-gray-700'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Modal Approve */}
            {approveTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                                <CheckCircle2 size={24} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setApproveTarget(null)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition dark:text-slate-500 dark:hover:bg-gray-700 dark:hover:text-slate-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Konfirmasi Persetujuan</h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Dana akan dikonfirmasi telah ditransfer ke rekening penerima berikut.
                            </p>
                        </div>

                        <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs dark:bg-gray-700 dark:border-gray-600">
                            <div className="flex justify-between">
                                <span className="text-slate-400 dark:text-slate-500">Mitra:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{approveTarget.user?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 dark:text-slate-500">Bank & Rekening:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{approveTarget.nama_bank} - {approveTarget.nomor_rekening}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-3 dark:border-gray-600">
                                <span className="text-slate-400 dark:text-slate-500">Total Pencairan:</span>
                                <span className="text-base font-black text-emerald-700 dark:text-emerald-400">{formatRupiah(approveTarget.jumlah)}</span>
                            </div>
                        </div>

                        {(approveTarget.utang_refund ?? 0) > 0 && (
                            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                                <p className="font-bold">Mitra memiliki utang refund</p>
                                <p className="mt-0.5">
                                    Utang refund sebesar <span className="font-semibold">{formatRupiah(approveTarget.utang_refund)}</span> akan dipotong dari saldo mitra.
                                    Pastikan saldo mitra cukup setelah potongan utang.
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setApproveTarget(null)}
                                className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition border border-slate-200 dark:text-slate-400 dark:hover:bg-gray-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleApprove}
                                className="rounded-xl bg-[#087847] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition disabled:opacity-50 border border-emerald-600"
                            >
                                {isSubmitting ? 'Memproses...' : 'Ya, Setujui Sekarang'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Reject */}
            {rejectTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800">
                                <AlertTriangle size={24} />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setRejectTarget(null);
                                    setCatatan('');
                                }}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition dark:text-slate-500 dark:hover:bg-gray-700 dark:hover:text-slate-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Tolak Permintaan</h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Berikan alasan penolakan agar mitra dapat memperbaiki pengajuannya.
                            </p>
                        </div>

                        <div className="mt-4 space-y-2 rounded-2xl bg-red-50/50 p-3.5 border border-red-200 text-xs dark:bg-red-950/30 dark:border-red-800">
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Mitra:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{rejectTarget.user?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Nominal:</span>
                                <span className="font-bold text-red-700 dark:text-red-300">{formatRupiah(rejectTarget.jumlah)}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Catatan Penolakan
                            </label>
                            <textarea
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                rows={3}
                                placeholder="Tuliskan alasan penolakan di sini..."
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition dark:bg-gray-700 dark:border-gray-600 dark:text-slate-200 dark:placeholder-slate-500"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setRejectTarget(null);
                                    setCatatan('');
                                }}
                                className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition border border-slate-200 dark:text-slate-400 dark:hover:bg-gray-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleReject}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50 border border-red-600"
                            >
                                {isSubmitting ? 'Memproses...' : 'Tolak Penarikan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FinanceLayout>
    );
}
