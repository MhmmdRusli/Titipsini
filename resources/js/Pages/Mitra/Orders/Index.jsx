import { Head, Link, router } from '@inertiajs/react';
import { Package, Car, Building2, MapPin, Clock, ChevronRight } from 'lucide-react';
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
        route('partner.orders.index'),
        { tab, kategori: kategori ?? undefined },
        { preserveState: true, preserveScroll: true, replace: true }
    );
}

export default function Index({ orders, counts, filters }) {
    return (
        <MitraLayout title="Pesanan">
            <Head title="Pesanan" />

            <div className="px-4 py-4">
                {/* Tabs status */}
                <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => goTo(t.key, filters.kategori)}
                            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                                filters.tab === t.key
                                    ? 'bg-white text-green-700 shadow-sm'
                                    : 'text-gray-500'
                            }`}
                        >
                            {t.label} ({counts[t.key] ?? 0})
                        </button>
                    ))}
                </div>

                {/* Filter kategori */}
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {KATEGORI.map((k) => (
                        <button
                            key={k.label}
                            onClick={() => goTo(filters.tab, k.key)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                                filters.kategori === k.key
                                    ? 'border-green-600 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-500'
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
                        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
                            Belum ada pesanan di kategori ini.
                        </div>
                    ) : (
                        orders.data.map((order) => {
                            const Icon = SERVICE_ICON[order.service_type] ?? Package;
                            return (
                                <Link
                                    key={order.id}
                                    href={route('partner.orders.show', order.id)}
                                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                                        <Icon size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900">{order.order_number}</p>
                                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500">
                                            <MapPin size={12} className="shrink-0" />
                                            {order.address ?? '-'}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                            <Clock size={12} className="shrink-0" />
                                            {order.duration ?? '-'}
                                        </p>
                                    </div>
                                    <ChevronRight size={16} className="shrink-0 text-gray-300" />
                                </Link>
                            );
                        })
                    )}
                </div>

                {/* Pagination sederhana */}
                {orders.links?.length > 3 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                        {orders.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg px-3 py-1.5 text-xs ${
                                    link.active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
                                } ${!link.url ? 'opacity-40' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MitraLayout>
    );
}