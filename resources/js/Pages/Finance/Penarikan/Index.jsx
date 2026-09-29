import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Wallet,
    CheckCircle2,
    X,
    AlertTriangle,
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
    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const cardCls = 'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800';

export default function PenarikanIndex({ penarikan, filter, hasAnyRefundDebt = false, kotaList = [] }) {
    const { flash } = usePage().props;
    const activeStatus = filter?.status ?? 'pending';

    const [approveTarget, setApproveTarget] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [catatan, setCatatan] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [approveError, setApproveError] = useState(null);

    const [kotaFilter, setKotaFilter] = useState(filter?.kota ?? 'all');
    const [dateFilter, setDateFilter] = useState(filter?.date_range ?? 'all');

    useEffect(() => {
        if (!approveError) return;
        const t = setTimeout(() => setApproveError(null), 4000);
        return () => clearTimeout(t);
    }, [approveError]);

    const changeTab = (status) => {
        router.get(
            '/finance/penarikan',
            {
                status: status,
                kota: kotaFilter === 'all' ? null : kotaFilter,
                date_range: dateFilter === 'all' ? null : dateFilter,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
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
                    // Inertia meratakan error validasi Laravel jadi string langsung per field
                    // (bukan array kayak Laravel murni), jadi JANGAN di-index [0] -- itu bakal
                    // ngambil karakter pertama string-nya doang, bukan pesan errornya.
                    const msg =
                        errors?.approve ??
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
            <div className="relative mb-8 overflow-hidden rounded-2xl bg-green-700 p-8 text-white shadow-md">
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
                        <p className="mt-1.5 max-w-xl text-xs text-green-100/90 leading-relaxed">
                            Pantau arus pemasukan, transaksi aktif, dan pencairan dana Titipsini dari seluruh wilayah.
                        </p>
                    </div>

                    {/* Filter Kota & Waktu di Kanan Banner */}
                    <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white backdrop-blur-sm">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-yellow-400" />
                            <select
                                value={kotaFilter}
                                onChange={(e) => {
                                    setKotaFilter(e.target.value);
                                    router.get(
                                        '/finance/penarikan',
                                        {
                                            status: activeStatus,
                                            kota: e.target.value === 'all' ? null : e.target.value,
                                            date_range: dateFilter === 'all' ? null : dateFilter,
                                        },
                                        { preserveState: true, preserveScroll: true, replace: true }
                                    );
                                }}
                                className="w-40 cursor-pointer appearance-none bg-white/15 text-left text-xs font-semibold text-white underline decoration-yellow-400/50 underline-offset-2 outline-none ring-1 ring-white/20 focus:ring-green-400"
                            >
                                <option value="all">Semua Kota</option>
                                {kotaList.map((kota) => (
                                    <option key={kota} value={kota}>{kota}</option>
                                ))}
                            </select>
                        </div>
                        <span className="text-white/30">|</span>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-yellow-400" />
                            <select
                                value={dateFilter}
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                    router.get(
                                        '/finance/penarikan',
                                        {
                                            status: activeStatus,
                                            kota: kotaFilter === 'all' ? null : kotaFilter,
                                            date_range: e.target.value === 'all' ? null : e.target.value,
                                        },
                                        { preserveState: true, preserveScroll: true, replace: true }
                                    );
                                }}
                                className="w-36 cursor-pointer appearance-none bg-white/15 text-left text-xs font-semibold text-white underline decoration-yellow-400/50 underline-offset-2 outline-none ring-1 ring-white/20 focus:ring-green-400"
                            >
                                <option value="all">Semua Waktu</option>
                                <option value="today">Hari Ini</option>
                                <option value="7d">7 Hari Terakhir</option>
                                <option value="30d">30 Hari Terakhir</option>
                                <option value="90d">90 Hari Terakhir</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bulatan Dekorasi Transparan Kanan Hero */}
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/5 border border-white/10"></div>
                <div className="absolute right-20 -bottom-20 h-48 w-48 rounded-full bg-white/5 border border-white/10"></div>
            </div>

            {/* Flash Message */}
            {flash?.success && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900 shadow-sm dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                        <CheckCircle2 size={18} />
                    </div>
                    <div className="flex-1 min-w-0 text-xs font-semibold whitespace-normal break-words">{flash.success}</div>
                </div>
            )}

            {/* Flash Error Message */}
            {flash?.error && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                    <div className="flex-1 min-w-0 text-xs font-semibold whitespace-normal break-words">{flash.error}</div>
                </div>
            )}

            {/* Notification: error ketika penyetujuan gagal (mis. saldo tidak cukup karena refund) */}
            {approveError && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                    <div className="flex-1 min-w-0 text-xs font-semibold whitespace-normal break-words">{approveError}</div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-100 p-1.5 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-wrap gap-1">
                    {TABS.map((tab) => {
                        const isActive = activeStatus === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => changeTab(tab.key)}
                                className={`relative rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-white text-green-800 border border-gray-200 shadow-sm dark:bg-gray-800 dark:text-green-300 dark:border-green-900/40'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5'
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

            {/* Tabel penarikan: tiap kolom punya lebar tetap (w-*), angka pakai
                tabular-nums, dan baris yang punya catatan/ringkasan dapat baris
                detail penuh (colspan) supaya lebar kolom di atasnya gak bergeser. */}
            <div className={cardCls}>
                {penarikan.data.length === 0 ? (
                    <div className="px-6 py-20 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500">
                                <Wallet size={32} />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-gray-800 dark:text-gray-200">Tidak ada pengajuan</h3>
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                Belum ada data penarikan saldo yang sesuai dengan filter ini.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* min-w hanya untuk layar sempit: di desktop tabel tetap w-full dan
                            lebar tiap kolom dibagi proporsional (table-fixed), jadi tidak muncul
                            scroll horizontal yang tidak perlu. */}
                        <table className="w-full min-w-[900px] table-fixed text-left text-xs">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-gray-700 dark:bg-gray-800/60">
                                    <th scope="col" className="w-[22%] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Mitra
                                    </th>
                                    <th scope="col" className="w-[14%] px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Nominal
                                    </th>
                                    <th scope="col" className="w-[20%] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Rekening Tujuan
                                    </th>
                                    <th scope="col" className="w-[13%] px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Utang Refund
                                    </th>
                                    <th scope="col" className="w-[12%] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Pengajuan
                                    </th>
                                    <th scope="col" className="w-[10%] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th scope="col" className="w-[9%] px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/70">
                                {penarikan.data.map((item) => {
                                    const adaCatatan = item.status === 'ditolak' && item.catatan;
                                    const adaRingkasan =
                                        item.status === 'selesai' &&
                                        ((item.utang_refund_dipotong ?? 0) > 0 || (item.jumlah_dikirim ?? 0) > 0);
                                    // Kalau ada baris detail di bawahnya, padding bawah baris utama
                                    // dikecilkan supaya jarak ke kotak detail tetap rapat.
                                    const padY = adaCatatan || adaRingkasan ? 'pt-4 pb-1' : 'py-4';

                                    return [
                                        <tr
                                            key={item.id}
                                            className="align-top transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                                        >
                                            {/* Mitra */}
                                            <td className={`px-5 ${padY}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-green-200/60 bg-green-50 text-sm font-bold uppercase text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300">
                                                        {item.user?.name?.charAt(0) ?? 'M'}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-[13px] font-bold text-gray-900 dark:text-gray-200">
                                                            {item.user?.name ?? '-'}
                                                        </p>
                                                        <p className="truncate text-[11px] text-gray-400 dark:text-gray-500">
                                                            {item.user?.email ?? '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Nominal */}
                                            <td className={`px-4 ${padY} text-right`}>
                                                <p className="text-[13px] font-extrabold tabular-nums text-gray-900 dark:text-gray-100">
                                                    {formatRupiah(item.jumlah)}
                                                </p>
                                            </td>

                                            {/* Rekening */}
                                            <td className={`px-4 ${padY}`}>
                                                <p className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-800 dark:text-gray-200">
                                                    <Building2 size={13} className="shrink-0 text-green-600 dark:text-green-400" />
                                                    <span className="truncate">{item.nama_bank ?? '-'}</span>
                                                </p>
                                                <p className="mt-0.5 truncate font-mono text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
                                                    {item.nomor_rekening ?? '-'}
                                                </p>
                                                <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-gray-400 dark:text-gray-500">
                                                    <User size={11} className="shrink-0" />
                                                    <span className="truncate">a.n. {item.nama_pemilik ?? '-'}</span>
                                                </p>
                                            </td>

                                            {/* Utang refund */}
                                            <td className={`px-4 ${padY} text-right`}>
                                                {(item.utang_refund ?? 0) > 0 ? (
                                                    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-bold tabular-nums text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                                                        <AlertTriangle size={11} />
                                                        {formatRupiah(item.utang_refund)}
                                                    </span>
                                                ) : (item.potensi_utang_refund ?? 0) > 0 ? (
                                                    <span
                                                        className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-bold tabular-nums text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                                                        title="Akan dipotong otomatis saat approve"
                                                    >
                                                        <AlertTriangle size={11} />
                                                        {formatRupiah(item.potensi_utang_refund)}
                                                    </span>
                                                ) : (
                                                    <span className="text-[12px] text-gray-300 dark:text-gray-600">—</span>
                                                )}
                                            </td>

                                            {/* Tanggal */}
                                            <td className={`px-4 ${padY}`}>
                                                <p className="whitespace-nowrap text-[12px] font-medium text-gray-700 dark:text-gray-300">
                                                    {formatDate(item.created_at)}
                                                </p>
                                                {item.status !== 'pending' && item.processed_at && (
                                                    <p className="mt-0.5 whitespace-nowrap text-[11px] text-gray-400 dark:text-gray-500">
                                                        Diproses {formatDate(item.processed_at)}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className={`px-4 ${padY}`}>
                                                {item.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                                                        Menunggu
                                                    </span>
                                                )}
                                                {item.status === 'selesai' && (
                                                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300">
                                                        <CheckCircle2 size={12} />
                                                        Selesai
                                                    </span>
                                                )}
                                                {item.status === 'ditolak' && (
                                                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                                                        <X size={12} />
                                                        Ditolak
                                                    </span>
                                                )}
                                            </td>

                                            {/* Aksi */}
                                            <td className={`px-5 ${padY} text-right`}>
                                                {item.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setApproveTarget(item)}
                                                            className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg border border-green-600 bg-green-700 px-3 text-[11px] font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-95"
                                                        >
                                                            <Check size={13} />
                                                            Setujui
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setRejectTarget(item)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                                            title="Tolak Penarikan"
                                                        >
                                                            <Ban size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-gray-300 dark:text-gray-600">—</span>
                                                )}
                                            </td>
                                        </tr>,

                                        // Baris detail: catatan penolakan / rincian dana yang dikirim.
                                        // colspan penuh supaya tidak menggeser lebar kolom di atasnya.
                                        (adaCatatan || adaRingkasan) && (
                                            <tr key={`${item.id}-detail`} className="bg-gray-50/60 dark:bg-gray-800/40">
                                                <td colSpan={7} className="px-5 pb-4">
                                                    {adaRingkasan && (
                                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 dark:border-gray-700 dark:bg-gray-800">
                                                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                                                Rincian
                                                            </span>
                                                            {(item.utang_refund_dipotong ?? 0) > 0 && (
                                                                <span className="text-[11px] font-semibold tabular-nums text-red-600 dark:text-red-400">
                                                                    Dipotong utang: {formatRupiah(item.utang_refund_dipotong)}
                                                                </span>
                                                            )}
                                                            {(item.jumlah_dikirim ?? 0) > 0 && (
                                                                <span className="text-[11px] font-semibold tabular-nums text-green-600 dark:text-green-400">
                                                                    Dikirim ke rekening: {formatRupiah(item.jumlah_dikirim)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {adaCatatan && (
                                                        <p className="rounded-lg border border-red-200 bg-white px-3.5 py-2.5 text-[11px] italic leading-relaxed text-red-600 dark:border-red-800 dark:bg-gray-800 dark:text-red-300">
                                                            Catatan: {item.catatan}
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    ];
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Container */}
            {penarikan.data.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Menampilkan <span className="font-bold tabular-nums text-gray-800 dark:text-gray-200">{penarikan.from}</span>
                        {' - '}
                        <span className="font-bold tabular-nums text-gray-800 dark:text-gray-200">{penarikan.to}</span> dari total{' '}
                        <span className="font-bold tabular-nums text-gray-800 dark:text-gray-200">{penarikan.total}</span> data
                    </p>
                    <div className="flex flex-wrap items-center gap-1">
                        {penarikan.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                preserveScroll
                                preserveState
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                                    link.active
                                        ? 'border-green-600 bg-green-700 text-white shadow-sm'
                                        : link.url
                                          ? 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                          : 'pointer-events-none border-gray-100 bg-gray-50/50 text-gray-300 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Modal Approve */}
            {approveTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-md">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800">
                                <CheckCircle2 size={24} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setApproveTarget(null)}
                                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">Konfirmasi Persetujuan</h3>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Dana akan dikonfirmasi telah ditransfer ke rekening penerima berikut.
                            </p>
                        </div>

                        <div className="mt-5 space-y-3 rounded-2xl bg-gray-50 p-4 border border-gray-200 text-xs dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex justify-between">
                                <span className="text-gray-400 dark:text-gray-500">Mitra:</span>
                                <span className="font-bold text-gray-800 dark:text-gray-200">{approveTarget.user?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 dark:text-gray-500">Bank & Rekening:</span>
                                <span className="font-bold text-gray-800 dark:text-gray-200">{approveTarget.nama_bank} - {approveTarget.nomor_rekening}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                                <span className="text-gray-400 dark:text-gray-500">Total Pencairan:</span>
                                <span className="text-base font-black text-green-700 dark:text-green-400">{formatRupiah(approveTarget.jumlah)}</span>
                            </div>
                        </div>

                        {(approveTarget.utang_refund ?? 0) > 0 && (
                            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                                <p className="font-bold">Mitra memiliki utang refund</p>
                                <p className="mt-0.5">
                                    Utang refund sebesar <span className="font-semibold">{formatRupiah(approveTarget.utang_refund)}</span> akan dipotong dari saldo mitra.
                                    Pastikan saldo mitra cukup setelah potongan utang.
                                </p>
                                <p className="mt-2 font-bold text-green-700 dark:text-green-400">
                                    Dana yang akan dikirim ke rekening: <span className="text-green-600">{formatRupiah(approveTarget.jumlah - approveTarget.utang_refund)}</span>
                                </p>
                            </div>
                        )}

                        {(approveTarget.potensi_utang_refund ?? 0) > 0 && (approveTarget.utang_refund ?? 0) === 0 && (
                            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                                <p className="font-bold">Ada refund yg akan dipotong dari penarikan ini</p>
                                <p className="mt-0.5">
                                    Refund approve sebesar <span className="font-semibold">{formatRupiah(approveTarget.potensi_utang_refund)}</span> akan dipotong otomatis.
                                </p>
                                <p className="mt-2 font-bold text-green-700 dark:text-green-400">
                                    Dana yang akan dikirim ke rekening: <span className="text-green-600">{formatRupiah(approveTarget.jumlah - approveTarget.potensi_utang_refund)}</span>
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setApproveTarget(null)}
                                className="rounded-xl px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 transition border border-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleApprove}
                                className="rounded-xl bg-green-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-green-800 transition disabled:opacity-50 border border-green-600"
                            >
                                {isSubmitting ? 'Memproses...' : 'Ya, Setujui Sekarang'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Reject */}
            {rejectTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-md">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
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
                                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">Tolak Permintaan</h3>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Berikan alasan penolakan agar mitra dapat memperbaiki pengajuannya.
                            </p>
                        </div>

                        <div className="mt-4 space-y-2 rounded-2xl bg-red-50/50 p-3.5 border border-red-200 text-xs dark:bg-red-950/30 dark:border-red-800">
                            <div className="flex justify-between">
                                <span className="text-red-500 dark:text-red-400">Mitra:</span>
                                <span className="font-bold text-red-800 dark:text-red-300">{rejectTarget.user?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-red-500 dark:text-red-400">Jumlah:</span>
                                <span className="font-bold text-red-800 dark:text-red-300">{formatRupiah(rejectTarget.jumlah)}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300">
                                Alasan Penolakan
                            </label>
                            <textarea
                                rows={3}
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                placeholder="Contoh: Data rekening tidak sesuai / atas nama tidak cocok"
                                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setRejectTarget(null);
                                    setCatatan('');
                                }}
                                className="rounded-xl px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 transition border border-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleReject}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50 border border-red-500"
                            >
                                {isSubmitting ? 'Memproses...' : 'Ya, Tolak Pengajuan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FinanceLayout>
    );
}