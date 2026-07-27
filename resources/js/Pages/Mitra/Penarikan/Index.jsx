import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft, ChevronDown } from 'lucide-react';

function formatRupiah(angka) {
    return 'Rp' + Number(angka).toLocaleString('id-ID');
}

const TABS = [
    { value: 'semua', label: 'Semua' },
    { value: 'penghasilan', label: 'Penghasilan' },
    { value: 'penarikan', label: 'Penarikan' },
];

export default function PenarikanIndex({ saldo = 8000000, mutasi = [], filter = {} }) {
    const tipe = filter.tipe ?? 'semua';

    const applyFilter = (nextTipe) => {
        router.get(
            route('mitra.penarikan.index'),
            { tipe: nextTipe },
            { preserveScroll: true, preserveState: true }
        );
    };

    return (
        <MitraLayout>
            <Head title="Detail Saldo" />

            <div className="mx-auto max-w-md bg-white min-h-screen pb-10">
                {/* Header Navigasi */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
                    <button type="button" onClick={() => window.history.back()} className="text-gray-700">
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-sm font-semibold text-gray-900">Detail Saldo</h1>
                    <div className="w-5" />
                </div>

                {/* Banner Saldo */}
                <div className="mx-4 mt-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                        <span>Total Saldo Aktif</span>
                        <ChevronDown size={14} />
                    </div>
                    <p className="mt-1 text-2xl font-black text-gray-900">{formatRupiah(saldo)}</p>
                    
                    <Link
                        href={route('mitra.penarikan.create')}
                        className="mt-4 block w-full rounded-xl bg-[#2D7A44] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-green-800 transition"
                    >
                        Tarik Saldo
                    </Link>
                </div>

                {/* Filter Tab & Tanggal */}
                <div className="mt-4 px-4">
                    <p className="text-xs font-bold text-gray-900 mb-2">Riwayat Transaksi</p>
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="flex gap-1.5">
                            {TABS.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => applyFilter(t.value)}
                                    className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                                        tipe === t.value
                                            ? 'bg-green-50 text-[#2D7A44] border border-green-200'
                                            : 'bg-gray-50 text-gray-500'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Daftar Mutasi / Empty State */}
                <div className="mt-4 px-4 space-y-3">
                    {mutasi.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-24 w-24 mb-3 flex items-center justify-center rounded-full bg-green-50">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2D7A44" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Belum ada penarikan atau penghasilan</p>
                        </div>
                    ) : (
                        mutasi.map((m) => (
                            <div key={m.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 shadow-xs">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#2D7A44]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="5" width="20" height="14" rx="2" />
                                            <line x1="2" y1="10" x2="22" y2="10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-800">{m.deskripsi ?? (m.type === 'penghasilan' ? 'Transfer dari BRI' : 'Penarikan')}</p>
                                        <p className="text-[10px] text-gray-400">{m.tanggal}</p>
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-gray-900">
                                    {formatRupiah(m.jumlah)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MitraLayout>
    );
}