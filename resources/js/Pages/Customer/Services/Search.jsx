import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Search as SearchIcon, MapPin, X, Clock, PackageX, Package, Car, Building2, Truck, ChevronLeft } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

/**
 * Props expected from the backend controller (adjust names to match your route):
 *
 * - kategori: string                -> fixed to 'barang' for this "Titip Barang" flow
 * - detectedKota: string | null      -> best-guess city from IP/geolocation, resolved server-side
 * - filters: { kota, search }        -> currently applied filters (present on reload / back nav)
 * - mitras: {                        -> paginated list of matching partners, only sent when a
 *     data: Array<{                     kota has already been confirmed (filters.kota is set)
 *       id, nama, alamat, kota, kecamatan,
 *       jam_buka, jam_tutup, is_buka: boolean
 *     }>
 *   } | null
 *
 * Endpoints this page calls:
 * - GET /api/cities?search=...      -> [{ nama, provinsi }], for the "Kota Lain" picker
 * - GET /app/services/barang/search -> Inertia visit with { kota, search } query, re-renders this page
 */

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

    // 'confirm'  -> "Pilih kota: X" bottom sheet
    // 'picker'   -> full "kota lain" search screen
    // null       -> nothing open, showing main results (or empty state)
    const [sheet, setSheet] = useState(null);

    const [cityQuery, setCityQuery] = useState('');
    const [cityResults, setCityResults] = useState([]);
    const [cityLoading, setCityLoading] = useState(false);
    const debounceRef = useRef(null);

    // On first load: if no kota confirmed yet, decide whether to ask.
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
            // Kendaraan memakai pemilih kota penuh. Saat kota dipilih,
            // applyKota() langsung memuat daftar mitra di kota tersebut.
            setSheet('picker');
        } else if (detectedKota) {
            setSheet('confirm');
        } else {
            // No guess available at all — send straight to the picker instead of
            // showing a confirm sheet with nothing to confirm.
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

    function handleSearchSubmit(e) {
        e.preventDefault();
        if (!kota) {
            setSheet(detectedKota ? 'confirm' : 'picker');
            return;
        }
        fetchMitras(kota, search);
    }

    // Debounced live city search inside the "Kota Lain" picker
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
                                    {m.is_orderable === false ? (
                                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                            Segera Tersedia
                                        </span>
                                    ) : sedangTutup ? (
                                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500 dark:bg-red-950/40 dark:text-red-400">
                                            Layanan Sedang Tutup
                                        </span>
                                    ) : null}
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
                                        disabled={!m.is_buka || m.is_orderable === false || sedangTutup}
                                        onClick={() => { if (m.is_orderable !== false && ! sedangTutup) router.visit(`/app/services/${kategori}/${m.id}/titip`); }}
                                        className="flex-1 rounded-lg bg-[#15803d] py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-[#22c55e] dark:disabled:bg-gray-700"
                                    >
                                        {sedangTutup ? 'Layanan Sedang Tutup' : 'Titip Disini'}
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
                    </div>
                </div>
            )}

            {/* Full screen: pick another city */}
            {sheet === 'picker' && (
                <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
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
            )}
        </CustomerLayout>
    );
}
