import { useEffect, useState } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const inputClass = (hasError) =>
    `mt-1 w-full rounded-lg border-none bg-gray-100 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50 ${
        hasError ? 'ring-2 ring-red-400' : 'focus:ring-green-500'
    }`;

const STATUS_OPTIONS = [
    { value: 'pemilik', label: 'Pemilik' },
    { value: 'penyewa', label: 'Penyewa' },
    { value: 'pengelola', label: 'Pengelola' },
];

export default function FormIdentitasPenjaga({ kategori, editingItem, onBatal, onSukses }) {
    const { data, setData, post, processing, errors } = useForm({
        kategori,
        nama_usaha: editingItem?.nama_usaha ?? '',
        nama_penjaga: editingItem?.nama_penjaga ?? '',
        nomor_telepon: editingItem?.nomor_telepon ?? '',
        tanggal_lahir: editingItem?.tanggal_lahir ?? '',
        provinsi: editingItem?.provinsi ?? '',
        kabupaten_kota: editingItem?.kabupaten_kota ?? '',
        kecamatan: editingItem?.kecamatan ?? '',
        alamat_lengkap: editingItem?.alamat_lengkap ?? '',
        status: editingItem?.status ?? 'pemilik',
        upload_berkas: editingItem?.upload_berkas ?? '',
    });

    // Data wilayah bertingkat: provinsi -> kabupaten/kota -> kecamatan.
    // Memakai endpoint /api/wilayah yang sudah ada di project.
    const [daftarProvinsi, setDaftarProvinsi] = useState([]);
    const [daftarKabupaten, setDaftarKabupaten] = useState([]);
    const [daftarKecamatan, setDaftarKecamatan] = useState([]);

    const [provinsiId, setProvinsiId] = useState('');
    const [kabupatenId, setKabupatenId] = useState('');

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
            <Head title="Identitas Penjaga" />

            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <button type="button" onClick={onBatal} className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-base font-semibold text-gray-900">Identitas Penjaga</h1>
            </div>

            <div className="flex gap-1 px-4 pt-3">
                <div className="h-1.5 flex-1 rounded-full bg-green-600" />
                <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
            </div>

            <form onSubmit={submit} className="flex-1 space-y-4 px-4 py-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Usaha</label>
                    <input
                        type="text"
                        placeholder="Ex.Titipsini_banguntapan"
                        value={data.nama_usaha}
                        onChange={(e) => setData('nama_usaha', e.target.value)}
                        className={inputClass(errors.nama_usaha)}
                    />
                    {errors.nama_usaha && <p className="mt-1 text-xs text-red-600">{errors.nama_usaha}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Penjaga</label>
                    <input
                        type="text"
                        placeholder="Ex. Muhammad"
                        value={data.nama_penjaga}
                        onChange={(e) => setData('nama_penjaga', e.target.value)}
                        className={inputClass(errors.nama_penjaga)}
                    />
                    {errors.nama_penjaga && <p className="mt-1 text-xs text-red-600">{errors.nama_penjaga}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Ex. 08775678999"
                        value={data.nomor_telepon}
                        onChange={(e) => setData('nomor_telepon', e.target.value.replace(/\D/g, ''))}
                        className={inputClass(errors.nomor_telepon)}
                    />
                    {errors.nomor_telepon && <p className="mt-1 text-xs text-red-600">{errors.nomor_telepon}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                    <input
                        type="text"
                        placeholder="Ex. 23/04/1991"
                        value={data.tanggal_lahir}
                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                        className={inputClass(errors.tanggal_lahir)}
                    />
                    {errors.tanggal_lahir && <p className="mt-1 text-xs text-red-600">{errors.tanggal_lahir}</p>}
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
                        placeholder="Alamat lengkap"
                        value={data.alamat_lengkap}
                        onChange={(e) => setData('alamat_lengkap', e.target.value)}
                        className={inputClass(errors.alamat_lengkap)}
                    />
                    {errors.alamat_lengkap && <p className="mt-1 text-xs text-red-600">{errors.alamat_lengkap}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="relative">
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className={`${inputClass(errors.status)} appearance-none pr-8`}
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Berkas</label>
                    <p className="text-xs text-gray-400">Sertakan berkas KTP dan SKCK menjadi satu dalam bentuk link!</p>
                    <textarea
                        rows={2}
                        placeholder="Link Drive"
                        value={data.upload_berkas}
                        onChange={(e) => setData('upload_berkas', e.target.value)}
                        className={inputClass(errors.upload_berkas)}
                    />
                    {errors.upload_berkas && <p className="mt-1 text-xs text-red-600">{errors.upload_berkas}</p>}
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