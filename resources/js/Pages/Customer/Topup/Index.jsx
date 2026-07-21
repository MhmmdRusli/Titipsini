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
                <h1 className="text-lg font-semibold text-gray-900">Top Up Menunggu Verifikasi</h1>

                <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Kode</th>
                                <th className="px-4 py-3">Pelanggan</th>
                                <th className="px-4 py-3">Nominal</th>
                                <th className="px-4 py-3">Waktu Klaim</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {topups.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                                        Tidak ada transaksi yang menunggu verifikasi.
                                    </td>
                                </tr>
                            ) : (
                                topups.data.map((t) => (
                                    <tr key={t.id}>
                                        <td className="px-4 py-3 font-medium text-gray-800">{t.kode_transaksi}</td>
                                        <td className="px-4 py-3">{t.user?.name}</td>
                                        <td className="px-4 py-3">{formatRupiah(t.nominal)}</td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(t.paid_at).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/topup/${t.id}`}
                                                className="text-xs font-medium text-green-700 hover:underline"
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