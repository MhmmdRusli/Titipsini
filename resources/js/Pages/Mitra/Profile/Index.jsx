import { Head, Link } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import {
    MapPin, Clock, CreditCard, Wallet, Lock, ShieldCheck, HelpCircle, LogOut, ChevronRight, Pencil, CheckCircle2, XCircle
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
    return (
        <MitraLayout title="">
            <Head title="Profil Mitra" />

            <div className="space-y-3 px-4 py-3">
                {/* Kartu identitas ringkas */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="relative flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0">
                            {partner.avatar ? (
                                <img src={partner.avatar} alt={partner.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100" />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-sm font-semibold text-green-700">
                                    {partner.name.charAt(0).toUpperCase()}
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

                            {/* Badge Verifikasi Ramping */}
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

                        <Link href="/mitra/profil/saya" className="absolute right-0 top-0 p-1 text-gray-400 hover:text-gray-600">
                            <Pencil size={15} />
                        </Link>
                    </div>
                </div>

                {/* Menu Navigasi */}
                <div className="space-y-2">
                    <MenuItem href="/mitra/alamat" icon={MapPin} label="Alamat" />
                    <MenuItem href="/mitra/layanan/jam-operasional" icon={Clock} label="Jam Operasional" />
                    <MenuItem href="/mitra/rekening" icon={CreditCard} label="Rekening Bank" />
                    <MenuItem href="/mitra/pendapatan/penarikan" icon={Wallet} label="Penarikan" />
                    <MenuItem href="/mitra/keamanan" icon={Lock} label="Keamanan" />
                    <MenuItem href="/mitra/kebijakan-privasi" icon={ShieldCheck} label="Kebijakan Privasi" />
                    <MenuItem href="/mitra/bantuan" icon={HelpCircle} label="Pusat Bantuan" />
                    <MenuItem href="/logout" method="post" as="button" icon={LogOut} label="Keluar" />
                </div>
            </div>
        </MitraLayout>
    );
}