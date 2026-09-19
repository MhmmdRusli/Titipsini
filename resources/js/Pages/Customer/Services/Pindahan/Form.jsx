import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ShieldCheck, ChevronDown, Building2, Car, Truck, MapPin, ExternalLink } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import DateRangeField, { parseISODate } from '@/Components/DateRangerField';

const BENEFITS = [
    'Keamanan terjaga',
    'Kontrol berkala setiap hari',
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

function googleMapsUrl(address) {
    const query = [
        address.address,
        address.district_name,
        address.city_name,
        address.province_name,
    ].filter(Boolean).join(', ');

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function Form({ 
    service, 
    addresses = [], 
    persenBiayaLayanan = 10 
}) {
    const isKendaraan = service?.kategori === 'kendaraan';
    const isPindahan = service?.kategori === 'pindahan';
    const ServiceIcon = isKendaraan ? Car : isPindahan ? Truck : Building2;
    const serviceLabel = isKendaraan ? 'Kendaraan' : isPindahan ? 'Pindahan' : 'Bangunan';

    const [form, setForm] = useState({
        namaItem: '',
        keterangan: '',
        tanggalMasuk: '',
        tanggalKeluar: '',
        address_id: addresses.find((a) => a.is_primary)?.id || addresses[0]?.id || '',
        setuju: false,
        service_id: service?.id ?? '',
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const selectedAddress = addresses.find((address) => String(address.id) === String(form.address_id));

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    const jumlahHari = useMemo(() => {
        if (!form.tanggalMasuk || !form.tanggalKeluar) return 0;
        const masuk = parseISODate(form.tanggalMasuk);
        const keluar = parseISODate(form.tanggalKeluar);
        const diff = Math.round((keluar - masuk) / (1000 * 60 * 60 * 24));
        return Math.max(1, diff);
    }, [form.tanggalMasuk, form.tanggalKeluar]);

    const hitung = useMemo(() => {
        const hargaPerHari = Number(service?.harga) || 0;
        const subtotal = hargaPerHari * jumlahHari;
        const biayaLayanan = Math.round((subtotal * persenBiayaLayanan) / 100);
        const total = subtotal + biayaLayanan;

        return { subtotal, biayaLayanan, total };
    }, [service, jumlahHari, persenBiayaLayanan]);

    const bisaSubmit =
        form.tanggalMasuk &&
        form.tanggalKeluar &&
        form.address_id &&
        form.setuju &&
        !submitting;

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        router.post(`/app/services/${service.id}/pesan`, form, {
            onError: (err) => {
                setErrors(err);
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    }

    return (
        <CustomerLayout title={`Form ${serviceLabel}`} backHref="/app/services?kategori=pindahan&browse=1">
            <Head title={`Form ${serviceLabel}`} />

            <div className="px-4 py-6">
                {/* Banner Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-700 to-green-600 p-5 text-white shadow-md dark:from-green-700 dark:to-green-900">
                    <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                        <ServiceIcon size={22} />
                    </div>
                    <h1 className="text-xl font-extrabold">Our Best Service</h1>
                    <p className="mt-1 text-sm text-white/90">Form Penitipan {serviceLabel}</p>

                    <div className="mt-3 space-y-2">
                        {BENEFITS.map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-white/90">
                                <ShieldCheck size={16} className="shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Utama */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <input type="hidden" value={form.service_id} readOnly />

                    {/* Jenis Layanan / Produk */}
                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Jenis {serviceLabel}</label>
                        <div className="relative mt-2">
                            <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-green-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-green-400">
                                {service?.nama || service?.jenisLabel || serviceLabel}
                            </div>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-500">
                                <ChevronDown size={16} />
                            </span>
                        </div>
                    </div>

                    {/* Rentang Tanggal */}
                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Tanggal Penitipan</label>
                        <div className="mt-2">
                            <DateRangeField
                                tanggalMasuk={form.tanggalMasuk}
                                tanggalKeluar={form.tanggalKeluar}
                                onChange={(masuk, keluar) =>
                                    setForm((prev) => ({ ...prev, tanggalMasuk: masuk, tanggalKeluar: keluar }))
                                }
                                error={errors.tanggalMasuk || errors.tanggalKeluar}
                            />
                        </div>
                    </div>

                    {/* Alamat Lengkap */}
                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Alamat Lengkap</label>
                        <div className="relative mt-2">
                            <select
                                value={form.address_id}
                                onChange={(e) => update('address_id', e.target.value)}
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
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
                        {selectedAddress && (
                            <div className="mt-2 rounded-xl border border-green-100 bg-green-50/70 p-3 dark:border-green-900/60 dark:bg-green-950/30">
                                <div className="flex items-start gap-2">
                                    <MapPin size={17} className="mt-0.5 shrink-0 text-green-700 dark:text-green-400" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                            {selectedAddress.name || 'Alamat pilihan'}
                                        </p>
                                        <p className="mt-0.5 text-xs leading-5 text-gray-600 dark:text-gray-300">
                                            {[selectedAddress.address, selectedAddress.district_name, selectedAddress.city_name, selectedAddress.province_name]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                        <a
                                            href={googleMapsUrl(selectedAddress)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:underline dark:text-green-400"
                                        >
                                            Tentukan / lihat di Google Maps
                                            <ExternalLink size={13} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!addresses.length && (
                            <Link href="/app/profile/alamat/tambah" className="mt-2 inline-flex text-xs font-bold text-green-700 hover:underline dark:text-green-400">
                                Tambah alamat terlebih dahulu
                            </Link>
                        )}
                        <FieldError message={errors.address_id} />
                    </div>

                    {/* Rincian Total */}
                    <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            Total Pembayaran ({jumlahHari} hari)
                        </p>
                        <p className="mt-1 text-xl font-extrabold text-gray-900 dark:text-gray-100">
                            {formatRupiah(hitung.total)}
                        </p>
                    </div>

                    {/* Catatan Denda */}
                    <p className="text-[11px] text-red-500 dark:text-red-400">
                        *Jika menggunakan layanan {serviceLabel.toLowerCase()} melebihi batas yang sudah ditentukan tanpa konfirmasi maka akan dikenakan denda sebesar Rp 10.000/hari.
                    </p>

                    {/* Persetujuan Syarat dan Ketentuan */}
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

                    {/* Tombol Submit */}
                    <button
                        type="submit"
                        disabled={!bisaSubmit}
                        className="w-full rounded-xl bg-green-700 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {submitting ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}