import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Building2, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const BENEFITS = [
    'Keamanan terjaga',
    'Kontrol berkala setiap hari',
    'Bisa diambil kapan saja',
    'Konsultasi & Support',
];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID').format(value);
}

// Sama persis dengan hitungJumlahHari() di ServiceController - dipakai hanya
// untuk preview di frontend, harga final tetap dihitung ulang di server.
function hitungJumlahHari(tanggalMasuk, tanggalKeluar) {
    if (!tanggalMasuk || !tanggalKeluar) return null;
    const d1 = new Date(tanggalMasuk);
    const d2 = new Date(tanggalKeluar);
    const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
}

export default function Show({ service }) {
    const [tanggalMasuk, setTanggalMasuk] = useState('');
    const [tanggalKeluar, setTanggalKeluar] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const jumlahHari = useMemo(
        () => hitungJumlahHari(tanggalMasuk, tanggalKeluar),
        [tanggalMasuk, tanggalKeluar]
    );
    const estimasiTotal = jumlahHari ? service.harga * jumlahHari : null;

    function handleSubmit(e) {
        e.preventDefault();
        if (!tanggalMasuk || !tanggalKeluar) {
            setError('Tanggal masuk dan keluar wajib diisi.');
            return;
        }
        setError('');
        setProcessing(true);
        router.post(
            `/app/services/${service.id}/pesan`,
            { tanggalMasuk, tanggalKeluar },
            { onFinish: () => setProcessing(false) }
        );
    }

    return (
        <CustomerLayout title="Detail Layanan" backHref="/app/dashboard">
            <Head title="Detail Layanan" />

            <div className="px-4 py-3">
                {/* Banner Hero Gradasi (Gaya Asli) */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#15803d] to-emerald-600 dark:from-green-700 dark:to-emerald-800 p-5 text-white shadow-md">
                    <div className="absolute right-4 top-4 rounded-xl bg-white/15 p-2">
                        <Building2 size={20} />
                    </div>

                    <p className="text-2xl font-extrabold leading-none">
                        {formatRupiah(service.harga)}
                        <span className="ml-1 text-sm font-semibold align-middle">/ hari</span>
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/90">Layanan Terbaik Kami</p>

                    <ul className="mt-4 space-y-1.5">
                        {BENEFITS.map((b) => (
                            <li key={b} className="flex items-center gap-2 text-xs text-white/90">
                                <ShieldCheck size={14} className="shrink-0 text-white" />
                                {b}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Form Utama */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {service.kategori === 'kendaraan' ? 'Kendaraan' : 'Bangunan'}
                        </label>
                        <div className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {service.jenisLabel}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Tanggal masuk</label>
                        <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                                <Calendar size={18} />
                            </span>
                            <input
                                type="date"
                                value={tanggalMasuk}
                                onChange={(e) => setTanggalMasuk(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pl-11 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15803d] dark:focus:ring-[#22c55e]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-100">Tanggal keluar</label>
                        <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                                <Calendar size={18} />
                            </span>
                            <input
                                type="date"
                                value={tanggalKeluar}
                                onChange={(e) => setTanggalKeluar(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pl-11 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15803d] dark:focus:ring-[#22c55e]"
                            />
                        </div>
                    </div>

                    {estimasiTotal !== null && (
                        <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                Estimasi ({jumlahHari} hari)
                            </span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">
                                Rp {formatRupiah(estimasiTotal)}
                            </span>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <p className="text-[11px] text-red-500 dark:text-red-400">
                        *Jika menitipkan {service.kategori === 'kendaraan' ? 'kendaraan' : 'bangunan'} melebihi batas
                        yang sudah ditentukan tanpa konfirmasi maka akan dikenakan denda sebesar Rp 10.000/hari.
                    </p>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <span>Lanjutkan Pembayaran</span>
                        )}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}