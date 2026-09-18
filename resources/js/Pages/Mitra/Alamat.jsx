import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft, Pencil, MapPin } from 'lucide-react';

export default function Alamat({ alamat, kotaOptions = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        address: alamat.address ?? '',
        city: alamat.city ?? '',
        provinsi: alamat.provinsi ?? '',
        kecamatan: alamat.kecamatan ?? '',
        wilayah: alamat.wilayah ?? '',
        postal_code: alamat.postal_code ?? '',
    });

    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [kotaList, setKotaList] = useState(kotaOptions ?? []);

    async function useCurrentLocation() {
        setLocationError('');
        if (!navigator.geolocation) {
            setLocationError('Geolokasi tidak didukung perangkat ini.');
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const { data } = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                        params: {
                            lat: latitude,
                            lon: longitude,
                            format: 'jsonv2',
                            addressdetails: 1,
                            'accept-language': 'id',
                        },
                    });

                    const a = data?.address ?? {};
                    const display = data?.display_name ?? '';
                    const detectedCity = a.city || a.town || a.county || '';
                    const detectedWilayah = a.village || a.suburb || a.neighbourhood || a.locality || a.road || '';
                    const detectedKecamatan = a.city_district || a.county || '';

                    if (display) setData('address', display);
                    // DEBUG (sementara): lihat field apa saja yang dikembalikan Nominatim untuk lokasi Anda
                    console.log('[Alamat] Nominatim address keys:', a);
                    if (a.state) setData('provinsi', a.state);
                    if (detectedKecamatan) setData('kecamatan', detectedKecamatan);
                    if (detectedWilayah) setData('wilayah', detectedWilayah);
                    if (a.postcode) setData('postal_code', a.postcode);
                    if (detectedCity) {
                        if (!kotaList.includes(detectedCity)) {
                            setKotaList((prev) => [...prev, detectedCity]);
                        }
                        setData('city', detectedCity);
                    }
                } catch {
                    setLocationError('Gagal menentukan lokasi. Silakan isi alamat manual.');
                } finally {
                    setLocating(false);
                }
            },
            () => {
                setLocationError('Akses lokasi ditolak. Silakan isi alamat manual.');
                setLocating(false);
            }
        );
    }

    const submit = (e) => {
        e.preventDefault();
        put('/mitra/alamat');
    };

    return (
        <MitraLayout>
            <Head title="Alamat" />

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
                    <label className="block text-sm font-medium text-gray-700">Kota/Kecamatan</label>
                    <select
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className={`mt-1 w-full rounded-lg text-sm ${
                            errors.city ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        }`}
                    >
                        <option value="">Pilih kota</option>
                        {kotaList.map((nama) => (
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

                <div className="pt-2">
                    <button
                        type="button"
                        onClick={useCurrentLocation}
                        disabled={locating}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        <MapPin size={14} />
                        {locating ? 'Mendeteksi...' : 'Gunakan Lokasi Saat Ini'}
                    </button>
                    {locationError && <p className="mt-1 text-xs text-red-600">{locationError}</p>}
                </div>

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