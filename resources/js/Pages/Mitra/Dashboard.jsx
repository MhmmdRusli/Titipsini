import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { History, AlertTriangle, Package, Car, Building2, Truck, ChevronRight, MapPin, User, LogOut, BadgeCheck, Clock, ArrowDownToLine } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const LAYANAN_ICON = {
    barang: Package,
    kendaraan: Car,
    bangunan: Building2,
    pindahan: Truck,
};

// Href per kategori - masing-masing sekarang punya halaman kelola sendiri
const LAYANAN_HREF = {
    barang: '/mitra/layanan/barang',
    kendaraan: '/mitra/layanan/kendaraan',
    bangunan: '/mitra/layanan/bangunan',
    pindahan: '/mitra/layanan/pindahan',
};

const PESANAN_CARDS = [
    { key: 'barang', label: 'Barang', icon: Package },
    { key: 'kendaraan', label: 'Kendaraan', icon: Car },
    { key: 'bangunan', label: 'Bangunan', icon: Building2 },
    { key: 'pindahan', label: 'Pindahan', icon: Truck },
];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Dashboard({ partner = {}, saldo = 0, toko = {}, layanan = [], pesanan = {}, just_logged_in = false }) {
    const { auth } = usePage().props;
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // 1. Ambil status mentah dari props partner atau auth.user
    const rawStatus = partner?.verification_status ?? auth?.user?.verification_status ?? partner?.is_verified ?? auth?.user?.is_verified;

    // 2. Logika pemeriksaan ketat: Hanya dianggap terverifikasi jika nilainya eksplisit 'terverifikasi', 'verified', atau true
    const isVerified = (() => {
        if (typeof rawStatus === 'boolean') return rawStatus;
        if (typeof rawStatus === 'number') return rawStatus === 1;
        if (typeof rawStatus === 'string') {
            const cleanStatus = rawStatus.trim().toLowerCase();
            return cleanStatus === 'terverifikasi' || cleanStatus === 'verified' || cleanStatus === '1' || cleanStatus === 'true';
        }
        return false;
    })();

    // Modal cuma terbuka otomatis kalau baru saja login/daftar DAN belum terverifikasi
    const [showKtpModal, setShowKtpModal] = useState(just_logged_in && !isVerified);

    return (
        <MitraLayout>
            <Head title="Beranda Mitra" />

            {/* MODAL POP-UP VERIFIKASI KTP */}
            {!isVerified && showKtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                Verifikasi KTP
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                                Kamu belum melakukan Verifikasi KTP. Silahkan Melakukan Verifikasi Terlebih dahulu
                            </p>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowKtpModal(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Batal
                            </button>
                            <Link
                                href="/mitra/legalitas"
                                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-700 transition"
                            >
                                Verifikasi Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-4 py-4 pb-8 space-y-4">
                {/* Header User/Toko */}
                <div className="relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                    <div className="flex items-start gap-3">
                        <button
                            type="button"
                            onClick={() => setProfileMenuOpen((v) => !v)}
                            className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                        >
                            {partner?.avatar ? (
                                <img src={partner.avatar} alt={partner?.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center font-bold text-gray-400">
                                    {partner?.name?.charAt(0) ?? 'M'}
                                </div>
                            )}
                        </button>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                                <p className="truncate text-base font-bold text-gray-900 dark:text-gray-100">
                                    {toko?.nama ?? 'Titipsini Partner Outlet'}
                                </p>
                                {isVerified && (
                                    <BadgeCheck size={15} className="shrink-0 text-green-600 dark:text-[#4ade80]" />
                                )}
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                Hello 👋 {partner?.name ?? 'Mitra'}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                <MapPin size={12} className="shrink-0 text-gray-400" />
                                <span className="truncate">{toko?.alamat ?? 'Alamat lokasi mitra belum diatur'}</span>
                            </p>
                        </div>
                    </div>

                    {/* BANNER MERAH VERIFIKASI KTP (DITAROH DI BAWAH ALAMAT) */}
                    {!isVerified && (
                        <div className="mt-3 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/40">
                            <AlertTriangle size={18} className="shrink-0 text-red-600 dark:text-red-400" />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                                    Kamu belum melakukan Verifikasi KTP.
                                </p>
                                <Link
                                    href="/mitra/legalitas"
                                    className="text-xs font-bold text-red-600 underline hover:text-red-800 dark:text-red-400"
                                >
                                    Verifikasi Sekarang
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Status Toko */}
                    <Link
                        href="/mitra/layanan/jam-operasional"
                        className={`mt-3 flex items-center justify-between rounded-lg px-3 py-2 transition ${
                            toko?.buka
                                ? 'bg-green-50 hover:bg-green-100 dark:bg-green-950/40'
                                : 'bg-red-50 hover:bg-red-100 dark:bg-red-950/40'
                        }`}
                    >
                        <div className="flex items-center gap-1.5">
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    toko?.buka ? 'bg-green-700 dark:bg-green-400' : 'bg-red-700 dark:bg-red-400'
                                }`}
                            />
                            <span
                                className={`text-xs font-semibold ${
                                    toko?.buka ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                                }`}
                            >
                                {toko?.buka ? 'Buka' : 'Tutup'}
                            </span>
                            {toko?.jam_buka && toko?.jam_tutup ? (
                                <span
                                    className={`text-xs ${
                                        toko?.buka ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                                    }`}
                                >
                                    {toko.jam_buka} - {toko.jam_tutup}
                                </span>
                            ) : (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Jam operasional belum diatur
                                </span>
                            )}
                        </div>
                        <Clock size={13} className={toko?.buka ? 'text-green-600' : 'text-red-500'} />
                    </Link>

                    {profileMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                            <div className="absolute left-4 top-16 z-20 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
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

                {/* Saldo */}
                <div className="rounded-2xl bg-green-600 dark:bg-green-700 p-4 text-white shadow-sm relative overflow-hidden">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-white/80">Saldo Kamu Saat Ini</p>
                            <p className="mt-1 text-2xl font-extrabold tracking-tight">{formatRupiah(saldo)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <Link
                                href="/mitra/pendapatan/riwayat"
                                className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white hover:bg-white/30 transition"
                            >
                                <History size={12} />
                                Riwayat
                            </Link>
                            <Link
                                href="/mitra/penarikan/tarik"
                                className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-green-700 hover:bg-white/90 transition"
                            >
                                <ArrowDownToLine size={12} />
                                Tarik Saldo
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Layanan Vendors - sekarang tiap ikon menuju halaman kategori masing-masing */}
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

                    <div className="grid grid-cols-4 gap-2">
                        {(Array.isArray(layanan) && layanan.length > 0 ? layanan : ['barang', 'kendaraan', 'bangunan', 'pindahan']).map((key) => {
                            const Icon = LAYANAN_ICON[key] ?? Package;
                            return (
                                <Link
                                    key={key}
                                    href={LAYANAN_HREF[key] ?? '/mitra/layanan'}
                                    className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-4 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                                >
                                    <Icon size={22} className="text-green-600 dark:text-[#4ade80]" strokeWidth={1.75} />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Jumlah Pesanan */}
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
            </div>
        </MitraLayout>
    );
}