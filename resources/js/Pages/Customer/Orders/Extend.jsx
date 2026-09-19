import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Info } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const SERVICE_LABEL = {
    barang: 'Titip Barang',
    kendaraan: 'Titip Kendaraan',
    bangunan: 'Sewa Bangunan',
    pindahan: 'Jasa Pindahan',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function formatTanggalPendek(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

// input date butuh format YYYY-MM-DD
function toInputDate(value) {
    if (!value) return '';
    return new Date(value).toISOString().slice(0, 10);
}

export default function Extend({ order, hargaPerHari }) {
    const minDate = useMemo(() => {
        const d = new Date(order.end_date);
        d.setDate(d.getDate() + 1);
        return d.toISOString().slice(0, 10);
    }, [order.end_date]);

    const [extendEndDate, setExtendEndDate] = useState('');
    const [agree, setAgree] = useState(false);
    const [processing, setProcessing] = useState(false);

    const jumlahHariTambahan = extendEndDate
        ? Math.max(1, Math.round((new Date(extendEndDate) - new Date(order.end_date)) / 86400000))
        : 0;
    const totalPembayaran = jumlahHariTambahan * hargaPerHari;

    function handleSubmit(e) {
        e.preventDefault();
        if (!extendEndDate || !agree) return;
        setProcessing(true);
        router.post(
            `/app/orders/${order.id}/extend`,
            { extend_end_date: extendEndDate },
            { onFinish: () => setProcessing(false) }
        );
    }

    const canSubmit = extendEndDate && agree && !processing;

    return (
        <CustomerLayout>
            <Head title={`Perpanjang Penitipan - ${order.order_code}`} />

            <div className="mx-auto max-w-lg px-4 py-6 md:py-8">
                {/* Navigasi Back */}
                <div className="mb-5 flex items-center gap-3">
                    <Link
                        href={`/app/orders/${order.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 transition"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Perpanjang Penitipan</h1>
                </div>

                {/* Progress bar sederhana - 1 langkah saja untuk perpanjangan */}
                <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-full w-full rounded-full bg-green-700 dark:bg-green-500" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Info pesanan (readonly) */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800/90">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            {SERVICE_LABEL[order.service_type] ?? order.service_type}
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{order.item_name}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Kode Pesanan: {order.order_code}
                        </p>
                    </div>

                    {/* Tanggal Penitipan Saat Ini */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-gray-100">
                            Tanggal Penitipan Saat Ini
                        </label>
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
                            <CalendarDays size={16} className="shrink-0 text-gray-400" />
                            {formatTanggalPendek(order.start_date)} / {formatTanggalPendek(order.end_date)}
                        </div>
                    </div>

                    {/* Tanggal Keluar Baru */}
                    <div>
                        <label htmlFor="extend_end_date" className="mb-1.5 block text-sm font-semibold text-gray-800 dark:text-gray-100">
                            Tanggal Keluar Baru
                        </label>
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-3 focus-within:border-green-700 focus-within:ring-1 focus-within:ring-green-700 dark:border-gray-700 dark:bg-gray-800">
                            <CalendarDays size={16} className="shrink-0 text-gray-400" />
                            <input
                                id="extend_end_date"
                                type="date"
                                min={minDate}
                                value={extendEndDate}
                                onChange={(e) => setExtendEndDate(e.target.value)}
                                required
                                className="w-full bg-transparent text-sm text-gray-800 outline-none dark:text-gray-100"
                            />
                        </div>
                        <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-gray-400">
                            <Info size={12} className="mt-0.5 shrink-0" />
                            Tanggal keluar baru harus setelah {formatTanggalPendek(order.end_date)}.
                        </p>
                    </div>

                    {/* Total Pembayaran preview */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800/90">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Total Pembayaran</span>
                            {jumlahHariTambahan > 0 && (
                                <span className="text-xs text-gray-400">{jumlahHariTambahan} hari tambahan</span>
                            )}
                        </div>
                        <p className="mt-1 text-xl font-extrabold text-green-700 dark:text-green-400">
                            {formatRupiah(totalPembayaran)}
                        </p>
                        {jumlahHariTambahan === 0 && (
                            <p className="mt-1 text-[11px] text-gray-400">Pilih tanggal keluar baru untuk melihat rincian biaya.</p>
                        )}
                    </div>

                    {/* Checkbox syarat & ketentuan */}
                    <label className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-400">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-green-700 focus:ring-green-700"
                        />
                        <span>
                            Saya menyetujui{' '}
                            <span className="font-semibold text-gray-800 dark:text-gray-200">Syarat</span> dan{' '}
                            <span className="font-semibold text-gray-800 dark:text-gray-200">Ketentuan</span> yang berlaku di
                            Titipsini.com
                        </span>
                    </label>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="flex w-full items-center justify-center rounded-xl bg-green-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition duration-200 hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none dark:bg-green-500 dark:hover:bg-green-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
                    >
                        {processing ? 'Memproses...' : 'Perpanjang Sekarang'}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}