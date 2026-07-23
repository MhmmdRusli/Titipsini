import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Clock } from 'lucide-react';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Menunggu({ topup }) {
    return (
        <CustomerLayout title="Status Top Up" backHref="/app/dashboard">
            <Head title="Menunggu Verifikasi" />

            <div className="px-4 py-6">
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                        <Clock size={28} />
                    </div>
                    <p className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">Menunggu Verifikasi</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Bukti pembayaran kamu sedang diperiksa oleh tim kami. Biasanya kurang dari 10 menit.
                    </p>
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">ID Transaksi {topup.kode_transaksi}</p>

                    <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 px-4 py-3 border border-amber-100/60 dark:border-amber-900/40">
                        <p className="text-xs text-amber-700 dark:text-amber-400">Nominal Top Up</p>
                        <p className="text-xl font-bold text-amber-800 dark:text-amber-300">{formatRupiah(topup.nominal)}</p>
                    </div>
                </div>

                <div className="mt-5 space-y-2">
                    <Link
                        href="/app/saldo/riwayat"
                        className="block w-full rounded-xl bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600 py-3 text-center text-sm font-bold text-white shadow-sm transition"
                    >
                        Lihat Riwayat Top Up
                    </Link>
                    <Link
                        href="/app/dashboard"
                        className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                        Kembali ke Home
                    </Link>
                </div>
            </div>
        </CustomerLayout>
    );
}