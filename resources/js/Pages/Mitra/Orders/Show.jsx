import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, MapPin, User, Package, XCircle, CheckCircle2, Loader2, Image, ShieldCheck, ExternalLink } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

const STATUS_CONFIG = {
    baru: { label: 'Pesanan Diproses', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', icon: Loader2 },
    diproses: { label: 'Pesanan Diproses', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', icon: Loader2 },
    selesai: { label: 'Selesai', color: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-[#4ade80]', icon: CheckCircle2 },
    dibatalkan: { label: 'Dibatalkan', color: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400', icon: XCircle },
};

export default function Show({ order }) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const statusInfo = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.diproses;
    const StatusIcon = statusInfo.icon;

    function verifikasiPembayaran() {
        setIsVerifying(true);
        router.patch(
            `/mitra/pesanan/${order.id}/verifikasi-pembayaran`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsVerifying(false),
            }
        );
    }

    return (
        <MitraLayout title="">
            <Head title={`Rincian Order - ${order.order_number}`} />

            {/* Header Hijau Melengkung dengan Tombol Kembali */}
            <div className="bg-[#15803d] dark:bg-green-700 px-4 pt-3 pb-6 rounded-b-[32px] shadow-sm">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('mitra.orders.index')}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-base font-bold text-white">Rincian Order</h1>
                        {order.category && (
                            <span className="text-[11px] text-white/80 capitalize">
                                Kategori Komoditas: <span className="font-semibold">{order.category}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">
                {/* Status Real-Time Pemrosesan */}
                <div className={`flex items-center gap-2.5 rounded-2xl p-4 shadow-sm ${statusInfo.color}`}>
                    <StatusIcon size={20} className="shrink-0" />
                    <div>
                        <p className="text-sm font-bold">{statusInfo.label}</p>
                        {order.status === 'dibatalkan' && order.cancel_reason && (
                            <p className="text-xs opacity-90 mt-0.5">Alasan: {order.cancel_reason}</p>
                        )}
                    </div>
                </div>

                {/* Info Order / Ringkasan Transaksi & Logistik */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-3 dark:border-gray-800 dark:bg-gray-800">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700/60">
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Nomor Pesanan</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{order.order_number}</p>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{order.created_at}</p>
                    </div>

                    {/* Identitas Pelanggan */}
                    <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                        <User size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Identitas Pelanggan</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{order.customer?.name ?? '-'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer?.phone ?? '-'}</p>
                        </div>
                    </div>

                    {/* Logistik Rute Penjemputan & Pengantaran */}
                    <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Rute Penjemputan</p>
                            <p className={`text-xs font-medium ${order.pickup_address && order.pickup_address !== '-' ? 'text-gray-800 dark:text-gray-200' : 'italic text-gray-400'}`}>
                                {order.pickup_address && order.pickup_address !== '-' 
                                    ? order.pickup_address 
                                    : 'Alamat penjemputan tidak disertakan (Titip langsung di tempat mitra)'}
                            </p>
                        </div>
                    </div>

                    {order.dropoff_address && (
                        <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                            <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Rute Pengantaran</p>
                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{order.dropoff_address}</p>
                            </div>
                        </div>
                    )}

                    {/* Deskripsi Item yang Dititipkan */}
                    <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                        <Package size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Deskripsi Item Dititipkan</p>
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{order.item_description ?? '-'}</p>
                        </div>
                    </div>

                    {/* Durasi Penitipan & Status Pick Up */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 dark:border-gray-700/40 text-sm">
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Durasi Penitipan</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{order.duration ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Status Pick Up</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{order.pickup_status ?? '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Bukti Pembayaran & Verifikasi */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            <Image size={15} className="text-gray-400" />
                            Bukti Pembayaran
                        </p>
                        {order.payment_verified_at && (
                            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700 dark:bg-green-950/40 dark:text-[#4ade80]">
                                <ShieldCheck size={12} />
                                Terverifikasi
                            </span>
                        )}
                    </div>

                    {order.payment_receipt ? (
                        <>
                            <div
                                onClick={() => setPreviewOpen(true)}
                                className="relative cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                            >
                                <img src={order.payment_receipt} alt="Bukti Pembayaran" className="h-44 w-full object-contain p-2" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition hover:bg-black/40 hover:opacity-100">
                                    <span className="flex items-center gap-1 text-xs font-semibold">
                                        <ExternalLink size={13} /> Lihat Penuh
                                    </span>
                                </div>
                            </div>

                            {order.payment_verified_at ? (
                                <p className="mt-3 text-center text-xs text-gray-400">
                                    Sudah diverifikasi pada {order.payment_verified_at}
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={verifikasiPembayaran}
                                    disabled={isVerifying}
                                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#15803d] dark:bg-green-700 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
                                >
                                    <ShieldCheck size={16} />
                                    {isVerifying ? 'Memverifikasi...' : 'Verifikasi Pembayaran'}
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-xs text-gray-400 italic py-4">
                            Customer belum mengunggah bukti pembayaran.
                        </p>
                    )}
                </div>

                {/* Nota Finansial / Rincian Pembayaran */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                    <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Nota Finansial Pembayaran</p>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span>{formatRupiah(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Diskon</span>
                            <span className="text-red-500">- {formatRupiah(order.discount)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Biaya Penjemputan</span>
                            <span>{formatRupiah(order.pickup_fee)}</span>
                        </div>
                        <div className="mt-2 flex justify-between border-t border-gray-100 dark:border-gray-700/60 pt-2.5 text-sm font-bold text-gray-900 dark:text-gray-100">
                            <span>Total Pembayaran</span>
                            <span className="text-[#15803d] dark:text-[#4ade80]">{formatRupiah(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Perbesar Gambar */}
            {previewOpen && order.payment_receipt && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setPreviewOpen(false)}
                >
                    <img
                        src={order.payment_receipt}
                        alt="Bukti Pembayaran Perbesar"
                        className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
                    />
                </div>
            )}
        </MitraLayout>
    );
}