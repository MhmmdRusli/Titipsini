import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import {
    MapPin,
    Clock,
    CreditCard,
    Wallet,
    Lock,
    ShieldCheck,
    HelpCircle,
    LogOut,
    ChevronRight,
    Pencil,
    CheckCircle2,
    XCircle,
    Store,
    AlertCircle,
    X
} from 'lucide-react';

function MenuCard({ href, icon: Icon, label, description, badge }) {
    return (
        <Link
            href={href}
            className="group relative flex items-center justify-between gap-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/90 p-4 shadow-sm transition-all duration-200 hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5 active:scale-[0.99]"
        >
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 transition-transform duration-200 group-hover:scale-105">
                    <Icon size={18} />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {label}
                        </p>
                        {badge && (
                            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                                {badge}
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <ChevronRight
                size={16}
                className="text-gray-300 dark:text-gray-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-emerald-500 shrink-0"
            />
        </Link>
    );
}

export default function ProfileIndex({ partner }) {
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(true);
        router.post(route('logout'), {}, {
            onFinish: () => {
                setIsLoggingOut(false);
                setIsLogoutOpen(false);
            }
        });
    };

    return (
        <MitraLayout title="">
            <Head title="Profil Mitra" />

            <div className="mx-auto max-w-xl space-y-6 px-4 py-6">

                {/* --- 1. Header Card Profil --- */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d5235] via-[#0f6340] to-[#15803d] p-6 text-white shadow-xl shadow-emerald-950/10">
                    {/* Pattern Background Accent */}
                    <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                    <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

                    <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Avatar */}
                            <div className="relative h-16 w-16 shrink-0">
                                {partner.avatar ? (
                                    <img
                                        src={partner.avatar}
                                        alt={partner.name}
                                        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/20 shadow-md"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-xl font-black text-white ring-2 ring-white/20 backdrop-blur-md">
                                        {partner.name?.charAt(0).toUpperCase() ?? 'M'}
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-900 p-0.5 border border-white/20">
                                    <Store size={12} className="text-emerald-300" />
                                </div>
                            </div>

                            {/* Info Detail */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                    <h2 className="truncate text-base font-extrabold text-white tracking-tight">
                                        {partner.name}
                                    </h2>
                                    {partner.is_verified && (
                                        <CheckCircle2 size={16} className="shrink-0 text-amber-300 fill-amber-300/20" />
                                    )}
                                </div>
                                <p className="truncate text-xs text-emerald-100/80 font-medium mt-0.5">
                                    {partner.email}
                                </p>

                                {/* Badge Status Verifikasi */}
                                <div className="mt-3 flex items-center gap-2">
                                    {partner.is_verified ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[10px] font-semibold text-emerald-100 border border-white/10">
                                            <CheckCircle2 size={12} className="text-emerald-300" />
                                            Terverifikasi
                                        </span>
                                    ) : (
                                        <Link
                                            href="/mitra/verifikasi"
                                            className="inline-flex items-center gap-1 rounded-full bg-amber-400/90 hover:bg-amber-400 px-3 py-1 text-[10px] font-bold text-amber-950 transition-all shadow-sm"
                                        >
                                            <XCircle size={12} />
                                            Belum Verifikasi
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tombol Edit Profil */}
                        <Link
                            href={route('mitra.profil.edit')}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 shadow-sm active:scale-95"
                            title="Edit Profil"
                        >
                            <Pencil size={16} />
                        </Link>
                    </div>
                </div>

                {/* --- 2. Operasional & Keuangan --- */}
                <div className="space-y-3">
                    <p className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        Operasional & Keuangan
                    </p>
                    <div className="grid gap-2.5">
                        <MenuCard
                            href={route('mitra.alamat.edit')}
                            icon={MapPin}
                            label="Alamat Toko"
                            description="Atur lokasi fisik outlet atau titik penjemputan"
                        />
                        <MenuCard
                            href={route('mitra.jam-operasional.edit')}
                            icon={Clock}
                            label="Jam Operasional"
                            description="Atur jadwal buka & tutup toko harian"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <MenuCard
                                href={route('mitra.rekening.edit')}
                                icon={CreditCard}
                                label="Rekening"
                                description="Bank tujuan pencairan"
                            />
                            <MenuCard
                                href={route('mitra.penarikan.index')}
                                icon={Wallet}
                                label="Penarikan Saldo"
                                description="Tarik hasil penjualan"
                            />
                        </div>
                    </div>
                </div>

                {/* --- 3. Akun & Keamanan --- */}
                <div className="space-y-3">
                    <p className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        Akun & Lainnya
                    </p>
                    <div className="grid gap-2.5">
                        <MenuCard
                            href={route('mitra.keamanan.edit')}
                            icon={Lock}
                            label="Keamanan Akun"
                            description="Ubah kata sandi & pengaturan login"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <MenuCard
                                href={route('mitra.kebijakan-privasi.index')}
                                icon={ShieldCheck}
                                label="Privasi"
                                description="Ketentuan layanan"
                            />
                            <MenuCard
                                href={route('mitra.bantuan.index')}
                                icon={HelpCircle}
                                label="Bantuan"
                                description="Pusat bantuan mitra"
                            />
                        </div>
                    </div>
                </div>

                {/* --- 4. Tombol Logout --- */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={() => setIsLogoutOpen(true)}
                        className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-red-200/80 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 py-3.5 shadow-sm transition-all duration-200 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-100/70 dark:hover:bg-red-900/40 active:scale-[0.99]"
                    >
                        <LogOut size={16} className="text-red-600 dark:text-red-400" />
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">
                            Keluar dari Akun
                        </span>
                    </button>
                </div>

            </div>

            {/* --- Modal Pop-up Konfirmasi Logout --- */}
            {isLogoutOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
                    <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                                    <AlertCircle size={22} />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                    Konfirmasi Keluar
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsLogoutOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                            Apakah Anda yakin ingin keluar dari akun mitra ini?
                        </p>

                        <div className="mt-6 flex justify-end gap-2.5">
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={() => setIsLogoutOpen(false)}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition active:scale-95"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={handleLogout}
                                className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-500/20 transition disabled:opacity-60 active:scale-95"
                            >
                                {isLoggingOut ? 'Memproses...' : 'Ya, Keluar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MitraLayout>
    );
}