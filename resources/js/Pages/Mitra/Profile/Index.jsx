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
    XCircle
} from 'lucide-react';

function MenuCard({ href, icon: Icon, label, description, iconBg = "bg-green-50", iconColor = "text-green-700" }) {
    return (
        <Link
            href={href}
            className="group relative flex items-center gap-3.5 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-green-200 hover:bg-green-50/30 hover:shadow-md active:scale-[0.99]"
        >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor} transition-transform duration-200 group-hover:scale-105`}>
                <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 group-hover:text-green-700">{label}</p>
                {description && (
                    <p className="mt-0.5 truncate text-[11px] text-gray-400">{description}</p>
                )}
            </div>
            <ChevronRight size={16} className="text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-green-500" />
        </Link>
    );
}

export default function ProfileIndex({ partner }) {
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <MitraLayout title="">
            <Head title="Profil Mitra" />

            <div className="mx-auto max-w-lg space-y-5 px-4 py-4">

                {/* 1. Header Profil */}
                <div className="relative overflow-hidden rounded-2xl bg-green-600 p-5 text-white shadow-md">
                    <div className="relative flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0">
                            {partner.avatar ? (
                                <img
                                    src={partner.avatar}
                                    alt={partner.name}
                                    className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/30 shadow-sm"
                                />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white ring-2 ring-white/30">
                                    {partner.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                                <h2 className="truncate text-base font-bold text-white">{partner.name}</h2>
                                {partner.is_verified && (
                                    <CheckCircle2 size={16} className="shrink-0 text-white" />
                                )}
                            </div>
                            <p className="truncate text-xs text-green-100">{partner.email}</p>

                            <div className="mt-2.5 flex items-center gap-2">
                                {partner.is_verified ? (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                                        <CheckCircle2 size={11} />
                                        Terverifikasi
                                    </span>
                                ) : (
                                    <Link
                                        href="/mitra/verifikasi"
                                        className="inline-flex items-center gap-1 rounded-md bg-amber-400/90 px-2.5 py-0.5 text-[10px] font-semibold text-white transition-all hover:bg-amber-400"
                                    >
                                        <XCircle size={11} />
                                        Belum Verifikasi
                                    </Link>
                                )}
                            </div>
                        </div>

                        <Link
                            href={route('mitra.profil.edit')}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white transition-all hover:bg-white/25"
                        >
                            <Pencil size={15} />
                        </Link>
                    </div>
                </div>

                {/* 2. Grup Menu: Operasional & Keuangan */}
                <div className="space-y-2">
                    <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Operasional & Keuangan
                    </p>
                    <div className="grid gap-2">
                        <MenuCard
                            href={route('mitra.alamat.edit')}
                            icon={MapPin}
                            label="Alamat Toko"
                            description="Atur lokasi fisik outlet atau titik penjemputan"
                            iconBg="bg-green-50"
                            iconColor="text-green-700"
                        />
                        <MenuCard
                            href={route('mitra.jam-operasional.edit')}
                            icon={Clock}
                            label="Jam Operasional"
                            description="Atur jadwal buka & tutup toko harian"
                            iconBg="bg-green-50"
                            iconColor="text-green-700"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <MenuCard
                                href={route('mitra.rekening.edit')}
                                icon={CreditCard}
                                label="Rekening"
                                description="Bank tujuan"
                                iconBg="bg-green-50"
                                iconColor="text-green-700"
                            />
                            <MenuCard
                                href={route('mitra.penarikan.index')}
                                icon={Wallet}
                                label="Penarikan"
                                description="Tarik Saldo"
                                iconBg="bg-green-100"
                                iconColor="text-green-800"
                            />
                        </div>
                    </div>
                </div>

                

                {/* 3. Grup Menu: Pengaturan Akun & Bantuan */}
                <div className="space-y-2">
                    <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Akun & Lainnya
                    </p>
                    <div className="grid gap-2">
                        <MenuCard
                            href={route('mitra.keamanan.edit')}
                            icon={Lock}
                            label="Keamanan Akun"
                            description="Ubah kata sandi dan keamanan login"
                            iconBg="bg-rose-50"
                            iconColor="text-rose-600"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <MenuCard
                                href={route('mitra.kebijakan-privasi.index')}
                                icon={ShieldCheck}
                                label="Privasi"
                                description="Ketentuan layanan"
                                iconBg="bg-teal-50"
                                iconColor="text-teal-600"
                            />
                            <MenuCard
                                href={route('mitra.bantuan.index')}
                                icon={HelpCircle}
                                label="Bantuan"
                                description="Pusat bantuan"
                                iconBg="bg-indigo-50"
                                iconColor="text-indigo-600"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Tombol Keluar Standalone */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={() => setIsLogoutOpen(true)}
                        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-red-200/80 bg-red-50/60 py-3 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-100/80 active:scale-[0.99]"
                    >
                        <LogOut size={16} className="text-red-600" />
                        <span className="text-xs font-bold text-red-600">Keluar dari Akun</span>
                    </button>
                </div>

            </div>

            {/* Modal Konfirmasi Keluar */}
            {isLogoutOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-all">
                    <div className="w-full max-w-xs transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                            <LogOut className="h-6 w-6 stroke-[2.5]" />
                        </div>

                        <h3 className="text-base font-bold text-gray-900">
                            Konfirmasi Keluar
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                            Apakah Anda yakin ingin keluar dari akun mitra ini?
                        </p>

                        <div className="mt-6 space-y-2">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-md shadow-red-200 transition-all hover:bg-red-700 active:scale-[0.98]"
                            >
                                Ya, Keluar
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsLogoutOpen(false)}
                                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]"
                            >
                                Batal
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </MitraLayout>
    );
}