import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Index({ topups }) {
    return (
        <AdminLayout title="Verifikasi Top Up">
            <Head title="Verifikasi Top Up" />

            <div className="p-6">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Up Menunggu Verifikasi</h1>

                <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-left text-xs text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3">Kode</th>
                                <th className="px-4 py-3">Pelanggan</th>
                                <th className="px-4 py-3">Nominal</th>
                                <th className="px-4 py-3">Waktu Klaim</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {topups.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400 dark:text-gray-500">
                                        Tidak ada transaksi yang menunggu verifikasi.
                                    </td>
                                </tr>
                            ) : (
                                topups.data.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{t.kode_transaksi}</td>
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.user?.name}</td>
                                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{formatRupiah(t.nominal)}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                            {t.paid_at ? new Date(t.paid_at).toLocaleString('id-ID') : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/topup/${t.id}`}
                                                className="text-xs font-medium text-[#15803d] dark:text-[#4ade80] hover:underline"
                                            >
                                                Periksa
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}