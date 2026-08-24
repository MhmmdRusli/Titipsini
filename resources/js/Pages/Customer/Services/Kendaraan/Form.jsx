import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Car, ShieldCheck, ChevronDown, Minus, Plus } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import DateRangeField, { parseISODate } from '@/Components/DateRangerField';

const BENEFITS = [
    'Keamanan terjaga',
    'Pengecekan kendaraan berkala',
    'Bisa diambil kapan saja',
    'Konsultasi & Support',
];

function formatRupiah(value) {
    return 'Rp' + Math.round(value || 0).toLocaleString('id-ID');
}

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p>;
}

export default function FormKendaraan({ serviceId, jenisKendaraanOptions = [], persenBiayaLayanan = 10 }) {
    const [form, setForm] = useState({
        merekKendaraan: '',
        jenisKendaraan: '',
        jumlahKendaraan: 1,
        keterangan: '',
        tanggalMasuk: '',
        tanggalKeluar: '',
        setuju: false,
        service_id: serviceId ?? '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    const tierTerpilih = jenisKendaraanOptions.find((o) => o.value === form.jenisKendaraan) ?? null;

    const jumlahHari = useMemo(() => {
        if (!form.tanggalMasuk || !form.tanggalKeluar) return 0;
        const masuk = parseISODate(form.tanggalMasuk);
        const keluar = parseISODate(form.tanggalKeluar);
        const diff = Math.round((keluar - masuk) / (1000 * 60 * 60 * 24));
        return Math.max(1, diff);
    }, [form.tanggalMasuk, form.tanggalKeluar]);

    const hitung = useMemo(() => {
        const hargaPerHari = tierTerpilih?.hargaPerHari ?? 0;
        const subtotal = hargaPerHari * form.jumlahKendaraan * jumlahHari;
        const biayaLayanan = Math.round((subtotal * persenBiayaLayanan) / 100);
        const total = subtotal + biayaLayanan;

        return { subtotal, biayaLayanan, total };
    }, [form.jumlahKendaraan, tierTerpilih, jumlahHari, persenBiayaLayanan]);

    const bisaSubmit =
        form.merekKendaraan.trim() &&
        form.jenisKendaraan &&
        form.jumlahKendaraan > 0 &&
        form.tanggalMasuk &&
        form.tanggalKeluar &&
        form.setuju &&
        !submitting;

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        router.post('/app/services/kendaraan', form, {
            onError: (err) => {
                setErrors(err);
                setSubmitting(false);
            },
        });
    }

    return (
        <CustomerLayout title="Form Penitipan Kendaraan" backHref="/app/services/barang/paket-pilihan">
            <Head title="Form Penitipan Kendaraan" />

             <div className="px-4 py-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#15803d] to-emerald-600 p-5 text-white">
                    <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                        <Car size={22} />
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
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Merek Kendaraan</label>
                        <input
                            type="text"
                            value={form.merekKendaraan}
                            onChange={(e) => update('merekKendaraan', e.target.value)}
                            placeholder="cth: Kijang, Avanza, Supra"
                            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                        />
                        <FieldError message={errors.merekKendaraan} />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Jenis Kendaraan</label>
                        <div className="relative mt-2">
                            <select
                                value={form.jenisKendaraan}
                                onChange={(e) => update('jenisKendaraan', e.target.value)}
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            >
                                <option value="">Jenis Kendaraan</option>
                                {jenisKendaraanOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-500">
                                <ChevronDown size={16} />
                            </span>
                        </div>
                        <FieldError message={errors.jenisKendaraan} />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Jumlah Kendaraan</label>
                        <div className="mt-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => update('jumlahKendaraan', Math.max(1, form.jumlahKendaraan - 1))}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#15803d] text-white transition hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                                {form.jumlahKendaraan}
                            </span>
                            <button
                                type="button"
                                onClick={() => update('jumlahKendaraan', form.jumlahKendaraan + 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#15803d] text-white transition hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <FieldError message={errors.jumlahKendaraan} />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Keterangan</label>
                        <textarea
                            rows={2}
                            value={form.keterangan}
                            onChange={(e) => update('keterangan', e.target.value)}
                            placeholder="Tulis keterangan kendaraan kamu seperti warna, merek, dll."
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
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#15803d] focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Saya menyetujui{' '}
                            <Link href="/app/profile/tentang/syarat-ketentuan" className="font-semibold text-[#15803d] dark:text-green-400">
                                Syarat
                            </Link>{' '}
                            dan{' '}
                            <Link href="/app/profile/tentang/kebijakan-privasi" className="font-semibold text-[#15803d] dark:text-green-400">
                                Ketentuan
                            </Link>{' '}
                            yang berlaku di Titipsini.com.
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={!bisaSubmit}
                        className="w-full rounded-xl bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {submitting ? 'Memproses...' : 'Titip Sekarang'}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}