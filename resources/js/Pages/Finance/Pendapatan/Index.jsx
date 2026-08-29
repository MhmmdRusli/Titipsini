import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import FinanceLayout from '@/Layouts/FinanceLayout';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Index({ items, summary, filters }) {
    const [bulan, setBulan] = useState(filters.bulan || '');

    const applyFilter = () => {
        if (bulan) {
            router.get('/finance/pendapatan', { bulan }, { preserveState: true, preserveScroll: true, replace: true });
        } else {
            router.get('/finance/pendapatan', {}, { preserveState: true, preserveScroll: true, replace: true });
        }
    };

    return (
        <FinanceLayout>
            <Head title="Pendapatan Platform" />

            <div className="mb-8">
                <p className="text-sm font-semibold text-emerald-700">Laporan</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Pendapatan Platform</h1>
                <p className="mt-2 text-sm text-slate-500">Rekap komisi platform yang terkumpul dari transaksi mitra.</p>
            </div>

            <div className="mb-6 flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600">Filter Bulan</label>
                    <input
                        type="month"
                        value={bulan}
                        onChange={(e) => setBulan(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-emerald-600 focus:ring-emerald-600"
                    />
                </div>
                <button
                    type="button"
                    onClick={applyFilter}
                    className="rounded-lg bg-[#123c2b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d2f22]"
                >
                    Terapkan
                </button>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total Komisi</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{formatRupiah(summary.totalKomisi)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total Transaksi</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{formatRupiah(summary.totalTransaksi)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Jumlah Transaksi</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{summary.jumlahTransaksi}</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Order</th>
                                <th className="px-6 py-3 font-semibold">Mitra</th>
                                <th className="px-6 py-3 font-semibold">Total Transaksi</th>
                                <th className="px-6 py-3 font-semibold">Komisi (%)</th>
                                <th className="px-6 py-3 font-semibold">Jumlah Komisi</th>
                                <th className="px-6 py-3 font-semibold">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-14 text-center text-sm text-slate-500">
                                        Belum ada data pendapatan pada filter ini.
                                    </td>
                                </tr>
                            ) : items.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/70">
                                    <td className="px-6 py-4 font-semibold text-slate-900">{item.order_code}</td>
                                    <td className="px-6 py-4 text-slate-800">{item.partner_name}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">{formatRupiah(item.total_transaksi)}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.komisi_persen}%</td>
                                    <td className="px-6 py-4 font-bold text-emerald-700">{formatRupiah(item.jumlah_komisi)}</td>
                                    <td className="px-6 py-4 text-slate-500">{item.tanggal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {items.links?.length > 3 && (
                <div className="mt-5 flex flex-wrap gap-2">
                    {items.links.map((link) => (
                        <button
                            key={link.label}
                            type="button"
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                            className={`rounded-lg px-3 py-1.5 text-xs ${link.active ? 'bg-emerald-700 text-white' : 'border border-slate-200 text-slate-600'} ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </FinanceLayout>
    );
}
