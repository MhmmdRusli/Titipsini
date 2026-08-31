import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
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

export default function PenarikanIndex({ penarikan, filter }) {
    const { flash } = usePage().props;
    const activeStatus = filter?.status ?? 'pending';

    const [approveTarget, setApproveTarget] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [catatan, setCatatan] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <CheckCircle2 size={18} />
                    </div>
                    <div className="text-xs font-semibold">{flash.success}</div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
                <div className="flex flex-wrap gap-1">
                    {TABS.map((tab) => {
                        const isActive = activeStatus === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => changeTab(tab.key)}
                                className={`relative rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-white text-emerald-800 border border-slate-200 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Table Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-4">Informasi Mitra</th>
                                <th className="px-6 py-4">Nominal</th>
                                <th className="px-6 py-4">Rekening Tujuan</th>
                                <th className="px-6 py-4">Waktu Pengajuan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {penarikan.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-200">
                                                <Wallet size={32} />
                                            </div>
                                            <h3 className="mt-4 text-base font-bold text-slate-800">Tidak ada pengajuan</h3>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Belum ada data penarikan saldo yang sesuai dengan filter ini.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {penarikan.data.map((item) => (
                                <tr key={item.id} className="group transition-colors hover:bg-slate-50/80">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-200/50">
                                                {item.user?.name?.charAt(0) ?? 'M'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                    {item.user?.name ?? '-'}
                                                </p>
                                                <p className="text-[11px] text-slate-400">{item.user?.email ?? '-'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-slate-900 text-base">
                                            {formatRupiah(item.jumlah)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                                            <div className="flex items-center gap-2 font-semibold text-xs text-slate-800">
                                                <Building2 size={14} className="text-emerald-600" />
                                                <span>{item.nama_bank}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="font-mono text-slate-600">{item.nomor_rekening}</span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                                                <User size={12} />
                                                <span>a.n. {item.nama_pemilik}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                            <Clock size={14} className="text-slate-400" />
                                            {formatDate(item.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                Menunggu
                                            </span>
                                        )}
                                        {item.status === 'selesai' && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                                                <CheckCircle2 size={12} />
                                                Selesai
                                            </span>
                                        )}
                                        {item.status === 'ditolak' && (
                                            <div>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
                                                    <X size={12} />
                                                    Ditolak
                                                </span>
                                                {item.catatan && (
                                                    <p className="mt-1.5 max-w-xs text-[11px] italic text-red-500 line-clamp-1" title={item.catatan}>
                                                        "{item.catatan}"
                                                    </p>
                                                )}
                                            </div>
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
                                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                                                    title="Tolak Penarikan"
                                                >
                                                    <Ban size={15} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] font-medium text-slate-400">
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
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
                    <p className="text-xs font-medium text-slate-500">
                        Menampilkan <span className="font-bold text-slate-800">{penarikan.from}</span> -{' '}
                        <span className="font-bold text-slate-800">{penarikan.to}</span> dari Total{' '}
                        <span className="font-bold text-slate-800">{penarikan.total}</span> Data
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
                                        ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                                        : 'cursor-not-allowed text-slate-300 border-slate-100'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Modal Approve */}
            {approveTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 size={24} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setApproveTarget(null)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-extrabold text-slate-900">Konfirmasi Persetujuan</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Dana akan dikonfirmasi telah ditransfer ke rekening penerima berikut.
                            </p>
                        </div>

                        <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Mitra:</span>
                                <span className="font-bold text-slate-800">{approveTarget.user?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Bank & Rekening:</span>
                                <span className="font-bold text-slate-800">{approveTarget.nama_bank} - {approveTarget.nomor_rekening}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-3">
                                <span className="text-slate-400">Total Pencairan:</span>
                                <span className="text-base font-black text-emerald-700">{formatRupiah(approveTarget.jumlah)}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setApproveTarget(null)}
                                className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition border border-slate-200"
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
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 border border-red-200">
                                <AlertTriangle size={24} />
                            </div>
                            <button
                                type="button"
                                onClick={() => { setRejectTarget(null); setCatatan(''); }}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-extrabold text-slate-900">Tolak Permintaan</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Berikan alasan penolakan agar mitra dapat memperbaiki pengajuannya.
                            </p>
                        </div>

                        <div className="mt-4 space-y-2 rounded-2xl bg-red-50/50 p-3.5 border border-red-200 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Mitra:</span>
                                <span className="font-bold text-slate-800">{rejectTarget.user?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Nominal:</span>
                                <span className="font-bold text-red-700">{formatRupiah(rejectTarget.jumlah)}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="mb-2 block text-xs font-bold text-slate-700">
                                Catatan Penolakan
                            </label>
                            <textarea
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                rows={3}
                                placeholder="Tuliskan alasan penolakan di sini..."
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => { setRejectTarget(null); setCatatan(''); }}
                                className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition border border-slate-200"
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