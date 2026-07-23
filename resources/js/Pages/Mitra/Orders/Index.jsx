import { Head, Link, router } from '@inertiajs/react';
import { Package, Car, Building2, Truck, MapPin, ClipboardList, TrendingUp, Store, HelpCircle } from 'lucide-react';
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
    { key: 'pindahan', label: 'Pindahan', icon: Truck },
];

const SERVICE_ICON = { 
    barang: Package, 
    kendaraan: Car, 
    bangunan: Building2, 
    pindahan: Truck 
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

            {/* Header Hijau Melengkung */}
            <div className="bg-[#15803d] dark:bg-green-700 px-4 pt-3 pb-6 rounded-b-[32px] shadow-sm">
                <div className="flex items-center justify-between">
                    <h1 className="flex items-center gap-1.5 text-base font-bold text-white">
                        Daftar Pesanan <ClipboardList size={18} />
                    </h1>
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">

                {/* MENU PINTASAN (Menutup ruang kosong di bawah header) */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Menu Pintasan</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <Link href={route('mitra.orders.index')} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-[#4ade80]">
                                <ClipboardList size={20} />
                            </div>
                            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">Pesanan</span>
                        </Link>
                        
                        <Link href="#" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <TrendingUp size={20} />
                            </div>
                            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">Statistik</span>
                        </Link>

                        <Link href="#" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                <Store size={20} />
                            </div>
                            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">Profil Toko</span>
                        </Link>

                        <Link href="#" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                <HelpCircle size={20} />
                            </div>
                            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">Bantuan</span>
                        </Link>
                    </div>
                </div>

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
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {KATEGORI.map((k) => (
                        <button
                            key={k.label ?? 'semua'}
                            onClick={() => goTo(filters.tab, k.key)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                                filters.kategori === k.key
                                    ? 'bg-[#15803d] text-white shadow-sm dark:bg-green-700'
                                    : 'border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                        >
                            {k.icon && <k.icon size={13} />}
                            {k.label}
                        </button>
                    ))}
                </div>

                {/* List pesanan */}
                <div className="space-y-3">
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
                                    className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                                >
                                    {/* Baris Atas: Nomor Order & Tanggal */}
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 dark:border-gray-700/60">
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                            {order.order_number ?? '-'}
                                        </p>
                                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                                            {order.created_at ?? '-'}
                                        </span>
                                    </div>

                                    {/* Alamat */}
                                    <div className="mt-2.5 flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                                        <MapPin size={14} className="mt-0.5 shrink-0 text-[#15803d] dark:text-[#4ade80]" />
                                        <p className="line-clamp-2 leading-relaxed">
                                            {order.address ?? '-'}
                                        </p>
                                    </div>

                                    {/* Badge jenis layanan */}
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1 text-xs font-semibold text-[#15803d] dark:bg-green-950/40 dark:text-[#4ade80]">
                                            <Icon size={13} /> {order.service_label ?? 'Titipan'}
                                        </span>
                                        {filters.tab === 'dibatalkan' && (
                                            <span className="text-xs font-semibold text-red-500">Dibatalkan</span>
                                        )}
                                        {filters.tab === 'selesai' && (
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Selesai</span>
                                        )}
                                    </div>

                                    {/* Detail Item, Durasi & Total Pembayaran */}
                                    <div className="mt-2.5 space-y-1.5 border-t border-gray-50 pt-2.5 text-xs text-gray-500 dark:border-gray-700/40 dark:text-gray-400">
                                        {order.item_name && (
                                            <div className="flex justify-between">
                                                <span>Item</span>
                                                <span className="font-medium text-gray-800 dark:text-gray-200">{order.item_name}</span>
                                            </div>
                                        )}
                                        {order.duration && (
                                            <div className="flex justify-between">
                                                <span>Durasi Penitipan</span>
                                                <span className="font-medium text-gray-800 dark:text-gray-200">{order.duration}</span>
                                            </div>
                                        )}
                                        {order.total_price > 0 && (
                                            <div className="flex justify-between border-t border-dashed border-gray-100 dark:border-gray-700/60 pt-1.5 mt-1">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">Total Pembayaran</span>
                                                <span className="font-bold text-[#15803d] dark:text-[#4ade80]">{formatRupiah(order.total_price)}</span>
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