import { Head, Link } from '@inertiajs/react';
import { MapPin, Star } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import JadwalOperasional from '@/Components/JadwalOperasional';

export default function Detail({ mitra }) {
    return (
        <CustomerLayout title="Detail Mitra" backHref="/app/services?kategori=pindahan&browse=1">
            <Head title="Detail Mitra Pindahan" />

            <div className="px-4 py-4">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">{mitra.nama}</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{mitra.mitraNama}</p>
                            <p className="text-xs text-gray-400">{mitra.kota}</p>
                        </div>
                        <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                mitra.isBuka
                                    ? 'bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-[#4ade80]'
                                    : 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400'
                            }`}
                        >
                            {mitra.isBuka ? 'Buka' : 'Tutup'}
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        <JadwalOperasional jadwal={mitra.jadwalOperasional} />

                        <div className="flex items-start gap-3 text-sm">
                            <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Alamat Lengkap</p>
                                <p className="text-gray-800 dark:text-gray-200">{mitra.alamat}, {mitra.kecamatan}, {mitra.kota}</p>
                            </div>
                        </div>
                    </div>

                    <ReviewList averageRating={mitra.averageRating} reviewCount={mitra.reviewCount} reviews={mitra.reviews} />
                </div>

                {mitra.isOrderable && mitra.sedangTutupHariIni ? (
                    <>
                        <button
                            type="button"
                            disabled
                            className="mt-6 block w-full cursor-not-allowed rounded-xl bg-gray-300 py-3 text-center text-sm font-bold text-white dark:bg-gray-700"
                        >
                            Layanan Sedang Tutup
                        </button>
                        <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
                            Mitra sedang tutup saat ini. Silakan pesan di jam operasional.
                        </p>
                    </>
                ) : (
                    <Link
                        href={`/app/services/pindahan/${mitra.id}/titip`}
                        className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-bold text-white ${
                            mitra.isOrderable
                                ? 'bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600'
                                : 'pointer-events-none bg-gray-300 dark:bg-gray-700'
                        }`}
                    >
                        Titip Disini
                    </Link>
                )}
                {!mitra.isOrderable && (
                    <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
                        Layanan ini belum bisa dipesan (masih dalam proses verifikasi atau belum mengatur jam operasional).
                    </p>
                )}
            </div>
        </CustomerLayout>
    );
}

function ReviewList({ averageRating = 0, reviewCount = 0, reviews = [] }) {
    return (
        <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <Star size={17} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{averageRating || '-'} / 5</span>
                <span className="text-xs text-gray-400">({reviewCount} ulasan)</span>
            </div>
            <div className="mt-3 space-y-2">
                {reviews.length ? reviews.map((item) => (
                    <div key={item.id} className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-900/50">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.customerName}</span>
                            <span className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={11} className={star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />)}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{item.review}</p>
                    </div>
                )) : <p className="text-xs text-gray-400">Belum ada ulasan.</p>}
            </div>
        </div>
    );
}
