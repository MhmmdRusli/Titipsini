import { useEffect, useRef, useState } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import { ChevronDown, MapPin, Loader2, ImagePlus, X } from 'lucide-react';
import { findRegionOption } from '@/lib/wilayah';
import { loadGoogleMaps, reverseGeocodeGoogle } from '@/Components/GoogleMapAddressPicker';

const inputClass = (hasError) =>
    `mt-1 w-full rounded-lg border-none bg-gray-100 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50 ${hasError ? 'ring-2 ring-red-400' : 'focus:ring-green-500'
    }`;

const MAKS_FOTO = 8;

export default function FormIdentitasGudang({ kategori, editingItem, onBatal, onSukses }) {
    const { data, setData, post, processing, errors } = useForm({
        kategori,
        nama_usaha: editingItem?.nama_usaha ?? '',
        provinsi: editingItem?.provinsi ?? '',
        kabupaten_kota: editingItem?.kabupaten_kota ?? '',
        kecamatan: editingItem?.kecamatan ?? '',
        alamat_lengkap: editingItem?.alamat_lengkap ?? '',
        catatan_alamat: editingItem?.catatan_alamat ?? '',
        foto_lahan: [], // array File baru yang mau diupload
        panjang: editingItem?.panjang ?? '',
        lebar: editingItem?.lebar ?? '',
        jumlah_tampung: editingItem?.jumlah_tampung ?? '',
    });

    const [daftarProvinsi, setDaftarProvinsi] = useState([]);
    const [daftarKabupaten, setDaftarKabupaten] = useState([]);
    const [daftarKecamatan, setDaftarKecamatan] = useState([]);
    const [provinsiId, setProvinsiId] = useState('');
    const [kabupatenId, setKabupatenId] = useState('');
    const [kecamatanId, setKecamatanId] = useState('');
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [loadingKabupaten, setLoadingKabupaten] = useState(false);
    const [loadingKecamatan, setLoadingKecamatan] = useState(false);
    const [locationError, setLocationError] = useState('');

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

    useEffect(() => {
        if (!editingItem) return;

        let cancelled = false;
        const restoreDropdown = async () => {
            let provinces = daftarProvinsi;
            if (!provinces.length) {
                provinces = await fetch('/api/wilayah/provinces').then((res) => res.json());
                if (!cancelled) setDaftarProvinsi(provinces);
            }

            const p = findRegionOption(provinces, editingItem.provinsi);
            if (!p) return;

            if (!cancelled) setProvinsiId(p.id);
            const regencies = await fetch(`/api/wilayah/regencies/${p.id}`).then((res) => res.json());
            if (cancelled) return;
            setDaftarKabupaten(regencies);

            const k = findRegionOption(regencies, editingItem.kabupaten_kota);
            if (!k) return;
            if (!cancelled) setKabupatenId(k.id);

            const districts = await fetch(`/api/wilayah/districts/${k.id}`).then((res) => res.json());
            if (cancelled) return;
            setDaftarKecamatan(districts);

            const d = findRegionOption(districts, editingItem.kecamatan);
            if (d && !cancelled) setKecamatanId(d.id);
        };

        restoreDropdown();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingItem]);

    // Bersihkan object URL preview supaya tidak bocor memori.
    useEffect(() => {
        return () => {
            fotoLahanPreviews.forEach((url) => URL.revokeObjectURL(url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getWilayahDariKoordinat(latitude, longitude) {
        try {
            await loadGoogleMaps();
            return await reverseGeocodeGoogle(latitude, longitude);
        } catch {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=id`,
            );
            const result = await response.json();
            const address = result.address || {};

            const city = address.county || address.regency || address.city || address.town || '';
            const kandidatKecamatan = address.city || address.town || '';

            const district =
                address.city_district ||
                address.district ||
                address.subdistrict ||
                address.suburb ||
                (kandidatKecamatan && kandidatKecamatan !== city ? kandidatKecamatan : '') ||
                address.municipality ||
                address.village ||
                '';

            return {
                address: result.display_name || '',
                province: address.state || address.province || '',
                city,
                district,
            };
        }
    }

    async function getCurrentLocation() {
        setLoadingLocation(true);
        setLocationError('');

        try {
            if (!navigator.geolocation) {
                throw new Error('Browser ini tidak mendukung geolokasi.');
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                });
            });

            const { latitude, longitude } = position.coords;
            const lokasi = await getWilayahDariKoordinat(latitude, longitude);

            let provinces = daftarProvinsi;
            if (!provinces.length) {
                provinces = await fetch('/api/wilayah/provinces').then((res) => res.json());
                setDaftarProvinsi(provinces);
            }

            const matchedProvinsi = findRegionOption(provinces, lokasi.province);
            if (!matchedProvinsi) {
                setData((prev) => ({
                    ...prev,
                    provinsi: lokasi.province,
                    kabupaten_kota: lokasi.city,
                    kecamatan: lokasi.district,
                    alamat_lengkap: lokasi.address,
                }));
                setProvinsiId('');
                setKabupatenId('');
                setKecamatanId('');
                setDaftarKabupaten([]);
                setDaftarKecamatan([]);
                setLoadingLocation(false);
                return;
            }

            setProvinsiId(matchedProvinsi.id);
            setLoadingKabupaten(true);
            const regencies = await fetch(`/api/wilayah/regencies/${matchedProvinsi.id}`).then((res) => res.json());
            setDaftarKabupaten(regencies);
            setLoadingKabupaten(false);

            const matchedKabupaten = findRegionOption(regencies, lokasi.city);
            if (!matchedKabupaten) {
                setData((prev) => ({
                    ...prev,
                    provinsi: matchedProvinsi.name,
                    kabupaten_kota: lokasi.city,
                    kecamatan: lokasi.district,
                    alamat_lengkap: lokasi.address,
                }));
                setKabupatenId('');
                setKecamatanId('');
                setDaftarKecamatan([]);
                setLoadingLocation(false);
                return;
            }

            setKabupatenId(matchedKabupaten.id);
            setLoadingKecamatan(true);
            const districts = await fetch(`/api/wilayah/districts/${matchedKabupaten.id}`).then((res) => res.json());
            setDaftarKecamatan(districts);
            setLoadingKecamatan(false);

            const matchedKecamatan = findRegionOption(districts, lokasi.district);
            setKecamatanId(matchedKecamatan?.id ?? '');

            setData((prev) => ({
                ...prev,
                provinsi: matchedProvinsi.name,
                kabupaten_kota: matchedKabupaten.name,
                kecamatan: matchedKecamatan?.name ?? lokasi.district,
                alamat_lengkap: lokasi.address,
            }));
        } catch (error) {
            if (error.code === 1) {
                setLocationError('Izin akses lokasi ditolak. Silakan aktifkan di pengaturan browser.');
            } else if (error.code === 2) {
                setLocationError('Informasi lokasi tidak tersedia.');
            } else if (error.code === 3) {
                setLocationError('Permintaan lokasi timeout. Coba lagi.');
            } else {
                setLocationError(error.message || 'Gagal mengambil alamat dari lokasi Anda.');
            }
        } finally {
            setLoadingLocation(false);
        }
    }

    function handleProvinsiChange(e) {
        const id = e.target.value;
        const nama = e.target.options[e.target.selectedIndex]?.text ?? '';
        setProvinsiId(id);
        setData((prev) => ({ ...prev, provinsi: nama, kabupaten_kota: '', kecamatan: '' }));
        setDaftarKabupaten([]);
        setDaftarKecamatan([]);
        setKabupatenId('');
        setKecamatanId('');

        if (id) {
            setLoadingKabupaten(true);
            fetch(`/api/wilayah/regencies/${id}`)
                .then((res) => res.json())
                .then(setDaftarKabupaten)
                .catch(() => setDaftarKabupaten([]))
                .finally(() => setLoadingKabupaten(false));
        }
    }

    function handleKabupatenChange(e) {
        const id = e.target.value;
        const nama = e.target.options[e.target.selectedIndex]?.text ?? '';
        setKabupatenId(id);
        setData((prev) => ({ ...prev, kabupaten_kota: nama, kecamatan: '' }));
        setDaftarKecamatan([]);
        setKecamatanId('');

        if (id) {
            setLoadingKecamatan(true);
            fetch(`/api/wilayah/districts/${id}`)
                .then((res) => res.json())
                .then(setDaftarKecamatan)
                .catch(() => setDaftarKecamatan([]))
                .finally(() => setLoadingKecamatan(false));
        }
    }

    function handleKecamatanChange(e) {
        const id = e.target.value;
        const nama = e.target.options[e.target.selectedIndex]?.text ?? '';
        setKecamatanId(id);
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

        if (editingItem) {
            router.post(`/mitra/layanan/${editingItem.id}`, { ...data, _method: 'put' }, {
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
            <Head title="Alamat Gudang" />

            <div className="border-b border-gray-100 px-4 py-3">
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
                            disabled={!provinsiId || loadingKabupaten}
                            className={`${inputClass(errors.kabupaten_kota)} appearance-none pr-8`}
                        >
                            <option value="">
                                {loadingKabupaten ? 'Memuat...' : 'Kabupaten/Kota'}
                            </option>
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
                            value={kecamatanId}
                            onChange={handleKecamatanChange}
                            disabled={!kabupatenId || loadingKecamatan}
                            className={`${inputClass(errors.kecamatan)} appearance-none pr-8`}
                        >
                            <option value="">
                                {loadingKecamatan ? 'Memuat...' : 'Kecamatan'}
                            </option>
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
                    <div className="mt-1 flex gap-2">
                        <textarea
                            rows={3}
                            placeholder="Jl. Jlagran Lor No.2, Pringgokusuman, Gedong Tengen, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55271"
                            value={data.alamat_lengkap}
                            onChange={(e) => setData('alamat_lengkap', e.target.value)}
                            className={inputClass(errors.alamat_lengkap)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={loadingLocation}
                        className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        {loadingLocation ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Mendapatkan lokasi...
                            </>
                        ) : (
                            <>
                                <MapPin size={14} />
                                Gunakan Lokasi Saat Ini
                            </>
                        )}
                    </button>
                    {locationError && <p className="mt-1 text-xs text-red-600">{locationError}</p>}
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">Jumlah Tampung</label>
                    <p className="text-xs text-gray-400">Perkiraan jumlah barang/kendaraan yang bisa ditampung</p>
                    <input
                        type="number"
                        placeholder="200"
                        value={data.jumlah_tampung}
                        onChange={(e) => setData('jumlah_tampung', e.target.value)}
                        className={inputClass(errors.jumlah_tampung)}
                    />
                    {errors.jumlah_tampung && <p className="mt-1 text-xs text-red-600">{errors.jumlah_tampung}</p>}
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