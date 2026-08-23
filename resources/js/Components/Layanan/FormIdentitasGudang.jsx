import { useEffect, useState } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const inputClass = (hasError) =>
    `mt-1 w-full rounded-lg border-none bg-gray-100 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50 ${
        hasError ? 'ring-2 ring-red-400' : 'focus:ring-green-500'
    }`;

export default function FormIdentitasGudang({ kategori, editingItem, onBatal, onSukses }) {
    const { data, setData, post, processing, errors } = useForm({
        kategori,
        nama_usaha: editingItem?.nama_usaha ?? '',
        provinsi: editingItem?.provinsi ?? '',
        kabupaten_kota: editingItem?.kabupaten_kota ?? '',
        kecamatan: editingItem?.kecamatan ?? '',
        alamat_lengkap: editingItem?.alamat_lengkap ?? '',
        catatan_alamat: editingItem?.catatan_alamat ?? '',
        foto_lahan: editingItem?.foto_lahan ?? '',
        panjang: editingItem?.panjang ?? '',
        lebar: editingItem?.lebar ?? '',
    });

    // Data wilayah bertingkat: provinsi -> kabupaten/kota -> kecamatan.
    // Memakai endpoint /api/wilayah yang sudah ada di project.
    const [daftarProvinsi, setDaftarProvinsi] = useState([]);
    const [daftarKabupaten, setDaftarKabupaten] = useState([]);
    const [daftarKecamatan, setDaftarKecamatan] = useState([]);

    const [provinsiId, setProvinsiId] = useState('');
    const [kabupatenId, setKabupatenId] = useState('');
    const [editingFoto, setEditingFoto] = useState(false);

    useEffect(() => {
        fetch('/api/wilayah/provinces')
            .then((res) => res.json())
            .then(setDaftarProvinsi)
            .catch(() => setDaftarProvinsi([]));
    }, []);

    function handleProvinsiChange(e) {
        const id = e.target.value;
        const nama = e.target.options[e.target.selectedIndex]?.text ?? '';
        setProvinsiId(id);
        setData((prev) => ({ ...prev, provinsi: nama, kabupaten_kota: '', kecamatan: '' }));
        setDaftarKabupaten([]);
        setDaftarKecamatan([]);
        setKabupatenId('');

        if (id) {
            fetch(`/api/wilayah/regencies/${id}`)
                .then((res) => res.json())
                .then(setDaftarKabupaten)
                .catch(() => setDaftarKabupaten([]));
        }
    }

    function handleKabupatenChange(e) {
        const id = e.target.value;
        const nama = e.target.options[e.target.selectedIndex]?.text ?? '';
        setKabupatenId(id);
        setData((prev) => ({ ...prev, kabupaten_kota: nama, kecamatan: '' }));
        setDaftarKecamatan([]);

        if (id) {
            fetch(`/api/wilayah/districts/${id}`)
                .then((res) => res.json())
                .then(setDaftarKecamatan)
                .catch(() => setDaftarKecamatan([]));
        }
    }

    function handleKecamatanChange(e) {
        const nama = e.target.options[e.target.selectedIndex]?.text ?? '';
        setData('kecamatan', nama);
    }

    const submit = (e) => {
        e.preventDefault();

        if (editingItem) {
            router.post(`/mitra/layanan/${editingItem.id}`, { ...data, _method: 'put' }, {
                onSuccess: onSukses,
            });
        } else {
            post('/mitra/layanan', {
                onSuccess: onSukses,
            });
        }
    };

    return (
        <div className="flex min-h-dvh flex-col bg-white">
            <Head title="Alamat Gudang" />

            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <button type="button" onClick={onBatal} className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-base font-semibold text-gray-900">Alamat Gudang</h1>
            </div>

            <div className="flex gap-1 px-4 pt-3">
                <div className="h-1.5 flex-1 rounded-full bg-green-600" />
                <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
            </div>

            <form onSubmit={submit} className="flex-1 space-y-4 px-4 py-4">
                <div>
                    <h2 className="text-base font-bold text-gray-900">Alamat</h2>
                    <p className="text-xs text-gray-400">Isikan alamat gudang anda di bawah sini</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Usaha</label>
                    <input
                        type="text"
                        placeholder="Ex : Titipsini_buanguntapan"
                        value={data.nama_usaha}
                        onChange={(e) => setData('nama_usaha', e.target.value)}
                        className={inputClass(errors.nama_usaha)}
                    />
                    {errors.nama_usaha && <p className="mt-1 text-xs text-red-600">{errors.nama_usaha}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Provinsi</label>
                    <div className="relative">
                        <select
                            value={provinsiId}
                            onChange={handleProvinsiChange}
                            className={`${inputClass(errors.provinsi)} appearance-none pr-8`}
                        >
                            <option value="">Provinsi</option>
                            {daftarProvinsi.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.provinsi && <p className="mt-1 text-xs text-red-600">{errors.provinsi}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Kabupaten/Kota</label>
                    <div className="relative">
                        <select
                            value={kabupatenId}
                            onChange={handleKabupatenChange}
                            disabled={!provinsiId}
                            className={`${inputClass(errors.kabupaten_kota)} appearance-none pr-8`}
                        >
                            <option value="">Kabupaten/Kota</option>
                            {daftarKabupaten.map((k) => (
                                <option key={k.id} value={k.id}>{k.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.kabupaten_kota && <p className="mt-1 text-xs text-red-600">{errors.kabupaten_kota}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
                    <div className="relative">
                        <select
                            onChange={handleKecamatanChange}
                            disabled={!kabupatenId}
                            defaultValue=""
                            className={`${inputClass(errors.kecamatan)} appearance-none pr-8`}
                        >
                            <option value="">Kecamatan</option>
                            {daftarKecamatan.map((k) => (
                                <option key={k.id} value={k.id}>{k.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.kecamatan && <p className="mt-1 text-xs text-red-600">{errors.kecamatan}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                    <textarea
                        rows={3}
                        placeholder="Jl. Jlagran Lor No.2, Pringgokusuman, Gedong Tengen, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55271"
                        value={data.alamat_lengkap}
                        onChange={(e) => setData('alamat_lengkap', e.target.value)}
                        className={inputClass(errors.alamat_lengkap)}
                    />
                    {errors.alamat_lengkap && <p className="mt-1 text-xs text-red-600">{errors.alamat_lengkap}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Catatan Alamat</label>
                    <p className="text-xs text-gray-400">
                        Mendeskripsikan tempat dan patokan agar lahan Gudang anda mudah ditemukan (opsional)
                    </p>
                    <textarea
                        rows={3}
                        placeholder="Lokasi gudang penitipan berada di sebelah kanan di samping oleh oleh jogja"
                        value={data.catatan_alamat}
                        onChange={(e) => setData('catatan_alamat', e.target.value)}
                        className={inputClass(errors.catatan_alamat)}
                    />
                    {errors.catatan_alamat && <p className="mt-1 text-xs text-red-600">{errors.catatan_alamat}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Foto Lahan</label>
                    <p className="text-xs text-gray-400">Sertakan Foto Lahan dari depan, belakang, samping Kiri dan Kanan</p>
                    <textarea
                        rows={2}
                        placeholder="Link Drive"
                        value={data.foto_lahan}
                        onChange={(e) => setData('foto_lahan', e.target.value)}
                        className={inputClass(errors.foto_lahan)}
                    />
                    {errors.foto_lahan && <p className="mt-1 text-xs text-red-600">{errors.foto_lahan}</p>}
                </div>

                <div>
                    <h2 className="text-base font-bold text-gray-900">Luas Lahan</h2>
                    <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-16 text-sm text-gray-700">Panjang</span>
                            <span className="text-sm text-gray-700">:</span>
                            <input
                                type="number"
                                value={data.panjang}
                                onChange={(e) => setData('panjang', e.target.value)}
                                className="w-24 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">M</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-16 text-sm text-gray-700">Lebar</span>
                            <span className="text-sm text-gray-700">:</span>
                            <input
                                type="number"
                                value={data.lebar}
                                onChange={(e) => setData('lebar', e.target.value)}
                                className="w-24 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">M</span>
                        </div>
                    </div>
                    {(errors.panjang || errors.lebar) && (
                        <p className="mt-1 text-xs text-red-600">{errors.panjang || errors.lebar}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-full bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                    Lanjutkan
                </button>
            </form>
        </div>
    );
}