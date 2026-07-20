import { Head, useForm, Link } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft, Pencil } from 'lucide-react';

export default function Alamat({ alamat, kotaOptions = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        address: alamat.address ?? '',
        city: alamat.city ?? '',
        provinsi: alamat.provinsi ?? '',
        kecamatan: alamat.kecamatan ?? '',
        wilayah: alamat.wilayah ?? '',
        postal_code: alamat.postal_code ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/mitra/alamat');
    };

    return (
        <MitraLayout>
            <Head title="Alamat" />

            <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
                <Link href="/mitra/profil" className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-base font-semibold text-gray-900">Alamat</h1>
            </div>

            <form onSubmit={submit} className="space-y-4 px-4 py-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                    <div className="relative mt-1">
                        <textarea
                            rows={3}
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Nama jalan, nomor, RT/RW, patokan"
                            className={`w-full rounded-lg text-sm pr-8 ${
                                errors.address ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                            }`}
                        />
                        <Pencil size={13} className="pointer-events-none absolute right-3 top-3 text-gray-300" />
                    </div>
                    {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Kota</label>
                    <select
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className={`mt-1 w-full rounded-lg text-sm ${
                            errors.city ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        }`}
                    >
                        <option value="">Pilih kota</option>
                        {kotaOptions.map((nama) => (
                            <option key={nama} value={nama}>
                                {nama}
                            </option>
                        ))}
                    </select>
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                </div>

                <Field label="Provinsi" value={data.provinsi} onChange={(v) => setData('provinsi', v)} error={errors.provinsi} />
                <Field label="Kecamatan" value={data.kecamatan} onChange={(v) => setData('kecamatan', v)} error={errors.kecamatan} />
                <Field label="Wilayah / Kelurahan" value={data.wilayah} onChange={(v) => setData('wilayah', v)} error={errors.wilayah} />
                <Field
                    label="Kode Pos"
                    value={data.postal_code}
                    onChange={(v) => setData('postal_code', v)}
                    error={errors.postal_code}
                />

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                >
                    Simpan
                </button>
            </form>
        </MitraLayout>
    );
}

function Field({ label, value, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative mt-1">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full rounded-lg text-sm pr-8 ${
                        error ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                />
                <Pencil size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}