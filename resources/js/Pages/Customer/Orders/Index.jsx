import { Head, Link, router } from '@inertiajs/react';
import { Package, MapPin, Truck, Building2, Car, CreditCard } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const TABS = [
    { value: '', label: 'Semua' },
    { value: 'baru', label: 'Baru' },
    { value: 'diproses', label: 'Diproses' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
];

const STATUS_STYLE = {
    baru: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
    diproses: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
    selesai: 'bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-[#4ade80]',
    dibatalkan: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300',
};

const SERVICE_LABEL = {
    barang: 'Titip Barang',
    kendaraan: 'Titip Kendaraan',
    bangunan: 'Titip Bangunan',
    pindahan: 'Pindahan',
};

// Fungsi untuk menentukan ikon berdasarkan jenis layanan
function getServiceIcon(serviceType) {
    switch (serviceType) {
        case 'pindahan':
            return Truck;
        case 'kendaraan':
            return Car;
        case 'bangunan':
            return Building2;
        case 'barang':
        default:
            return Package;
    }
}

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

            <div className="pb-6">
                {/* Header hijau melengkung dengan z-30 agar posisinya paling depan dan bisa diklik */}
                <div className="relative z-30 bg-[#15803d] dark:bg-green-700 px-4 pt-3 pb-7 rounded-b-[32px] shadow-sm">
                    {/* Tabs status - scroll horizontal */}
                    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => changeTab(tab.value)}
                                className={`relative z-40 shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition cursor-pointer ${activeStatus === tab.value
                                    ? 'bg-white text-[#15803d] shadow-sm dark:bg-gray-900 dark:text-[#4ade80]'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Daftar pesanan dengan jarak mt-3 agar tidak mepet */}
                <div className="px-4 mt-3">
                    <div className="flex flex-col gap-3">
                        {orders.data.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500">
                                Belum ada pesanan untuk status ini.
                            </div>
                        )}

                        {orders.data.map((order) => {
                            // Mengambil komponen ikon yang sesuai berdasarkan service_type
                            const IconComponent = getServiceIcon(order.service_type);

                            return (
                                <Link
                                    key={order.id}
                                    href={`/app/orders/${order.id}`}
                                    className="group relative block rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-700"
                                >
                                    {/* Atas: Ikon, Layanan, Lokasi & Status */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-[#4ade80]">
                                                <IconComponent size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                                    {SERVICE_LABEL[order.service_type] ?? 'Titip Barang'}
                                                </p>
                                                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                                                    <MapPin size={10} />
                                                    {order.vendor_name ?? 'Lokasi Penitipan'}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${order.status === 'baru'
                                                ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300 animate-pulse'
                                                : STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {order.status === 'baru' ? 'Perlu Bayar' : order.status}
                                        </span>
                                    </div>

                                    {/* Tengah: Tanggal & Durasi */}
                                    <div className="mt-2.5 flex items-center justify-between border-t border-gray-50 pt-2 text-[11px] dark:border-gray-700/60">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-gray-400 dark:text-gray-500">TANGGAL</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                {formatTanggal(order.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-gray-400 dark:text-gray-500">DURASI</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                {order.duration ?? '1 hari'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bawah: Total Pembayaran & Tombol Detail */}
                                    <div className="mt-2.5 flex items-center justify-between border-t border-gray-50 pt-2.5 dark:border-gray-700/60">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                                Total Pembayaran
                                            </p>
                                            <p className="mt-0.5 text-xs font-extrabold text-gray-900 dark:text-gray-100">
                                                {formatRupiah(order.total_price)}
                                            </p>
                                        </div>
                                        <span className="flex items-center gap-0.5 text-xs font-bold text-[#15803d] transition group-hover:translate-x-0.5 dark:text-[#4ade80]">
                                            Detail &gt;
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {orders.links && orders.links.length > 3 && (
                        <div className="mt-5 flex items-center justify-center gap-1">
                            {orders.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    preserveScroll
                                    className={`rounded-md px-3 py-1.5 text-xs ${link.active
                                        ? 'bg-[#15803d] text-white dark:bg-[#22c55e]'
                                        : link.url
                                            ? 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                            : 'text-gray-300 dark:text-gray-700'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}