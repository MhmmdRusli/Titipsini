import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import FinanceLayout from '@/Layouts/FinanceLayout';
import { Search, CheckCircle2, XCircle, Image as ImageIcon, ShieldCheck, X, AlertCircle, Info } from 'lucide-react';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function Index({ orders = { data: [], links: [], total: 0 }, filters = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [verifyTarget, setVerifyTarget] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [previewImage, setPreviewImage] = useState(false);
    const [showBanner, setShowBanner] = useState(true);

    function applyFilters(overrides = {}) {
        router.get('/finance/orders', {
            search: overrides.search ?? search,
        }, { preserveState: true, preserveScroll: true });
    }

    function handleVerify() {
        if (!verifyTarget) return;
        setIsVerifying(true);
        router.post(
            `/finance/orders/${verifyTarget.id}/verify-payment`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsVerifying(false);
                    setVerifyTarget(null);
                },
                onError: () => setIsVerifying(false),
            }
        );
    }

    function openReject(order) {
        setRejectTarget(order);
        setRejectReason('');
    }

    function handleReject() {
        if (!rejectTarget || !rejectReason.trim()) return;
        setIsRejecting(true);
        router.post(
            `/finance/orders/${rejectTarget.id}/reject-payment`,
            { rejection_reason: rejectReason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsRejecting(false);
                    setRejectTarget(null);
                    setRejectReason('');
                },
                onError: () => setIsRejecting(false),
            }
        );
    }

    return (
        <FinanceLayout>
            <Head title="Verifikasi Pembayaran" />

            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-green-600">Verifikasi Transaksi</span>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
                        Verifikasi Pembayaran QRIS
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                        Daftar pesanan yang menunggu verifikasi bukti transfer QRIS dari customer.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search: e.target.value })}
                            placeholder="Cari kode pesanan..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-200"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => applyFilters({ search })}
                        className="rounded-xl bg-green-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700"
                    >
                        Cari
                    </button>
                </div>
            </div>

            {/* Banner Informasi / Alert */}
            {showBanner && (
                <div className="relative mb-6 overflow-hidden rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                    <div className="flex items-start gap-3 pr-6">
                        <div className="mt-0.5 rounded-lg bg-amber-100 p-1.5 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                            <Info size={18} />
                        </div>
                        <div className="text-xs leading-relaxed">
                            <p className="font-bold text-amber-950 dark:text-amber-100">Perhatian Sebelum Memverifikasi!</p>
                            <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                                Pastikan <span className="font-semibold">nominal pembayaran</span> dan <span className="font-semibold">sumber dana</span> pada bukti transfer telah sesuai dengan rincian transaksi di rekening koran sebelum menyetujui pesanan.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowBanner(false)}
                        className="absolute right-3 top-3 rounded-lg p-1 text-amber-600 transition hover:bg-amber-100 hover:text-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/50"
                        title="Tutup Banner"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Main Table Card */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 bg-slate-50/60 uppercase tracking-wider text-slate-500 dark:border-gray-800 dark:bg-slate-800/40 dark:text-gray-400">
                            <tr>
                                <th className="px-5 py-3.5 font-semibold">Kode</th>
                                <th className="px-5 py-3.5 font-semibold">Customer</th>
                                <th className="px-5 py-3.5 font-semibold">Mitra</th>
                                <th className="px-5 py-3.5 font-semibold">Total</th>
                                <th className="px-5 py-3.5 font-semibold">Metode</th>
                                <th className="px-5 py-3.5 font-semibold">Dibuat</th>
                                <th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-gray-500">
                                        Belum ada pesanan yang menunggu verifikasi pembayaran.
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr key={order.id} className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                                        <td className="px-5 py-4 font-semibold text-slate-900 dark:text-gray-100">{order.order_code}</td>
                                        <td className="px-5 py-4 font-medium text-slate-700 dark:text-gray-300">{order.customer?.name ?? '-'}</td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-gray-400">{order.partner?.name ?? '-'}</td>
                                        <td className="px-5 py-4 font-bold text-green-600 dark:text-green-400">{formatRupiah(order.total_price)}</td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-gray-400">
                                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-700 dark:bg-slate-800 dark:text-gray-300">
                                                {order.payment_method ?? '-'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-500 dark:text-gray-400">{order.created_at}</td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => { setVerifyTarget(order); setPreviewImage(true); }}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                                                >
                                                    <ImageIcon size={13} /> Bukti
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setVerifyTarget(order)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700"
                                                >
                                                    <CheckCircle2 size={13} /> Verifikasi
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openReject(order)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
                                                >
                                                    <XCircle size={13} /> Tolak
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {orders.links && orders.links.length > 3 && (
                    <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                            Menampilkan <span className="font-semibold text-slate-700 dark:text-gray-200">{orders.data.length}</span> dari <span className="font-semibold text-slate-700 dark:text-gray-200">{orders.total}</span> pesanan
                        </p>
                        <div className="flex flex-wrap items-center gap-1">
                            {orders.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                                        link.active
                                            ? 'bg-green-600 text-white'
                                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                                    } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal preview bukti transfer */}
            {previewImage && verifyTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setPreviewImage(false)}>
                    <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-gray-800">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-green-600">Bukti Transfer</span>
                                <h3 className="text-base font-bold text-slate-900 dark:text-gray-100">{verifyTarget.order_code}</h3>
                            </div>
                            <button type="button" onClick={() => setPreviewImage(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center justify-center rounded-lg bg-slate-50 p-2 border border-slate-100 dark:bg-slate-800/50 dark:border-gray-800">
                                <img
                                    src={verifyTarget.payment_receipt}
                                    alt="Bukti Transfer"
                                    className="max-h-[60vh] w-auto rounded-lg object-contain"
                                />
                            </div>
                            <div className="mt-5 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPreviewImage(false)}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewImage(false);
                                        handleVerify();
                                    }}
                                    disabled={isVerifying}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50"
                                >
                                    <CheckCircle2 size={14} />
                                    {isVerifying ? 'Memverifikasi...' : 'Verifikasi Pembayaran'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal konfirmasi verifikasi pembayaran */}
            {verifyTarget && !previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:border dark:border-gray-800 dark:bg-slate-900">
                        <div className="p-6">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                                <ShieldCheck size={22} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-gray-100">Verifikasi Pembayaran?</h3>
                            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-gray-400">
                                Pastikan bukti transfer untuk pesanan <span className="font-semibold text-slate-800 dark:text-gray-200">{verifyTarget.order_code}</span> sebesar{' '}
                                <span className="font-bold text-green-600 dark:text-green-400">{formatRupiah(verifyTarget.total_price)}</span> sudah benar. Status pesanan akan diubah menjadi <span className="font-semibold text-slate-700 dark:text-gray-200">Pembayaran Diterima</span>.
                            </p>
                            <div className="mt-6 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setVerifyTarget(null)}
                                    disabled={isVerifying}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleVerify}
                                    disabled={isVerifying}
                                    className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-60"
                                >
                                    {isVerifying ? 'Memproses...' : 'Ya, Verifikasi Pembayaran'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal konfirmasi penolakan pembayaran */}
            {rejectTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:border dark:border-gray-800 dark:bg-slate-900">
                        <div className="p-6">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                                <XCircle size={22} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-gray-100">Tolak Pembayaran?</h3>
                            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-gray-400">
                                Anda akan menolak pembayaran untuk pesanan <span className="font-semibold text-slate-800 dark:text-gray-200">{rejectTarget.order_code}</span>.
                            </p>
                            <div className="mt-4">
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-gray-300">Alasan Penolakan</label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-800 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:bg-slate-800"
                                    placeholder="Contoh: Bukti transfer tidak jelas / nominal tidak sesuai"
                                />
                            </div>
                            <div className="mt-6 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setRejectTarget(null); setRejectReason(''); }}
                                    disabled={isRejecting}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReject}
                                    disabled={isRejecting || !rejectReason.trim()}
                                    className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                                >
                                    {isRejecting ? 'Memproses...' : 'Ya, Tolak Pembayaran'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </FinanceLayout>
    );
}