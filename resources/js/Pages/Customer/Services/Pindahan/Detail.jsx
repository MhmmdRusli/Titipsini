import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, MapPin, Star, Truck } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import JadwalOperasional from '@/Components/JadwalOperasional';

export default function Detail({ mitra }) {
    return (
        <CustomerLayout title="Detail Mitra" backHref="/app/services?kategori=pindahan&browse=1">
            <Head title="Detail Mitra Pindahan" />
            <div className="px-4 py-6">
                <Link href="/app/services?kategori=pindahan&browse=1" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <ArrowLeft size={16} /> Detail Mitra
                </Link>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-green-400">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{mitra.nama}</h1>
                            <p className="text-xs text-gray-500">{mitra.mitraNama}</p>
                            <p className="text-xs text-gray-400">{mitra.kota}</p>
                        </div>
                    </div>
                    <div className="mt-6 space-y-4 border-t border-gray-100 pt-5 dark:border-gray-700">
                        <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300"><CheckCircle2 size={17} className="text-[#15803d]" /> {mitra.is_buka ? 'Buka' : 'Tutup'} : {mitra.jam_buka} - {mitra.jam_tutup}</div>
                        <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300"><MapPin size={17} className="text-[#15803d]" /> {mitra.alamat}, {mitra.kecamatan}, {mitra.kota}</div>
                        <JadwalOperasional jadwal={mitra.jadwalOperasional} />
                    </div>
                    <Reviews mitra={mitra} />
                    <Link href={`/app/services/pindahan/${mitra.id}/titip`} className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white dark:bg-[#22c55e]">
                        Titip Disini
                    </Link>
                </div>
            </div>
        </CustomerLayout>
    );
}

function Reviews({ mitra }) {
    return <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-700"><div className="flex items-center gap-2 text-sm font-bold"><Star size={17} className="fill-yellow-400 text-yellow-400" /> {mitra.averageRating || '-'} / 5 <span className="text-xs font-normal text-gray-400">({mitra.reviewCount || 0} ulasan)</span></div>{mitra.reviews?.length ? <div className="mt-3 space-y-2">{mitra.reviews.map((item) => <div key={item.id} className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-900/50"><div className="flex justify-between text-xs font-semibold"><span>{item.customerName}</span><span className="flex">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={11} className={star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />)}</span></div><p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{item.review}</p></div>)}</div> : <p className="mt-3 text-xs text-gray-400">Belum ada ulasan.</p>}</div>;
}