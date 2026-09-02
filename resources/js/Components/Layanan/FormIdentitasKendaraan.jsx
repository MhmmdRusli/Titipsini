    import { useState } from 'react';
    import { useForm, router, Head } from '@inertiajs/react';
    import { ChevronLeft, ChevronDown } from 'lucide-react';

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

    export default function FormIdentitasKendaraan({ kategori, editingItem, onBatal, onSukses }) {
        const { data, setData, post, processing, errors } = useForm({
            kategori,
            nama_usaha: editingItem?.nama_usaha ?? '',
            nomor_polisi: editingItem?.nomor_polisi ?? '',
            nomor_kir: editingItem?.nomor_kir ?? '',
            merek_kendaraan: editingItem?.merek_kendaraan ?? '',
            jenis_pickup: editingItem?.jenis_pickup ?? '',
            upload_berkas: editingItem?.upload_berkas ?? '',
        });

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
                                className={`${inputClass(errors.merek_kendaraan)} appearance-none pr-8`}
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
                                className={`${inputClass(errors.jenis_pickup)} appearance-none pr-8`}
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