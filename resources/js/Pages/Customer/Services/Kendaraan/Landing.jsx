import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Car, Search, X } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Landing({ detectedKota = 'Yogyakarta' }) {
    const [open, setOpen] = useState(false);

    return (
        <CustomerLayout title="Titip Kendaraan" backHref="/app/dashboard">
            <Head title="Titip Kendaraan" />
            <div className="px-4 py-6">
                <div className="overflow-hidden rounded-3xl bg-[#e8f5ee] p-6 dark:bg-green-950/30">
                    <div className="flex min-h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-[#15803d] to-[#4ade80] text-white">
                        <Car size={96} strokeWidth={1.2} />
                    </div>
                    <h1 className="mt-6 text-2xl font-extrabold text-gray-900 dark:text-gray-100">Titip Kendaraan</h1>
                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Cari mitra penitipan kendaraan dengan metode berikut:
                    </p>
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white shadow-sm hover:bg-green-700 dark:bg-[#22c55e]"
                    >
                        <Search size={17} /> Fitur Pencarian
                    </button>
                    <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
                        Hasil pencarian Mitra berdasarkan nama Mitra yang kamu masukkan
                    </p>
                </div>
            </div>

            {open && (
                <div className="absolute inset-0 z-30 flex items-end bg-black/40 sm:items-center sm:justify-center sm:p-4">
                    <div className="w-full rounded-t-3xl bg-white p-6 dark:bg-gray-800 sm:max-w-sm sm:rounded-3xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Pencarian</h2>
                            <button type="button" onClick={() => setOpen(false)} className="text-gray-400" aria-label="Tutup">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-200">
                            Pilih kota : <span className="font-bold">{detectedKota}</span>
                        </p>
                        <div className="mt-7 grid grid-cols-3 gap-2">
                            <Link href="/app/services/kendaraan/search" className="rounded-xl border border-[#15803d] py-3 text-center text-xs font-bold text-[#15803d] dark:border-green-400 dark:text-green-400">
                                KOTA LAIN
                            </Link>
                            <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-500 dark:border-gray-700">
                                BATAL
                            </button>
                            <Link href={`/app/services/kendaraan/search?kota=${encodeURIComponent(detectedKota)}`} className="rounded-xl bg-[#15803d] py-3 text-center text-xs font-bold text-white dark:bg-[#22c55e]">
                                OKE
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
