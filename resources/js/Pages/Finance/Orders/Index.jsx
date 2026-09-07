import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import FinanceLayout from '@/Layouts/FinanceLayout';
import { Search, CheckCircle2, Image, ExternalLink } from 'lucide-react';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function Index({ orders, filters = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [verifyTarget, setVerifyTarget] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [previewImage, setPreviewImage] = useState(false);

    function applyFilters(overrides = {}) {
        router.get('/finance/orders', {
            search: overrides.search ?? search,
        });
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

    return (
        <FinanceLayout title="Verifikasi Pembayaran">
            <Head title="Verifikasi Pembayaran" />

            <div className="mx-auto max-w-5xl px-4 py-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Verifikasi Pembayaran Transfer</h1>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Daftar pesanan yang menunggu verifikasi bukti transfer dari customer.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search: e.target.value })}
                                placeholder="Cari kode pesanan..."
                                className="rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2 text-xs text-gray-800 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-200"
                            />
                        </div>
                        <button
                            onClick={() => applyFilters({ search })}
                            className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-800"
                        >
                            Cari
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-slate-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/60 dark:border-gray-800 dark:bg-slate-800/40">
                                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Kode</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Customer</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Mitra</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Total</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Metode</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Dibuat</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {orders.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500">
                                            Belum ada pesanan yang menunggu verifikasi pembayaran.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="transition hover:bg-gray-50/60 dark:hover:bg-slate-800/40">
                                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{order.order_code}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{order.customer?.name ?? '-'}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{order.partner?.name ?? '-'}</td>
                                            <td className="px-4 py-3 font-semibold text-green-700 dark:text-emerald-400">{formatRupiah(order.total_price)}</td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                <span className="capitalize">{order.payment_method ?? '-'}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{order.created_at}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setVerifyTarget(order); setPreviewImage(true); }}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-slate-800"
                                                    >
                                                        <Image size={13} /> Bukti
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setVerifyTarget(order)}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                                                    >
                                                        <CheckCircle2 size={13} /> Verifikasi
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {orders.links && (
                        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Menampilkan {orders.data.length} dari {orders.total} pesanan
                            </p>
                            <div className="flex items-center gap-1">
                                {orders.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ${
                                            link.active
                                                ? 'bg-green-700 text-white'
                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800'
                                        } ${!link.url ? 'cursor-not-allowed opacity-40' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal preview bukti transfer */}
            {previewImage && verifyTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setPreviewImage(false)}>
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Bukti Transfer - {verifyTarget.order_code}</h3>
                            <button onClick={() => setPreviewImage(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <ExternalLink size={18} />
                            </button>
                        </div>
                        <div className="mt-4">
                            <img
                                src={verifyTarget.payment_receipt}
                                alt="Bukti Transfer"
                                className="mx-auto max-h-[70vh] w-auto rounded-xl border border-gray-200 dark:border-gray-700 object-contain"
                            />
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setPreviewImage(false)}
                                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-slate-800"
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
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {isVerifying ? 'Memverifikasi...' : 'Verifikasi Pembayaran'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal konfirmasi verifikasi pembayaran */}
            {verifyTarget && !previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-gray-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <CheckCircle2 size={18} />
                            </span>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Verifikasi Pembayaran?</h2>
                        </div>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            Pastikan bukti transfer untuk pesanan <span className="font-semibold text-gray-800 dark:text-gray-200">{verifyTarget.order_code}</span> sebesar{' '}
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{formatRupiah(verifyTarget.total_price)}</span> sudah benar sebelum melanjutkan.
                            Status pesanan akan berubah menjadi <span className="font-semibold">Diproses</span>.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setVerifyTarget(null)}
                                disabled={isVerifying}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-60 dark:text-gray-300 dark:hover:bg-slate-800"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleVerify}
                                disabled={isVerifying}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {isVerifying ? 'Memproses...' : 'Ya, Verifikasi Pembayaran'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FinanceLayout>
    );
}
