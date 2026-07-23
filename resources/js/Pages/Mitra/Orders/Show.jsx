import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, MapPin, User, Package, XCircle, CheckCircle2, Loader2, Image, ShieldCheck, ExternalLink } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

const STATUS_CONFIG = {
    diproses: { label: 'Pesanan Diproses', color: 'bg-blue-50 text-blue-600', icon: Loader2 },
    selesai: { label: 'Selesai', color: 'bg-green-50 text-green-600', icon: CheckCircle2 },
    dibatalkan: { label: 'Dibatalkan', color: 'bg-red-50 text-red-600', icon: XCircle },
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
        <MitraLayout title="Rincian Order">
            <Head title={`Rincian Order - ${order.order_number}`} />

            <div className="px-4 py-4">
                <Link href={route('mitra.orders.index')} className="mb-3 flex items-center gap-1.5 text-sm text-gray-500">
                    <ArrowLeft size={16} />
                    Kembali ke Pesanan
                </Link>

                {/* Status */}
                <div className={`flex items-center gap-2 rounded-xl p-3.5 ${statusInfo.color}`}>
                    <StatusIcon size={18} />
                    <div>
                        <p className="text-sm font-semibold">{statusInfo.label}</p>
                        {order.status === 'dibatalkan' && order.cancel_reason && (
                            <p className="text-xs opacity-80">Alasan: {order.cancel_reason}</p>
                        )}
                    </div>
                </div>

                {/* Info order */}
                <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">{order.order_number}</p>
                        <p className="text-xs text-gray-400">{order.created_at}</p>
                    </div>

                    <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                        <User size={16} className="mt-0.5 shrink-0 text-gray-400" />
                        <div>
                            <p className="font-medium text-gray-900">{order.customer.name}</p>
                            <p className="text-xs text-gray-500">{order.customer.phone}</p>
                        </div>
                    </div>

                    <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-400">Penjemputan</p>
                            <p>{order.pickup_address ?? '-'}</p>
                        </div>
                    </div>

                    {order.dropoff_address && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                            <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Pengantaran</p>
                                <p>{order.dropoff_address}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                        <Package size={16} className="mt-0.5 shrink-0 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-400">Deskripsi Barang</p>
                            <p>{order.item_description ?? '-'}</p>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <p className="text-xs text-gray-400">Durasi Penitipan</p>
                            <p className="font-medium text-gray-900">{order.duration ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Status Pick Up</p>
                            <p className="font-medium text-gray-900">{order.pickup_status ?? '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Bukti Pembayaran & Verifikasi */}
                <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                            <Image size={15} className="text-gray-400" />
                            Bukti Pembayaran
                        </p>
                        {order.payment_verified_at && (
                            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
                                <ShieldCheck size={12} />
                                Terverifikasi
                            </span>
                        )}
                    </div>

                    {order.payment_receipt ? (
                        <>
                            <div
                                onClick={() => setPreviewOpen(true)}
                                className="relative cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                            >
                                <img src={order.payment_receipt} alt="Bukti Pembayaran" className="h-40 w-full object-contain" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition hover:bg-black/30 hover:opacity-100">
                                    <span className="flex items-center gap-1 text-xs font-medium">
                                        <ExternalLink size={13} /> Lihat penuh
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
                                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-green-700 py-2.5 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                                >
                                    <ShieldCheck size={15} />
                                    {isVerifying ? 'Memverifikasi...' : 'Verifikasi Pembayaran'}
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-xs text-gray-400 italic">
                            Customer belum mengunggah bukti pembayaran.
                        </p>
                    )}
                </div>

                {/* Nota pembayaran */}
                <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-gray-900">Rincian Pembayaran</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatRupiah(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Diskon</span>
                            <span className="text-red-500">- {formatRupiah(order.discount)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Biaya Penjemputan</span>
                            <span>{formatRupiah(order.pickup_fee)}</span>
                        </div>
                        <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 text-sm font-semibold text-gray-900">
                            <span>Total Pembayaran</span>
                            <span>{formatRupiah(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {previewOpen && order.payment_receipt && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setPreviewOpen(false)}
                >
                    <img
                        src={order.payment_receipt}
                        alt="Bukti Pembayaran Perbesar"
                        className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
                    />
                </div>
            )}
        </MitraLayout>
    );
}