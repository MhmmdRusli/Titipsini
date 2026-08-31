import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Package,
    ShieldCheck,
    MapPin,
    Plus,
    Star,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Info,
    X,
    Image,
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const BENEFITS = [
    'Keamanan terjaga',
    'Pengecekan barang berkala',
    'Bisa diambil kapan saja',
    'Konsultasi & Support',
];

const NAMA_BULAN = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const NAMA_HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function toISODate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function parseISODate(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatShort(iso) {
    const date = parseISODate(iso);
    if (!date) return null;
    return `${date.getDate()} ${NAMA_BULAN[date.getMonth()]}`;
}

function formatRupiah(value) {
    return 'Rp' + Math.round(value || 0).toLocaleString('id-ID');
}

function getCalendarCells(viewDate) {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Senin = index 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
}

function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBetween(date, start, end) {
    if (!start || !end) return false;
    return date > start && date < end;
}

/** Date-range picker custom: 1 field, buka kalender, klik 2 tanggal (masuk & keluar). */
function DateRangeField({ tanggalMasuk, tanggalKeluar, onChange, error }) {
    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => parseISODate(tanggalMasuk) || new Date());

    const startDate = parseISODate(tanggalMasuk);
    const endDate = parseISODate(tanggalKeluar);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function handlePick(date) {
        if (date < today) return;

        if (!tanggalMasuk || (tanggalMasuk && tanggalKeluar)) {
            onChange(toISODate(date), '');
            return;
        }

        if (date < startDate) {
            onChange(toISODate(date), '');
        } else {
            onChange(tanggalMasuk, toISODate(date));
            setOpen(false);
        }
    }

    const label = tanggalMasuk && tanggalKeluar
        ? `${formatShort(tanggalMasuk)} / ${formatShort(tanggalKeluar)}`
        : tanggalMasuk
            ? `${formatShort(tanggalMasuk)} / Pilih tanggal keluar`
            : null;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`flex w-full items-center gap-2.5 rounded-xl border bg-white px-4 py-3 text-left text-sm shadow-sm transition dark:bg-gray-800 ${
                    error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                }`}
            >
                <Calendar size={16} className="shrink-0 text-gray-400 dark:text-gray-500" />
                <span className={label ? 'text-gray-700 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                    {label ?? 'Tentukan tanggal pesanan'}
                </span>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 right-0 z-50 mt-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {NAMA_BULAN[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </p>
                            <button
                                type="button"
                                onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
                            {NAMA_HARI.map((h) => (
                                <span key={h} className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">
                                    {h}
                                </span>
                            ))}

                            {getCalendarCells(viewDate).map((date, i) => {
                                if (!date) return <span key={`empty-${i}`} />;

                                const disabled = date < today;
                                const isStart = isSameDay(date, startDate);
                                const isEnd = isSameDay(date, endDate);
                                const inRange = isBetween(date, startDate, endDate);

                                return (
                                    <button
                                        key={date.toISOString()}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => handlePick(date)}
                                        className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition ${
                                            disabled
                                                ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                                                : isStart || isEnd
                                                    ? 'bg-[#15803d] font-bold text-white dark:bg-[#22c55e]'
                                                    : inRange
                                                        ? 'bg-green-100 text-[#15803d] dark:bg-green-950/50 dark:text-green-400'
                                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}

function UkuranBarangInfoModal({ options, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#15803d] dark:text-green-400">
                        <Info size={18} />
                        <p className="text-sm font-bold">Information</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-3 space-y-3">
                    {options.map((opt, i) => (
                        <div key={opt.value}>
                            <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                {i + 1}. {opt.label}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{opt.deskripsi}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function FormBarang({ serviceId, addresses = [], ukuranBarangOptions = [], biayaPickup = 0, persenBiayaLayanan = 10 }) {
    const [form, setForm] = useState({
        namaBarang: '',
        jumlahBarang: '',
        keterangan: '',
        pickup: false,
        jamPickup: '09:00',
        tanggalMasuk: '',
        tanggalKeluar: '',
        ukuranBarang: '',
        fotoBarang: null,
        address_id: addresses.find((a) => a.is_primary)?.id ?? addresses[0]?.id ?? '',
        setuju: false,
        service_id: serviceId ?? '',
    });
    const [infoOpen, setInfoOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    const tierTerpilih = ukuranBarangOptions.find((o) => o.value === form.ukuranBarang) ?? null;

    const jumlahHari = useMemo(() => {
        if (!form.tanggalMasuk || !form.tanggalKeluar) return 0;
        const masuk = parseISODate(form.tanggalMasuk);
        const keluar = parseISODate(form.tanggalKeluar);
        const diff = Math.round((keluar - masuk) / (1000 * 60 * 60 * 24));
        return Math.max(1, diff);
    }, [form.tanggalMasuk, form.tanggalKeluar]);

    const hitung = useMemo(() => {
        const jumlahBarang = Number(form.jumlahBarang) || 0;
        const hargaPerHari = tierTerpilih?.hargaPerHari ?? 0;
        const subtotal = hargaPerHari * jumlahBarang * jumlahHari;
        const pickupFee = form.pickup ? biayaPickup : 0;
        const biayaLayanan = Math.round((subtotal * persenBiayaLayanan) / 100);
        const total = subtotal + pickupFee + biayaLayanan;

        return { subtotal, pickupFee, biayaLayanan, total };
    }, [form.jumlahBarang, form.pickup, tierTerpilih, jumlahHari, biayaPickup, persenBiayaLayanan]);

    const belumPunyaAlamat = addresses.length === 0;

    const bisaSubmit =
        form.namaBarang.trim() &&
        Number(form.jumlahBarang) > 0 &&
        form.tanggalMasuk &&
        form.tanggalKeluar &&
        form.ukuranBarang &&
        form.fotoBarang &&
        (!form.pickup || (form.jamPickup && form.address_id)) &&
        form.setuju &&
        !submitting;

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        router.post('/app/services/barang', form, {
            forceFormData: true,
            onError: (err) => {
                setErrors(err);
                setSubmitting(false);
            },
        });
    }

    return (
        <CustomerLayout title="Form Penitipan Barang" backHref="/app/services?kategori=barang&browse=1">
            <Head title="Form Penitipan Barang" />

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
                    <input type="hidden" value={form.service_id} readOnly />

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Nama Barang</label>
                        <input
                            type="text"
                            value={form.namaBarang}
                            onChange={(e) => update('namaBarang', e.target.value)}
                            placeholder="cth: Laptop, TV, Kulkas"
                            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                        />
                        <FieldError message={errors.namaBarang} />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Jumlah Barang</label>
                        <input
                            type="number"
                            min={1}
                            value={form.jumlahBarang}
                            onChange={(e) => update('jumlahBarang', e.target.value)}
                            placeholder="Jumlah Barang"
                            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
                        />
                        {tierTerpilih && Number(form.jumlahBarang) > tierTerpilih.maksItem && (
                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                Maksimal {tierTerpilih.maksItem} item untuk {tierTerpilih.label}.
                            </p>
                        )}
                        <FieldError message={errors.jumlahBarang} />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Keterangan</label>
                        <textarea
                            rows={2}
                            value={form.keterangan}
                            onChange={(e) => update('keterangan', e.target.value)}
                            placeholder="Tulis keterangan barang kamu seperti warna, merek, dll."
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

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Layanan Pick Up Barang</label>
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

                    {form.pickup && (
                        <>
                            <div>
                                <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Jam Pick Up</label>
                                <input
                                    type="time"
                                    value={form.jamPickup}
                                    onChange={(e) => update('jamPickup', e.target.value)}
                                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:[color-scheme:dark]"
                                />
                                <FieldError message={errors.jamPickup} />
                            </div>

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
                                <FieldError message={errors.address_id} />
                            </div>
                        </>
                    )}

                    <div>
                        <div className="flex items-center gap-1.5">
                            <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Ukuran Barang</label>
                            <button
                                type="button"
                                onClick={() => setInfoOpen(true)}
                                className="text-gray-400 hover:text-[#15803d] dark:hover:text-green-400"
                            >
                                <Info size={14} />
                            </button>
                        </div>
                        <div className="relative mt-2">
                            <select
                                value={form.ukuranBarang}
                                onChange={(e) => update('ukuranBarang', e.target.value)}
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            >
                                <option value="">Pilih Ukuran Barang</option>
                                {ukuranBarangOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-500">
                                <ChevronDown size={16} />
                            </span>
                        </div>
                        <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th className="px-3 py-2 font-semibold">Ukuran</th>
                                        <th className="px-3 py-2 font-semibold">Dimensi (P x L x T)</th>
                                        <th className="px-3 py-2 font-semibold">Berat</th>
                                        <th className="px-3 py-2 font-semibold">Maks Item</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                    {ukuranBarangOptions.map((opt) => (
                                        <tr key={opt.value} className={tierTerpilih?.value === opt.value ? 'bg-green-50 dark:bg-green-950/30' : ''}>
                                            <td className="px-3 py-2 font-bold text-gray-900 dark:text-gray-100">{opt.label}</td>
                                            <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{opt.dimensi}</td>
                                            <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{opt.berat}</td>
                                            <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{opt.maksItem}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <FieldError message={errors.ukuranBarang} />
                    </div>

                    <div>
                        <div className="flex items-center gap-1.5">
                            <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Tambah Foto Barang</label>
                            <span className="text-gray-400 dark:text-gray-500">
                                <Info size={14} />
                            </span>
                        </div>
                        <div className="relative mt-2">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => update('fotoBarang', e.target.files?.[0] ?? null)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#15803d] focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:file:bg-green-950/40 dark:file:text-green-400"
                            />
                        </div>
                        {form.fotoBarang && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <Image size={14} /> {form.fotoBarang.name}
                            </p>
                        )}
                        <FieldError message={errors.fotoBarang} />
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

            {infoOpen && <UkuranBarangInfoModal options={ukuranBarangOptions} onClose={() => setInfoOpen(false)} />}
        </CustomerLayout>
    );
}

function FieldError({ message }) {
    if (!message) return null;
    return <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p>;
}