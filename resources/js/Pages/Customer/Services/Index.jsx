import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, MapPin, X, Car, Building2 } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const VEHICLE_TYPES = [
    { value: 'motor', label: 'Motor' },
    { value: 'mobil', label: 'Mobil' },
    { value: 'truk', label: 'Truk' },
    { value: 'becak', label: 'Becak' },
    { value: 'sepeda', label: 'Sepeda' },
    { value: 'bus', label: 'Bus' },
    { value: 'mobil_pick_up', label: 'Mobil pick up' },
];

const BUILDING_TYPES = [
    { value: 'rumah', label: 'Rumah' },
    { value: 'apartemen', label: 'Apartemen' },
    { value: 'kosan', label: 'Kosan' },
    { value: 'gudang', label: 'Gudang' },
    { value: 'kamar', label: 'Kamar' },
];

const TYPE_OPTIONS_BY_KATEGORI = {
    kendaraan: VEHICLE_TYPES,
    bangunan: BUILDING_TYPES,
};

const MODAL_LABEL_BY_KATEGORI = {
    kendaraan: {
        title: 'Pilih Kendaraan',
        description: 'Pilih jenis kendaraan yang sesuai dengan kebutuhan Anda untuk melanjutkan transaksi.',
        icon: Car,
    },
    bangunan: {
        title: 'Pilih Bangunan',
        description: 'Pilih jenis bangunan yang sesuai dengan kebutuhan Anda untuk melanjutkan transaksi.',
        icon: Building2,
    },
};

const KATEGORI_LABEL = {
    barang: 'Barang',
    bangunan: 'Bangunan',
    kendaraan: 'Kendaraan',
    pindahan: 'Pindahan',
};

export default function ServicesIndex({ services, filters }) {
    const kategori = filters?.kategori ?? '';
    const typeOptions = TYPE_OPTIONS_BY_KATEGORI[kategori] ?? null;
    const needsTypeSelection = !!typeOptions;
    const modalLabel = MODAL_LABEL_BY_KATEGORI[kategori];

    const [modalOpen, setModalOpen] = useState(needsTypeSelection && !filters?.jenis);
    const [selectedType, setSelectedType] = useState(filters?.jenis ?? '');
    const [search, setSearch] = useState(filters?.search ?? '');

    function confirmType() {
        if (!selectedType) return;
        setModalOpen(false);
        router.get(
            '/app/services',
            { kategori, jenis: selectedType, search },
            { preserveState: true, replace: true }
        );
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        router.get(
            '/app/services',
            { kategori, jenis: filters?.jenis ?? '', search },
            { preserveState: true, replace: true }
        );
    }

    const pageTitle = KATEGORI_LABEL[kategori] ?? 'Layanan';
    const ModalIcon = modalLabel?.icon ?? Car;

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
                        className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                    />
                </form>

                {needsTypeSelection && selectedType && (
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                        <ModalIcon size={13} />
                        {typeOptions.find((t) => t.value === selectedType)?.label}
                    </button>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3">
                    {services.data.length === 0 && (
                        <div className="col-span-2 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
                            Belum ada layanan yang cocok di area ini.
                        </div>
                    )}
                    {services.data.map((service) => (
                        <Link
                            key={service.id}
                            href={service.kategori === 'barang' ? `/app/services/barang/paket-pilihan?service_id=${service.id}` : `/app/services/${service.id}`}
                            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="h-24 w-full bg-gray-100 dark:bg-gray-700">
                                {service.foto ? (
                                    <img src={service.foto} alt={service.nama} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
                                        <ModalIcon size={28} />
                                    </div>
                                )}
                            </div>
                            <div className="p-2.5">
                                <p className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">{service.kota}</p>
                                <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-gray-500 dark:text-gray-400">
                                    <MapPin size={10} />
                                    Kecamatan {service.kecamatan}
                                </p>
                                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-brand-teal-50 px-2 py-0.5 text-[10px] font-medium text-brand-teal-700 dark:bg-brand-teal-900/40 dark:text-brand-teal-300">
                                    <ModalIcon size={10} />
                                    {KATEGORI_LABEL[service.kategori]}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Modal Pilih Jenis */}
            {modalOpen && needsTypeSelection && (
                <div className="absolute inset-0 z-20 flex items-end bg-black/40">
                    <div className="w-full rounded-t-2xl bg-white p-5 pb-8 dark:bg-gray-800">
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
                                            ? 'border-brand-teal-600 bg-brand-teal-600 text-white'
                                            : 'border-gray-200 text-gray-600 hover:border-brand-teal-300 dark:border-gray-600 dark:text-gray-300'
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
                            className="mt-6 w-full rounded-xl bg-brand-teal-600 py-3 text-sm font-bold text-white disabled:opacity-40"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}