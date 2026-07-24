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

            {/* Tabel Data Verifikasi Top Up */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm transition-colors">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/70 dark:bg-gray-900/60 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 select-none">
                        <tr>
                            <th className="px-4 py-3 font-bold">Kode</th>
                            <th className="px-4 py-3 font-bold">Pelanggan</th>
                            <th className="px-4 py-3 font-bold">Nominal</th>
                            <th className="px-4 py-3 font-bold">Metode</th>
                            <th className="px-4 py-3 font-bold">Waktu Klaim</th>
                            <th className="px-4 py-3 font-bold text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                        {topups.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 select-none">
                                    <div className="flex flex-col items-center justify-center">
                                        <Clock size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Tidak ada transaksi yang menunggu verifikasi.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            topups.data.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-4 py-3.5 font-mono text-gray-500 dark:text-gray-400">{t.kode_transaksi}</td>
                                    <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">{t.user?.name ?? '-'}</td>
                                    <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-gray-100">{formatRupiah(t.nominal)}</td>
                                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">
                                        {t.metode_pembayaran === 'transfer_bank' ? 'Transfer Bank' : 'E-Wallet'} - {t.channel}
                                    </td>
                                    <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">
                                        {t.paid_at ? new Date(t.paid_at).toLocaleString('id-ID') : '-'}
                                    </td>
                                    <td className="px-4 py-3.5 text-right select-none">
                                        <Link
                                            href={`/admin/topup/${t.id}`}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 transition-colors"
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
                <div className="mt-5 flex flex-wrap justify-center gap-1.5 select-none">
                    {topups.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                link.active
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : link.url
                                    ? 'bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                                    : 'cursor-not-allowed text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-gray-800/40 bg-gray-50/50 dark:bg-gray-900/20'
                            }`}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}