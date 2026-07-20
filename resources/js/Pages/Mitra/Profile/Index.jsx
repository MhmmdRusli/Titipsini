import { Head, Link } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import {
    MapPin, Clock, CreditCard, Wallet, Lock, ShieldCheck, HelpCircle, LogOut, ChevronRight, Pencil,
} from 'lucide-react';

function MenuItem({ href, icon: Icon, label, method, as }) {
    return (
        <Link
            href={href}
            method={method}
            as={as}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
        >
            <Icon size={18} className="text-green-600" />
            <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
            <ChevronRight size={16} className="text-gray-300" />
        </Link>
    );
}

export default function ProfileIndex({ partner }) {
    return (
        <MitraLayout title="Profile">
            <Head title="Profil Mitra" />

            <div className="space-y-3 px-4 py-3">
                {/* Kartu identitas ringkas */}
                <Link
                    href="/mitra/profil/saya"
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                    <div className="relative h-12 w-12 shrink-0">
                        {partner.avatar ? (
                            <img src={partner.avatar} alt={partner.name} className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-sm font-semibold text-green-700">
                                {partner.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <p className="truncate text-sm font-semibold text-gray-900">{partner.name}</p>
                            <Pencil size={12} className="shrink-0 text-gray-400" />
                        </div>
                        <p className="truncate text-xs text-gray-500">{partner.email}</p>
                        {partner.is_verified ? (
                            <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                TERVERIFIKASI
                            </span>
                        ) : (
                            <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                                VERIFIKASI
                            </span>
                        )}
                    </div>
                </Link>

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