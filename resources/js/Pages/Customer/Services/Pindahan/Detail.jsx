import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, MapPin, Truck } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Detail({ mitra }) {
    return (
        <CustomerLayout title="Detail Mitra" backHref="/app/services?kategori=pindahan">
            <Head title="Detail Mitra Pindahan" />
            <div className="px-4 py-6">
                <Link href="/app/services?kategori=pindahan" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <ArrowLeft size={16} /> Detail Mitra
                </Link>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-green-400">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{mitra.nama}</h1>
                            <p className="text-xs text-gray-400">{mitra.kota}</p>
                        </div>
                    </div>
                    <div className="mt-6 space-y-4 border-t border-gray-100 pt-5 dark:border-gray-700">
                        <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300"><CheckCircle2 size={17} className="text-[#15803d]" /> {mitra.is_buka ? 'Buka' : 'Tutup'} : {mitra.jam_buka} - {mitra.jam_tutup}</div>
                        <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300"><MapPin size={17} className="text-[#15803d]" /> {mitra.alamat}, {mitra.kecamatan}, {mitra.kota}</div>
                        <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300"><Clock size={17} className="text-[#15803d]" /> Jam operasional setiap hari</div>
                    </div>
                    <Link href={`/app/services/pindahan/${mitra.id}/titip`} className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white dark:bg-[#22c55e]">
                        Titip Disini
                    </Link>
                </div>
            </div>
        </CustomerLayout>
    );
}