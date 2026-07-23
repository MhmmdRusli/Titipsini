import { Head, Link } from '@inertiajs/react';
import { History, AlertTriangle, Package, Car, Building2, Truck, ChevronRight, Clock } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const LAYANAN_ICON = {
    barang: Package,
    kendaraan: Car,
    bangunan: Building2,
    pindahan: Truck,
};

const LAYANAN_LABEL = {
    barang: 'Titip Barang',
    kendaraan: 'Titip Kendaraan',
    bangunan: 'Titip Bangunan',
    pindahan: 'Layanan Pindahan',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Dashboard({ partner, saldo = 0, toko, layanan = [], pesanan }) {
    return (
        <MitraLayout title="Beranda">
            <Head title="Beranda Mitra" />

            <div className="px-4 py-4 pb-8">
                {/* Banner verifikasi KTP - hanya muncul kalau belum verified */}
                {!partner?.is_verified && (
                    <Link
                        href="/mitra/legalitas"
                        className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40"
                    >
                        <AlertTriangle size={20} className="shrink-0 text-red-600 dark:text-red-400" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-red-700 dark:text-red-300">Kamu belum melakukan Verifikasi KTP</p>
                            <p className="text-xs text-red-600 dark:text-red-400">Verifikasi Sekarang</p>
                        </div>
                        <ChevronRight size={16} className="shrink-0 text-red-400" />
                    </Link>
                )}

                {/* Profil Atas (Foto/Avatar & Nama) */}
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        {partner?.avatar ? (
                            <img src={partner.avatar} alt={partner.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400 font-bold">
                                {partner?.name?.charAt(0) ?? 'M'}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Hello 👋</p>
                        <p className="text-base font-bold text-gray-900 dark:text-gray-100">{partner?.name ?? 'Riza Hidayat'}</p>
                    </div>
                </div>

                {/* Status Vendor / Jam Operasional */}
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Status Vendor</p>
                    <p className="mt-0.5">
                        {toko?.buka ? 'Buka' : 'Tutup'} : {toko?.jam_buka && toko?.jam_tutup ? `${toko.jam_buka} - ${toko.jam_tutup}` : '08.00-20.00'}
                    </p>
                </div>

                {/* Kartu Saldo (Full Hijau) */}
                <div className="mt-4 rounded-2xl bg-[#15803d] dark:bg-green-700 p-4 text-white shadow-sm relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-white/80">Saldo Kamu Saat Ini</p>
                            <p className="mt-1 text-2xl font-extrabold tracking-tight">{formatRupiah(saldo)}</p>
                        </div>
                        <Link
                            href="/mitra/pendapatan/riwayat"
                            className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white hover:bg-white/30 transition"
                        >
                            <History size={12} />
                            Riwayat
                        </Link>
                    </div>
                </div>

                {/* Layanan Vendors dengan Tombol Kelola di Kanan & Bisa Diklik */}
                <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Layanan Vendors</p>
                        <Link
                            href="/mitra/layanan"
                            className="flex items-center gap-0.5 text-xs font-bold text-[#15803d] hover:underline dark:text-[#4ade80]"
                        >
                            Kelola
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {layanan.length === 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                            {['barang', 'kendaraan', 'bangunan', 'pindahan'].map((key) => {
                                const Icon = LAYANAN_ICON[key] ?? Package;
                                return (
                                    <Link
                                        key={key}
                                        href="/mitra/layanan"
                                        className="flex flex-col items-center justify-center rounded-2xl border border-[#15803d]/40 bg-white py-4 shadow-sm transition hover:bg-gray-50 dark:border-green-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                                    >
                                        <Icon size={22} className="text-[#15803d] dark:text-[#4ade80]" strokeWidth={1.75} />
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-2">
                            {layanan.map((key) => {
                                const Icon = LAYANAN_ICON[key] ?? Package;
                                return (
                                    <Link
                                        key={key}
                                        href="/mitra/layanan"
                                        className="flex flex-col items-center justify-center rounded-2xl border border-[#15803d]/40 bg-white py-4 shadow-sm transition hover:bg-gray-50 dark:border-green-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                                    >
                                        <Icon size={22} className="text-[#15803d] dark:text-[#4ade80]" strokeWidth={1.75} />
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Jumlah Pesanan */}
                <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Jumlah Pesanan</p>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Card Barang */}
                        <div className="rounded-2xl bg-[#15803d] dark:bg-green-700 p-3.5 text-white shadow-sm flex flex-col justify-between">
                            <p className="text-sm font-bold">Barang</p>
                            <div className="mt-3 rounded-xl bg-white py-3 text-center text-gray-900 shadow-inner font-extrabold text-xl">
                                {pesanan?.barang ?? 0}
                            </div>
                        </div>
                        {/* Card Kendaraan */}
                        <div className="rounded-2xl bg-[#15803d] dark:bg-green-700 p-3.5 text-white shadow-sm flex flex-col justify-between">
                            <p className="text-sm font-bold">Kendaraan</p>
                            <div className="mt-3 rounded-xl bg-white py-3 text-center text-gray-900 shadow-inner font-extrabold text-xl">
                                {pesanan?.kendaraan ?? 0}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MitraLayout>
    );
}