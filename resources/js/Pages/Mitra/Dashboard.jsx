import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { History, AlertTriangle, Package, Car, Building2, Truck, ChevronRight, MapPin, Store, User, LogOut } from 'lucide-react';
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

// Konfigurasi tiap card "Jumlah Pesanan" - dipisah biar gampang nambah
// kategori baru tanpa duplikasi JSX.
const PESANAN_CARDS = [
    { key: 'barang', label: 'Barang', icon: Package },
    { key: 'kendaraan', label: 'Kendaraan', icon: Car },
    { key: 'bangunan', label: 'Bangunan', icon: Building2 },
    { key: 'pindahan', label: 'Pindahan', icon: Truck },
];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Dashboard({ partner, saldo = 0, toko = {}, layanan = [], pesanan = {} }) {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    return (
        <MitraLayout title="Beranda">
            <Head title="Beranda Mitra" />

            <div className="px-4 py-4 pb-8 space-y-4">
                {/* Banner verifikasi KTP - hanya muncul kalau belum verified */}
                {!partner?.is_verified && (
                    <Link
                        href="/mitra/legalitas"
                        className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40"
                    >
                        <AlertTriangle size={20} className="shrink-0 text-red-600 dark:text-red-400" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-red-700 dark:text-red-300">Kamu belum melakukan Verifikasi KTP</p>
                            <p className="text-xs text-red-600 dark:text-red-400">Verifikasi Sekarang</p>
                        </div>
                        <ChevronRight size={16} className="shrink-0 text-red-400" />
                    </Link>
                )}

                {/* Profil Atas (Foto/Avatar & Nama) - sekarang bisa diklik untuk buka popup */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setProfileMenuOpen((v) => !v)}
                        className="flex items-center gap-3 text-left"
                    >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            {partner?.avatar ? (
                                <img src={partner.avatar} alt={partner?.name} className="h-full w-full object-cover" />
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
                    </button>

                    {profileMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                            <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                <Link
                                    href="/mitra/profil"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    <User size={15} />
                                    Lihat Profil
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                                >
                                    <LogOut size={15} />
                                    Keluar
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Status Vendor / Jam Operasional */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Status Vendor</p>
                    <p className="mt-0.5">
                        {toko?.buka ? 'Buka' : 'Tutup'} : {toko?.jam_buka && toko?.jam_tutup ? `${toko.jam_buka} - ${toko.jam_tutup}` : '08.00-20.00'}
                    </p>
                </div>

                {/* Kartu Saldo (Full Hijau) - warna disamakan dengan hijau
                    di sisi Customer (green-600 / dark:green-700) */}
                <div className="rounded-2xl bg-green-600 dark:bg-green-700 p-4 text-white shadow-sm relative overflow-hidden">
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
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Layanan Vendors</p>
                        <Link
                            href="/mitra/layanan"
                            className="flex items-center gap-0.5 text-xs font-bold text-green-600 hover:underline dark:text-[#4ade80]"
                        >
                            Kelola
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {!Array.isArray(layanan) || layanan.length === 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                            {['barang', 'kendaraan', 'bangunan', 'pindahan'].map((key) => {
                                const Icon = LAYANAN_ICON[key] ?? Package;
                                return (
                                    <Link
                                        key={key}
                                        href="/mitra/layanan"
                                        className="flex flex-col items-center justify-center rounded-2xl border border-black-600/40 bg-white py-4 shadow-sm transition hover:bg-gray-50 dark:border-black-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                                    >
                                        <Icon size={22} className="text-green-600 dark:text-[#4ade80]" strokeWidth={1.75} />
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
                                        className="flex flex-col items-center justify-center rounded-2xl border border-black-600/40 bg-white py-4 shadow-sm transition hover:bg-gray-50 dark:border-black-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                                    >
                                        <Icon size={22} className="text-green-600 dark:text-[#4ade80]" strokeWidth={1.75} />
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div>
                    <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Jumlah Pesanan</p>
                    <div className="grid grid-cols-2 gap-3">
                        {PESANAN_CARDS.map(({ key, label, icon: Icon }) => (
                            <div
                                key={key}
                                className="relative overflow-hidden rounded-2xl bg-green-600 dark:bg-green-700 p-3.5 text-white shadow-sm"
                            >
                                <Icon
                                    size={110}
                                    strokeWidth={1.5}
                                    className="pointer-events-none absolute -bottom-5 -right-5 rotate-[-8deg] text-white opacity-15"
                                />
                                <p className="relative text-sm font-bold">{label}</p>
                                <div className="relative mt-3 flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold leading-none">{pesanan?.[key] ?? 0}</span>
                                    <span className="text-xs font-medium text-white/80">pesanan</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card Informasi Toko/Lokasi di Bawah (Aman dari Error) */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-[#4ade80]">
                            <Store size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                                {toko?.nama ?? 'Titipsini Partner Outlet'}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                <MapPin size={12} className="shrink-0 text-gray-400" />
                                {toko?.alamat ?? 'Alamat lokasi mitra belum diatur'}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </MitraLayout>
    );
}