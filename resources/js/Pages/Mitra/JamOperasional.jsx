import { Head, useForm, Link } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft } from 'lucide-react';

const KATEGORI_OPTIONS = [
    { value: 'barang', label: 'Barang' },
    { value: 'bangunan', label: 'Bangunan' },
    { value: 'kendaraan', label: 'Kendaraan' },
    { value: 'pindahan', label: 'Pindahan' },
];

export default function JamOperasional({ jamOperasional }) {
    const { data, setData, put, processing, errors } = useForm({
        toko_buka: jamOperasional.toko_buka ?? true,
        jam_buka: jamOperasional.jam_buka ?? '',
        jam_tutup: jamOperasional.jam_tutup ?? '',
        layanan_kategori: jamOperasional.layanan_kategori ?? [],
    });

    const submit = (e) => {
        e.preventDefault();
        put('/mitra/layanan/jam-operasional');
    };

    const toggleKategori = (value) => {
        if (data.layanan_kategori.includes(value)) {
            setData(
                'layanan_kategori',
                data.layanan_kategori.filter((v) => v !== value)
            );
        } else {
            setData('layanan_kategori', [...data.layanan_kategori, value]);
        }
    };

    return (
        <MitraLayout>
            <Head title="Jam Operasional" />

            <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
                <Link href="/mitra/profil" className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-base font-semibold text-gray-900">Jam Operasional</h1>
            </div>

            <form onSubmit={submit} className="space-y-4 px-4 py-4">
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                    <div>
                        <p className="text-sm font-medium text-gray-800">Status Toko</p>
                        <p className="text-xs text-gray-500">{data.toko_buka ? 'Sedang buka, menerima pesanan' : 'Sedang tutup'}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setData('toko_buka', !data.toko_buka)}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                            data.toko_buka ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                    >
                        <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                data.toko_buka ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                        />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jam Buka</label>
                        <input
                            type="time"
                            value={data.jam_buka}
                            onChange={(e) => setData('jam_buka', e.target.value)}
                            className={`mt-1 w-full rounded-lg text-sm ${
                                errors.jam_buka ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                            }`}
                        />
                        {errors.jam_buka && <p className="mt-1 text-xs text-red-600">{errors.jam_buka}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jam Tutup</label>
                        <input
                            type="time"
                            value={data.jam_tutup}
                            onChange={(e) => setData('jam_tutup', e.target.value)}
                            className={`mt-1 w-full rounded-lg text-sm ${
                                errors.jam_tutup ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                            }`}
                        />
                        {errors.jam_tutup && <p className="mt-1 text-xs text-red-600">{errors.jam_tutup}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Kategori Layanan</label>
                    <p className="text-xs text-gray-500">Pilih kategori yang kamu layani</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {KATEGORI_OPTIONS.map((opt) => {
                            const checked = data.layanan_kategori.includes(opt.value);
                            return (
                                <label
                                    key={opt.value}
                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                                        checked ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-700'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleKategori(opt.value)}
                                        className="rounded text-green-600 focus:ring-green-500"
                                    />
                                    {opt.label}
                                </label>
                            );
                        })}
                    </div>
                    {errors.layanan_kategori && <p className="mt-1 text-xs text-red-600">{errors.layanan_kategori}</p>}
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