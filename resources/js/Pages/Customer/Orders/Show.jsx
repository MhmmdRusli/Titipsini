import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Package, Truck, MapPin, User, Phone, CreditCard, 
    ArrowLeft, XCircle, X, Check, Clock, AlertTriangle,
    CalendarDays, TicketPercent
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

// Konfigurasi visual untuk setiap status pesanan
const STATUS_CONFIG = {
    baru: {
        label: 'Pesanan Baru',
        badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-100 dark:border-blue-900',
        icon: Clock,
    },
    diproses: {
        label: 'Sedang Diproses',
        badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-100 dark:border-amber-900',
        icon: Package,
    },
    selesai: {
        label: 'Selesai',
        badge: 'bg-green-50 text-[#15803d] dark:bg-green-950/60 dark:text-[#4ade80] border-green-100 dark:border-green-900',
        icon: Check,
    },
    dibatalkan: {
        label: 'Dibatalkan',
        badge: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-100 dark:border-red-900',
        icon: XCircle,
    },
};

const SERVICE_LABEL = {
    barang: 'Titip Barang',
    kendaraan: 'Titip Kendaraan',
    bangunan: 'Sewa Bangunan',
    pindahan: 'Jasa Pindahan',
};

// Tahapan untuk timeline progress
const STEPS = ['baru', 'diproses', 'selesai'];

// Helper untuk format mata uang
function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

// Helper untuk format tanggal
function formatTanggal(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function OrderShow({ order }) {
    const isCancelled = order.status === 'dibatalkan';
    const currentStepIndex = STEPS.indexOf(order.status);
    const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.baru;
    const StatusIcon = statusInfo.icon;

    const [cancelOpen, setCancelOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);

    // Fungsi untuk menangani pembatalan pesanan
    function handleCancel(e) {
        e.preventDefault();
        if (!reason.trim()) return;
        setProcessing(true);
        router.patch(
            `/app/orders/${order.id}/batalkan`,
            { cancel_reason: reason },
            {
                onFinish: () => setProcessing(false),
                onSuccess: () => setCancelOpen(false),
            }
        );
    }

    return (
        /* Title di CustomerLayout dihilangkan agar tidak muncul judul ganda di atas */
        <CustomerLayout>
            <Head title={`Pesanan ${order.order_code} - Titipsini.com`} />

            <div className="mx-auto max-w-lg px-4 py-6 md:py-8">
                {/* Navigasi Back & Judul Utama */}
                <div className="mb-6 flex items-center gap-3">
                    <Link
                        href="/app/orders"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 transition"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Detail Pesanan</h1>
                </div>

                {/* --- KARTU RINGKASAN UTAMA --- */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/90">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Kode Pesanan</p>
                            <p className="text-base font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                                {order.order_code}
                            </p>
                        </div>
                        {/* Badge Status */}
                        <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusInfo.badge}`}>
                            <StatusIcon size={14} className="shrink-0" />
                            {statusInfo.label}
                        </div>
                    </div>

                    {/* Detail Layanan & Lokasi */}
                    <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm dark:border-gray-700/60">
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-[#15803d] dark:bg-green-950/50 dark:text-[#4ade80]">
                                <Package size={16} />
                            </div>
                            <span className="font-semibold">
                                {SERVICE_LABEL[order.service_type] ?? order.service_type}
                            </span>
                            {order.is_pickup && (
                                <span className="ml-auto inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Truck size={13} /> Antar-jemput
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                <MapPin size={16} />
                            </div>
                            <span>{order.city}</span>
                        </div>
                    </div>
                </div>

                {/* --- TOMBOL AKSI CEPAT --- */}
                {order.status === 'baru' && (
                    <div className="mt-4 space-y-3">
                        {/* Tombol Bayar (Warna Hijau Titipsini) */}
                        <Link
                            href={`/app/orders/${order.id}/pembayaran`}
                            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600 transition duration-200 active:scale-[0.98]"
                        >
                            <CreditCard size={18} />
                            Bayar Sekarang
                        </Link>

                        {/* Tombol Batalkan */}
                        <button
                            type="button"
                            onClick={() => setCancelOpen(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/40 transition"
                        >
                            <XCircle size={15} />
                            Batalkan Pesanan
                        </button>
                    </div>
                )}

                {/* --- TIMELINE STATUS (Visual Progress) --- */}
                {!isCancelled && (
                    <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                        <p className="mb-5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            Status Pelacakan
                        </p>
                        <div className="relative flex items-center justify-between">
                            {STEPS.map((step, i) => {
                                const isPassed = i < currentStepIndex;
                                const isCurrent = i === currentStepIndex;

                                return (
                                    <div key={step} className="relative z-10 flex flex-1 flex-col items-center">
                                        {/* Titik Timeline */}
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                                                isPassed
                                                    ? 'border-[#15803d] bg-[#15803d] text-white dark:border-[#22c55e] dark:bg-[#22c55e]'
                                                    : isCurrent
                                                    ? 'border-[#15803d] bg-white text-[#15803d] ring-4 ring-green-100 dark:border-[#22c55e] dark:bg-gray-800 dark:text-[#4ade80] dark:ring-green-950'
                                                    : 'border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-500'
                                            }`}
                                        >
                                            {isPassed ? (
                                                <Check size={16} strokeWidth={3} />
                                            ) : isCurrent ? (
                                                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#15803d] dark:bg-[#4ade80]" />
                                            ) : (
                                                <span className="text-xs font-bold">{i + 1}</span>
                                            )}
                                        </div>
                                        {/* Label Step */}
                                        <span
                                            className={`mt-2 text-[11px] font-semibold capitalize ${
                                                isCurrent
                                                    ? 'text-[#15803d] dark:text-[#4ade80]'
                                                    : isPassed
                                                    ? 'text-gray-800 dark:text-gray-200'
                                                    : 'text-gray-400 dark:text-gray-600'
                                            }`}
                                        >
                                            {step}
                                        </span>

                                        {/* Garis Penghubung */}
                                        {i < STEPS.length - 1 && (
                                            <div
                                                className={`absolute left-[50%] top-4 -z-10 h-0.5 w-full -translate-y-1/2 transition-colors duration-300 ${
                                                    i < currentStepIndex
                                                        ? 'bg-[#15803d] dark:bg-[#22c55e]'
                                                        : 'bg-gray-200 dark:bg-gray-700'
                                                }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* --- DETAIL PEMBATALAN (Jika Dibatalkan) --- */}
                {isCancelled && order.cancel_reason && (
                    <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30 transition-colors">
                        <div className="flex items-center gap-2.5 text-red-700 dark:text-red-400">
                            <AlertTriangle size={18} className="shrink-0" />
                            <p className="text-xs font-bold">Informasi Pembatalan</p>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-red-600 dark:text-red-300">
                            {order.cancel_reason}
                        </p>
                    </div>
                )}

                {/* --- KARTU VENDOR --- */}
                <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/90">
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Vendor</p>
                    
                    {order.partner ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3.5">
                                {/* Avatar (Warna Hijau Titipsini) */}
                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-green-50 text-xl font-bold text-[#15803d] dark:bg-green-950 dark:text-[#4ade80]">
                                    {order.partner.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {order.partner.name}
                                    </p>
                                    {order.partner.phone && (
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <Phone size={12} /> {order.partner.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Tombol Lapor (Hanya muncul jika ada partner) */}
                            <Link
                                href={`/app/orders/${order.id}/lapor`}
                                className="block w-full rounded-lg border border-red-100 bg-red-50 py-2 text-center text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/40 transition"
                            >
                                Laporkan Masalah Vendor
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500 transition-colors">
                            Vendor belum ditugaskan untuk pesanan ini.
                        </div>
                    )}
                </div>

                {/* --- KARTU PEMBAYARAN --- */}
                <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/90">
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Rincian Biaya</p>
                    
                    <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-2">
                                <CalendarDays size={14} className="text-gray-400" /> Waktu Pesanan
                            </span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                {formatTanggal(order.created_at)}
                            </span>
                        </div>
                        {/* Garis pemisah */}
                        <div className="pt-2.5 border-t border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
                            <span className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                <TicketPercent size={16} className="text-[#15803d] dark:text-[#4ade80]" />
                                Total Pembayaran
                            </span>
                            {/* Warna Hijau Titipsini */}
                            <span className="text-lg font-extrabold text-[#15803d] dark:text-[#4ade80]">
                                {formatRupiah(order.total_price)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Link Navigasi Bawah */}
                <Link
                    href="/app/orders"
                    className="mt-6 block w-full rounded-xl border border-gray-200 bg-white py-3 text-center text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/60 transition"
                >
                    Kembali ke Daftar Pesanan
                </Link>
            </div>

            {/* --- MODAL DIALOG PEMBATALAN --- */}
            {cancelOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Konfirmasi Pembatalan
                            </h2>
                            <button
                                type="button"
                                onClick={() => setCancelOpen(false)}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            Mohon beritahu kami alasan Anda membatalkan pesanan ini agar kami dapat meningkatkan layanan.
                        </p>

                        <form onSubmit={handleCancel} className="mt-4">
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                required
                                placeholder="Contoh: Salah pilih tanggal, ingin mengubah jenis layanan, dll."
                                className="w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-800 placeholder-gray-400 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
                            />

                            <div className="mt-4 flex gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setCancelOpen(false)}
                                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition"
                                >
                                    Kembali
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !reason.trim()}
                                    className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/20 hover:bg-red-700 disabled:opacity-50 transition active:scale-[0.98]"
                                >
                                    {processing ? 'Memproses...' : 'Ya, Batalkan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}