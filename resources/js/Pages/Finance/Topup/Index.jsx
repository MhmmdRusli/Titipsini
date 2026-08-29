import { Head, Link, router } from '@inertiajs/react';
import FinanceLayout from '@/Layouts/FinanceLayout';
import { Clock } from 'lucide-react';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        value ?? 0
    );
}

export default function Index({ topups }) {
    return (
        <FinanceLayout>
            <Head title="Verifikasi Top Up" />

            <div className="mb-8">
                <p className="text-sm font-semibold text-emerald-700">Verifikasi</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Top Up</h1>
                <p className="mt-2 text-sm text-slate-500">Kelola dan verifikasi pengajuan top-up saldo dari pelanggan.</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Kode</th>
                            <th className="px-6 py-3 font-semibold">Pelanggan</th>
                            <th className="px-6 py-3 font-semibold">Nominal</th>
                            <th className="px-6 py-3 font-semibold">Metode</th>
                            <th className="px-6 py-3 font-semibold">Waktu Klaim</th>
                            <th className="px-6 py-3 text-right font-semibold">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {topups.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-14 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <Clock size={32} className="text-slate-300 mb-2" />
                                        <p className="text-sm font-medium text-slate-500">
                                            Tidak ada transaksi yang menunggu verifikasi.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            topups.data.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/70">
                                    <td className="px-6 py-4 font-mono text-slate-500">{t.kode_transaksi}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">{t.user?.name ?? '-'}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">{formatRupiah(t.nominal)}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {t.metode_pembayaran === 'transfer_bank' ? 'Transfer Bank' : 'E-Wallet'} - {t.channel}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {t.paid_at ? new Date(t.paid_at).toLocaleString('id-ID') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/finance/topup/${t.id}`}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
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

            {topups.links?.length > 3 && (
                <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                    {topups.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                link.active
                                    ? 'bg-emerald-700 text-white shadow-sm'
                                    : link.url
                                    ? 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                    : 'cursor-not-allowed text-slate-300 border border-slate-100 bg-slate-50/50'
                            }`}
                        />
                    ))}
                </div>
            )}
        </FinanceLayout>
    );
}
