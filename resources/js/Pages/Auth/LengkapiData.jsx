import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const WILAYAH_API = '/api/wilayah';

export default function LengkapiData() {
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        phone: '',
        tanggal_lahir: '',
        gender: '',
        address: '',
        provinsi: '',
        provinsi_id: '',
        city: '',
        city_id: '',
        kecamatan: '',
        postal_code: '',
    });

    useEffect(() => {
        fetch(`${WILAYAH_API}/provinces`)
            .then((res) => res.json())
            .then(setProvinces)
            .catch(() => setProvinces([]));
    }, []);

    function handleProvinceChange(e) {
        const id = e.target.value;
        const name = e.target.selectedOptions[0]?.dataset.name ?? '';
        setData((prev) => ({
            ...prev,
            provinsi_id: id,
            provinsi: name,
            city: '',
            city_id: '',
            kecamatan: '',
        }));
        setRegencies([]);
        setDistricts([]);
        if (id) {
            fetch(`${WILAYAH_API}/regencies/${id}`)
                .then((res) => res.json())
                .then(setRegencies)
                .catch(() => setRegencies([]));
        }
    }

    function handleRegencyChange(e) {
        const id = e.target.value;
        const name = e.target.selectedOptions[0]?.dataset.name ?? '';
        setData((prev) => ({ ...prev, city_id: id, city: name, kecamatan: '' }));
        setDistricts([]);
        if (id) {
            fetch(`${WILAYAH_API}/districts/${id}`)
                .then((res) => res.json())
                .then(setDistricts)
                .catch(() => setDistricts([]));
        }
    }

    function handleDistrictChange(e) {
        const name = e.target.selectedOptions[0]?.dataset.name ?? '';
        setData('kecamatan', name);
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('customer.lengkapi-data.store'));
    }

    function inputClass(hasError) {
        return `w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${hasError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-brand-teal-500 focus:ring-brand-teal-500'
            }`;
    }

    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white px-6 pb-10">
            <Head title="Isi Data Dirimu" />

            <div className="flex items-center gap-3 pt-6">
                <Link href={route('customer.lengkapi-data.intro')} className="text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-base font-semibold text-gray-900">Daftar</h1>
            </div>

            <div className="mt-2 h-1 w-full rounded-full bg-gray-100">
                <div className="h-1 w-full rounded-full bg-brand-teal-600" />
            </div>

            <h2 className="mt-6 text-lg font-semibold text-gray-900">Isi Data Dirimu Yuk! 👋</h2>
            <p className="mt-1 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                Lengkapi data diri untuk memperoleh verifikasi resmi dan menikmati semua fitur di
                aplikasi dan sistem informasi Titipsini.com
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <Field label="Nama Lengkap" error={errors.name}>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nama Lengkap"
                        className={inputClass(errors.name)}
                    />
                </Field>

                <Field label="Username" error={errors.username}>
                    <input
                        type="text"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        placeholder="Username"
                        className={inputClass(errors.username)}
                    />
                </Field>

                <Field label="Nomor Telepon" error={errors.phone}>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="Nomor Telepon"
                        className={inputClass(errors.phone)}
                    />
                </Field>

                <Field label="Tanggal Lahir" error={errors.tanggal_lahir}>
                    <input
                        type="date"
                        value={data.tanggal_lahir}
                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                        className={inputClass(errors.tanggal_lahir)}
                    />
                </Field>

                <Field label="Jenis Kelamin" error={errors.gender}>
                    <div className="flex gap-6 pt-1">
                        {[
                            { value: 'male', label: 'Pria' },
                            { value: 'female', label: 'Wanita' },
                        ].map((option) => (
                            <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="radio"
                                    name="gender"
                                    checked={data.gender === option.value}
                                    onChange={() => setData('gender', option.value)}
                                    className="accent-brand-teal-600"
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </Field>

                <Field label="Alamat Lengkap" error={errors.address}>
                    <textarea
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Alamat Lengkap"
                        rows={3}
                        className={inputClass(errors.address)}
                    />
                </Field>

                <Field label="Provinsi" error={errors.provinsi}>
                    <select
                        value={data.provinsi_id}
                        onChange={handleProvinceChange}
                        className={inputClass(errors.provinsi)}
                    >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map((p) => (
                            <option key={p.id} value={p.id} data-name={p.name}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Kota/Kabupaten" error={errors.city}>
                    <select
                        value={data.city_id}
                        onChange={handleRegencyChange}
                        disabled={!data.provinsi_id}
                        className={inputClass(errors.city)}
                    >
                        <option value="">Pilih Kota/Kabupaten</option>
                        {regencies.map((r) => (
                            <option key={r.id} value={r.id} data-name={r.name}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Kecamatan" error={errors.kecamatan}>
                    <select
                        value={data.kecamatan}
                        onChange={handleDistrictChange}
                        disabled={!data.city_id}
                        className={inputClass(errors.kecamatan)}
                    >
                        <option value="">Pilih Kecamatan</option>
                        {districts.map((d) => (
                            <option key={d.id} value={d.name} data-name={d.name}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Kode Pos" error={errors.postal_code}>
                    <input
                        type="text"
                        value={data.postal_code}
                        onChange={(e) => setData('postal_code', e.target.value)}
                        placeholder="Kode Pos"
                        className={inputClass(errors.postal_code)}
                    />
                </Field>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-brand-teal-700 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                    Lanjutkan
                </button>
            </form>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="mb-1 block text-sm text-gray-700">
                {label} <span className="text-red-500">*</span>
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}