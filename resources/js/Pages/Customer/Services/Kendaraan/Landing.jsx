import { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Car, Search, X } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Landing({ detectedKota = 'Yogyakarta' }) {
    const [open, setOpen] = useState(false);
    const [cityQuery, setCityQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState(detectedKota);
    const [cityResults, setCityResults] = useState([]);
    const [cityLoading, setCityLoading] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        clearTimeout(debounceRef.current);
        if (!cityQuery.trim()) {
            setCityResults([]);
            return;
        }

        setCityLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const { data } = await axios.get('/api/cities', { params: { search: cityQuery } });
                setCityResults(data ?? []);
            } catch {
                setCityResults([]);
            } finally {
                setCityLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [cityQuery, open]);

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
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Pencarian</h2>
                            <button type="button" onClick={() => setOpen(false)} className="text-gray-400" aria-label="Tutup">
                                <X size={20} />
                            </button>
                        </div>
                        <label className="mt-6 block text-sm text-gray-700 dark:text-gray-200">
                            <span className="block text-center">Pilih kota</span>
                            <input
                                type="text"
                                value={cityQuery}
                                onChange={(e) => setCityQuery(e.target.value)}
                                placeholder={selectedCity}
                                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#15803d] focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                            />
                        </label>
                        {(cityLoading || cityResults.length > 0) && (
                            <div className="mt-2 max-h-32 overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-700">
                                {cityLoading && <p className="p-3 text-xs text-gray-400">Mencari kota...</p>}
                                {!cityLoading && cityResults.map((city) => (
                                    <button
                                        key={city.nama}
                                        type="button"
                                        onClick={() => { setSelectedCity(city.nama); setCityQuery(city.nama); setCityResults([]); }}
                                        className="block w-full border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 last:border-0 dark:border-gray-700 dark:text-gray-200"
                                    >
                                        {city.nama}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="mt-7 grid grid-cols-2 gap-2">
                            <Link href="/app/services/kendaraan/search" className="rounded-xl border border-[#15803d] py-3 text-center text-xs font-bold text-[#15803d] dark:border-green-400 dark:text-green-400">
                                KOTA LAIN
                            </Link>
                            <Link href={`/app/services/kendaraan/search?kota=${encodeURIComponent(selectedCity)}`} className="rounded-xl bg-[#15803d] py-3 text-center text-xs font-bold text-white dark:bg-[#22c55e]">
                                OKE
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}