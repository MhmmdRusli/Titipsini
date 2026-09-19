import { Head, Link, router } from '@inertiajs/react';
import {
    Wallet,
    Clock,
    Sparkles,
    MapPin,
    Calendar,
    ArrowUpRight,
    Search,
    ShieldCheck,
} from 'lucide-react';
import FinanceLayout from '@/Layouts/FinanceLayout';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

const cardCls = 'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800';

export default function Index({ topups }) {
    return (
        <FinanceLayout>
            <Head title="Verifikasi Top Up" />

            {/* Header Hero Banner */}
            <div className="relative mb-8 overflow-hidden rounded-2xl bg-[#087847] p-8 text-white shadow-md">
                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        {/* Badge Pill Khusus */}
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-400/40 bg-yellow-500/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-yellow-300">
                            <Sparkles size={12} className="text-yellow-400" />
                            <span>FINANCE DASHBOARD</span>
                        </div>
                        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Verifikasi Top Up
                        </h1>
                        <p className="mt-1.5 max-w-xl text-xs text-green-100/90 leading-relaxed">
                            Kelola dan verifikasi pengajuan top-up saldo dari pelanggan secara aman dan terstruktur.
                        </p>
                    </div>

                    {/* Filter Capsule */}
                    <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-yellow-400" />
                            <span>Semua Kota</span>
                        </div>
                        <span className="text-white/30">|</span>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-yellow-400" />
                            <span>Semua Waktu</span>
                        </div>
                    </div>
                </div>

                {/* Bulatan Dekorasi */}
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/5 border border-white/10"></div>
                <div className="absolute right-20 -bottom-20 h-48 w-48 rounded-full bg-white/5 border border-white/10"></div>
            </div>

            {/* Main Table Card */}
            <div className={cardCls}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                <th className="px-6 py-4">Kode Transaksi</th>
                                <th className="px-6 py-4">Pelanggan</th>
                                <th className="px-6 py-4">Nominal</th>
                                <th className="px-6 py-4">Metode Pembayaran</th>
                                <th className="px-6 py-4">Waktu Klaim</th>
                                <th className="px-6 py-4 text-right">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700/60">
                            {topups.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500 dark:text-gray-400">
                                        <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600">
                                                <Clock size={32} />
                                            </div>
                                            <h3 className="mt-4 text-base font-bold text-gray-800 dark:text-gray-200">Tidak Ada Transaksi</h3>
                                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                Belum ada transaksi top-up yang menunggu verifikasi saat ini.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                topups.data.map((t) => (
                                    <tr key={t.id} className="group transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/40">
                                        <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-600 dark:text-gray-400">
                                            {t.kode_transaksi}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 group-hover:text-green-700 transition-colors dark:text-gray-200">
                                                {t.user?.name ?? '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-extrabold text-gray-900 text-base dark:text-gray-200">
                                                {formatRupiah(t.nominal)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                {t.metode_pembayaran === 'transfer_bank' ? 'Transfer Bank' : 'E-Wallet'} - {t.channel}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <Clock size={14} className="text-gray-400 dark:text-gray-500" />
                                                {t.paid_at ? new Date(t.paid_at).toLocaleString('id-ID') : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/finance/topup/${t.id}`}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#087847] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-green-800 active:scale-95 border border-green-600"
                                            >
                                                <span>Periksa</span>
                                                <ArrowUpRight size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Container */}
            {topups.links?.length > 3 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Menampilkan <span className="font-bold text-gray-800 dark:text-gray-200">{topups.from ?? 0}</span> -{' '}
                        <span className="font-bold text-gray-800 dark:text-gray-200">{topups.to ?? 0}</span> dari Total{' '}
                        <span className="font-bold text-gray-800 dark:text-gray-200">{topups.total ?? 0}</span> Data
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {topups.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
                                    link.active
                                        ? 'bg-[#087847] text-white border-green-600 shadow-sm'
                                        : link.url
                                        ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                                        : 'cursor-not-allowed text-gray-300 border-gray-100 bg-gray-50/50 dark:text-gray-600 dark:border-gray-600 dark:bg-gray-700'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </FinanceLayout>
    );
}
