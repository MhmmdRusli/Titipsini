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
    menunggu_verifikasi: { label: 'Menunggu Verifikasi', color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300' },
    berhasil: { label: 'Berhasil', color: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300' },
    ditolak: { label: 'Ditolak', color: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300' },
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

    const cardCls = 'rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800';

    return (
        <FinanceLayout>
            <Head title={`Verifikasi Top Up - ${topup.kode_transaksi}`} />

            <div className="mx-auto max-w-2xl p-6">
                <Link href="/finance/topup" className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition dark:text-gray-400 dark:hover:text-gray-200">
                    <ArrowLeft size={16} />
                    Kembali ke Daftar Top Up
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{topup.kode_transaksi}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Diklaim dibayar: {formatTanggal(topup.paid_at)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>
                        {badge.label}
                    </span>
                </div>

                <div className={cardCls}>
                    <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Info Pelanggan</p>
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{topup.user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{topup.user?.email}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{topup.user?.phone}</p>
                        </div>
                    </div>
                </div>

                <div className={cardCls}>
                    <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Info Pembayaran</p>
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Building2 size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                {topup.metode_pembayaran === 'transfer_bank' ? 'Transfer Bank' : 'E-Wallet'} - {topup.channel}
                            </p>
                            {topup.va_number && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">No. VA: {topup.va_number}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 space-y-1.5 border-t border-gray-200 pt-3 text-sm dark:border-gray-700">
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Subtotal Top Up</span>
                            <span className="text-gray-800 dark:text-gray-200">{formatRupiah(topup.nominal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Biaya Admin</span>
                            <span className="text-gray-800 dark:text-gray-200">{formatRupiah(topup.biaya_admin)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-1.5 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                            <span>Total Bayar</span>
                            <span>{formatRupiah(topup.total)}</span>
                        </div>
                    </div>
                </div>

                <div className={cardCls}>
                    <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Bukti Pembayaran</p>
                    {topup.bukti_transfer ? (
                        <a href={topup.bukti_transfer} target="_blank" rel="noopener noreferrer">
                            <img
                                src={topup.bukti_transfer}
                                alt="Bukti transfer"
                                className="w-full rounded-lg border border-gray-200 object-cover dark:border-gray-600"
                            />
                        </a>
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500">Belum ada bukti yang diunggah.</p>
                    )}
                </div>

                {topup.catatan_admin && (
                    <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/30">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-300">Catatan Penolakan</p>
                        <p className="mt-1 text-sm text-red-600 dark:text-red-300">{topup.catatan_admin}</p>
                        {topup.verifier && (
                            <p className="mt-2 text-xs text-red-400 dark:text-red-400/60">
                                Diproses oleh {topup.verifier.name} • {formatTanggal(topup.verified_at)}
                            </p>
                        )}
                    </div>
                )}

                {topup.status === 'berhasil' && topup.verifier && (
                    <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
                        Diverifikasi oleh {topup.verifier.name} • {formatTanggal(topup.verified_at)}
                    </p>
                )}

                {isPending && (
                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setRejectOpen(true)}
                            disabled={processing}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/40 disabled:opacity-50"
                        >
                            <XCircle size={16} />
                            Tolak
                        </button>
                        <button
                            type="button"
                            onClick={() => setApproveOpen(true)}
                            disabled={processing}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-600 hover:bg-green-700 py-3 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50"
                        >
                            <CheckCircle2 size={16} />
                            Setujui & Tambah Saldo
                        </button>
                    </div>
                )}
            </div>

            {approveOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300">
                                <CheckCircle2 size={22} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Setujui Top Up</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{topup.kode_transaksi}</p>
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            Setujui top up sebesar <strong className="text-green-700 dark:text-green-400">{formatRupiah(topup.nominal)}</strong> untuk <strong className="text-gray-900 dark:text-gray-100">{topup.user?.name}</strong>? Saldo pelanggan akan langsung ditambahkan.
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => setApproveOpen(false)}
                                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={handleApprove}
                                className="rounded-xl bg-green-600 hover:bg-green-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-60"
                            >
                                {processing ? 'Memproses...' : 'Ya, Setujui'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {rejectOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Tolak Top Up</h2>
                            <button onClick={() => setRejectOpen(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
                                <X size={18} />
                            </button>
                        </div>

                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Alasan Penolakan</label>
                        <textarea
                            rows={3}
                            value={alasan}
                            onChange={(e) => {
                                setAlasan(e.target.value);
                                setErrorAlasan('');
                            }}
                            placeholder="Contoh: Bukti transfer tidak sesuai nominal."
                            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                                errorAlasan
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
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
