import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, User, Package, XCircle, CheckCircle2, Loader2 } from 'lucide-react';
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
    const statusInfo = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.diproses;
    const StatusIcon = statusInfo.icon;

    return (
        <MitraLayout title="Rincian Order">
            <Head title={`Rincian Order - ${order.order_number}`} />

            <div className="px-4 py-4">
                <Link href={route('partner.orders.index')} className="mb-3 flex items-center gap-1.5 text-sm text-gray-500">
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
        </MitraLayout>
    );
}