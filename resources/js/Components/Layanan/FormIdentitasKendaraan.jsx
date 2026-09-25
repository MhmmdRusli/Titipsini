    import { useState, useRef } from 'react';
    import { useForm, router, Head } from '@inertiajs/react';
    import { ChevronLeft, ChevronDown, Upload, X } from 'lucide-react';

    const inputClass = (hasError) =>
        `mt-1 w-full rounded-lg border-none bg-gray-100 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            hasError ? 'ring-2 ring-red-400' : 'focus:ring-green-500'
        }`;

    const MEREK_OPTIONS = [
        'Mitsubishi',
        'Toyota',
        'Suzuki',
        'Daihatsu',
        'Isuzu',
        'Hino',
        'Honda',
    ];

    const JENIS_PICKUP_OPTIONS = [
        'Pick Up Terbuka',
        'Pick Up Box',
        'Engkel Box',
        'Double Cabin',
        'Colt Diesel',
    ];

export default function FormIdentitasKendaraan({ kategori, editingItem, daftarKota = [], onBatal, onSukses }) {
    const { data, setData, post, put, processing, errors, transform } = useForm({
        kategori,
        nama_usaha: editingItem?.nama_usaha ?? '',
        nomor_polisi: editingItem?.nomor_polisi ?? '',
        nomor_kir: editingItem?.nomor_kir ?? '',
        merek_kendaraan: editingItem?.merek_kendaraan ?? '',
        jenis_pickup: editingItem?.jenis_pickup ?? '',
        harga: editingItem?.harga ?? '',
        kota: editingItem?.kota ?? '',
        kecamatan: editingItem?.kecamatan ?? '',
        latitude: editingItem?.latitude ?? '',
        longitude: editingItem?.longitude ?? '',
        foto_kendaraan: null,
        upload_berkas: editingItem?.upload_berkas ?? '',
    });

        const [fotoKendaraanPreview, setFotoKendaraanPreview] = useState(editingItem?.foto_kendaraan_url ?? null);

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

        const fotoKendaraanInputRef = useRef(null);

        function handleFotoKendaraanChange(e) {
            const file = e.target.files?.[0];
            if (!file) return;
            setData('foto_kendaraan', file);
            setFotoKendaraanPreview(URL.createObjectURL(file));
        }

        function hapusFotoKendaraan() {
            setData('foto_kendaraan', null);
            setFotoKendaraanPreview(null);
        }

        return (
            <div className="flex min-h-dvh flex-col bg-white">
                <Head title="Identitas Kendaraan" />

                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                    <button type="button" onClick={onBatal} className="text-gray-500 hover:text-gray-700">
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-base font-semibold text-gray-900">Identitas Kendaraan</h1>
                </div>

                <div className="flex gap-1 px-4 pt-3">
                    <div className="h-1.5 flex-1 rounded-full bg-green-600" />
                    <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
                </div>

                <form onSubmit={submit} className="flex-1 space-y-4 px-4 py-4 pt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Usaha</label>
                        <input
                            type="text"
                            placeholder="Titipsini_banguntapan"
                            value={data.nama_usaha}
                            onChange={(e) => setData('nama_usaha', e.target.value)}
                            className={inputClass(errors.nama_usaha)}
                        />
                        {errors.nama_usaha && <p className="mt-1 text-xs text-red-600">{errors.nama_usaha}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nomor Polisi Kendaraan</label>
                        <input
                            type="text"
                            placeholder="AB 12345 ABC"
                            value={data.nomor_polisi}
                            onChange={(e) => setData('nomor_polisi', e.target.value)}
                            className={inputClass(errors.nomor_polisi)}
                        />
                        {errors.nomor_polisi && <p className="mt-1 text-xs text-red-600">{errors.nomor_polisi}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nomor Kir Kendaraan</label>
                        <input
                            type="text"
                            placeholder="AAAAAAA"
                            value={data.nomor_kir}
                            onChange={(e) => setData('nomor_kir', e.target.value)}
                            className={inputClass(errors.nomor_kir)}
                        />
                        {errors.nomor_kir && <p className="mt-1 text-xs text-red-600">{errors.nomor_kir}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pilih Merek Kendaraan</label>
                        <div className="relative">
                            <select
                                value={data.merek_kendaraan}
                                onChange={(e) => setData('merek_kendaraan', e.target.value)}
                                className={`${inputClass(errors.merek_kendaraan)} appearance-none bg-none pr-8`}
                            >
                                <option value="">Merek Kendaraan</option>
                                {MEREK_OPTIONS.map((merek) => (
                                    <option key={merek} value={merek}>{merek}</option>
                                ))}
                            </select>
                            <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.merek_kendaraan && <p className="mt-1 text-xs text-red-600">{errors.merek_kendaraan}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jenis Kendaraan Pick Up</label>
                        <div className="relative">
                            <select
                                value={data.jenis_pickup}
                                onChange={(e) => setData('jenis_pickup', e.target.value)}
                                className={`${inputClass(errors.jenis_pickup)} appearance-none bg-none pr-8`}
                            >
                                <option value="">Jenis Kendaraan Pick Up</option>
                                {JENIS_PICKUP_OPTIONS.map((jenis) => (
                                    <option key={jenis} value={jenis}>{jenis}</option>
                                ))}
                            </select>
                            <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        {errors.jenis_pickup && <p className="mt-1 text-xs text-red-600">{errors.jenis_pickup}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Harga (per hari)</label>
                        <input
                            type="number"
                            placeholder="Contoh: 15000"
                            value={data.harga}
                            onChange={(e) => setData('harga', e.target.value)}
                            className={inputClass(errors.harga)}
                        />
                        {errors.harga && <p className="mt-1 text-xs text-red-600">{errors.harga}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kota</label>
                            <div className="relative">
                                <select
                                    value={data.kota}
                                    onChange={(e) => setData('kota', e.target.value)}
                                    className={`${inputClass(errors.kota)} appearance-none bg-none pr-8`}
                                >
                                    <option value="">Pilih kota</option>
                                    {daftarKota.map((kota) => (
                                        <option key={kota} value={kota}>{kota}</option>
                                    ))}
                                </select>
                                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {errors.kota && <p className="mt-1 text-xs text-red-600">{errors.kota}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
                            <input
                                type="text"
                                placeholder="Contoh: Gondokusuman"
                                value={data.kecamatan}
                                onChange={(e) => setData('kecamatan', e.target.value)}
                                className={inputClass(errors.kecamatan)}
                            />
                            {errors.kecamatan && <p className="mt-1 text-xs text-red-600">{errors.kecamatan}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Foto Kendaraan</label>
                        <p className="text-xs text-gray-400">Upload foto kendaraan yang akan ditampilkan ke customer</p>
                        {fotoKendaraanPreview && (
                            <div className="mt-2 relative inline-block">
                                <img src={fotoKendaraanPreview} alt="Foto Kendaraan" className="h-28 w-28 rounded-lg border border-gray-200 object-cover" />
                                <button
                                    type="button"
                                    onClick={hapusFotoKendaraan}
                                    className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 text-white p-1"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        )}
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={() => fotoKendaraanInputRef.current?.click()}
                                className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-green-500 hover:text-green-600"
                            >
                                <Upload size={20} />
                                <span className="text-[10px]">Tambah</span>
                            </button>
                            <input
                                ref={fotoKendaraanInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFotoKendaraanChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Berkas</label>
                        <p className="text-xs text-gray-400">Sertakan berkas SIM, STNK, SKCK menjadi satu dalam bentuk link!</p>
                        <textarea
                            rows={2}
                            placeholder="Link drive"
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