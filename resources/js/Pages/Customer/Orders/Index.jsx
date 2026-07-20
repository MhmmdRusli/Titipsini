import { Head, Link, router } from '@inertiajs/react';
import { Package, Truck } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const TABS = [
    { value: '', label: 'Semua' },
    { value: 'baru', label: 'Baru' },
    { value: 'diproses', label: 'Diproses' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
];

const STATUS_STYLE = {
    baru: 'bg-blue-50 text-blue-600',
    diproses: 'bg-amber-50 text-amber-600',
    selesai: 'bg-brand-teal-100 text-brand-teal-700',
    dibatalkan: 'bg-red-50 text-red-600',
};

const SERVICE_LABEL = {
    barang: 'Barang',
    kendaraan: 'Kendaraan',
    bangunan: 'Bangunan',
    pindahan: 'Pindahan',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function formatTanggal(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function OrdersIndex({ orders, filters }) {
    const activeStatus = filters?.status ?? '';

    function changeTab(status) {
        router.get('/app/orders', { status }, { preserveState: true, preserveScroll: true, replace: true });
    }

    return (
        <CustomerLayout title="Pesanan Saya">
            <Head title="Pesanan Saya" />

            <div className="px-4 py-2">
                {/* Tabs status - scroll horizontal */}
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => changeTab(tab.value)}
                            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                                activeStatus === tab.value
                                    ? 'bg-brand-teal-700 text-white'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Daftar pesanan */}
                <div className="mt-4 flex flex-col gap-3">
                    {orders.data.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
                            Belum ada pesanan untuk status ini.
                        </div>
                    )}

                    {orders.data.map((order) => (
                        <Link
                            key={order.id}
                            href={`/app/orders/${order.id}`}
                            className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-teal-50 text-brand-teal-700">
                                        <Package size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-900">{order.order_code}</p>
                                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                                            {SERVICE_LABEL[order.service_type] ?? order.service_type}
                                            {order.is_pickup && <Truck size={11} className="text-brand-teal-600" />}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`rounded-full px-2 py-1 text-[10px] font-medium capitalize ${
                                        STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-2 text-[11px] text-gray-500">
                                <span>{formatTanggal(order.created_at)}</span>
                                <span className="font-semibold text-gray-800">{formatRupiah(order.total_price)}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {orders.links && orders.links.length > 3 && (
                    <div className="mt-4 flex items-center justify-center gap-1">
                        {orders.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded-md px-3 py-1.5 text-xs ${
                                    link.active
                                        ? 'bg-brand-teal-700 text-white'
                                        : link.url
                                        ? 'text-gray-500 hover:bg-gray-100'
                                        : 'text-gray-300'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}