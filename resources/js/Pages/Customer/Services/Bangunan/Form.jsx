import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, ShieldCheck, ChevronDown, Minus, Plus } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import DateRangeField, { parseISODate } from '@/Components/DateRangerField';

const BENEFITS = [
    'Keamanan terjaga',
    'Pengecekan bangunan berkala',
    'Bisa diambil kapan saja',
    'Konsultasi & Support',
];

function formatRupiah(value) {
    return 'Rp' + Math.round(value || 0).toLocaleString('id-ID');
}

const BUILDING_DESKRIPSI = {
    rumah: 'Rumah tinggal, rumah toko, atau hunian pribadi.',
    apartemen: 'Unit apartemen, kondominium, atau hunian vertikal.',
    kosan: 'Kos-kosan, kontrakan, atau hunian sewa.',
    gudang: 'Gudang, warehouse, atau tempat penyimpanan komersial.',
    kamar: 'Kamar kos, kamar mandi, atau ruangan kecil.',
};

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p>;
}

export default function FormBangunan({ service, buildingOptions = [], addresses = [], persenBiayaLayanan = 10 }) {
    const [form, setForm] = useState({
        namaBangunan: '',
        jumlahBangunan: 1,
        keterangan: '',
        tanggalMasuk: '',
        tanggalKeluar: '',
        address_id: addresses.find((a) => a.is_primary)?.id || addresses[0]?.id || '',
        setuju: false,
        service_id: service?.id ?? '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    const jenisLabel = buildingOptions.find((o) => o.value === service?.jenis_bangunan)?.label ?? 'Bangunan';

    const jumlahHari = useMemo(() => {
        if (!form.tanggalMasuk || !form.tanggalKeluar) return 0;
        const masuk = parseISODate(form.tanggalMasuk);
        const keluar = parseISODate(form.tanggalKeluar);
        const diff = Math.round((keluar - masuk) / (1000 * 60 * 60 * 24));
        return Math.max(1, diff);
    }, [form.tanggalMasuk, form.tanggalKeluar]);

    const hitung = useMemo(() => {
        const hargaPerHari = Number(service?.harga) || 0;
        const subtotal = hargaPerHari * form.jumlahBangunan * jumlahHari;
        const biayaLayanan = Math.round((subtotal * persenBiayaLayanan) / 100);
        const total = subtotal + biayaLayanan;

        return { subtotal, biayaLayanan, total };
    }, [form.jumlahBangunan, service, jumlahHari, persenBiayaLayanan]);

    const bisaSubmit =
        form.namaBangunan.trim() &&
        form.jumlahBangunan > 0 &&
        form.tanggalMasuk &&
        form.tanggalKeluar &&
        form.address_id &&
        form.setuju &&
        !submitting;

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        router.post('/app/services/bangunan', form, {
            onError: (err) => {
                setErrors(err);
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    }

    return (
        <CustomerLayout title="Form Penitipan Bangunan" backHref="/app/services?kategori=bangunan&browse=1">
            <Head title="Form Penitipan Bangunan" />

            <div className="px-4 py-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-700 to-green-600 p-5 text-white">
                    <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                        <Building2 size={22} />
                    </div>
                    <h1 className="text-xl font-extrabold">Our Best Service</h1>
                    <div className="mt-3 space-y-2">
                        {BENEFITS.map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-white/90">
                                <ShieldCheck size={16} className="shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <input type="hidden" value={form.service_id} readOnly />

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Nama Bangunan</label>
                        <input
                            type="text"
                            value={form.namaBangunan}
                            onChange={(e) => update('namaBangunan', e.target.value)}
                            placeholder="cth: Rumah tinggal, Ruko, Gudang"
                            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                        />
                        <FieldError message={errors.namaBangunan} />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Jenis Bangunan</label>
                        <div className="relative mt-2">
                            <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-green-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-green-400">
                                {jenisLabel}
                            </div>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-500">
                                <ChevronDown size={16} />
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Jumlah Bangunan</label>
                        <div className="mt-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => update('jumlahBangunan', Math.max(1, form.jumlahBangunan - 1))}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-white transition hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                                {form.jumlahBangunan}
                            </span>
                            <button
                                type="button"
                                onClick={() => update('jumlahBangunan', form.jumlahBangunan + 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-white transition hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <FieldError message={errors.jumlahBangunan} />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Keterangan</label>
                        <textarea
                            rows={2}
                            value={form.keterangan}
                            onChange={(e) => update('keterangan', e.target.value)}
                            placeholder="Tulis keterangan bangunan kamu seperti tipe, luas, dll."
                            className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                        />
                        <FieldError message={errors.keterangan} />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Tanggal Penitipan</label>
                        <div className="mt-2">
                            <DateRangeField
                                tanggalMasuk={form.tanggalMasuk}
                                tanggalKeluar={form.tanggalKeluar}
                                onChange={(masuk, keluar) => setForm((prev) => ({ ...prev, tanggalMasuk: masuk, tanggalKeluar: keluar }))}
                                error={errors.tanggalMasuk || errors.tanggalKeluar}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Alamat Lengkap</label>
                        <div className="relative mt-2">
                            <select
                                value={form.address_id}
                                onChange={(e) => update('address_id', e.target.value)}
                                className="appearance-none bg-none w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            >
                                <option value="">Pilih alamat</option>
                                {addresses.map((address) => (
                                    <option key={address.id} value={address.id}>
                                        {address.address}
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-500">
                                <ChevronDown size={16} />
                            </span>
                        </div>
                        <FieldError message={errors.address_id} />
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            Total Pembayaran
                        </p>
                        <p className="mt-1 text-xl font-extrabold text-gray-900 dark:text-gray-100">
                            {formatRupiah(hitung.total)}
                        </p>
                    </div>

                    <label className="flex items-start gap-2.5">
                        <input
                            type="checkbox"
                            checked={form.setuju}
                            onChange={(e) => update('setuju', e.target.checked)}
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-green-700 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Saya menyetujui{' '}
                            <Link href="/app/profile/tentang/syarat-ketentuan" className="font-semibold text-green-700 dark:text-green-400">
                                Syarat
                            </Link>{' '}
                            dan{' '}
                            <Link href="/app/profile/tentang/kebijakan-privasi" className="font-semibold text-green-700 dark:text-green-400">
                                Ketentuan
                            </Link>{' '}
                            yang berlaku di Titipsini.com.
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={!bisaSubmit}
                        className="w-full rounded-xl bg-green-700 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {submitting ? 'Memproses...' : 'Titip Sekarang'}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}