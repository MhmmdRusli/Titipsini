import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, MapPin, Home, User, Package, ExternalLink, Clock, ArrowRightCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

function getFileUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/storage/')) {
        return path;
    }
    return `/storage/${path}`;
}

const FASE_COLOR = {
    menunggu: 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300',
    berjalan: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    akhir: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-[#4ade80]',
};

export default function Show({ order }) {
    if (order.status === 'baru') {
        return <ShowBaru order={order} />;
    }

    return <ShowDiproses order={order} />;
}

/* ====================================================================
   TAMPILAN PESANAN BARU (belum di-accept) — Ambil Pesanan / Tolak
   ==================================================================== */
const ALASAN_TOLAK = [
    { value: 'area', label: 'Di luar jangkauan area Kerja' },
    { value: 'penuh', label: 'Lahan sudah Penuh' },
    { value: 'no_pickup', label: 'Tidak ada Pick Up' },
    { value: 'kriteria', label: 'Barang tidak masuk kriteria' },
    { value: 'lainnya', label: 'Lainnya' },
];

function ShowBaru({ order }) {
    const [step, setStep] = useState('main'); // 'main' | 'alasan'
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [selectedAlasan, setSelectedAlasan] = useState('');
    const [alasanLain, setAlasanLain] = useState('');

    function ambilPesanan() {
        setIsAccepting(true);
        router.patch(`/mitra/pesanan/${order.id}/ambil`, {}, {
            preserveScroll: true,
            onFinish: () => setIsAccepting(false),
        });
    }

    function tolakPesanan() {
        const label = ALASAN_TOLAK.find((a) => a.value === selectedAlasan)?.label;
        const reason = selectedAlasan === 'lainnya' ? alasanLain : label;

        setIsRejecting(true);
        router.patch(`/mitra/pesanan/${order.id}/tolak`, { cancel_reason: reason }, {
            preserveScroll: true,
            onFinish: () => setIsRejecting(false),
        });
    }

    if (step === 'alasan') {
        const bisaLanjut = selectedAlasan && (selectedAlasan !== 'lainnya' || alasanLain.trim().length > 0);

        return (
            <MitraLayout title="Alasan Penolakan">
                <Head title="Alasan Penolakan" />

                <div className="flex h-[calc(100%-56px)] flex-col px-4 py-4">
                    <h2 className="text-center text-base font-bold text-gray-900 dark:text-gray-100">Alasan Menolak Pesanan</h2>
                    <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
                        Pilih salah satu atau lebih alasan anda menolak pesanan ini.
                    </p>

                    <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100 dark:divide-gray-800 dark:border-gray-800">
                        {ALASAN_TOLAK.map((opt) => (
                            <label
                                key={opt.value}
                                className="flex items-center gap-3 py-3.5 text-sm text-gray-800 dark:text-gray-200"
                            >
                                <input
                                    type="radio"
                                    name="alasan_tolak"
                                    checked={selectedAlasan === opt.value}
                                    onChange={() => setSelectedAlasan(opt.value)}
                                    className="h-4 w-4 accent-[#15803d]"
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>

                    {selectedAlasan === 'lainnya' && (
                        <input
                            type="text"
                            value={alasanLain}
                            onChange={(e) => setAlasanLain(e.target.value)}
                            placeholder="Lainnya...."
                            className="mt-3 w-full border-b border-gray-200 pb-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#15803d] focus:outline-none dark:border-gray-700 dark:bg-transparent dark:text-gray-100"
                        />
                    )}

                    <div className="mt-auto pt-6">
                        <button
                            type="button"
                            onClick={tolakPesanan}
                            disabled={!bisaLanjut || isRejecting}
                            className="w-full rounded-xl bg-[#15803d] py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-700"
                        >
                            {isRejecting ? 'Memproses...' : 'Selanjutnya'}
                        </button>
                    </div>
                </div>
            </MitraLayout>
        );
    }

    const items = Array.isArray(order.items) && order.items.length > 0
        ? order.items
        : order.item_description
            ? [{ name: order.item_description, qty: null }]
            : [];

    return (
        <MitraLayout title="Rincian Order">
            <Head title={`Rincian Order - ${order.order_number}`} />

            <div className="bg-green-50/60 px-4 py-4 dark:bg-green-950/10">
                <div className="overflow-hidden rounded-2xl border border-green-100 shadow-sm dark:border-green-900/40">
                    <div className="flex items-center justify-between bg-[#15803d] px-4 py-3.5 text-white dark:bg-green-700">
                        <div>
                            <p className="flex items-center gap-1.5 text-base font-bold">
                                <img src="/images/logo-titipsini.png" alt="" className="h-5 w-auto object-contain" />
                                Titipsini<span className="text-[#fbbf24]">•</span>Com
                            </p>
                            <p className="mt-0.5 text-[10px] text-white/80">Tempat Yang Aman Untuk Barang Berharga Kamu</p>
                        </div>
                        <div className="text-right text-xs text-white/90">
                            <p>{order.created_at}</p>
                            <p>Order ID {order.order_number}</p>
                        </div>
                    </div>

                    <div className="bg-green-50/70 px-4 py-4 dark:bg-green-950/20">
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{order.customer?.name ?? '-'}</p>
                            {order.customer?.code && (
                                <p className="text-xs text-gray-400 dark:text-gray-500">{order.customer.code}</p>
                            )}
                        </div>

                        <div className="mt-4">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Detail Alamat</p>

                            <div className="mt-2 flex gap-2.5">
                                <div className="flex flex-col items-center">
                                    <MapPin size={16} className="text-red-500" />
                                    <span className="my-0.5 h-6 w-px border-l border-dashed border-gray-300" />
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {order.pickup_address && order.pickup_address !== '-'
                                        ? order.pickup_address
                                        : 'Titip langsung di tempat mitra'}
                                </p>
                            </div>
                            <div className="mt-1 flex items-center gap-2.5">
                                <Home size={16} className="text-green-600" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {order.dropoff_address || 'Kantor Titipsini.com'}
                                </p>
                            </div>
                        </div>

                        {order.jam_pickup && (
                            <div className="mt-3 flex items-center justify-between text-sm">
                                <span className="font-bold text-gray-900 dark:text-gray-100">Jam Pick Up</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{order.jam_pickup}</span>
                            </div>
                        )}

                        {items.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Detail Penitipan</p>
                                <div className="mt-1.5 space-y-1">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                            <span>{item.name}</span>
                                            {item.qty && <span>x{item.qty}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-3 space-y-1.5 border-t border-green-100 pt-2.5 text-sm dark:border-green-900/40">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Pick up</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{order.pickup_status}</span>
                            </div>
                            {order.duration && (
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Durasi penitipan</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{order.duration}</span>
                                </div>
                            )}
                            {order.vendor_pickup && (
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Vendor Pick up</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{order.vendor_pickup}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 space-y-1.5 border-t border-green-100 pt-3 text-sm dark:border-green-900/40">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Sub total</span>
                                <span>{formatRupiah(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Diskon</span>
                                <span>{order.discount > 0 ? `- ${formatRupiah(order.discount)}` : 0}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Biaya penjemputan</span>
                                <span>{formatRupiah(order.pickup_fee)}</span>
                            </div>

                            {order.payment_receipt && (
                                <a
                                    href={getFileUrl(order.payment_receipt)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between pt-0.5 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
                                >
                                    <span>Lihat Bukti Transfer</span>
                                    <ExternalLink size={14} />
                                </a>
                            )}
                            {order.bukti_denda && (
                                <a
                                    href={getFileUrl(order.bukti_denda)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between pt-0.5 text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400"
                                >
                                    <span>Lihat Bukti Pembayaran Denda</span>
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>

                        <div className="mt-3 flex justify-between border-t border-dashed border-green-300 pt-3 text-base font-bold text-gray-900 dark:border-green-800 dark:text-gray-100">
                            <span>Total</span>
                            <span>{formatRupiah(order.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    <button
                        type="button"
                        onClick={ambilPesanan}
                        disabled={isAccepting}
                        className="w-full rounded-xl bg-[#15803d] py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60 dark:bg-green-700"
                    >
                        {isAccepting ? 'Memproses...' : 'Ambil Pesanan'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setStep('alasan')}
                        disabled={isAccepting}
                        className="w-full rounded-xl border border-[#15803d] bg-white py-3 text-sm font-bold text-[#15803d] hover:bg-green-50 disabled:opacity-60 dark:border-green-600 dark:bg-transparent dark:text-green-400"
                    >
                        Tolak
                    </button>
                </div>
            </div>
        </MitraLayout>
    );
}

/* ====================================================================
   TAMPILAN PESANAN YANG SUDAH DI-ACCEPT (diproses/selesai/dibatalkan)
   — didesain ulang memakai kartu struk terpadu (sama seperti ShowBaru),
   fungsi Status Operasional, Denda, dan Verifikasi Pembayaran tetap ada.
   ==================================================================== */
function ShowDiproses({ order }) {
    const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
    const [isAdvancingFase, setIsAdvancingFase] = useState(false);

    const items = Array.isArray(order.items) && order.items.length > 0
        ? order.items
        : order.item_description
            ? [{ name: order.item_description, qty: null }]
            : [];

    function advanceFase() {
        setIsAdvancingFase(true);
        router.patch(
            `/mitra/pesanan/${order.id}/fase`,
            {},
            { preserveScroll: true, onFinish: () => setIsAdvancingFase(false) }
        );
    }

    function verifikasiPembayaran() {
        setIsVerifyingPayment(true);
        router.patch(
            `/mitra/pesanan/${order.id}/verifikasi-pembayaran`,
            {},
            { preserveScroll: true, onFinish: () => setIsVerifyingPayment(false) }
        );
    }

    return (
        <MitraLayout title="Rincian Order">
            <Head title={`Rincian Order - ${order.order_number}`} />

            <div className="bg-green-50/60 px-4 py-4 dark:bg-green-950/10">
                {/* Kartu struk terpadu — sama persis strukturnya dengan ShowBaru */}
                <div className="overflow-hidden rounded-2xl border border-green-100 shadow-sm dark:border-green-900/40">
                    <div className="flex items-center justify-between bg-[#15803d] px-4 py-3.5 text-white dark:bg-green-700">
                        <div>
                            <p className="flex items-center gap-1.5 text-base font-bold">
                                <img src="/images/logo-titipsini.png" alt="" className="h-5 w-auto object-contain" />
                                Titipsini<span className="text-[#fbbf24]">•</span>Com
                            </p>
                            <p className="mt-0.5 text-[10px] text-white/80">Tempat Yang Aman Untuk Barang Berharga Kamu</p>
                        </div>
                        <div className="text-right text-xs text-white/90">
                            <p>{order.created_at}</p>
                            <p>Order ID {order.order_number}</p>
                        </div>
                    </div>

                    <div className="bg-green-50/70 px-4 py-4 dark:bg-green-950/20">
                        {/* Status Operasional */}
                        {order.fase_label && (
                            <div className="border-t border-green-100 pt-3 dark:border-green-900/40">
                                <div className="flex items-center justify-between">
                                    <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        <Clock size={15} className="text-gray-400" />
                                        Status Operasional
                                    </p>
                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${FASE_COLOR[order.fase] ?? FASE_COLOR.menunggu}`}>
                                        {order.fase_label}
                                    </span>
                                </div>

                                {order.can_advance_fase ? (
                                    <button
                                        type="button"
                                        onClick={advanceFase}
                                        disabled={isAdvancingFase}
                                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#15803d] dark:bg-green-700 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
                                    >
                                        <ArrowRightCircle size={16} />
                                        {isAdvancingFase ? 'Memproses...' : order.next_fase_action_label}
                                    </button>
                                ) : order.service_type === 'barang' && order.fase === 'berjalan' && !order.pickup_requested_at ? (
                                    <p className="mt-2 text-xs italic text-amber-700 dark:text-amber-400">
                                        Menunggu customer mengajukan pengambilan barang.
                                    </p>
                                ) : order.status !== 'diproses' ? (
                                    <p className="mt-2 text-xs italic text-gray-400 dark:text-gray-500">
                                        Status operasional hanya bisa diubah selagi pesanan sedang diproses.
                                    </p>
                                ) : (
                                    <p className="mt-2 text-xs italic text-gray-400 dark:text-gray-500">
                                        Pesanan ini sudah berada di fase akhir.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Denda */}
                        {order.denda > 0 && (
                            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400" />
                                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                        Pesanan Ini Terlambat
                                    </p>
                                </div>
                                <p className="mt-1.5 text-xs text-amber-700/80 dark:text-amber-300/80">
                                    {order.fase === 'akhir'
                                        ? 'Denda keterlambatan berikut akan otomatis ditambahkan ke saldo kamu.'
                                        : 'Estimasi denda berjalan - akan terkunci begitu status operasional ditandai selesai.'}
                                </p>
                                <p className="mt-2 text-base font-bold text-amber-800 dark:text-amber-300">
                                    {formatRupiah(order.denda)}
                                </p>
                            </div>
                        )}

                        {/* Identitas Pelanggan */}
                        <div className="mt-4 border-t border-green-100 pt-3 dark:border-green-900/40">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{order.customer?.name ?? '-'}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{order.customer?.phone ?? '-'}</p>
                        </div>

                        {/* Detail Alamat */}
                        <div className="mt-4">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Detail Alamat</p>

                            <div className="mt-2 flex gap-2.5">
                                <div className="flex flex-col items-center">
                                    <MapPin size={16} className="text-red-500" />
                                    <span className="my-0.5 h-6 w-px border-l border-dashed border-gray-300" />
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {order.pickup_address && order.pickup_address !== '-'
                                        ? order.pickup_address
                                        : 'Titip langsung di tempat mitra'}
                                </p>
                            </div>
                            <div className="mt-1 flex items-center gap-2.5">
                                <Home size={16} className="text-green-600" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {order.dropoff_address || 'Kantor Titipsini.com'}
                                </p>
                            </div>
                        </div>

                        {order.jam_pickup && (
                            <div className="mt-3 flex items-center justify-between text-sm">
                                <span className="font-bold text-gray-900 dark:text-gray-100">Jam Pick Up</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{order.jam_pickup}</span>
                            </div>
                        )}

                        {/* Detail Penitipan */}
                        {items.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Detail Penitipan</p>
                                <div className="mt-1.5 space-y-1">
                                    {items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                            <span>{item.name}</span>
                                            {item.qty && <span>x{item.qty}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-3 space-y-1.5 border-t border-green-100 pt-2.5 text-sm dark:border-green-900/40">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Pick up</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{order.pickup_status}</span>
                            </div>
                            {order.duration && (
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Durasi penitipan</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{order.duration}</span>
                                </div>
                            )}
                            {order.vendor_pickup && (
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Vendor Pick up</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{order.vendor_pickup}</span>
                                </div>
                            )}
                        </div>

                        {/* Rincian Biaya */}
                        <div className="mt-4 space-y-1.5 border-t border-green-100 pt-3 text-sm dark:border-green-900/40">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Sub total</span>
                                <span>{formatRupiah(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Diskon</span>
                                <span>{order.discount > 0 ? `- ${formatRupiah(order.discount)}` : 0}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Biaya penjemputan</span>
                                <span>{formatRupiah(order.pickup_fee)}</span>
                            </div>

                            {/* Bukti transfer dan verifikasi dalam satu baris */}
                            {order.payment_receipt && (
                                <div className="flex items-center justify-between gap-3 pt-0.5">
                                    <a
                                        href={getFileUrl(order.payment_receipt)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex min-w-0 items-center gap-1 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
                                    >
                                        <span>Lihat Bukti Transfer</span>
                                        <ExternalLink size={14} className="shrink-0" />
                                    </a>
                                    {order.payment_verified_at ? (
                                        <span className="flex shrink-0 items-center gap-1 text-[11px] text-green-700 dark:text-green-400">
                                            <ShieldCheck size={13} />
                                            Terverifikasi
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={verifikasiPembayaran}
                                            disabled={isVerifyingPayment}
                                            className="flex shrink-0 items-center gap-1 rounded-lg bg-[#15803d] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                                        >
                                            <ShieldCheck size={13} />
                                            {isVerifyingPayment ? 'Memproses...' : 'Verifikasi Pembayaran'}
                                        </button>
                                    )}
                                </div>
                            )}
                            {order.bukti_denda && (
                                <a
                                    href={getFileUrl(order.bukti_denda)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between pt-0.5 text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400"
                                >
                                    <span>Lihat Bukti Pembayaran Denda</span>
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </div>

                        <div className="mt-3 flex justify-between border-t border-dashed border-green-300 pt-3 text-base font-bold text-gray-900 dark:border-green-800 dark:text-gray-100">
                            <span>Total</span>
                            <span>{formatRupiah(order.total)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </MitraLayout>
    );
}