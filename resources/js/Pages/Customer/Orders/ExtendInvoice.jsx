import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft, Clock, CheckCircle2, QrCode, WalletMinimal, Upload,
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function formatTanggalPendek(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function InfoRow({ label, value }) {
    return (
        <div className="grid grid-cols-12 gap-2 text-xs">
            <span className="col-span-5 text-gray-500 dark:text-gray-400">{label}</span>
            <span className="col-span-7 font-medium text-gray-800 dark:text-gray-200">{value ?? '-'}</span>
        </div>
    );
}

const STATUS_LABEL = {
    menunggu_pembayaran: { label: 'Belum Dibayar', color: 'text-blue-600 dark:text-blue-400' },
    menunggu_verifikasi: { label: 'Menunggu Verifikasi', color: 'text-amber-600 dark:text-amber-400' },
    terverifikasi: { label: 'Berhasil', color: 'text-[#15803d] dark:text-[#4ade80]' },
};

export default function ExtendInvoice({ order, qris_url, saldo }) {
    const { errors } = usePage().props;
    const status = order.status_perpanjangan ?? 'menunggu_pembayaran';
    const isMenungguPembayaran = status === 'menunggu_pembayaran';
    const statusInfo = STATUS_LABEL[status] ?? STATUS_LABEL.menunggu_pembayaran;

    const [payingSaldo, setPayingSaldo] = useState(false);
    const [showQris, setShowQris] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    function bayarSaldo() {
        setPayingSaldo(true);
        router.post(
            `/app/orders/${order.id}/extend/bayar-saldo`,
            {},
            { preserveScroll: true, onFinish: () => setPayingSaldo(false) }
        );
    }

    function handleFileChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    }

    function uploadBukti(e) {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        router.post(
            `/app/orders/${order.id}/extend/upload-bukti`,
            { extend_receipt: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setUploading(false),
            }
        );
    }

    return (
        <CustomerLayout>
            <Head title={`Invoice Perpanjangan - ${order.order_code}`} />

            <div className="mx-auto max-w-lg px-4 py-6 md:py-8">
                <div className="mb-5 flex items-center gap-3">
                    <Link
                        href={`/app/orders/${order.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 transition"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Rincian Pesanan</h1>
                </div>

                {/* ================= KARTU INVOICE ================= */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800/90">
                    <div className="flex items-center justify-between gap-3 bg-[#15803d] px-5 py-4 dark:bg-[#0f5c2c]">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white/15">
                                <img src="/images/admin-titipsini.png" alt="Titipsini" className="h-full w-full object-contain" />
                            </div>
                            <div>
                                <p className="text-sm font-extrabold leading-tight text-white">
                                    Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                                </p>
                                <p className="text-[10px] leading-tight text-green-100">Tempat yang aman untuk barang berharga kamu</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] font-medium text-green-100">{formatTanggalPendek(order.created_at)}</p>
                            <p className="text-[11px] font-semibold text-white">ID Pesanan: {order.order_code}</p>
                        </div>
                    </div>

                    <div className="space-y-5 px-5 py-5">
                        {/* Status */}
                        <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-4 dark:border-gray-700">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</span>
                            <span className={`inline-flex items-center gap-1 text-xs font-bold ${statusInfo.color}`}>
                                {status === 'terverifikasi' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                                {statusInfo.label}
                            </span>
                        </div>

                        {/* Detail Perpanjangan */}
                        <div className="space-y-2">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                Perpanjangan Penitipan
                            </p>
                            <InfoRow label="Barang" value={order.item_name} />
                            <InfoRow label="Tanggal Keluar Lama" value={formatTanggalPendek(order.end_date)} />
                            <InfoRow label="Tanggal Keluar Baru" value={formatTanggalPendek(order.extend_end_date)} />
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700/60">
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Total Pembayaran</span>
                            <span className="text-lg font-extrabold text-[#15803d] dark:text-[#4ade80]">
                                {formatRupiah(order.extend_price)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ================= PEMBAYARAN ================= */}
                {isMenungguPembayaran && (
                    <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800/90">
                        {errors?.saldo_perpanjangan && (
                            <div className="mb-3 rounded-lg bg-red-50 p-2.5 dark:bg-red-950/30">
                                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                    {errors.saldo_perpanjangan}
                                </p>
                                <Link
                                    href="/app/saldo/topup"
                                    className="mt-1 inline-block text-xs font-bold text-red-700 underline dark:text-red-300"
                                >
                                    Top Up Saldo Sekarang &rarr;
                                </Link>
                            </div>
                        )}

                        {!showQris ? (
                            <div className="space-y-2.5">
                                <button
                                    type="button"
                                    onClick={bayarSaldo}
                                    disabled={payingSaldo}
                                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 disabled:opacity-60 dark:bg-[#22c55e] dark:hover:bg-green-600 transition active:scale-[0.98]"
                                >
                                    <WalletMinimal size={16} />
                                    {payingSaldo ? 'Memproses...' : `Bayar Sekarang (Saldo ${formatRupiah(saldo)})`}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowQris(true)}
                                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#15803d] bg-white py-3 text-sm font-bold text-[#15803d] hover:bg-green-50 dark:border-green-700 dark:bg-transparent dark:text-[#4ade80] dark:hover:bg-green-950/30 transition"
                                >
                                    <QrCode size={16} />
                                    Bayar via QRIS
                                </button>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                                {qris_url ? (
                                    <img
                                        src={qris_url}
                                        alt="QRIS Pembayaran Perpanjangan"
                                        className="mx-auto h-40 w-40 rounded-lg border border-gray-200 object-contain dark:border-gray-700"
                                    />
                                ) : (
                                    <p className="text-center text-xs italic text-gray-400">QRIS belum tersedia.</p>
                                )}

                                <form onSubmit={uploadBukti} className="mt-3 space-y-2">
                                    <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 dark:border-gray-700">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="max-h-28 rounded" />
                                        ) : (
                                            <>
                                                <Upload size={20} className="text-gray-400" />
                                                <span className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                                    Unggah bukti transfer
                                                </span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowQris(false)}
                                            className="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!file || uploading}
                                            className="flex-1 rounded-lg bg-[#15803d] py-2 text-xs font-bold text-white disabled:opacity-50 dark:bg-[#22c55e]"
                                        >
                                            {uploading ? 'Mengunggah...' : 'Kirim Bukti'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {status === 'menunggu_verifikasi' && (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                        Bukti pembayaran sudah diunggah dan sedang menunggu verifikasi mitra. Tanggal keluar akan
                        diperbarui otomatis setelah diverifikasi.
                    </div>
                )}

                {status === 'terverifikasi' && (
                    <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-xs text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">
                        Perpanjangan berhasil dan tanggal keluar sudah diperbarui.
                    </div>
                )}

                <Link
                    href="/app/dashboard"
                    className="mt-4 block w-full rounded-xl border border-gray-200 bg-white py-3 text-center text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/60 transition"
                >
                    Kembali Ke Beranda
                </Link>
            </div>
        </CustomerLayout>
    );
}