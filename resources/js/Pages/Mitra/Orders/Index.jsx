import { Head, Link, router } from '@inertiajs/react';
import { Package, Car, Building2, MapPin, Clock, ChevronRight, ClipboardList } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const TABS = [
    { key: 'baru', label: 'Baru' },
    { key: 'selesai', label: 'Selesai' },
    { key: 'dibatalkan', label: 'Dibatalkan' },
];

const KATEGORI = [
    { key: null, label: 'Semua' },
    { key: 'barang', label: 'Barang', icon: Package },
    { key: 'kendaraan', label: 'Kendaraan', icon: Car },
    { key: 'bangunan', label: 'Bangunan', icon: Building2 },
];

const SERVICE_ICON = { barang: Package, kendaraan: Car, bangunan: Building2 };

function goTo(tab, kategori) {
    router.get(
        route('mitra.orders.index'),
        { tab, kategori: kategori ?? undefined },
        { preserveState: true, preserveScroll: true, replace: true }
    );
}

export default function Index({ orders, counts, filters }) {
    return (
        <MitraLayout title="">
            <Head title="Pesanan Mitra" />

            {/* Header Hijau Melengkung */}
            <div className="bg-[#15803d] dark:bg-green-700 px-4 pt-3 pb-6 rounded-b-[32px] shadow-sm">
                <div className="flex items-center justify-between">
                    <h1 className="flex items-center gap-1.5 text-base font-bold text-white">
                        Daftar Pesanan <ClipboardList size={18} />
                    </h1>
                </div>
            </div>

            <div className="px-4 py-4">
                {/* Tabs status */}
                <div className="flex gap-1 rounded-2xl bg-gray-100 p-1 dark:bg-gray-800 shadow-sm">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => goTo(t.key, filters.kategori)}
                            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
                                filters.tab === t.key
                                    ? 'bg-white text-[#15803d] shadow-sm dark:bg-gray-700 dark:text-[#4ade80]'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            {t.label} ({counts[t.key] ?? 0})
                        </button>
                    ))}
                </div>

                {/* Filter kategori */}
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {KATEGORI.map((k) => (
                        <button
                            key={k.label ?? 'semua'}
                            onClick={() => goTo(filters.tab, k.key)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                                filters.kategori === k.key
                                    ? 'border-[#15803d] bg-green-50 text-[#15803d] dark:border-green-700 dark:bg-green-950/40 dark:text-[#4ade80]'
                                    : 'border-gray-200 text-gray-500 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                        >
                            {k.icon && <k.icon size={13} />}
                            {k.label}
                        </button>
                    ))}
                </div>

                {/* List pesanan */}
                <div className="mt-4 space-y-3">
                    {orders.data.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-sm text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 shadow-sm">
                            Belum ada pesanan di kategori ini.
                        </div>
                    ) : (
                        orders.data.map((order) => {
                            const Icon = SERVICE_ICON[order.service_type] ?? Package;
                            return (
                                <Link
                                    key={order.id}
                                    href={route('mitra.orders.show', order.id)}
                                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-[#4ade80]">
                                        <Icon size={20} strokeWidth={1.75} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{order.order_number}</p>
                                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                            <MapPin size={12} className="shrink-0" />
                                            {order.address ?? '-'}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <Clock size={12} className="shrink-0" />
                                            {order.duration ?? '-'}
                                        </p>
                                    </div>
                                    <ChevronRight size={16} className="shrink-0 text-gray-300 dark:text-gray-600" />
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
                                        : 'bg-white text-gray-600 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                                } ${!link.url ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MitraLayout>
    );
}