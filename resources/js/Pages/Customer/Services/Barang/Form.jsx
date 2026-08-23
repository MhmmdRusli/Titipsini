import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Package, ShieldCheck, MapPin, Plus, Star } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const BENEFITS = [
    'Keamanan terjaga',
    'Pengecekan barang berkala',
    'Bisa diambil kapan saja',
    'Konsultasi & Support',
];

export default function FormBarang({ serviceId, addresses = [] }) {
    const [form, setForm] = useState({
        namaBarang: '',
        pickup: false,
        tanggalMasuk: '',
        tanggalKeluar: '',
        service_id: serviceId ?? '',
        address_id: addresses.find((a) => a.is_primary)?.id ?? addresses[0]?.id ?? '',
    });

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        router.post('/app/services/barang', {
            ...form,
            // Kalau pickup tidak aktif, alamat tidak relevan - jangan ikut dikirim
            // supaya tidak nyangkut ke order sebagai pickup_address yang salah.
            address_id: form.pickup ? (form.address_id || null) : null,
        });
    }

    const belumPunyaAlamat = addresses.length === 0;
    const pickupButTanpaAlamat = form.pickup && !belumPunyaAlamat && !form.address_id;

    return (
        <CustomerLayout title="Pilih Paket" backHref="/app/services/barang/paket-pilihan">
            <Head title="Pilih Paket" />

            <div className="px-4 py-3">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-900 p-5 text-white shadow-md">
                    <div className="absolute right-4 top-4 rounded-xl bg-white/15 p-2">
                        <Package size={20} />
                    </div>

                    <p className="text-lg font-extrabold leading-none">Our Best Service</p>

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
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                form.pickup ? 'bg-[#15803d] dark:bg-[#22c55e]' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                                    form.pickup ? 'translate-x-6' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Muncul cuma kalau Pick up aktif - customer perlu pilih dari
                        mana barangnya mau dijemput. */}
                    {form.pickup && (
                        <div>
                            <label className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                Alamat Penjemputan
                            </label>

                            {belumPunyaAlamat ? (
                                <Link
                                    href="/app/profile/alamat/tambah"
                                    className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-green-300 bg-green-50 px-4 py-3.5 text-sm font-semibold text-[#15803d] transition hover:bg-green-100 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400"
                                >
                                    <Plus size={16} className="shrink-0" />
                                    Tambah alamat penjemputan
                                </Link>
                            ) : (
                                <div className="mt-2 space-y-2">
                                    {addresses.map((address) => {
                                        const selected = String(form.address_id) === String(address.id);
                                        return (
                                            <button
                                                key={address.id}
                                                type="button"
                                                onClick={() => update('address_id', address.id)}
                                                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                                                    selected
                                                        ? 'border-[#15803d] bg-green-50 ring-2 ring-[#15803d]/20 dark:border-green-500 dark:bg-green-950/30'
                                                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                                                }`}
                                            >
                                                <MapPin
                                                    size={16}
                                                    className={`mt-0.5 shrink-0 ${
                                                        selected ? 'text-[#15803d] dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                                                    }`}
                                                />
                                                <span className="flex-1">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            {address.name}
                                                        </span>
                                                        {address.is_primary && (
                                                            <Star size={11} className="fill-amber-400 text-amber-400" />
                                                        )}
                                                    </span>
                                                    <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                                                        {address.phone}
                                                    </span>
                                                    <span className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">
                                                        {address.address}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}

                                    <Link
                                        href="/app/profile/alamat/tambah"
                                        className="flex items-center gap-2 px-1 py-1 text-xs font-semibold text-[#15803d] dark:text-green-400"
                                    >
                                        <Plus size={13} />
                                        Tambah alamat lain
                                    </Link>
                                </div>
                            )}

                            {pickupButTanpaAlamat && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    Pilih salah satu alamat penjemputan.
                                </p>
                            )}
                        </div>
                    )}

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
                        disabled={pickupButTanpaAlamat}
                        className="w-full rounded-xl bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Lanjutkan
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}