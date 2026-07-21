import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Clock } from 'lucide-react';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        value ?? 0
    );
}

export default function Index({ topups }) {
    return (
        <AdminLayout title="Verifikasi Top Up">
            <Head title="Verifikasi Top Up" />

            <div className="p-6">
                <h1 className="text-lg font-semibold text-gray-900">Top Up Menunggu Verifikasi</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Daftar transaksi top up yang sudah diklaim dibayar oleh pelanggan dan menunggu verifikasi.
                </p>

                <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Kode</th>
                                <th className="px-4 py-3">Pelanggan</th>
                                <th className="px-4 py-3">Nominal</th>
                                <th className="px-4 py-3">Metode</th>
                                <th className="px-4 py-3">Waktu Klaim</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {topups.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                                        <Clock size={24} className="mx-auto mb-2 text-gray-300" />
                                        Tidak ada transaksi yang menunggu verifikasi.
                                    </td>
                                </tr>
                            ) : (
                                topups.data.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">{t.kode_transaksi}</td>
                                        <td className="px-4 py-3">{t.user?.name ?? '-'}</td>
                                        <td className="px-4 py-3 font-semibold text-gray-900">{formatRupiah(t.nominal)}</td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {t.metode_pembayaran === 'transfer_bank' ? 'Transfer Bank' : 'E-Wallet'} - {t.channel}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {t.paid_at ? new Date(t.paid_at).toLocaleString('id-ID') : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/topup/${t.id}`}
                                                className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
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

                {/* Pagination */}
                {topups.links?.length > 3 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                        {topups.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg px-3 py-1.5 text-xs ${
                                    link.active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
                                } ${!link.url ? 'opacity-40' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}