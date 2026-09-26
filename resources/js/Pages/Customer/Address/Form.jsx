import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    User,
    Phone,
    MapPin,
    Building2,
    Landmark,
    StickyNote,
    ChevronDown,
    Loader2,
    Pencil,
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import GoogleMapAddressPicker from '@/Components/GoogleMapAddressPicker';

// Endpoint API wilayah — sesuaikan dengan route yang tersedia di backend Laravel.
// GET  /api/wilayah/provinces                      -> [{ id, name }]
// GET  /api/wilayah/regencies/PROVINCE_ID           -> [{ id, name }]
// GET  /api/wilayah/districts/REGENCY_ID            -> [{ id, name }]
const REGION_ENDPOINTS = {
    provinces: '/api/wilayah/provinces',
    cities: (provinceId) => `/api/wilayah/regencies/${provinceId}`,
    districts: (cityId) => `/api/wilayah/districts/${cityId}`,
};

// --- Shared styling helpers (konsisten dengan ProfileEdit.jsx) ---

const wrapperClass = (hasError) => `
    relative rounded-2xl border transition-all duration-200 shadow-sm
    ${
        hasError
            ? 'border-red-400 ring-4 ring-red-500/10'
            : 'border-gray-200 dark:border-gray-700 focus-within:border-[#008736] focus-within:ring-4 focus-within:ring-[#008736]/10'
    }
`;

// focus:ring-0 ditambahkan di sini — tanpa ini, ring/box-shadow biru bawaan
// plugin @tailwindcss/forms numpuk di atas ring hijau custom dari wrapperClass,
// jadi kelihatan kayak border dobel pas field-nya di-focus.
const inputClass =
    'w-full bg-slate-50 dark:bg-gray-800 rounded-2xl px-4 py-3 pl-11 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 !border-0';

function FieldLabel({ children }) {
    return (
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            {children}
        </label>
    );
}

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p>;
}

function IconIn({ icon: Icon, top = false }) {
    return (
        <span
            className={`absolute left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500 ${
                top ? 'top-3.5' : 'inset-y-0'
            }`}
        >
            <Icon size={18} />
        </span>
    );
}

function SelectField({ icon, value, onChange, placeholder, options, disabled, error }) {
    return (
        <div className={wrapperClass(error)}>
            <IconIn icon={icon} />
                <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`${inputClass} appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-50 !dark:bg-gray-800`}
            >
                <option value="" className="bg-white dark:bg-gray-800 dark:text-gray-200">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-white dark:bg-gray-800 dark:text-gray-200">
                        {opt.name}
                    </option>
                ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-500">
                <ChevronDown size={16} />
            </span>
        </div>
    );
}

function normalizeRegionName(value) {
    return String(value ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, ' ')
        .replace(/\b(kabupaten|kab|regency|kota|city|kecamatan|kec|kapanewon|district|daerah istimewa|special region|di)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function findRegionOption(options, value) {
    const target = normalizeRegionName(value);
    if (!target) return null;

    return options.find((option) => {
        const name = normalizeRegionName(option.name);
        return name === target || name.includes(target) || target.includes(name);
    });
}

// --- Main Component ---
export default function AddressForm({ address = null }) {
    const isEdit = Boolean(address);

    const { data, setData, post, put, processing, errors } = useForm({
        name: address?.name ?? '',
        phone: address?.phone ?? '',
        province_id: address?.province_id ?? '',
        city_id: address?.city_id ?? '',
        district_id: address?.district_id ?? '',
        address: address?.address ?? '',
        notes: address?.notes ?? '',
        is_primary: address?.is_primary ?? false,
    });

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [editConfirmOpen, setEditConfirmOpen] = useState(false);

    // Muat daftar provinsi sekali di awal
    useEffect(() => {
        const controller = new AbortController();

        fetch(REGION_ENDPOINTS.provinces)
            .then((res) => {
                if (!res.ok) throw new Error('Gagal memuat provinsi');
                return res.json();
            })
            .then((options) => {
                if (!controller.signal.aborted) setProvinces(options);
            })
            .catch((reason) => {
                if (reason.name !== 'AbortError') setProvinces([]);
            });

        return () => controller.abort();
    }, []);

    // Muat kabupaten/kota setiap kali provinsi berubah
    useEffect(() => {
        const controller = new AbortController();

        if (!data.province_id) {
            setCities([]);
            return;
        }
        setLoadingCities(true);
        fetch(REGION_ENDPOINTS.cities(data.province_id), { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error('Gagal memuat kabupaten/kota');
                return res.json();
            })
            .then((options) => {
                if (!controller.signal.aborted) setCities(options);
            })
            .catch((reason) => {
                if (reason.name !== 'AbortError') setCities([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingCities(false);
            });

        return () => controller.abort();
    }, [data.province_id]);

    // Muat kecamatan setiap kali kabupaten/kota berubah
    useEffect(() => {
        const controller = new AbortController();

        if (!data.city_id) {
            setDistricts([]);
            return;
        }
        setLoadingDistricts(true);
        fetch(REGION_ENDPOINTS.districts(data.city_id), { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error('Gagal memuat kecamatan');
                return res.json();
            })
            .then((options) => {
                if (!controller.signal.aborted) setDistricts(options);
            })
            .catch((reason) => {
                if (reason.name !== 'AbortError') setDistricts([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoadingDistricts(false);
            });

        return () => controller.abort();
    }, [data.city_id]);

    function handleProvinceChange(e) {
        setData((prev) => ({
            ...prev,
            province_id: e.target.value,
            city_id: '',
            district_id: '',
        }));
    }

    function handleCityChange(e) {
        setData((prev) => ({
            ...prev,
            city_id: e.target.value,
            district_id: '',
        }));
    }

    async function handleMapAddressSelect({ address, province, city, district }) {
        setData('address', address);

        try {
            const provinceOptions = provinces.length
                ? provinces
                : await fetch(REGION_ENDPOINTS.provinces).then((res) => res.json());
            const selectedProvince = findRegionOption(provinceOptions, province);
            if (!selectedProvince) return;

            setData((prev) => ({ ...prev, province_id: selectedProvince.id, city_id: '', district_id: '' }));
            setLoadingCities(true);
            const cityOptions = await fetch(REGION_ENDPOINTS.cities(selectedProvince.id)).then((res) => res.json());
            setCities(cityOptions);
            const selectedCity = findRegionOption(cityOptions, city);
            if (!selectedCity) return;

            setData((prev) => ({ ...prev, province_id: selectedProvince.id, city_id: selectedCity.id, district_id: '' }));
            setLoadingDistricts(true);
            const districtOptions = await fetch(REGION_ENDPOINTS.districts(selectedCity.id)).then((res) => res.json());
            setDistricts(districtOptions);
            const selectedDistrict = findRegionOption(districtOptions, district);
            if (selectedDistrict) {
                setData((prev) => ({ ...prev, province_id: selectedProvince.id, city_id: selectedCity.id, district_id: selectedDistrict.id }));
            }
        } finally {
            setLoadingCities(false);
            setLoadingDistricts(false);
        }
    }

    function submit(e) {
        e.preventDefault();
        if (isEdit) {
            setEditConfirmOpen(true);
        } else {
            post('/app/profile/alamat');
        }
    }

    function updateAddress() {
        put(`/app/profile/alamat/${address.id}`, {
            onFinish: () => setEditConfirmOpen(false),
        });
    }

    return (
        <CustomerLayout
            title={isEdit ? 'Edit Alamat' : 'Tambah Alamat'}
            backHref="/app/profile/alamat"
        >
            <Head title={isEdit ? 'Edit Alamat' : 'Tambah Alamat'} />

            <div className="mx-auto max-w-lg px-4 py-6">
                <form
                    onSubmit={submit}
                    className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-900/5 dark:border-gray-800 dark:bg-gray-900 md:p-8"
                >
                    <div className="space-y-5">
                        {/* Nama Penerima */}
                        <div>
                            <FieldLabel>Nama Penerima</FieldLabel>
                            <div className={wrapperClass(errors.name)}>
                                <IconIn icon={User} />
                                <input
                                    type="text"
                                    placeholder="Nama Penerima"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <FieldError message={errors.name} />
                        </div>

                        {/* Nomor Telepon */}
                        <div>
                            <FieldLabel>Nomor Telepon</FieldLabel>
                            <div className={wrapperClass(errors.phone)}>
                                <IconIn icon={Phone} />
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder="cth : 081221212100"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value.replace(/\D/g, ''))}
                                    className={inputClass}
                                />
                            </div>
                            <FieldError message={errors.phone} />
                        </div>

                        {/* Provinsi */}
                        <div>
                            <FieldLabel>Provinsi</FieldLabel>
                            <SelectField
                                icon={MapPin}
                                value={data.province_id}
                                onChange={handleProvinceChange}
                                placeholder="Pilih Provinsi"
                                options={provinces}
                                error={errors.province_id}
                            />
                            <FieldError message={errors.province_id} />
                        </div>

                        {/* Kabupaten/Kota */}
                        <div>
                            <FieldLabel>Kabupaten/Kota</FieldLabel>
                            <SelectField
                                icon={Building2}
                                value={data.city_id}
                                onChange={handleCityChange}
                                placeholder={
                                    loadingCities ? 'Memuat...' : 'Pilih Kabupaten/Kota'
                                }
                                options={cities}
                                disabled={!data.province_id || loadingCities}
                                error={errors.city_id}
                            />
                            <FieldError message={errors.city_id} />
                        </div>

                        {/* Kecamatan */}
                        <div>
                            <FieldLabel>Kecamatan</FieldLabel>
                            <SelectField
                                icon={Landmark}
                                value={data.district_id}
                                onChange={(e) => setData('district_id', e.target.value)}
                                placeholder={
                                    loadingDistricts ? 'Memuat...' : 'Pilih Kecamatan'
                                }
                                options={districts}
                                disabled={!data.city_id || loadingDistricts}
                                error={errors.district_id}
                            />
                            <FieldError message={errors.district_id} />
                        </div>

                        {/* Alamat Lengkap */}
                        <div>
                            <FieldLabel>Alamat Lengkap</FieldLabel>
                            <div className={wrapperClass(errors.address)}>
                                <IconIn icon={MapPin} top />
                                <textarea
                                    rows={3}
                                    placeholder="cth : Jalan Kampus Merdeka"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                            <GoogleMapAddressPicker onAddressSelect={handleMapAddressSelect} />
                            <FieldError message={errors.address} />
                        </div>

                        {/* Catatan */}
                        <div>
                            <FieldLabel>Catatan</FieldLabel>
                            <div className={wrapperClass(errors.notes)}>
                                <IconIn icon={StickyNote} top />
                                <textarea
                                    rows={2}
                                    placeholder="cth: Masuk gang depan"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                            <FieldError message={errors.notes} />
                        </div>

                        {/* Atur Sebagai Alamat Utama */}
                        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3.5 dark:border-gray-700 dark:bg-gray-800">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Atur Sebagai Alamat Utama
                            </span>
                            <button
                                type="button"
                                onClick={() => setData('is_primary', !data.is_primary)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                    data.is_primary
                                        ? 'bg-[#008736]'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                                        data.is_primary ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#008736] hover:bg-green-800 active:scale-[0.99] py-3.5 text-sm font-bold text-white shadow-lg shadow-green-700/25 transition-all disabled:opacity-60"
                        >
                            {processing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <span>{isEdit ? 'Simpan dan Perbarui' : 'Simpan'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {editConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-[#008736] dark:bg-green-950/50 dark:text-green-400">
                                <Pencil size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Simpan Perubahan?</h2>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                    Pastikan data alamat yang kamu ubah sudah benar sebelum disimpan.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 rounded-xl bg-green-50 px-3 py-2.5 text-xs leading-relaxed text-green-800 dark:bg-green-950/30 dark:text-green-300">
                            Perubahan alamat akan langsung diterapkan pada pesanan berikutnya.
                        </div>
                        <div className="mt-5 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setEditConfirmOpen(false)}
                                disabled={processing}
                                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={updateAddress}
                                disabled={processing}
                                className="flex-1 rounded-xl bg-[#008736] py-2.5 text-xs font-bold text-white transition hover:bg-green-800 disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : 'Ya, Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}       