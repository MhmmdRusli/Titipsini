import { Head, Link } from '@inertiajs/react';
import { Package, Truck, MapPin, User, Phone, CreditCard } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const STATUS_STYLE = {
    baru: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
    diproses: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
    selesai: 'bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-[#4ade80]',
    dibatalkan: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300',
};

const SERVICE_LABEL = {
    barang: 'Barang',
    kendaraan: 'Kendaraan',
    bangunan: 'Bangunan',
    pindahan: 'Pindahan',
};

const STEPS = ['baru', 'diproses', 'selesai'];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

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

    return (
        <CustomerLayout title="Detail Pesanan" backHref="/app/orders">
            <Head title={order.order_code} />

            <div className="px-4 py-3">
                {/* Header ringkasan */}
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-gray-400">Kode Pesanan</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{order.order_code}</p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {order.status}
                        </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                        <Package size={15} className="text-[#15803d] dark:text-[#4ade80]" />
                        {SERVICE_LABEL[order.service_type] ?? order.service_type}
                        {order.is_pickup && (
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Truck size={13} />
                                Antar-jemput
                            </span>
                        )}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin size={14} className="text-gray-400 dark:text-gray-500" />
                        {order.city}
                    </div>
                </div>

                {order.status === 'baru' && (
                    <Link
                        href={`/app/orders/${order.id}/pembayaran`}
                        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#15803d] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#166534] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] transition"
                    >
                        <CreditCard size={16} />
                        Bayar Sekarang
                    </Link>
                )}

                {/* Timeline status */}
                {!isCancelled && (
                    <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Status Pesanan
                        </p>
                        <div className="flex items-center">
                            {STEPS.map((step, i) => {
                                const reached = i <= currentStepIndex;
                                return (
                                    <div key={step} className="flex flex-1 items-center last:flex-none">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`h-3 w-3 rounded-full ${reached ? 'bg-[#15803d] dark:bg-[#4ade80]' : 'bg-gray-200 dark:bg-gray-700'
                                                    }`}
                                            />
                                            <span
                                                className={`mt-1.5 text-[10px] capitalize ${reached ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'
                                                    }`}
                                            >
                                                {step}
                                            </span>
                                        </div>
                                        {i < STEPS.length - 1 && (
                                            <div
                                                className={`mx-1 h-0.5 flex-1 ${i < currentStepIndex ? 'bg-[#15803d] dark:bg-[#4ade80]' : 'bg-gray-200 dark:bg-gray-700'
                                                    }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {isCancelled && order.cancel_reason && (
                    <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                        <p className="text-xs font-semibold text-red-700 dark:text-red-400">Alasan Pembatalan</p>
                        <p className="mt-1 text-sm text-red-600 dark:text-red-300">{order.cancel_reason}</p>
                    </div>
                )}

                {/* Info vendor */}
                {order.partner && (
                    <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Vendor</p>
                        <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                            <User size={15} className="text-gray-400 dark:text-gray-500" />
                            {order.partner.name}
                        </div>
                        {order.partner.phone && (
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Phone size={14} className="text-gray-400 dark:text-gray-500" />
                                {order.partner.phone}
                            </div>
                        )}

                        <Link
                            href={`/app/orders/${order.id}/lapor`}
                            className="mt-3 block w-full rounded-lg border border-red-100 bg-red-50 py-2 text-center text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/40 transition"
                        >
                            Laporkan Vendor
                        </Link>
                    </div>
                )}

                {!order.partner && (
                    <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
                        Vendor belum ditugaskan untuk pesanan ini.
                    </div>
                )}

                {/* Rincian pembayaran */}
                <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Pembayaran</p>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Total Harga</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatRupiah(order.total_price)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                        <span>Tanggal Pesanan</span>
                        <span>{formatTanggal(order.created_at)}</span>
                    </div>
                </div>

                <Link
                    href="/app/orders"
                    className="mt-5 block w-full rounded-xl border border-green-200 bg-green-50 py-2.5 text-center text-sm font-bold text-[#15803d] hover:bg-green-100 dark:border-green-900/50 dark:bg-green-950/40 dark:text-[#4ade80] dark:hover:bg-green-900/50 transition"
                >
                    Kembali ke Pesanan Saya
                </Link>
            </div>
        </CustomerLayout>
    );
}