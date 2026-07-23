import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { CheckCircle2, Wallet } from 'lucide-react';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        value ?? 0
    );
}

function formatTanggal(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Sukses({ topup, saldo }) {
    return (
        <CustomerLayout title="Detail Transaksi" backHref="/app/dashboard">
            <Head title="Top Up Berhasil" />

            <div className="px-4 py-6">
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/50 text-[#15803d] dark:text-[#4ade80]">
                        <CheckCircle2 size={30} />
                    </div>
                    <p className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">Sukses</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatTanggal(topup.paid_at)}</p>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">ID Transaksi {topup.kode_transaksi}</p>

                    <div className="mt-3 rounded-xl bg-green-50 dark:bg-green-950/40 px-4 py-3 border border-green-100/60 dark:border-green-900/40">
                        <p className="text-xs text-[#15803d] dark:text-[#4ade80]">Total Top Up</p>
                        <p className="text-xl font-bold text-green-800 dark:text-green-300">{formatRupiah(topup.nominal)}</p>
                    </div>

                    <div className="mt-4 space-y-1.5 text-left text-xs">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Detail Transaksi</p>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Subtotal Top Up</span>
                            <span className="text-gray-800 dark:text-gray-200">{formatRupiah(topup.nominal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Biaya Admin</span>
                            <span className="text-gray-800 dark:text-gray-200">{formatRupiah(topup.biaya_admin)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-1.5 font-semibold text-gray-900 dark:text-gray-100">
                            <span>Total Bayar</span>
                            <span>{formatRupiah(topup.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3.5 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Wallet size={15} className="text-[#15803d] dark:text-[#4ade80]" />
                        Saldo Titip Saat Ini
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatRupiah(saldo)}</span>
                </div>

                <div className="mt-5 space-y-2">
                    <Link
                        href="/app/saldo/riwayat"
                        className="block w-full rounded-xl bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600 py-3 text-center text-sm font-bold text-white shadow-sm transition"
                    >
                        Lihat Saldo
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