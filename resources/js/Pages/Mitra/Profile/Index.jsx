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

function MenuItem({ href, icon: Icon, label, method, as }) {
    return (
        <Link
            href={href}
            method={method}
            as={as}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all hover:bg-gray-50"
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50">
                <Icon size={16} className="text-green-600" />
            </div>
            <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
            <ChevronRight size={16} className="text-gray-300" />
        </Link>
    );
}

export default function ProfileIndex({ partner }) {
    // State untuk kontrol modal
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    // Fungsi eksekusi logout
    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <MitraLayout title="">
            <Head title="Profil Mitra" />

            <div className="space-y-3 px-4 py-3">
                {/* Kartu Identitas Ringkas */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="relative flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0">
                            {partner.avatar ? (
                                <img 
                                    src={partner.avatar} 
                                    alt={partner.name} 
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100" 
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-sm font-semibold text-green-700">
                                    {partner.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                                <p className="truncate text-sm font-bold text-gray-900">{partner.name}</p>
                                {partner.is_verified && (
                                    <CheckCircle2 size={16} className="shrink-0 fill-green-600 text-white" />
                                )}
                            </div>
                            <p className="truncate text-xs text-gray-500">{partner.email}</p>

                            {/* Badge Verifikasi */}
                            <div className="mt-2 flex">
                                {partner.is_verified ? (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">
                                        <CheckCircle2 size={12} className="text-green-600" />
                                        Terverifikasi
                                    </span>
                                ) : (
                                    <Link
                                        href="/mitra/verifikasi"
                                        className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 hover:bg-amber-100"
                                    >
                                        <XCircle size={12} className="text-amber-600" />
                                        Belum Verifikasi
                                    </Link>
                                )}
                            </div>
                        </div>

                        <Link href={route('mitra.profil.edit')} className="absolute right-0 top-0 p-1 text-gray-400 hover:text-gray-600">
                            <Pencil size={15} />
                        </Link>
                    </div>
                </div>

                {/* Menu Navigasi */}
                <div className="space-y-2">
                    <MenuItem href={route('mitra.alamat.edit')} icon={MapPin} label="Alamat" />
                    <MenuItem href={route('mitra.jam-operasional.edit')} icon={Clock} label="Jam Operasional" />
                    <MenuItem href={route('mitra.rekening.edit')} icon={CreditCard} label="Rekening Bank" />
                    <MenuItem href={route('mitra.penarikan.index')} icon={Wallet} label="Penarikan" />
                    <MenuItem href={route('mitra.keamanan.edit')} icon={Lock} label="Keamanan" />
                    <MenuItem href={route('mitra.kebijakan-privasi.index')} icon={ShieldCheck} label="Kebijakan Privasi" />
                    <MenuItem href={route('mitra.bantuan.index')} icon={HelpCircle} label="Pusat Bantuan" />
                    
                    {/* Tombol Keluar Merah */}
                    <button
                        type="button"
                        onClick={() => setIsLogoutOpen(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 shadow-sm transition-all hover:bg-red-100 active:bg-red-200"
                    >
                        <LogOut size={16} className="text-red-600" />
                        <span className="text-sm font-semibold text-red-600">Keluar</span>
                    </button>
                </div>
            </div>

            {/* Modal Konfirmasi Langsung di Sini */}
            {isLogoutOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
                    <div className="w-full max-w-xs transform overflow-hidden rounded-3xl bg-white p-6 text-center shadow-xl transition-all">
                        
                        {/* Icon Lingkaran Merah */}
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                            <LogOut className="h-7 w-7 text-red-500 stroke-[2.5]" />
                        </div>

                        {/* Judul & Teks */}
                        <h3 className="text-lg font-bold text-gray-900">
                            Konfirmasi Keluar
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-gray-500">
                            Apakah Anda yakin ingin keluar dari akun ini?
                        </p>

                        {/* Tombol Action */}
                        <div className="mt-6 space-y-2.5">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full rounded-2xl bg-red-600 py-3 text-xs font-bold text-white shadow-md shadow-red-200 transition-all hover:bg-red-700 active:scale-[0.98]"
                            >
                                Ya, Keluar
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsLogoutOpen(false)}
                                className="w-full rounded-2xl border border-gray-200 bg-white py-3 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]"
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