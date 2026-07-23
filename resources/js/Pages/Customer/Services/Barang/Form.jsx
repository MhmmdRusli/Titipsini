import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Package, ShieldCheck } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const BENEFITS = [
    'Keamanan terjaga',
    'Pengecekan barang berkala',
    'Bisa diambil kapan saja',
    'Konsultasi & Support',
];

export default function FormBarang({ hargaMulai = 100000, serviceId }) {
    const formattedHarga = new Intl.NumberFormat('id-ID').format(hargaMulai);

    const [form, setForm] = useState({
        namaBarang: '',
        pickup: false,
        tanggalMasuk: '',
        tanggalKeluar: '',
        service_id: serviceId ?? '',
    });

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        router.post('/app/services/barang', form);
    }

    return (
        <CustomerLayout title="Pilih Paket" backHref="/app/services/barang/paket-pilihan">
            <Head title="Pilih Paket" />

            <div className="px-4 py-3">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-900 p-5 text-white shadow-md">
                    <div className="absolute right-4 top-4 rounded-xl bg-white/15 p-2">
                        <Package size={20} />
                    </div>

                    <p className="text-2xl font-extrabold leading-none">
                        {formattedHarga}
                        <span className="ml-1 text-sm font-semibold align-middle">(1 item)</span>
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/90">Our Best Service</p>

                    <ul className="mt-4 space-y-1.5">
                        {BENEFITS.map((benefit) => (
                            <li key={benefit} className="flex items-center gap-2 text-xs text-white/90">
                                <ShieldCheck size={14} className="shrink-0 text-white" />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {/* service_id dibawa dari query string (?service_id=...) sewaktu
                        customer memilih vendor/toko barang di halaman list layanan.
                        Wajib ada - kalau kosong, backend akan menolak & redirect
                        balik ke halaman pilih vendor. */}
                    <input type="hidden" value={form.service_id} readOnly />

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Barang</label>
                        <input
                            type="text"
                            value={form.namaBarang}
                            onChange={(e) => update('namaBarang', e.target.value)}
                            placeholder="Masukkan nama barang"
                            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                        />
                        <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                            *Jika jenis barang lebih dari satu, tulis dengan menggunakan tanda koma(,) (cont: lemari, kulkas)
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Pick up</label>
                        <button
                            type="button"
                            onClick={() => update('pickup', !form.pickup)}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                form.pickup ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                    form.pickup ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Tanggal masuk</label>
                        <div className="relative mt-2">
                            <input
                                type="date"
                                value={form.tanggalMasuk}
                                onChange={(e) => update('tanggalMasuk', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:[color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Tanggal Keluar</label>
                        <div className="relative mt-2">
                            <input
                                type="date"
                                value={form.tanggalKeluar}
                                onChange={(e) => update('tanggalKeluar', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:[color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition active:scale-[0.98]"
                    >
                        Lanjutkan
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}