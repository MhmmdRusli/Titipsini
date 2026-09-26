import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, MapPin, Clock, X, Package, Car, Building2, Truck, Star } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import axios from 'axios';

const VEHICLE_TYPES = [
    { value: 'motor', label: 'Motor' },
    { value: 'mobil', label: 'Mobil' },
    { value: 'truk', label: 'Truk' },
    { value: 'becak', label: 'Becak' },
    { value: 'sepeda', label: 'Sepeda' },
    { value: 'bus', label: 'Bus' },
    { value: 'mobil_pick_up', label: 'Mobil pick up' },
];

const TYPE_OPTIONS_BY_KATEGORI = {
    kendaraan: VEHICLE_TYPES,
};

const MODAL_LABEL_BY_KATEGORI = {
    kendaraan: {
        title: 'Pilih Kendaraan',
        description: 'Pilih jenis kendaraan yang sesuai dengan kebutuhan Anda untuk melanjutkan transaksi.',
        icon: Car,
    },
};

const ICON_BY_KATEGORI = {
    barang: Package,
    kendaraan: Car,
    bangunan: Building2,
    pindahan: Truck,
};

const KATEGORI_LABEL = {
    barang: 'Barang',
    bangunan: 'Bangunan',
    kendaraan: 'Kendaraan',
    pindahan: 'Pindahan',
};

function hrefForService(service) {
    if (service.kategori === 'barang') {
        return `/app/services/barang/paket-pilihan?service_id=${service.id}`;
    }
    if (service.kategori === 'kendaraan') {
        return `/app/services/kendaraan?service_id=${service.id}`;
    }
    if (service.kategori === 'bangunan') {
        return `/app/services/bangunan/${service.id}/titip`;
    }
    if (service.kategori === 'pindahan') {
        return `/app/services/pindahan/${service.id}/titip`;
    }
    return `/app/services/${service.id}`;
}

function detailHrefForService(service) {
    if (service.kategori === 'barang') {
        return `/app/services/barang/${service.id}/detail`;
    }
    if (service.kategori === 'bangunan') {
        return `/app/services/bangunan/${service.id}/detail`;
    }
    if (service.kategori === 'kendaraan') {
        return `/app/services/kendaraan/${service.id}/detail`;
    }
    return `/app/services/pindahan/${service.id}/detail`;
}

export default function ServicesIndex({ services, filters }) {
    const kategori = filters?.kategori ?? '';
    const typeOptions = TYPE_OPTIONS_BY_KATEGORI[kategori] ?? null;
    const needsTypeSelection = !!typeOptions;
    const modalLabel = MODAL_LABEL_BY_KATEGORI[kategori];

    const [modalOpen, setModalOpen] = useState(needsTypeSelection && !filters?.jenis);
    const [selectedType, setSelectedType] = useState(filters?.jenis ?? '');
    const [search, setSearch] = useState(filters?.search ?? '');
    const [geoLoading, setGeoLoading] = useState(false);

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
            
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=id`
            );
            const result = await response.json();
            const address = result.address || {};
            
            const city = address.city || address.town || address.municipality || address.county || address.regency || '';
            
            if (city) {
                const { data } = await axios.get('/api/cities', { params: { search: city, kategori } });
                if (data && data.length > 0) {
                    router.get('/app/services', { kategori, search: data[0].nama, browse: true }, { replace: true });
                } else {
                    router.get('/app/services', { kategori, search: city, browse: true }, { replace: true });
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

    function confirmType() {
        if (!selectedType) return;
        setModalOpen(false);
        router.get(
            '/app/services',
            { kategori, jenis: selectedType, search, browse: true },
            { preserveState: true, replace: true }
        );
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        router.get(
            '/app/services',
            { kategori, jenis: filters?.jenis ?? '', search, browse: true },
            { preserveState: true, replace: true }
        );
    }

    const pageTitle = KATEGORI_LABEL[kategori] ?? 'Layanan';
    const CategoryIcon = ICON_BY_KATEGORI[kategori] ?? Package;
    const ModalIcon = modalLabel?.icon ?? CategoryIcon;

    return (
        <CustomerLayout title={pageTitle} backHref="/app/dashboard">
            <Head title={pageTitle} />

            <div className={`px-4 py-3 ${modalOpen ? 'pointer-events-none blur-sm' : ''}`}>
                <form onSubmit={handleSearchSubmit} className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari kota atau kecamatan..."
                        className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                    />
                </form>

                {!search && !filters?.search && (
                    <button
                        type="button"
                        onClick={handleCurrentLocation}
                        disabled={geoLoading}
                        className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-green-700 bg-white px-4 py-2.5 text-sm font-medium text-green-700 shadow-sm hover:bg-[#e8f5ee] dark:border-green-500 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-green-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MapPin size={16} />
                        {geoLoading ? 'Mendeteksi lokasi...' : 'Gunakan Lokasi Saat Ini'}
                    </button>
                )}

                {needsTypeSelection && selectedType && (
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-700 px-3 py-1.5 text-xs font-semibold text-white dark:bg-green-500"
                    >
                        <ModalIcon size={13} />
                        {typeOptions.find((t) => t.value === selectedType)?.label}
                    </button>
                )}

                <div className="mt-4 space-y-3">
                    {services.data.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
                            Belum ada layanan yang cocok di area ini.
                        </div>
                    )}
                    {services.data.map((service) => {
                        const ServiceIcon = ICON_BY_KATEGORI[service.kategori] ?? CategoryIcon;
                        const orderable = service.is_orderable !== false;
                        const sedangTutup = orderable && service.sedang_tutup_hari_ini === true;
                        const cap = service.capacity;
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
                                key={service.id}
                                className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            <ServiceIcon size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{service.nama}</p>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400">{service.vendor?.name ?? service.mitraNama ?? 'Mitra Titipsini'}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        {orderable ? (
                                            <span
                                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                    sedangTutup
                                                        ? 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400'
                                                        : 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                                                }`}
                                            >
                                                {sedangTutup ? 'Layanan Sedang Tutup' : 'Buka'}
                                            </span>
                                        ) : (
                                            <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                                Segera Tersedia
                                            </span>
                                        )}
                                        {capText && (
                                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${capColor}`}>
                                                {capText}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2.5 space-y-1 border-t border-gray-50 pt-2 text-[11px] text-gray-500 dark:border-gray-700/60 dark:text-gray-400">
                                    <p className="flex items-center gap-1.5">
                                        <MapPin size={11} />
                                        {service.kecamatan}, {service.kota}
                                    </p>
                                    <p className="flex items-center gap-1.5">
                                        <Clock size={11} />
                                        {service.jam_buka || '08.00'} - {service.jam_tutup || '21.00'}
                                    </p>
                                </div>

                                {Number(service.review_count) > 0 && (
                                    <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        {Number(service.average_rating).toFixed(1)} ({service.review_count} ulasan)
                                    </div>
                                )}

                                <div className="mt-2.5 flex items-center gap-2">
                                    <div className="flex w-full items-center gap-2">
                                        {orderable && ! sedangTutup && !isFull ? (
                                            <Link
                                                href={hrefForService(service)}
                                                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-700 px-3.5 py-2 text-xs font-bold text-white dark:bg-green-500"
                                            >
                                                Titip Disini
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled
                                                className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-1 rounded-lg bg-gray-200 px-3.5 py-2 text-xs font-bold text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                                            >
                                                {isFull ? 'Penuh' : sedangTutup ? 'Layanan Sedang Tutup' : 'Segera Tersedia'}
                                            </button>
                                        )}
                                        <Link
                                            href={detailHrefForService(service)}
                                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-green-700 px-3.5 py-2 text-xs font-bold text-green-700 dark:border-green-500 dark:text-green-400"
                                        >
                                            Detail Mitra
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal Pilih Jenis (Fixed Center) */}
            {modalOpen && needsTypeSelection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-gray-800">
                        <div className="mb-4 flex items-start justify-between">
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">{modalLabel.title}</h2>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{modalLabel.description}</p>
                            </div>
                            <Link href="/app/dashboard" className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                                <X size={18} />
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {typeOptions.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setSelectedType(type.value)}
                                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                        selectedType === type.value
                                            ? 'border-green-700 bg-green-700 text-white dark:border-green-500 dark:bg-green-500'
                                            : 'border-gray-200 text-gray-600 hover:border-green-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-green-600'
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            disabled={!selectedType}
                            onClick={confirmType}
                            className="mt-6 w-full rounded-xl bg-green-700 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-40 dark:bg-green-500 dark:hover:bg-green-600"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
