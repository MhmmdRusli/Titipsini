import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ShieldCheck, Truck, XCircle, X, Clock, AlertTriangle,
    QrCode, WalletMinimal, Upload, CheckCircle2, ArrowLeft, FileText,
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

/**
 * Tampilan status di baris "Status" paling atas invoice.
 * Teks & warna disamakan dengan 4 varian invoice fisik yang dipakai
 * sebagai acuan desain (Menunggu Pembayaran / Sedang di titipkan /
 * Pesanan Selesai / Pesanan di batalkan).
 */
const STATUS_CONFIG = {
    baru: {
        label: 'Menunggu Pembayaran',
        color: 'text-blue-600 dark:text-blue-400',
        icon: Clock,
    },
    diproses: {
        label: 'Sedang di titipkan',
        color: 'text-cyan-600 dark:text-cyan-400',
        icon: Clock,
    },
    selesai: {
        label: 'Pesanan Selesai',
        color: 'text-[#15803d] dark:text-[#4ade80]',
        icon: CheckCircle2,
    },
    dibatalkan: {
        label: 'Pesanan di batalkan',
        color: 'text-red-600 dark:text-red-400',
        icon: XCircle,
    },
};

const SERVICE_LABEL = {
    barang: 'Titip Barang',
    kendaraan: 'Titip Kendaraan',
    bangunan: 'Sewa Bangunan',
    pindahan: 'Jasa Pindahan',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function formatTanggalPendek(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function formatTanggalJam(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Baris label : value dipakai berulang kali di seksi "Diterbitkan Atas
// Nama", "Untuk", dan "Detail Pesanan" - disamakan lewat 1 komponen kecil
// supaya lebar kolom label & spacing selalu konsisten.
function InfoRow({ label, value }) {
    return (
        <div className="grid grid-cols-12 gap-2 text-xs">
            <span className="col-span-5 text-gray-500 dark:text-gray-400">{label}</span>
            <span className="col-span-7 font-medium text-gray-800 dark:text-gray-200">{value ?? '-'}</span>
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            {children}
        </p>
    );
}

export default function OrderShow({ order, qris_url }) {
    const { errors } = usePage().props;
    const isCancelled = order.status === 'dibatalkan';
    const isBelumBayar = order.status === 'baru';
    const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.baru;
    const StatusIcon = statusInfo.icon;
    const adaDenda = Number(order.denda) > 0;

    const [cancelOpen, setCancelOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [payingDenda, setPayingDenda] = useState(false);
    const [showQrisDenda, setShowQrisDenda] = useState(false);
    const [dendaFile, setDendaFile] = useState(null);
    const [dendaPreview, setDendaPreview] = useState(null);
    const [uploadingDenda, setUploadingDenda] = useState(false);

    function bayarDenda() {
        setPayingDenda(true);
        router.post(
            `/app/orders/${order.id}/bayar-denda`,
            {},
            { preserveScroll: true, onFinish: () => setPayingDenda(false) }
        );
    }

    function handleDendaFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setDendaFile(file);
        setDendaPreview(URL.createObjectURL(file));
    }

    function uploadBuktiDenda(e) {
        e.preventDefault();
        if (!dendaFile) return;
        setUploadingDenda(true);
        router.post(
            `/app/orders/${order.id}/upload-bukti-denda`,
            { denda_receipt: dendaFile },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setUploadingDenda(false),
                onSuccess: () => {
                    setShowQrisDenda(false);
                    setDendaFile(null);
                    setDendaPreview(null);
                },
            }
        );
    }

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

    const namaBarang = order.item_name ?? '-';
    const durasi = order.duration ?? (order.start_date && order.end_date
        ? `${Math.max(1, Math.round((new Date(order.end_date) - new Date(order.start_date)) / 86400000))} hari`
        : '-');
    const biayaLayanan = order.service_fee ?? (order.subtotal ? Math.round(order.subtotal * 0.1) : 0);
    const statusPembayaran = order.payment_verified_at
        ? 'Berhasil'
        : order.payment_receipt
        ? 'Menunggu Verifikasi'
        : 'Belum Dibayar';

    return (
        <CustomerLayout>
            <Head title={`Pesanan ${order.order_code} - Titipsini.com`} />

            <div className="mx-auto max-w-lg px-4 py-6 md:py-8">
                {/* Navigasi Back */}
                <div className="mb-5 flex items-center gap-3">
                    <Link
                        href="/app/orders"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 transition"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Rincian Pesanan</h1>
                </div>

                {/* ================= KARTU INVOICE ================= */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800/90">
                    {/* Header hijau: logo brand + tanggal & ID pesanan */}
                    <div className="flex items-center justify-between gap-3 bg-[#15803d] px-5 py-4 dark:bg-[#0f5c2c]">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                                <ShieldCheck size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-extrabold leading-tight text-white">Titipsini&nbsp;•&nbsp;Com</p>
                                <p className="text-[10px] leading-tight text-green-100">Titip Aman, Hidup Tenang</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] font-medium text-green-100">{formatTanggalPendek(order.created_at)}</p>
                            <p className="text-[11px] font-semibold text-white">ID Pesanan: {order.order_code}</p>
                        </div>
                    </div>

                    <div className="space-y-5 px-5 py-5">
                        {/* Status */}
                        <div className="flex items-start justify-between gap-3 border-b border-dashed border-gray-200 pb-4 dark:border-gray-700">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</span>
                            <div className="text-right">
                                <span className={`inline-flex items-center gap-1 text-xs font-bold ${statusInfo.color}`}>
                                    <StatusIcon size={13} />
                                    {statusInfo.label}
                                </span>
                                {isBelumBayar && (
                                    <p className="mt-0.5 text-[10px] text-gray-400">Selesaikan pembayaran sebelum batas waktu</p>
                                )}
                            </div>
                        </div>

                        {/* Diterbitkan Atas Nama */}
                        <div className="space-y-2">
                            <SectionTitle>Diterbitkan Atas Nama</SectionTitle>
                            <InfoRow label="Mitra" value={order.partner?.name ?? '-'} />
                        </div>

                        {/* Untuk (data customer) */}
                        <div className="space-y-2">
                            <SectionTitle>Untuk</SectionTitle>
                            <InfoRow label="Customer" value={order.customer?.name} />
                            <InfoRow label="Nomor Telepon" value={order.customer?.phone} />
                            <InfoRow label="Alamat Lengkap" value={order.customer?.address ?? order.city} />
                        </div>

                        {/* Detail Pesanan */}
                        <div className="space-y-2">
                            <SectionTitle>Detail Pesanan</SectionTitle>
                            <InfoRow label="Barang" value={namaBarang} />
                            <InfoRow label="Layanan" value={SERVICE_LABEL[order.service_type] ?? order.service_type} />
                            <InfoRow label="Tanggal Masuk" value={formatTanggalPendek(order.start_date)} />
                            <InfoRow label="Tanggal Keluar" value={formatTanggalPendek(order.end_date)} />
                            <InfoRow label="Durasi Waktu" value={durasi} />
                            <InfoRow label="Layanan Pick Up" value={order.is_pickup ? 'Ya' : 'Tidak'} />
                            {order.is_pickup && (
                                <InfoRow
                                    label="Jam Pick Up"
                                    value={
                                        <span className="inline-flex items-center gap-1">
                                            <Truck size={12} className="shrink-0 text-gray-400" />
                                            {order.pickup_time ?? '-'}
                                        </span>
                                    }
                                />
                            )}
                        </div>

                        {/* Box Total Pembayaran (rincian nilai barang) */}
                        <div className="rounded-xl bg-gray-50 p-3.5 dark:bg-gray-900/50">
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Total Pembayaran
                            </p>
                            <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
                                <span>Nilai Harga</span>
                                <span className="font-semibold">{formatRupiah(order.subtotal ?? order.total_price)}</span>
                            </div>
                            <div className="mt-1 flex justify-between text-xs text-gray-700 dark:text-gray-300">
                                <span>Durasi Penitipan</span>
                                <span className="font-semibold">{durasi}</span>
                            </div>
                        </div>

                        {/* Box Total Harga (biaya tambahan) */}
                        <div className="rounded-xl bg-gray-50 p-3.5 dark:bg-gray-900/50">
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Total Harga
                            </p>
                            {order.is_pickup && (
                                <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
                                    <span>Biaya Pick Up</span>
                                    <span className="font-semibold">{formatRupiah(order.pickup_fee)}</span>
                                </div>
                            )}
                            <div className="mt-1 flex justify-between text-xs text-gray-700 dark:text-gray-300">
                                <span>Biaya Layanan 10%</span>
                                <span className="font-semibold">{formatRupiah(biayaLayanan)}</span>
                            </div>
                            {adaDenda && (
                                <div className="mt-1 flex justify-between text-xs text-amber-600 dark:text-amber-400">
                                    <span>Denda Keterlambatan</span>
                                    <span className="font-semibold">+{formatRupiah(order.denda)}</span>
                                </div>
                            )}
                        </div>

                        {/* Grand Total */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700/60">
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Total Pembayaran</span>
                            <span className="text-lg font-extrabold text-[#15803d] dark:text-[#4ade80]">
                                {formatRupiah(order.total_price)}
                            </span>
                        </div>

                        {/* Metode Pembayaran */}
                        <div className="space-y-2 border-t border-dashed border-gray-200 pt-4 dark:border-gray-700">
                            <SectionTitle>Metode Pembayaran</SectionTitle>
                            <p className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">
                                {order.payment_method && order.payment_method !== 'pending'
                                    ? order.payment_method
                                    : 'Belum dipilih'}
                            </p>
                        </div>

                        {/* Bukti Transaksi */}
                        {order.payment_receipt && (
                            <div className="space-y-2">
                                <SectionTitle>Bukti Transaksi</SectionTitle>
                                <a
                                    href={order.payment_receipt_url ?? order.payment_receipt}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 underline underline-offset-2 dark:text-blue-400"
                                >
                                    <FileText size={13} className="shrink-0" />
                                    Lihat bukti pembayaran
                                </a>
                            </div>
                        )}

                        {/* Status Pembayaran */}
                        <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 dark:border-gray-700">
                            <SectionTitle>Status Pembayaran</SectionTitle>
                            <span
                                className={`text-xs font-bold ${
                                    statusPembayaran === 'Berhasil'
                                        ? 'text-[#15803d] dark:text-[#4ade80]'
                                        : statusPembayaran === 'Menunggu Verifikasi'
                                        ? 'text-amber-600 dark:text-amber-400'
                                        : 'text-red-500 dark:text-red-400'
                                }`}
                            >
                                {statusPembayaran}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ================= INFO DENDA ================= */}
                {adaDenda && (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                        <div className="flex items-start gap-2.5">
                            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                                    Ada Denda Keterlambatan
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-amber-700/90 dark:text-amber-300/80">
                                    {order.denda_paid_at
                                        ? 'Denda keterlambatan berikut sudah kamu bayar. Terima kasih.'
                                        : order.bukti_denda
                                        ? 'Bukti pembayaran denda sudah diunggah, menunggu verifikasi mitra.'
                                        : 'Pesanan ini melewati batas waktu yang disepakati, sehingga dikenakan denda keterlambatan berikut.'}
                                </p>
                                <p className="mt-2 text-lg font-extrabold text-amber-800 dark:text-amber-300">
                                    +{formatRupiah(order.denda)}
                                </p>

                                {order.denda_paid_at ? (
                                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                        <CheckCircle2 size={14} /> Lunas pada {order.denda_paid_at}
                                    </p>
                                ) : order.bukti_denda ? (
                                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                                        <Clock size={14} /> Menunggu verifikasi mitra
                                    </p>
                                ) : (
                                    <>
                                        {errors?.saldo_denda && (
                                            <div className="mt-2 rounded-lg bg-red-50 p-2.5 dark:bg-red-950/30">
                                                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                                    {errors.saldo_denda}
                                                </p>
                                                <Link
                                                    href="/app/saldo/topup"
                                                    className="mt-1 inline-block text-xs font-bold text-red-700 underline dark:text-red-300"
                                                >
                                                    Top Up Saldo Sekarang &rarr;
                                                </Link>
                                            </div>
                                        )}

                                        {!showQrisDenda ? (
                                            <div className="mt-3 flex flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={bayarDenda}
                                                    disabled={payingDenda}
                                                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-60"
                                                >
                                                    <WalletMinimal size={16} />
                                                    {payingDenda ? 'Memproses...' : 'Bayar dengan Saldo'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowQrisDenda(true)}
                                                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-white py-2.5 text-sm font-bold text-amber-700 shadow-sm transition hover:bg-amber-50 dark:border-amber-800 dark:bg-transparent dark:text-amber-300 dark:hover:bg-amber-950/40"
                                                >
                                                    <QrCode size={16} />
                                                    Bayar via QRIS
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="mt-3 rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-800 dark:bg-gray-900">
                                                {qris_url ? (
                                                    <img
                                                        src={qris_url}
                                                        alt="QRIS Pembayaran Denda"
                                                        className="mx-auto h-40 w-40 rounded-lg border border-gray-200 object-contain dark:border-gray-700"
                                                    />
                                                ) : (
                                                    <p className="text-center text-xs italic text-gray-400">QRIS belum tersedia.</p>
                                                )}

                                                <form onSubmit={uploadBuktiDenda} className="mt-3 space-y-2">
                                                    <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 dark:border-gray-700">
                                                        {dendaPreview ? (
                                                            <img src={dendaPreview} alt="Preview" className="max-h-28 rounded" />
                                                        ) : (
                                                            <>
                                                                <Upload size={20} className="text-gray-400" />
                                                                <span className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                                                    Unggah bukti transfer
                                                                </span>
                                                            </>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleDendaFileChange}
                                                            className="absolute inset-0 cursor-pointer opacity-0"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowQrisDenda(false)}
                                                            className="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
                                                        >
                                                            Batal
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={!dendaFile || uploadingDenda}
                                                            className="flex-1 rounded-lg bg-amber-600 py-2 text-xs font-bold text-white disabled:opacity-50"
                                                        >
                                                            {uploadingDenda ? 'Mengunggah...' : 'Kirim Bukti'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= DETAIL PEMBATALAN ================= */}
                {isCancelled && order.cancel_reason && (
                    <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
                        <div className="flex items-center gap-2.5 text-red-700 dark:text-red-400">
                            <AlertTriangle size={18} className="shrink-0" />
                            <p className="text-xs font-bold">Alasan dibatalkan</p>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-red-600 dark:text-red-300">
                            {order.cancel_reason}
                        </p>
                    </div>
                )}

                {/* ================= LAPOR MASALAH VENDOR ================= */}
                {order.partner && order.status === 'selesai' && (
                    <Link
                        href={`/app/orders/${order.id}/lapor`}
                        className="mt-4 block w-full rounded-xl border border-red-100 bg-red-50 py-2.5 text-center text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/40 transition"
                    >
                        Laporkan Masalah Vendor
                    </Link>
                )}

                {/* ================= TOMBOL AKSI ================= */}
                {isBelumBayar && (
                    <div className="mt-5 space-y-3">
                        <button
                            type="button"
                            onClick={() => setCancelOpen(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-white py-3 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30 transition"
                        >
                            Batalkan Pesanan
                        </button>
                        <Link
                            href={`/app/orders/${order.id}/pembayaran`}
                            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600 transition duration-200 active:scale-[0.98]"
                        >
                            Bayar Sekarang
                        </Link>
                    </div>
                )}

                <Link
                    href="/app/orders"
                    className="mt-6 block w-full rounded-xl border border-gray-200 bg-white py-3 text-center text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/60 transition"
                >
                    Kembali ke Daftar Pesanan
                </Link>
            </div>

            {/* ================= MODAL PEMBATALAN ================= */}
            {cancelOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
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

                        <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                            Mohon beritahu kami alasan Anda membatalkan pesanan ini agar kami dapat meningkatkan layanan.
                        </p>

                        <form onSubmit={handleCancel} className="mt-4 space-y-3">
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                required
                                placeholder="Contoh: Salah pilih tanggal, ingin mengubah jenis layanan, dll."
                                className="w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-800 placeholder-gray-400 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
                            />

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCancelOpen(false)}
                                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!reason.trim() || processing}
                                    className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition"
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