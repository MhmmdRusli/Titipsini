import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

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
        return `w-full rounded-xl border-none bg-[#f4f7fc] px-4 py-3.5 text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 transition-all ${
            hasError ? 'ring-2 ring-red-500' : ''
        }`;
    }

    return (
        // Backdrop abu-abu di layar lebar (desktop) agar konsisten dengan halaman login
        <div className="min-h-dvh bg-gray-100 sm:flex sm:items-center sm:justify-center sm:py-6">
            
            {/* Bodi Utama Bingkai HP */}
            <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white sm:min-h-[850px] sm:shadow-xl">
                <Head title="Isi Data Dirimu" />

                {/* Header dengan tombol kembali & Progress Bar */}
                <div 
                    className="border-b border-gray-100 px-4 pb-3"
                    style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <Link href={route('customer.lengkapi-data.intro')} className="text-gray-800 hover:opacity-70 flex items-center justify-center p-1 rounded-lg active:bg-gray-50">
                            <ChevronLeft size={22} strokeWidth={2.5} />
                        </Link>
                        <h2 className="text-base font-bold text-gray-900">Daftar</h2>
                        <div className="w-6"></div> {/* Spacer penyeimbang */}
                    </div>
                    
                    {/* Progress Bar Indikator Hijau */}
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full w-1/2 rounded-full bg-[#15803d]" />
                    </div>
                </div>

                {/* Konten Utama Form (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8">
                    
                    {/* Logo Image dan Teks Utama */}
                    <div className="mb-6 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center justify-center gap-3">
                            <img
                                src="/images/logo-titipsini.png"
                                alt="Logo Icon"
                                className="h-10 w-auto object-contain"
                            />
                            <div className="text-2xl font-bold tracking-tight text-[#15803d]">
                                Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium tracking-wide mt-2">
                            Tempat Terbaik untuk Barang Berharga Anda
                        </p>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900">Isi Data Dirimu Yuk! 👋</h2>
                    
                    {/* Box Alert Berwarna Hijau Lembut Sesuai Gambar */}
                    <div className="mt-3 rounded-xl bg-green-50/70 border border-green-100/50 p-3 flex gap-2.5 items-start">
                        <span className="text-red-500 mt-0.5 text-xs">🔴</span>
                        <div className="text-[11px] text-green-700 font-medium leading-relaxed">
                            <span className="font-bold">Lengkapi data diri untuk memperoleh verifikasi</span>
                            <p className="mt-0.5 text-green-600/90 font-normal">
                                Kami melindungi informasi dan penggunaan data diri yang telah Kamu kirimkan untuk kenyamanan pengguna.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                                    <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            checked={data.gender === option.value}
                                            onChange={() => setData('gender', option.value)}
                                            className="h-4 w-4 accent-[#15803d]"
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
                            <select
                                value={data.postal_code}
                                onChange={(e) => setData('postal_code', e.target.value)}
                                className={inputClass(errors.postal_code)}
                            >
                                <option value="">Pilih Kodepos</option>
                                {/* Silahkan map opsi kode pos jika ada data API-nya */}
                                <option value="12345">12345</option> 
                            </select>
                        </Field>

                        {/* Tombol Aksi Utama */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#166534] active:scale-[0.99] disabled:opacity-50 mt-4 shadow-sm"
                        >
                            Lanjutkan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Komponen Field Kustom dengan Tanda Bintang di Kiri Label
function Field({ label, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
                <span className="text-red-500 mr-0.5">*</span>{label}
            </label>
            {children}
            {error && <p className="text-xs font-medium text-red-500 mt-1">{error}</p>}
        </div>
    );
}