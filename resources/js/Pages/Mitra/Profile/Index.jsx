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

// Komponen Menu Item yang lebih ringkas dengan divider halus
function MenuItem({ href, icon: Icon, label, description, isLast = false }) {
    return (
        <Link
            href={href}
            className={`flex items-center justify-between p-3.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                !isLast ? 'border-b border-gray-100 dark:border-gray-700/50' : ''
            }`}
        >
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <Icon size={18} />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {label}
                    </p>
                    {description && (
                        <p className="truncate text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 shrink-0 ml-2" />
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

            <div className="mx-auto max-w-lg space-y-6 px-4 py-6">

                {/* --- Header Profil Transparan --- */}
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 p-4 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-12 w-12 shrink-0">
                            {partner.avatar ? (
                                <img
                                    src={partner.avatar}
                                    alt={partner.name}
                                    className="h-12 w-12 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950/60 font-bold text-green-700 dark:text-green-300">
                                    {partner.name?.charAt(0).toUpperCase() ?? 'M'}
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 rounded-full bg-green-600 p-0.5 text-white">
                                <Store size={10} />
                            </div>
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h2 className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                                    {partner.name}
                                </h2>
                                {partner.is_verified && (
                                    <CheckCircle2 size={14} className="shrink-0 text-green-500" />
                                )}
                            </div>
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                {partner.email}
                            </p>
                            <div className="mt-1">
                                {partner.is_verified ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600 dark:text-green-400">
                                        • Terverifikasi
                                    </span>
                                ) : (
                                    <Link
                                        href="/mitra/verifikasi"
                                        className="inline-flex items-center gap-1 rounded-md bg-red-500 hover:bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white transition-colors"
                                    >
                                        <XCircle size={10} /> Belum Verifikasi
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <Link
                        href={route('mitra.profil.edit')}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Edit Profil"
                    >
                        <Pencil size={15} />
                    </Link>
                </div>

                {/* --- Grup 1: Operasional & Keuangan --- */}
                <div className="space-y-1.5">
                    <p className="px-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Operasional & Keuangan
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
                        <MenuItem
                            href={route('mitra.alamat.edit')}
                            icon={MapPin}
                            label="Alamat Toko"
                            description="Atur lokasi fisik outlet atau titik penjemputan"
                        />
                        <MenuItem
                            href={route('mitra.jam-operasional.edit')}
                            icon={Clock}
                            label="Jam Operasional"
                            description="Atur jadwal buka & tutup toko harian"
                        />
                        <MenuItem
                            href={route('mitra.rekening.edit')}
                            icon={CreditCard}
                            label="Rekening Bank"
                            description="Bank tujuan pencairan"
                        />
                        <MenuItem
                            href={route('mitra.penarikan.index')}
                            icon={Wallet}
                            label="Penarikan Saldo"
                            description="Tarik hasil penjualan"
                            isLast={true}
                        />
                    </div>
                </div>

                {/* --- Grup 2: Akun & Keamanan --- */}
                <div className="space-y-1.5">
                    <p className="px-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Akun & Lainnya
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
                        <MenuItem
                            href={route('mitra.keamanan.edit')}
                            icon={Lock}
                            label="Keamanan Akun"
                            description="Ubah kata sandi & pengaturan login"
                        />
                        <MenuItem
                            href={route('mitra.kebijakan-privasi.index')}
                            icon={ShieldCheck}
                            label="Kebijakan Privasi"
                            description="Ketentuan layanan"
                        />
                        <MenuItem
                            href={route('mitra.bantuan.index')}
                            icon={HelpCircle}
                            label="Pusat Bantuan"
                            description="Layanan bantuan mitra"
                            isLast={true}
                        />
                    </div>
                </div>

                {/* --- Tombol Logout --- */}
                <button
                    type="button"
                    onClick={() => setIsLogoutOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 py-3 text-red-600 dark:text-red-400 hover:bg-red-100/50 transition-colors"
                >
                    <LogOut size={16} />
                    <span className="text-xs font-bold">Keluar dari Akun</span>
                </button>

            </div>

            {/* --- Modal Pop-up Logout --- */}
            {isLogoutOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <AlertCircle size={20} />
                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                    Keluar Akun
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsLogoutOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Apakah Anda yakin ingin keluar dari akun ini?
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={() => setIsLogoutOpen(false)}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={handleLogout}
                                className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
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