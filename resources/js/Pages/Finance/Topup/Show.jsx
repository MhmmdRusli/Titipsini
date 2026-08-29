import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, User, Building2, CheckCircle2, XCircle, X, AlertCircle } from 'lucide-react';
import FinanceLayout from '@/Layouts/FinanceLayout';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        value ?? 0
    );
}

function formatTanggal(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const STATUS_BADGE = {
    menunggu_verifikasi: { label: 'Menunggu Verifikasi', color: 'bg-amber-50 text-amber-600' },
    berhasil: { label: 'Berhasil', color: 'bg-green-50 text-green-700' },
    ditolak: { label: 'Ditolak', color: 'bg-red-50 text-red-600' },
};

export default function Show({ topup }) {
    const [approveOpen, setApproveOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [alasan, setAlasan] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errorAlasan, setErrorAlasan] = useState('');

    const badge = STATUS_BADGE[topup.status] ?? STATUS_BADGE.menunggu_verifikasi;
    const isPending = topup.status === 'menunggu_verifikasi';

    function handleApprove() {
        setProcessing(true);
        router.post(
            `/finance/topup/${topup.id}/approve`,
            {},
            {
                onFinish: () => {
                    setProcessing(false);
                    setApproveOpen(false);
                },
            }
        );
    }

    function handleReject() {
        if (!alasan.trim()) {
            setErrorAlasan('Cantumkan alasan penolakan.');
            return;
        }
        setProcessing(true);
        router.post(
            `/finance/topup/${topup.id}/reject`,
            { catatan_admin: alasan },
            {
                onFinish: () => {
                    setProcessing(false);
                    setRejectOpen(false);
                },
            }
        );
    }

    return (
        <FinanceLayout>
            <Head title={`Verifikasi Top Up - ${topup.kode_transaksi}`} />

            <div className="mx-auto max-w-2xl p-6">
                <Link href="/finance/topup" className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition">
                    <ArrowLeft size={16} />
                    Kembali ke Daftar Top Up
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-semibold text-slate-900">{topup.kode_transaksi}</p>
                        <p className="text-xs text-slate-400">Diklaim dibayar: {formatTanggal(topup.paid_at)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>
                        {badge.label}
                    </span>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-slate-900">Info Pelanggan</p>
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                        <User size={16} className="mt-0.5 shrink-0 text-slate-400" />
                        <div>
                            <p className="font-medium text-slate-900">{topup.user?.name}</p>
                            <p className="text-xs text-slate-500">{topup.user?.email}</p>
                            <p className="text-xs text-slate-500">{topup.user?.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-slate-900">Info Pembayaran</p>
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                        <Building2 size={16} className="mt-0.5 shrink-0 text-slate-400" />
                        <div>
                            <p className="font-medium text-slate-900">
                                {topup.metode_pembayaran === 'transfer_bank' ? 'Transfer Bank' : 'E-Wallet'} - {topup.channel}
                            </p>
                            {topup.va_number && (
                                <p className="text-xs text-slate-500">No. VA: {topup.va_number}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 space-y-1.5 border-t border-slate-200 pt-3 text-sm">
                        <div className="flex justify-between text-slate-500">
                            <span>Subtotal Top Up</span>
                            <span className="text-slate-800">{formatRupiah(topup.nominal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Biaya Admin</span>
                            <span className="text-slate-800">{formatRupiah(topup.biaya_admin)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-1.5 font-semibold text-slate-900">
                            <span>Total Bayar</span>
                            <span>{formatRupiah(topup.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-slate-900">Bukti Pembayaran</p>
                    {topup.bukti_transfer ? (
                        <a href={topup.bukti_transfer} target="_blank" rel="noopener noreferrer">
                            <img
                                src={topup.bukti_transfer}
                                alt="Bukti transfer"
                                className="w-full rounded-lg border border-slate-200 object-cover"
                            />
                        </a>
                    ) : (
                        <p className="text-sm text-slate-400">Belum ada bukti yang diunggah.</p>
                    )}
                </div>

                {topup.catatan_admin && (
                    <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-700">Catatan Penolakan</p>
                        <p className="mt-1 text-sm text-red-600">{topup.catatan_admin}</p>
                        {topup.verifier && (
                            <p className="mt-2 text-xs text-red-400">
                                Diproses oleh {topup.verifier.name} • {formatTanggal(topup.verified_at)}
                            </p>
                        )}
                    </div>
                )}

                {topup.status === 'berhasil' && topup.verifier && (
                    <p className="mt-3 text-center text-xs text-slate-400">
                        Diverifikasi oleh {topup.verifier.name} • {formatTanggal(topup.verified_at)}
                    </p>
                )}

                {isPending && (
                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setRejectOpen(true)}
                            disabled={processing}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                            <XCircle size={16} />
                            Tolak
                        </button>
                        <button
                            type="button"
                            onClick={() => setApproveOpen(true)}
                            disabled={processing}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50"
                        >
                            <CheckCircle2 size={16} />
                            Setujui & Tambah Saldo
                        </button>
                    </div>
                )}
            </div>

            {approveOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                                <CheckCircle2 size={22} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Setujui Top Up</h3>
                                <p className="text-xs text-slate-500">{topup.kode_transaksi}</p>
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-slate-600">
                            Setujui top up sebesar <strong className="text-emerald-600">{formatRupiah(topup.nominal)}</strong> untuk <strong className="text-slate-900">{topup.user?.name}</strong>? Saldo pelanggan akan langsung ditambahkan.
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => setApproveOpen(false)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={handleApprove}
                                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-60"
                            >
                                {processing ? 'Memproses...' : 'Ya, Setujui'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {rejectOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-slate-100">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-900">Tolak Top Up</h2>
                            <button onClick={() => setRejectOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>

                        <label className="mb-1 block text-xs font-medium text-slate-600">Alasan Penolakan</label>
                        <textarea
                            rows={3}
                            value={alasan}
                            onChange={(e) => {
                                setAlasan(e.target.value);
                                setErrorAlasan('');
                            }}
                            placeholder="Contoh: Bukti transfer tidak sesuai nominal."
                            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 ${
                                errorAlasan
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                                    : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600'
                            }`}
                        />
                        {errorAlasan && <p className="mt-1 text-xs text-red-500">{errorAlasan}</p>}

                        <button
                            type="button"
                            disabled={processing}
                            onClick={handleReject}
                            className="mt-4 w-full rounded-xl bg-red-600 hover:bg-red-700 py-3 text-sm font-bold text-white transition disabled:opacity-60"
                        >
                            {processing ? 'Memproses...' : 'Tolak Transaksi Ini'}
                        </button>
                    </div>
                </div>
            )}
        </FinanceLayout>
    );
}
