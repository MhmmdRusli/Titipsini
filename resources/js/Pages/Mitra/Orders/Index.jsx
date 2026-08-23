import { Head, Link, router } from '@inertiajs/react';
import { Package, Car, Building2, Truck, MapPin, ChevronLeft } from 'lucide-react';
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

            {/* Header putih polos */}
            <div className="flex items-center border-b border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                <Link
                    href="/mitra/dashboard"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                    <ChevronLeft size={22} />
                </Link>
                <h1 className="flex-1 pr-6 text-center text-base font-bold text-gray-900 dark:text-gray-100">
                    Pesanan
                </h1>
            </div>

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
                                    ? 'text-[#15803d] dark:text-[#4ade80]'
                                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                            }`}
                        >
                            {t.label}
                            {t.key === 'baru' && (counts?.baru ?? 0) > 0 && (
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            )}
                            {active && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#15803d] dark:bg-[#4ade80]" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Filter kategori - pil hijau */}
            <div className="flex gap-2 overflow-x-auto bg-white px-4 py-3 scrollbar-none dark:bg-gray-900">
                {KATEGORI.map((k) => {
                    const active = filters.kategori === k.key;
                    return (
                        <button
                            key={k.label}
                            onClick={() => goTo(filters.tab, k.key)}
                            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold text-white transition ${
                                active
                                    ? 'bg-[#15803d] ring-2 ring-[#15803d] ring-offset-1 dark:ring-offset-gray-900'
                                    : 'bg-[#22c55e] hover:bg-[#16a34a]'
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

                            return (
                                <Link
                                    key={order.id}
                                    href={route('mitra.orders.show', order.id)}
                                    className="block rounded-2xl border border-green-100 bg-green-50 p-4 transition hover:bg-green-100/70 dark:border-green-900/40 dark:bg-green-950/20 dark:hover:bg-green-950/30"
                                >
                                    {/* Baris atas: nomor order & tanggal/status */}
                                    <div className="flex items-center justify-between">
                                        <span className="rounded border border-gray-300 bg-white px-2 py-0.5 text-xs font-bold text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                                            {order.order_number ?? '-'}
                                        </span>
                                        {dibatalkan ? (
                                            <span className="text-xs font-semibold text-red-500">Dibatalkan</span>
                                        ) : (
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {order.created_at ?? '-'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Alamat */}
                                    <div className="mt-2 flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                                        <MapPin size={14} className="mt-0.5 shrink-0 text-[#15803d] dark:text-[#4ade80]" />
                                        <p className="line-clamp-2 leading-relaxed">{order.address ?? '-'}</p>
                                    </div>

                                    {/* Badge jenis layanan - outline putih di atas card hijau */}
                                    <div className="mt-3">
                                        <span className="inline-flex items-center gap-1 rounded-lg border border-green-600 bg-white px-2.5 py-1 text-xs font-semibold text-green-700 dark:border-green-700 dark:bg-gray-900 dark:text-[#4ade80]">
                                            <Icon size={13} /> {order.service_label ?? 'Titipan'}
                                        </span>
                                    </div>

                                    {/* Detail item & durasi */}
                                    <div className="mt-2.5 space-y-1 text-xs">
                                        {order.item_name && (
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{order.item_name}</p>
                                        )}
                                        {order.duration && (
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Durasi Penitipan :{' '}
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">{order.duration}</span>
                                            </p>
                                        )}
                                        {order.total_price > 0 && (
                                            <div className="mt-1.5 flex justify-between border-t border-dashed border-green-200 pt-1.5 dark:border-green-900/40">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">Total Pembayaran</span>
                                                <span className="font-bold text-[#15803d] dark:text-[#4ade80]">
                                                    {formatRupiah(order.total_price)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
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
                                        ? 'bg-[#15803d] text-white dark:bg-green-700'
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