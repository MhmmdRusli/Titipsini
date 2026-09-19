import { useEffect, useRef, useState } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import { ChevronDown, ImagePlus, X } from 'lucide-react';

const JENIS_KENDARAAN_OPTIONS = [
    { value: 'motor', label: 'Motor' },
    { value: 'mobil', label: 'Mobil' },
    { value: 'truk', label: 'Truk' },
    { value: 'becak', label: 'Becak' },
    { value: 'sepeda', label: 'Sepeda' },
    { value: 'bus', label: 'Bus' },
    { value: 'mobil_pick_up', label: 'Mobil pick up' },
];

const inputClass = (hasError) =>
    `mt-1 w-full rounded-lg border-none bg-gray-100 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50 ${
        hasError ? 'ring-2 ring-red-400' : 'focus:ring-green-500'
    }`;

const MAKS_FOTO = 8;

export default function FormAlamatLahanParkir({ kategori, editingItem, onBatal, onSukses }) {
    const { data, setData, post, put, processing, errors, transform } = useForm({
        kategori,
        nama_usaha: editingItem?.nama_usaha ?? '',
        jenis_kendaraan: editingItem?.jenis_kendaraan ?? '',
        provinsi: editingItem?.provinsi ?? '',
        kabupaten_kota: editingItem?.kabupaten_kota ?? '',
        kecamatan: editingItem?.kecamatan ?? '',
        alamat_lengkap: editingItem?.alamat_lengkap ?? '',
        catatan_alamat: editingItem?.catatan_alamat ?? '',
        foto_lahan: [],
        panjang: editingItem?.panjang ?? '',
        lebar: editingItem?.lebar ?? '',
        latitude: editingItem?.latitude ?? '',
        longitude: editingItem?.longitude ?? '',
    });

    // Data wilayah bertingkat: provinsi -> kabupaten/kota -> kecamatan.
    // Memakai endpoint /api/wilayah yang sudah ada di project.
    const [daftarProvinsi, setDaftarProvinsi] = useState([]);
    const [daftarKabupaten, setDaftarKabupaten] = useState([]);
    const [daftarKecamatan, setDaftarKecamatan] = useState([]);

    const [provinsiId, setProvinsiId] = useState('');
    const [kabupatenId, setKabupatenId] = useState('');

    // Foto lahan yang sudah ada sebelumnya (mode edit) — ditampilkan
    // sebagai info, bukan file baru yang diupload ulang.
    const [existingFotoLahan] = useState(() => {
        if (!editingItem?.foto_lahan) return [];
        return Array.isArray(editingItem.foto_lahan) ? editingItem.foto_lahan : [editingItem.foto_lahan];
    });

    // Foto baru yang dipilih user (belum diupload, masih di browser).
    const [fotoLahanFiles, setFotoLahanFiles] = useState([]);
    const [fotoLahanPreviews, setFotoLahanPreviews] = useState([]);
    const [fotoLahanError, setFotoLahanError] = useState('');
    const fotoLahanInputRef = useRef(null);

    useEffect(() => {
        fetch('/api/wilayah/provinces')
            .then((res) => res.json())
            .then(setDaftarProvinsi)
            .catch(() => setDaftarProvinsi([]));
    }, []);

    // Bersihkan object URL preview supaya tidak bocor memori.
    useEffect(() => {
        return () => {
            fotoLahanPreviews.forEach((url) => URL.revokeObjectURL(url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    function handleFotoLahanChange(e) {
        const filesDipilih = Array.from(e.target.files || []);
        e.target.value = ''; // supaya bisa pilih file yang sama lagi kalau perlu

        if (!filesDipilih.length) return;

        setFotoLahanError('');

        const hanyaGambar = filesDipilih.filter((file) => file.type.startsWith('image/'));
        if (hanyaGambar.length !== filesDipilih.length) {
            setFotoLahanError('Hanya file gambar (JPG/PNG) yang bisa diupload.');
        }

        const maksUkuran = 5 * 1024 * 1024; // 5MB per foto
        const ukuranAman = hanyaGambar.filter((file) => file.size <= maksUkuran);
        if (ukuranAman.length !== hanyaGambar.length) {
            setFotoLahanError('Ada foto yang ukurannya lebih dari 5MB, foto itu dilewati.');
        }

        const gabungan = [...fotoLahanFiles, ...ukuranAman].slice(0, MAKS_FOTO);
        setFotoLahanFiles(gabungan);
        setData('foto_lahan', gabungan);

        fotoLahanPreviews.forEach((url) => URL.revokeObjectURL(url));
        setFotoLahanPreviews(gabungan.map((file) => URL.createObjectURL(file)));
    }

    function handleHapusFotoLahan(index) {
        const gabungan = fotoLahanFiles.filter((_, i) => i !== index);
        setFotoLahanFiles(gabungan);
        setData('foto_lahan', gabungan);

        setFotoLahanPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    }

    const submit = (e) => {
    e.preventDefault();

    transform((currentData) => {
        const payload = { ...currentData };
        if (kategori === 'kendaraan') {
            payload.nama = payload.nama_usaha;
            payload.kota = payload.kabupaten_kota;
        }
        return payload;
    });

    if (editingItem) {
        put(`/mitra/layanan/${editingItem.id}`, {
            forceFormData: true,
            onSuccess: onSukses,
        });
    } else {
        post('/mitra/layanan', {
            forceFormData: true,
            onSuccess: onSukses,
        });
    }
};

    return (
        <div className="flex min-h-dvh flex-col bg-white">
            <Head title="Alamat Lahan Parkir" />

            <div className="border-b border-gray-100 px-4 py-3">
                <h1 className="text-base font-semibold text-gray-900">Alamat Lahan Parkir</h1>
            </div>

            <div className="flex gap-1 px-4 pt-3">
                <div className="h-1.5 flex-1 rounded-full bg-green-600" />
                <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
            </div>

            <form onSubmit={submit} className="flex-1 space-y-4 px-4 py-4">
                <div>
                    <h2 className="text-base font-bold text-gray-900">Alamat Lahan Parkir</h2>
                    <p className="text-xs text-gray-400">Isikan alamat lahan parkir anda di bawah sini</p>
                </div>

                {kategori === 'kendaraan' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jenis Kendaraan</label>
                        <div className="relative">
                            <select
                                value={data.jenis_kendaraan}
                                onChange={(e) => setData('jenis_kendaraan', e.target.value)}
                                className={`${inputClass(errors.jenis_kendaraan)} appearance-none pr-8`}
                            >
                                <option value="">Jenis Kendaraan</option>
                                {JENIS_KENDARAAN_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.jenis_kendaraan && <p className="mt-1 text-xs text-red-600">{errors.jenis_kendaraan}</p>}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Usaha</label>
                    <input
                        type="text"
                        placeholder="Ex : Titipsini_buanguntapan"
                        value={data.nama_usaha}
                        onChange={(e) => setData('nama_usaha', e.target.value)}
                        className={inputClass(errors.nama_usaha || errors.nama)}
                    />
                    {(errors.nama_usaha || errors.nama) && <p className="mt-1 text-xs text-red-600">{errors.nama_usaha || errors.nama}</p>}
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
                    {errors.kota && <p className="mt-1 text-xs text-red-600">{errors.kota}</p>}
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
                    <p className="text-xs text-gray-400">
                        Sertakan Foto Lahan dari depan, belakang, samping Kiri dan Kanan (maks. {MAKS_FOTO} foto, JPG/PNG, maks. 5MB per foto)
                    </p>

                    {existingFotoLahan.length > 0 && (
                        <div className="mt-2">
                            <p className="mb-1 text-xs text-gray-500">Foto yang sudah tersimpan:</p>
                            <div className="flex flex-wrap gap-2">
                                {existingFotoLahan.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={`Foto lahan lama ${i + 1}`}
                                        className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-2 flex flex-wrap gap-2">
                        {fotoLahanPreviews.map((src, i) => (
                            <div key={i} className="relative h-20 w-20">
                                <img
                                    src={src}
                                    alt={`Foto lahan baru ${i + 1}`}
                                    className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleHapusFotoLahan(i)}
                                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {fotoLahanPreviews.length < MAKS_FOTO && (
                            <button
                                type="button"
                                onClick={() => fotoLahanInputRef.current?.click()}
                                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-green-500 hover:text-green-600"
                            >
                                <ImagePlus size={20} />
                                <span className="text-[10px]">Tambah</span>
                            </button>
                        )}
                    </div>

                    <input
                        ref={fotoLahanInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFotoLahanChange}
                        className="hidden"
                    />

                    {fotoLahanError && <p className="mt-1 text-xs text-red-600">{fotoLahanError}</p>}
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