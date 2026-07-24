import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft, Wallet, ArrowDownCircle, ArrowUpCircle, Filter } from 'lucide-react';

function formatRupiah(angka) {
    return 'Rp' + Number(angka).toLocaleString('id-ID');
}

const TABS = [
    { value: 'semua', label: 'Semua' },
    { value: 'penghasilan', label: 'Penghasilan' },
    { value: 'penarikan', label: 'Penarikan' },
];

export default function PenarikanIndex({ saldo, mutasi = [], filter = {} }) {
    const [dari, setDari] = useState(filter.dari ?? '');
    const [sampai, setSampai] = useState(filter.sampai ?? '');
    const [showFilter, setShowFilter] = useState(false);
    const tipe = filter.tipe ?? 'semua';

    const applyFilter = (nextTipe = tipe, nextDari = dari, nextSampai = sampai) => {
        router.get(
            '/mitra/pendapatan/penarikan',
            { tipe: nextTipe, dari: nextDari || undefined, sampai: nextSampai || undefined },
            { preserveScroll: true, preserveState: true }
        );
    };

    return (
        <MitraLayout>
            <Head title="Detail Saldo" />

            <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
                <button type="button" onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-base font-semibold text-gray-900">Detail Saldo</h1>
            </div>

            <div className="bg-green-700 px-4 py-5 text-white">
                <div className="flex items-center gap-1.5 text-xs text-green-100">
                    <Wallet size={13} />
                    Saldo Tersedia
                </div>
                <p className="mt-1 text-2xl font-bold">{formatRupiah(saldo)}</p>
                <Link
                    href="/mitra/pendapatan/penarikan/tarik"
                    className="mt-3 inline-block rounded-lg bg-white px-4 py-2 text-xs font-semibold text-green-700"
                >
                    Tarik Saldo
                </Link>
            </div>

            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-gray-100 bg-white px-4 py-2">
                <div className="flex gap-1.5">
                    {TABS.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => applyFilter(t.value)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium ${tipe === t.value ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowFilter((v) => !v)}
                    className="flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600"
                >
                    <Filter size={12} />
                    Tanggal
                </button>
            </div>

            {showFilter ? (
                <div className="flex items-end gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex-1">
                        <label className="block text-[11px] text-gray-500">Dari</label>
                        <input type="date" value={dari} onChange={(e) => setDari(e.target.value)} className="w-full rounded-lg border-gray-300 text-xs" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-[11px] text-gray-500">Sampai</label>
                        <input type="date" value={sampai} onChange={(e) => setSampai(e.target.value)} className="w-full rounded-lg border-gray-300 text-xs" />
                    </div>
                    <button
                        onClick={() => applyFilter(tipe, dari, sampai)}
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white"
                    >
                        Terapkan
                    </button>
                </div>
            ) : null}

            <div className="space-y-2 px-4 py-3">
                {mutasi.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
                        Belum ada mutasi pada rentang ini.
                    </div>
                ) : null}

                {mutasi.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
                        {m.type === 'penghasilan' ? (
                            <ArrowDownCircle size={22} className="shrink-0 text-green-600" />
                        ) : (
                            <ArrowUpCircle size={22} className="shrink-0 text-red-500" />
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-800">{m.deskripsi ?? (m.type === 'penghasilan' ? 'Penghasilan' : 'Penarikan')}</p>
                            <p className="text-[11px] text-gray-400">{m.tanggal}</p>
                        </div>
                        <p className={`text-sm font-semibold ${m.type === 'penghasilan' ? 'text-green-600' : 'text-red-500'}`}>
                            {m.type === 'penghasilan' ? '+' : '-'}
                            {formatRupiah(m.jumlah)}
                        </p>
                    </div>
                ))}
            </div>
        </MitraLayout>
    );
}