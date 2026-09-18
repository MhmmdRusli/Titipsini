import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import FinanceLayout from '@/Layouts/FinanceLayout';

// Helper Format Rupiah
function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

// Helper Format Tanggal
function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Card style diperbarui agar konsisten di dark mode
const cardCls = 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900';

export default function Index({ items, summary, filters }) {
    const [bulan, setBulan] = useState(filters.bulan || '');

    const handleMonthChange = (e) => {
        const value = e.target.value;
        setBulan(value);
        router.get(
            '/finance/pendapatan',
            value ? { bulan: value } : {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleReset = () => {
        setBulan('');
        router.get('/finance/pendapatan', {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <FinanceLayout>
            <Head title="Pendapatan Platform - Titipsini" />

            <div className="space-y-6">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-[#0c7050] p-6 text-white shadow-sm">
                    <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-white/5 pointer-events-none"></div>
                    <div className="absolute -bottom-20 -right-4 h-80 w-80 rounded-full bg-white/5 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-[11px] font-bold tracking-wider text-yellow-400 uppercase">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                                Finance Dashboard
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Pendapatan Platform
                            </h1>
                            <p className="mt-1 text-sm text-emerald-100/80">
                                Rekapitulasi komisi platform Titipsini yang terkumpul dari transaksi mitra.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-md">
                            <input
                                type="month"
                                value={bulan}
                                onChange={handleMonthChange}
                                className="cursor-pointer rounded-lg border-0 bg-transparent px-3 py-1.5 text-sm font-medium text-white placeholder-emerald-200 focus:outline-none focus:ring-1 focus:ring-white/30 [color-scheme:dark]"
                            />
                            {bulan && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="rounded-lg bg-rose-500/20 px-2.5 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/30"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3 Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {/* Card 1: Total Komisi */}
                    <div className="relative flex flex-col h-full overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-100/40 to-white p-5 shadow-sm transition hover:shadow-md dark:border-emerald-900/40 dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-slate-900">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                                Total Komisi Platform
                            </span>
                            <p className="mt-2 text-3xl font-extrabold text-emerald-950 dark:text-emerald-300">
                                {formatRupiah(summary.totalKomisi)}
                            </p>
                            <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">Keuntungan bersih platform</p>
                        </div>
                        <div className="absolute -bottom-6 -right-3 h-24 w-24 text-emerald-600/20 dark:text-emerald-400/20 pointer-events-none -z-0">
                            <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Card 2: Volume Transaksi */}
                    <div className={cardCls + " relative flex flex-col h-full p-5"}>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Volume Transaksi
                            </span>
                            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                                {formatRupiah(summary.totalTransaksi)}
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">Nilai bruto seluruh transaksi</p>
                        </div>
                        <div className="absolute -bottom-6 -right-3 h-24 w-24 text-slate-500/20 dark:text-slate-400/20 pointer-events-none -z-0">
                            <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v9.75a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5zm13.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6 7.5h1.5S9 7.5 9 9s-1.5 1.5-1.5 1.5H6" />
                            </svg>
                        </div>
                    </div>

                    {/* Card 3: Total Transaksi */}
                    <div className={cardCls + " relative flex flex-col h-full p-5"}>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Total Transaksi
                            </span>
                            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                                {summary.jumlahTransaksi}{' '}
                                <span className="text-2xl font-normal text-slate-500 dark:text-slate-400">order</span>
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">Jumlah transaksi berhasil</p>
                        </div>
                        <div className="absolute -bottom-6 -right-3 h-24 w-24 text-slate-500/20 dark:text-slate-400/20 pointer-events-none -z-0">
                            <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className={cardCls}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">No. Order</th>
                                    <th className="px-6 py-4">Mitra</th>
                                    <th className="px-6 py-4">Total Transaksi</th>
                                    <th className="px-6 py-4">Komisi</th>
                                    <th className="px-6 py-4">Jumlah Komisi</th>
                                    <th className="px-6 py-4">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                                {items.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                                            Tidak ada data pendapatan pada periode ini.
                                        </td>
                                    </tr>
                                ) : (
                                    items.data.map((item) => (
                                        <tr key={item.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4 font-mono text-xs font-normal text-slate-600 dark:text-slate-300">
                                                #{item.order_code}
                                            </td>
                                            <td className="px-6 py-4 font-normal text-slate-600 dark:text-slate-300">
                                                {item.partner_name}
                                            </td>
                                            <td className="px-6 py-4 font-normal text-slate-600 dark:text-slate-300">
                                                {formatRupiah(item.total_transaksi)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                    {item.komisi_persen}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-emerald-700 dark:text-emerald-400">
                                                {formatRupiah(item.jumlah_komisi)}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                                {formatDate(item.tanggal)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {items.links?.length > 3 && (
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-300">{items.from ?? 0}</span> - <span className="font-semibold text-slate-700 dark:text-slate-300">{items.to ?? 0}</span> dari <span className="font-semibold text-slate-700 dark:text-slate-300">{items.total ?? 0}</span> data
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {items.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                            link.active
                                                ? 'bg-[#0c7050] text-white shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                        } ${!link.url ? 'cursor-not-allowed opacity-30 hover:bg-transparent' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FinanceLayout>
    );
}