import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Search as SearchIcon, MapPin, X, Clock, PackageX, Package, Car, Building2, Truck, ChevronLeft } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const LOCAL_STORAGE_KEY = 'titipsini:last_kota';

const CATEGORY_ICON = {
    barang: Package,
    kendaraan: Car,
    bangunan: Building2,
    pindahan: Truck,
};

export default function Search({ kategori = 'barang', detectedKota = null, openCityPicker = false, filters = {}, mitras = null }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [kota, setKota] = useState(filters?.kota ?? null);
    const [geoLoading, setGeoLoading] = useState(false);

    // 'confirm'  -> "Pilih kota: X" bottom sheet
    // 'picker'   -> full "kota lain" search screen
    // null       -> nothing open, showing main results (or empty state)
    const [sheet, setSheet] = useState(null);

    const [cityQuery, setCityQuery] = useState('');
    const [cityResults, setCityResults] = useState([]);
    const [cityLoading, setCityLoading] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (openCityPicker) {
            setSheet('picker');
            return;
        }

        if (kota) return;

        const remembered = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (remembered) {
            applyKota(remembered, { silent: true });
            return;
        }

        if (kategori === 'kendaraan') {
            setSheet('picker');
        } else if (detectedKota) {
            setSheet('confirm');
        } else {
            setSheet('picker');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openCityPicker]);

    function fetchMitras(nextKota, nextSearch) {
        router.get(
            `/app/services/${kategori}/search`,
            { kota: nextKota, search: nextSearch ?? '' },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function applyKota(nextKota, { silent = false } = {}) {
        setKota(nextKota);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, nextKota);
        setSheet(null);
        if (!silent) setCityQuery('');
        fetchMitras(nextKota, search);
    }

    async function handleCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Browser tidak mendukung geolokasi.');
            return;
        }
        setGeoLoading(true);
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                });
            });
            const { latitude, longitude } = position.coords;
            
            // Reverse geocode using Nominatim (OpenStreetMap)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=id`
            );
            const result = await response.json();
            const address = result.address || {};
            
            // Try to find city from address
            const city = address.city || address.town || address.municipality || address.county || address.regency || '';
            
            if (city) {
                // Try to match with our city list
                const { data } = await axios.get('/api/cities', { params: { search: city } });
                if (data && data.length > 0) {
                    applyKota(data[0].nama);
                } else {
                    applyKota(city);
                }
            } else {
                alert('Tidak dapat mendeteksi kota dari lokasi Anda.');
            }
        } catch (error) {
            if (error.code === 1) {
                alert('Izin akses lokasi ditolak. Silakan aktifkan di pengaturan browser.');
            } else if (error.code === 2) {
                alert('Informasi lokasi tidak tersedia.');
            } else if (error.code === 3) {
                alert('Permintaan lokasi timeout. Coba lagi.');
            } else {
                alert('Gagal mengambil lokasi: ' + error.message);
            }
        } finally {
            setGeoLoading(false);
        }
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        if (!kota && !search.trim()) {
            setSheet(detectedKota ? 'confirm' : 'picker');
            return;
        }
        fetchMitras(kota, search);
    }

    useEffect(() => {
        if (sheet !== 'picker') return;

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
    }, [cityQuery, sheet]);

    const groupedCities = useMemo(() => {
        const groups = {};
        for (const c of cityResults) {
            const key = c.provinsi ?? 'Lainnya';
            groups[key] = groups[key] ?? [];
            groups[key].push(c);
        }
        return groups;
    }, [cityResults]);

    const hasNoResults = kota && mitras && mitras.data.length === 0;
    const CategoryIcon = CATEGORY_ICON[kategori] ?? Package;
    const landingHref = {
        barang: '/app/services/barang/landing',
        bangunan: '/app/services/bangunan',
        kendaraan: '/app/services/kendaraan',
        pindahan: '/app/services/pindahan',
    }[kategori] ?? '/app/dashboard';

    return (
        <CustomerLayout title="Pencarian" backHref={landingHref}>
            <Head title="Pencarian" />

            <div className={`px-4 py-3 ${sheet ? 'pointer-events-none blur-sm' : ''}`}>
                <form onSubmit={handleSearchSubmit} className="relative">
                    <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nama kota ataupun nama vendor"
                        className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15803d] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                    />
                </form>

                {/* Quick "Lokasi Saat Ini" button - always visible when no kota selected */}
                {!kota && (
                    <button
                        type="button"
                        onClick={handleCurrentLocation}
                        disabled={geoLoading}
                        className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#15803d] bg-white px-4 py-2.5 text-sm font-medium text-[#15803d] shadow-sm hover:bg-[#e8f5ee] dark:border-[#22c55e] dark:bg-gray-800 dark:text-[#4ade80] dark:hover:bg-green-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MapPin size={16} />
                        {geoLoading ? 'Mendeteksi lokasi...' : 'Gunakan Lokasi Saat Ini'}
                    </button>
                )}

                {kota && (
                    <button
                        type="button"
                        onClick={() => setSheet('picker')}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#15803d] px-3 py-1.5 text-xs font-semibold text-white dark:bg-[#22c55e]"
                    >
                        <MapPin size={13} />
                        {kota}
                    </button>
                )}

                {/* Results */}
                {kota && mitras && mitras.data.length > 0 && (
                    <div className="mt-4 space-y-3">
                        {mitras.data.map((m) => {
                            const sedangTutup = m.is_orderable !== false && m.sedang_tutup_hari_ini === true;
                            const dimmed = m.is_orderable === false || sedangTutup;
                            const cap = m.capacity;
                            const isFull = cap && cap.is_full;
                            const capText = cap && !cap.is_unlimited 
                                ? `Tersisa ${cap.remaining}/${cap.total} slot`
                                : cap && cap.is_unlimited
                                ? 'Tidak terbatas'
                                : null;
                            const capColor = isFull ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                                : cap && cap.remaining <= 2 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                                : 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400';
                            return (
                            <div
                                key={m.id}
                                className={`rounded-xl border p-4 shadow-sm ${dimmed
                                    ? 'border-gray-100 bg-gray-50 opacity-60 dark:border-gray-800 dark:bg-gray-900'
                                    : 'border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-green-400">
                                            <CategoryIcon size={15} />
                                        </span>
                                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{m.nama}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {m.is_orderable === false ? (
                                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                                Segera Tersedia
                                            </span>
                                        ) : sedangTutup ? (
                                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500 dark:bg-red-950/40 dark:text-red-400">
                                                Layanan Sedang Tutup
                                            </span>
                                        ) : null}
                                        {capText && (
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${capColor}`}>
                                                {capText}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                    <MapPin size={12} /> {m.alamat}, {m.kecamatan}
                                </p>
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                    <Clock size={12} /> {m.jam_buka} - {m.jam_tutup}
                                </p>

                                <div className="mt-3 flex gap-2">
                                    <button
                                        type="button"
                                        disabled={!m.isBuka || m.is_orderable === false || sedangTutup || isFull}
                                        onClick={() => { if (m.is_orderable !== false && ! sedangTutup && !isFull) router.visit(`/app/services/${kategori}/${m.id}/titip`); }}
                                        className="flex-1 rounded-lg bg-[#15803d] py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-[#22c55e] dark:disabled:bg-gray-700"
                                    >
                                        {isFull ? 'Penuh' : sedangTutup ? 'Layanan Sedang Tutup' : 'Titip Disini'}
                                    </button>
                                    <Link
                                        href={`/app/services/${kategori}/${m.id}/detail`}
                                        className="flex-1 rounded-lg border border-[#15803d] py-2 text-center text-xs font-bold text-[#15803d] dark:border-[#22c55e] dark:text-[#4ade80]"
                                    >
                                        Detail Mitra
                                    </Link>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty state: kota confirmed but nothing matched */}
                {hasNoResults && (
                    <div className="mt-10 flex flex-col items-center text-center">
                        <PackageX size={64} className="text-gray-300 dark:text-gray-600" />
                        <p className="mt-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                            Tidak ada Mitra Titipsini.com
                        </p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            Cek penulisan atau pilih lokasi lainnya
                        </p>
                        <button
                            type="button"
                            onClick={() => setSheet('picker')}
                            className="mt-4 rounded-full bg-[#15803d] px-4 py-2 text-xs font-bold text-white dark:bg-[#22c55e]"
                        >
                            Ganti Kota
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom sheet: confirm detected city */}
            {sheet === 'confirm' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-gray-800">
                        <div className="flex items-start justify-between">
                            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Pencarian</h2>
                            <button
                                type="button"
                                onClick={() => setSheet(null)}
                                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">Pilih kota</p>

                        <div className="mt-2 w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-center text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                            {detectedKota}
                        </div>

                        <div className="mt-5 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSheet('picker')}
                                className="flex-1 rounded-full border border-[#15803d] py-2.5 text-xs font-bold text-[#15803d] dark:border-[#22c55e] dark:text-[#4ade80]"
                            >
                                KOTA LAIN
                            </button>
                            <button
                                type="button"
                                onClick={() => applyKota(detectedKota)}
                                className="flex-1 rounded-full bg-[#15803d] py-2.5 text-xs font-bold text-white dark:bg-[#22c55e]"
                            >
                                OKE
                            </button>
                        </div>

                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={handleCurrentLocation}
                                disabled={geoLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#15803d] bg-white px-4 py-2.5 text-sm font-medium text-[#15803d] shadow-sm hover:bg-[#e8f5ee] dark:border-[#22c55e] dark:bg-gray-800 dark:text-[#4ade80] dark:hover:bg-green-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MapPin size={16} />
                                {geoLoading ? 'Mendeteksi lokasi...' : 'Gunakan Lokasi Saat Ini'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Full screen: pick another city.
                FIX: sebelumnya "fixed inset-0 bg-white" tanpa pembatas lebar,
                jadi keluar dari mobile-frame CustomerLayout dan melebar penuh
                satu layar di desktop. Sekarang dibungkus persis pola frame
                yang sama seperti CustomerLayout sendiri (max-w-[430px],
                terpusat, sm:h-[850px] + shadow) supaya konsisten "terbingkai"
                seperti HP di semua ukuran layar. */}
            {sheet === 'picker' && (
                <div className="fixed inset-0 z-50 bg-black/40 sm:flex sm:items-center sm:justify-center">
                    <div className="mx-auto flex h-full w-full max-w-[430px] flex-col overflow-y-auto bg-white dark:bg-gray-900 sm:h-[850px] sm:shadow-xl">
                        <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-3 dark:border-gray-800">
                            <button
                                type="button"
                                onClick={() => setSheet(kota ? null : 'confirm')}
                                className="text-gray-500 dark:text-gray-400"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Pilihan Kota</h2>
                        </div>

                        <div className="p-4">
                            <div className="relative">
                                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={cityQuery}
                                    onChange={(e) => setCityQuery(e.target.value)}
                                    placeholder="Pencarian"
                                    className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15803d] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                                {cityQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setCityQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="mt-4">
                                {!cityQuery && detectedKota && (
                                    <button
                                        type="button"
                                        onClick={() => applyKota(detectedKota)}
                                        className="flex w-full items-center justify-between border-b border-gray-100 py-3 text-left dark:border-gray-800"
                                    >
                                        <span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {detectedKota}
                                            </span>
                                            <span className="ml-2 text-xs font-medium text-[#15803d] dark:text-[#4ade80]">
                                                Anda di sini
                                            </span>
                                        </span>
                                    </button>
                                )}

                                {!cityQuery && (
                                    <button
                                        type="button"
                                        onClick={handleCurrentLocation}
                                        disabled={geoLoading}
                                        className="flex w-full items-center gap-2 border-b border-gray-100 py-3 text-left dark:border-gray-800"
                                    >
                                        <MapPin size={16} className="text-[#15803d] dark:text-[#4ade80]" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {geoLoading ? 'Mendeteksi lokasi...' : 'Gunakan Lokasi Saya'}
                                        </span>
                                    </button>
                                )}

                                {cityLoading && (
                                    <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">Mencari kota...</p>
                                )}

                                {!cityLoading &&
                                    Object.entries(groupedCities).map(([provinsi, list]) => (
                                        <div key={provinsi}>
                                            {list.map((c) => (
                                                <button
                                                    key={c.nama}
                                                    type="button"
                                                    onClick={() => applyKota(c.nama)}
                                                    className="flex w-full flex-col items-start border-b border-gray-100 py-3 text-left dark:border-gray-800"
                                                >
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {c.nama}
                                                    </span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                                        Provinsi {provinsi}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    ))}

                                {!cityLoading && cityQuery && cityResults.length === 0 && (
                                    <div className="mt-10 flex flex-col items-center text-center">
                                        <PackageX size={56} className="text-gray-300 dark:text-gray-600" />
                                        <p className="mt-3 text-sm font-bold text-gray-900 dark:text-gray-100">
                                            Tidak ada Mitra Titipsini.com
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                            Cek penulisan atau pilih lokasi lainnya
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}