import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, User, Building2, CheckCircle2, XCircle, X } from 'lucide-react';

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
    berhasil: { label: 'Berhasil', color: 'bg-green-50 text-green-600' },
    ditolak: { label: 'Ditolak', color: 'bg-red-50 text-red-600' },
};

export default function Show({ topup }) {
    const [rejectOpen, setRejectOpen] = useState(false);
    const [alasan, setAlasan] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errorAlasan, setErrorAlasan] = useState('');

    const badge = STATUS_BADGE[topup.status] ?? STATUS_BADGE.menunggu_verifikasi;
    const isPending = topup.status === 'menunggu_verifikasi';

    function handleApprove() {
        if (!confirm(`Setujui top up sebesar ${formatRupiah(topup.nominal)} untuk ${topup.user?.name}? Saldo pelanggan akan langsung ditambahkan.`)) {
            return;
        }
        setProcessing(true);
        router.post(`/admin/topup/${topup.id}/approve`, {}, {
            onFinish: () => setProcessing(false),
        });
    }

    function handleReject() {
        if (!alasan.trim()) {
            setErrorAlasan('Cantumkan alasan penolakan.');
            return;
        }
        setProcessing(true);
        router.post(
            `/admin/topup/${topup.id}/reject`,
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
        <AdminLayout title="Detail Top Up">
            <Head title={`Verifikasi Top Up - ${topup.kode_transaksi}`} />

            <div className="mx-auto max-w-2xl p-6">
                <Link href="/admin/topup" className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={16} />
                    Kembali ke Daftar Top Up
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-semibold text-gray-900">{topup.kode_transaksi}</p>
                        <p className="text-xs text-gray-400">Diklaim dibayar: {formatTanggal(topup.paid_at)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>
                        {badge.label}
                    </span>
                </div>

                {/* Info pelanggan */}
                <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-gray-900">Info Pelanggan</p>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                        <User size={16} className="mt-0.5 shrink-0 text-gray-400" />
                        <div>
                            <p className="font-medium text-gray-900">{topup.user?.name}</p>
                            <p className="text-xs text-gray-500">{topup.user?.email}</p>
                            <p className="text-xs text-gray-500">{topup.user?.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Info transaksi */}
                <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-gray-900">Info Pembayaran</p>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Building2 size={16} className="mt-0.5 shrink-0 text-gray-400" />
                        <div>
                            <p className="font-medium text-gray-900">
                                {topup.metode_pembayaran === 'transfer_bank' ? 'Transfer Bank' : 'E-Wallet'} - {topup.channel}
                            </p>
                            {topup.va_number && (
                                <p className="text-xs text-gray-500">No. VA: {topup.va_number}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal Top Up</span>
                            <span className="text-gray-800">{formatRupiah(topup.nominal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Biaya Admin</span>
                            <span className="text-gray-800">{formatRupiah(topup.biaya_admin)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-100 pt-1.5 font-semibold text-gray-900">
                            <span>Total Bayar</span>
                            <span>{formatRupiah(topup.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Bukti transfer */}
                <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-gray-900">Bukti Pembayaran</p>
                    {topup.bukti_transfer ? (
                        <a href={topup.bukti_transfer} target="_blank" rel="noopener noreferrer">
                            <img
                                src={topup.bukti_transfer}
                                alt="Bukti transfer"
                                className="w-full rounded-lg border border-gray-100 object-cover"
                            />
                        </a>
                    ) : (
                        <p className="text-sm text-gray-400">Belum ada bukti yang diunggah.</p>
                    )}
                </div>

                {/* Catatan admin (kalau sudah pernah diproses) */}
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
                    <p className="mt-3 text-center text-xs text-gray-400">
                        Diverifikasi oleh {topup.verifier.name} • {formatTanggal(topup.verified_at)}
                    </p>
                )}

                {/* Aksi - hanya muncul kalau masih menunggu verifikasi */}
                {isPending && (
                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setRejectOpen(true)}
                            disabled={processing}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 disabled:opacity-50"
                        >
                            <XCircle size={16} />
                            Tolak
                        </button>
                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={processing}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            <CheckCircle2 size={16} />
                            Setujui & Tambah Saldo
                        </button>
                    </div>
                )}
            </div>

            {/* Modal alasan penolakan */}
            {rejectOpen && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900">Tolak Top Up</h2>
                            <button onClick={() => setRejectOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <label className="mb-1 block text-xs font-medium text-gray-600">Alasan Penolakan</label>
                        <textarea
                            rows={3}
                            value={alasan}
                            onChange={(e) => {
                                setAlasan(e.target.value);
                                setErrorAlasan('');
                            }}
                            placeholder="Contoh: Bukti transfer tidak sesuai nominal."
                            className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${
                                errorAlasan
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
                            }`}
                        />
                        {errorAlasan && <p className="mt-1 text-xs text-red-500">{errorAlasan}</p>}

                        <button
                            type="button"
                            onClick={handleReject}
                            disabled={processing}
                            className="mt-4 w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white disabled:opacity-60"
                        >
                            {processing ? 'Memproses...' : 'Tolak Transaksi Ini'}
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}