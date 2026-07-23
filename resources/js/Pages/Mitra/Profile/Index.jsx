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
        <MitraLayout title="Profile">
            <Head title="Profil Mitra" />

            <div className="space-y-3 px-4 py-3">
                {/* Kartu identitas ringkas */}
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <Link href="/mitra/profil/saya" className="relative flex items-center gap-3 p-4">
                        <div className="h-12 w-12 shrink-0">
                            {partner.avatar ? (
                                <img src={partner.avatar} alt={partner.name} className="h-12 w-12 rounded-full object-cover" />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-sm font-semibold text-green-700">
                                    {partner.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">{partner.name}</p>
                            <p className="truncate text-xs text-gray-500">{partner.email}</p>
                        </div>
                        <Pencil size={14} className="absolute right-4 top-4 shrink-0 text-gray-400" />
                    </Link>

                    <div
                        className={`py-2 text-center text-xs font-bold tracking-wide text-white ${
                            partner.is_verified ? 'bg-green-600' : 'bg-red-500'
                        }`}
                    >
                        {partner.is_verified ? 'TERVERIFIKASI' : 'VERIFIKASI'}
                    </div>
                </div>

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