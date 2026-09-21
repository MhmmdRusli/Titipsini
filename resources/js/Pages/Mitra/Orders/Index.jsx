import { Head, Link, router } from '@inertiajs/react';
import { Package, Car, Building2, Truck, MapPin, Star } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const TABS = [
    { key: 'baru', label: 'Baru' },
    { key: 'selesai', label: 'Selesai' },
    { key: 'dibatalkan', label: 'Dibatalkan' },
];

const KATEGORI = [
    { key: null, label: 'Semua' },
    { key: 'barang', label: 'Barang' },
    { key: 'kendaraan', label: 'Kendaraan' },
    { key: 'bangunan', label: 'Bangunan' },
    { key: 'pindahan', label: 'Pindahan' },
];

const SERVICE_ICON = {
    barang: Package,
    kendaraan: Car,
    bangunan: Building2,
    pindahan: Truck,
};

function goTo(tab, kategori) {
    router.get(
        route('mitra.orders.index'),
        { tab, kategori: kategori ?? undefined },
        { preserveState: true, preserveScroll: true, replace: true }
    );
}

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Index({ orders, counts, filters }) {
    return (
        <MitraLayout title="">
            <Head title="Pesanan Mitra" />

            {/* Tabs garis bawah */}
            <div className="flex border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                {TABS.map((t) => {
                    const active = filters.tab === t.key;
                    return (
                        <button
                            key={t.key}
                            onClick={() => goTo(t.key, filters.kategori)}
                            className={`relative flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-semibold transition ${
                                active
                                    ? 'text-green-700 dark:text-green-400'
                                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                            }`}
                        >
                            {t.label}
                            {t.key === 'baru' && (counts?.baru ?? 0) > 0 && (
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            )}
                            {active && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-700 dark:bg-green-400" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Filter kategori - pil kapsul */}
            <div className="flex gap-2 overflow-x-auto bg-white px-4 py-3 scrollbar-none dark:bg-gray-900">
                {KATEGORI.map((k) => {
                    const active = filters.kategori === k.key;
                    return (
                        <button
                            key={k.label}
                            onClick={() => goTo(filters.tab, k.key)}
                            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                active
                                    ? 'border-green-700 bg-green-700 text-white dark:border-green-700 dark:bg-green-700'
                                    : 'border-gray-300 bg-white text-gray-600 hover:border-green-500 hover:bg-green-500 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-green-600 dark:hover:bg-green-600 dark:hover:text-white'
                            }`}
                        >
                            {k.label}
                        </button>
                    );
                })}
            </div>

            <div className="px-4 py-4">
                {/* List pesanan */}
                <div className="space-y-3">
                    {orders.data.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-400 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500">
                            Belum ada pesanan di kategori ini.
                        </div>
                    ) : (
                        orders.data.map((order) => {
                            const Icon = SERVICE_ICON[order.service_type] ?? Package;
                            const dibatalkan = filters.tab === 'dibatalkan';
                            const selesai = filters.tab === 'selesai';
                            const canAccept = ['baru', 'pembayaran_diterima'].includes(order.status);
                            const canReject = ['baru', 'pembayaran_diterima'].includes(order.status);

                            return (
                                <div
                                    key={order.id}
                                    className="rounded-2xl border border-green-100 bg-green-50 p-4 transition hover:bg-green-100/70 dark:border-green-900/40 dark:bg-green-950/20 dark:hover:bg-green-950/30"
                                >
                                    <Link href={route('mitra.orders.show', order.id)} className="block">
                                        {/* Baris atas: nama customer & status */}
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {order.customer_name ?? '-'}
                                            </p>
                                            {dibatalkan ? (
                                                <span className="text-xs font-semibold text-red-500">Dibatalkan</span>
                                            ) : selesai ? (
                                                <span className="text-xs font-semibold text-green-800 dark:text-green-300">Selesai</span>
                                            ) : (
                                                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Diproses</span>
                                            )}
                                        </div>

                                        {/* Alamat */}
                                        <div className="mt-2 flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                                            <MapPin size={14} className="mt-0.5 shrink-0 text-green-700 dark:text-green-400" />
                                            <div className="min-w-0">
                                                <p className="line-clamp-2 leading-relaxed">{order.address ?? '-'}</p>
                                                {order.address_notes && (
                                                    <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500 dark:text-gray-400">Catatan: {order.address_notes}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Jenis layanan spesifik dan nomor pesanan. */}
                                        <div className="mt-3 flex items-center justify-between gap-3">
                                            <span className="inline-flex items-center gap-1 rounded-lg border border-green-600 bg-white px-2.5 py-1 text-xs font-semibold text-green-700 dark:border-green-700 dark:bg-gray-900 dark:text-green-400">
                                                <Icon size={13} /> {order.service_label}
                                            </span>
                                            <span className="shrink-0 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                                {order.order_number ?? '-'}
                                            </span>
                                        </div>

                                        {/* Rincian utama pesanan. */}
                                        <dl className="mt-3 space-y-2 text-sm text-gray-900 dark:text-gray-100">
                                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                                <dt>Durasi Penitipan</dt><span>:</span>
                                                <dd className="text-right font-semibold">{order.duration ?? '-'}</dd>
                                            </div>
                                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                                <dt>Total Pembayaran</dt><span>:</span>
                                                <dd className="text-right font-semibold">{formatRupiah(order.total_price)}</dd>
                                            </div>
                                        </dl>

                                        {/* Note: Customer pengembalian */}
                                        {order.status === 'pengambilan_diajukan' && (
                                            <div className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                                                ⚠️ Customer mengajukan pengembalian — Harap diselesaikan
                                            </div>
                                        )}

                                        {/* Ulasan hanya relevan untuk pesanan yang telah selesai. */}
                                        {selesai && order.review && (
                                            <div className="mt-3 border-t border-dashed border-green-200 pt-3 dark:border-green-900/40">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ulasan</p>
                                                    {order.rating && (
                                                        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-500">
                                                            <Star size={12} fill="currentColor" />
                                                            {order.rating}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="rounded-lg bg-white px-3 py-2.5 text-xs leading-relaxed text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200">
                                                    {order.review}
                                                </p>
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {orders.links?.length > 3 && (
                    <div className="mt-5 flex flex-wrap justify-center gap-1">
                        {orders.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                                    link.active
                                        ? 'bg-green-700 text-white dark:bg-green-700'
                                        : 'border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                } ${!link.url ? 'cursor-not-allowed opacity-40' : 'hover:opacity-80'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MitraLayout>
    );
}