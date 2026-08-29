import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowDownToLine, CircleDollarSign, Clock3, Eye, ReceiptText } from 'lucide-react';
import FinanceLayout from '@/Layouts/FinanceLayout';

const statusOptions = [
    { value: 'semua', label: 'Semua status' },
    { value: 'baru', label: 'Baru' },
    { value: 'diproses', label: 'Diproses' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
];

const statusStyles = {
    baru: 'bg-blue-50 text-blue-700 ring-blue-600/10',
    diproses: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    selesai: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    dibatalkan: 'bg-rose-50 text-rose-700 ring-rose-600/10',
};

const currency = (value) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
}).format(value || 0);

function StatCard({ label, value, detail, icon: Icon, tone }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`mb-6 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
            <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
    );
}

export default function Dashboard({ stats = {}, transactions, filters = {} }) {
    const [status, setStatus] = useState(filters.status || 'semua');
    const [selected, setSelected] = useState(null);
    const rows = transactions?.data || [];

    const applyStatus = (nextStatus) => {
        setStatus(nextStatus);
        router.get('/finance/dashboard', { status: nextStatus }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <FinanceLayout>
            <Head title="Dashboard Finance" />
            <div className="mb-8">
                <p className="text-sm font-semibold text-emerald-700">Ringkasan keuangan</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Dashboard Finance</h1>
                <p className="mt-2 max-w-xl text-sm text-slate-500">Pantau arus pemasukan, transaksi aktif, dan pencairan dana Titipsini.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard label="Total pemasukan" value={currency(stats.totalIncome)} detail="Dari transaksi selesai" icon={CircleDollarSign} tone="bg-emerald-100 text-emerald-700" />
                <StatCard label="Pendapatan hari ini" value={currency(stats.todayIncome)} detail="Transaksi selesai hari ini" icon={ArrowDownToLine} tone="bg-blue-100 text-blue-700" />
                <StatCard label="Transaksi pending" value={stats.pendingTransactions || 0} detail="Menunggu diproses" icon={Clock3} tone="bg-amber-100 text-amber-700" />
            </div>

            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
                    <div>
                        <h2 className="font-bold text-slate-950">Transaksi keuangan</h2>
                        <p className="mt-1 text-xs text-slate-500">Daftar transaksi terbaru berdasarkan status.</p>
                    </div>
                    <select value={status} onChange={(event) => applyStatus(event.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-emerald-600 focus:ring-emerald-600">
                        {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                            <tr><th className="px-6 py-3 font-semibold">Transaksi</th><th className="px-6 py-3 font-semibold">Customer / Mitra</th><th className="px-6 py-3 font-semibold">Nominal</th><th className="px-6 py-3 font-semibold">Status</th><th className="px-6 py-3 text-right font-semibold">Aksi</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? <tr><td colSpan="5" className="px-6 py-14 text-center text-sm text-slate-500">Belum ada transaksi pada filter ini.</td></tr> : rows.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-slate-50/70">
                                    <td className="px-6 py-4"><p className="font-semibold text-slate-900">{transaction.order_code}</p><p className="mt-1 text-xs text-slate-500">{transaction.service_type} · {transaction.created_at}</p></td>
                                    <td className="px-6 py-4"><p className="text-slate-800">{transaction.customer}</p><p className="mt-1 text-xs text-slate-500">Mitra: {transaction.partner}</p></td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">{currency(transaction.amount)}</td>
                                    <td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[transaction.status] || 'bg-slate-100 text-slate-600 ring-slate-500/10'}`}>{transaction.status}</span></td>
                                    <td className="px-6 py-4 text-right"><button type="button" onClick={() => setSelected(transaction)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700"><Eye size={14} /> Tinjau</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {transactions?.links?.length > 3 && <div className="flex flex-wrap gap-2 border-t border-slate-200 px-6 py-4">{transactions.links.map((link) => <button key={link.label} type="button" disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })} className={`rounded-lg px-3 py-1.5 text-xs ${link.active ? 'bg-emerald-700 text-white' : 'border border-slate-200 text-slate-600'} ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />)}</div>}
            </section>

            {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-5" role="dialog" aria-modal="true" aria-label="Detail transaksi"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Detail transaksi</p><h2 className="mt-1 text-xl font-bold text-slate-950">{selected.order_code}</h2></div><button type="button" onClick={() => setSelected(null)} className="text-sm font-semibold text-slate-400 hover:text-slate-700">Tutup</button></div><dl className="mt-6 space-y-4 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">Customer</dt><dd className="text-right font-medium text-slate-900">{selected.customer}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Mitra</dt><dd className="text-right font-medium text-slate-900">{selected.partner}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Nominal</dt><dd className="text-right font-bold text-emerald-700">{currency(selected.amount)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Status</dt><dd className="capitalize text-slate-900">{selected.status}</dd></div></dl></div></div>}
        </FinanceLayout>
    );
}
