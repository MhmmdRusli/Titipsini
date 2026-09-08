import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ArrowLeft, MapPin, Home, User, Package, XCircle, 
    CheckCircle2, Loader2, Image, ShieldCheck, ExternalLink, 
    HandCoins, Clock, ArrowRightCircle, AlertTriangle 
} from 'lucide-react';
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

const STATUS_CONFIG = {
    baru: { label: 'Pesanan Diproses', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', icon: Loader2 },
    pembayaran_diterima: { label: 'Pembayaran Diterima', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', icon: CheckCircle2 },
    diproses: { label: 'Pesanan Diproses', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', icon: Loader2 },
    diproses_mitra: { label: 'Diproses Mitra', color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400', icon: Loader2 },
    dikirim: { label: 'Dikirim', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400', icon: Loader2 },
    selesai: { label: 'Selesai', color: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-[#4ade80]', icon: CheckCircle2 },
    dibatalkan: { label: 'Dibatalkan', color: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400', icon: XCircle },
};

const FASE_COLOR = {
    menunggu: 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300',
    berjalan: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    akhir: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-[#4ade80]',
};

export default function Show({ order }) {
    if (order.status === 'baru' || order.status === 'pembayaran_diterima') {
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
                                className="flex items-center gap-3 py-3.5 text-sm text-gray-800 dark:text-gray-200 cursor-pointer"
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

    return (
        <MitraLayout title="Rincian Order">
            <Head title={`Rincian Order - ${order.order_number}`} />

            <div className="bg-green-50/60 px-4 py-4 dark:bg-green-950/10">
                <div className="flex items-center justify-between rounded-2xl bg-[#15803d] px-4 py-3.5 text-white shadow-sm dark:bg-green-700">
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

                <div className="mt-4">
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
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p>{order.pickup_address && order.pickup_address !== '-'
                                ? order.pickup_address
                                : 'Titip langsung di tempat mitra'}</p>
                            {order.address_notes && (
                                <p className="mt-1 text-xs italic text-gray-500 dark:text-gray-400">{order.address_notes}</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2.5">
                        <Home size={16} className="text-green-600" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {order.dropoff_address || 'Kantor Titipsini.com'}
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Detail Penitipan</p>
                    <div className="mt-1.5 flex justify-between text-sm text-gray-700 dark:text-gray-300">
                        <span>{order.item_description ?? '-'}</span>
                    </div>

                    <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-2.5 text-sm dark:border-gray-800">
                        {order.jam_pickup && (
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Jam Pick Up</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{order.jam_pickup}</span>
                            </div>
                        )}
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
                    </div>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
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
                </div>

                <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                    <span>Total</span>
                    <span>{formatRupiah(order.total)}</span>
                </div>

                <div className="mt-6 space-y-3">
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
                        className="w-full rounded-xl border border-[#15803d] py-3 text-sm font-bold text-[#15803d] hover:bg-green-50 disabled:opacity-60 dark:border-green-600 dark:text-green-400"
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
   ==================================================================== */
function ShowDiproses({ order }) {
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerifyingDenda, setIsVerifyingDenda] = useState(false);
    const [isAdvancingFase, setIsAdvancingFase] = useState(false);
    const [isConfirmingPickup, setIsConfirmingPickup] = useState(false);
    const [isMarkingAsPickedUp, setIsMarkingAsPickedUp] = useState(false);

    const statusInfo = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.diproses;
    const StatusIcon = statusInfo.icon;
    const isCash = order.payment_method === 'cod';
    const isSaldo = order.payment_method === 'saldo';

    function verifikasiPembayaran() {
        setIsVerifying(true);
        router.patch(
            `/mitra/pesanan/${order.id}/verifikasi-pembayaran`,
            {},
            { preserveScroll: true, onFinish: () => setIsVerifying(false) }
        );
    }

    function verifikasiDenda() {
        setIsVerifyingDenda(true);
        router.patch(
            `/mitra/pesanan/${order.id}/verifikasi-denda`,
            {},
            { preserveScroll: true, onFinish: () => setIsVerifyingDenda(false) }
        );
    }

    function advanceFase() {
        setIsAdvancingFase(true);
        router.patch(
            `/mitra/pesanan/${order.id}/fase`,
            {},
            { preserveScroll: true, onFinish: () => setIsAdvancingFase(false) }
        );
    }

    function serahkanBarang() {
        if (!confirm('Konfirmasi bahwa pesanan telah diserahkan kepada customer?')) return;
        setIsConfirmingPickup(true);
        router.patch(
            `/mitra/pesanan/${order.id}/serahkan`,
            {},
            { preserveScroll: true, onFinish: () => setIsConfirmingPickup(false) }
        );
    }

    function tandaiDititip() {
        if (!confirm('Tandai pesanan ini sebagai sudah dititip?')) return;
        setIsMarkingAsPickedUp(true);
        router.patch(
            `/mitra/pesanan/${order.id}/tandai-dititip`,
            {},
            { preserveScroll: true, onFinish: () => setIsMarkingAsPickedUp(false) }
        );
    }

    return (
        <MitraLayout title="Rincian Order">
            <Head title={`Rincian Order - ${order.order_number}`} />

            <div className="min-h-full bg-green-50/60 px-4 py-4 space-y-4 dark:bg-green-950/10">
                <div className="flex items-center justify-between rounded-2xl bg-[#15803d] px-4 py-3.5 text-white shadow-sm dark:bg-green-700">
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

                <div className={`flex items-center gap-2.5 border-b border-green-200/70 pb-3 ${statusInfo.color.replace('bg-blue-50', 'bg-transparent').replace('bg-green-50', 'bg-transparent').replace('bg-red-50', 'bg-transparent').replace('dark:bg-blue-950/40', '').replace('dark:bg-green-950/40', '').replace('dark:bg-red-950/40', '')}`}>
                    <StatusIcon size={20} className="shrink-0" />
                    <div>
                        <p className="text-sm font-bold">{statusInfo.label}</p>
                        {order.status === 'dibatalkan' && order.cancel_reason && (
                            <p className="text-xs opacity-90 mt-0.5">Alasan: {order.cancel_reason}</p>
                        )}
                    </div>
                </div>

                {order.has_pickup && order.status !== 'selesai' && order.fase_label && (
                    <div className="border-b border-green-200/70 pb-4 dark:border-green-900/40">
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
                        ) : order.advance_fase_blocked_reason ? (
                            <p className="mt-2 text-xs italic text-amber-500 dark:text-amber-400">
                                {order.advance_fase_blocked_reason}
                            </p>
                        ) : !['pembayaran_diterima', 'diproses_mitra', 'dititip'].includes(order.status) ? (
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

                {order.status === 'selesai' && (
                    <div className="border-b border-green-200/70 pb-4 dark:border-green-900/40">
                        <div className="flex items-center justify-between">
                            <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                <CheckCircle2 size={15} className="text-green-600" />
                                Status Pesanan
                            </p>
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                Pesanan Selesai
                            </span>
                        </div>
                    </div>
                )}

                {['pembayaran_diterima', 'diproses_mitra'].includes(order.status) && (
                    <div className="border-b border-green-200/70 pb-4 dark:border-green-900/40">
                        {order.has_pickup ? (
                            <>
                                <p className="mt-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Tandai Sudah Dititip</p>
                                <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                    Tandai bahwa barang sudah diterima dan sedang disiapkan untuk customer.
                                </p>
                                <button
                                    type="button"
                                    onClick={tandaiDititip}
                                    disabled={isMarkingAsPickedUp}
                                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#15803d] dark:bg-green-700 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
                                >
                                    <CheckCircle2 size={16} />
                                    {isMarkingAsPickedUp ? 'Memproses...' : 'Tandai Sudah Dititip'}
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="mt-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Selesaikan Pesanan</p>
                                <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                    Tidak ada proses pickup untuk pesanan ini. Klik tombol di bawah jika jasa sudah selesai.
                                </p>
                                <button
                                    type="button"
                                    onClick={serahkanBarang}
                                    disabled={isConfirmingPickup}
                                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#15803d] dark:bg-green-700 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
                                >
                                    <CheckCircle2 size={16} />
                                    {isConfirmingPickup ? 'Memproses...' : 'Tandai Selesai'}
                                </button>
                            </>
                        )}
                    </div>
                )}

                {order.has_pickup && order.status === 'pengambilan_diajukan' && (
                    <div className="border-b border-green-200/70 pb-4 dark:border-green-900/40">
                        <p className="mt-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Serahkan Barang ke Customer</p>
                        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                            Customer telah mengajukan pengambilan. Klik tombol di bawah jika barang sudah diserahkan.
                        </p>
                        <button
                            type="button"
                            onClick={serahkanBarang}
                            disabled={isConfirmingPickup}
                            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#15803d] dark:bg-green-700 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
                        >
                            <CheckCircle2 size={16} />
                            {isConfirmingPickup ? 'Memproses...' : 'Barang Telah Diserahkan / Selesai'}
                        </button>
                    </div>
                )}

                {order.denda > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/30">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                Pesanan Ini Terlambat
                            </p>
                        </div>
                        <p className="mt-1.5 text-xs text-amber-700/80 dark:text-amber-300/80">
                            {order.fase === 'akhir'
                                ? 'Denda keterlambatan berikut akan otomatis ditambahkan ke saldo kamu.'
                                : 'Estimasi denda berjalan - akan terkunci begitu status operasional ditandai selesai.'}
                        </p>
                        <p className="mt-2 text-lg font-bold text-amber-800 dark:text-amber-300">
                            {formatRupiah(order.denda)}
                        </p>
                    </div>
                )}

                <div className="space-y-3 border-b border-green-200/70 pb-4 dark:border-green-900/40">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700/60">
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Nomor Pesanan</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{order.order_number}</p>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{order.created_at}</p>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                        <User size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 dark:text-gray-500">Identitas Pelanggan</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{order.customer?.name ?? '-'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer?.phone ?? '-'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 dark:text-gray-500">Rute Penjemputan</p>
                            <p className={`text-xs font-medium ${order.pickup_address && order.pickup_address !== '-' ? 'text-gray-800 dark:text-gray-200' : 'italic text-gray-400'}`}>
                                {order.pickup_address && order.pickup_address !== '-'
                                    ? order.pickup_address
                                    : 'Alamat penjemputan tidak disertakan (Titip langsung di tempat mitra)'}
                            </p>
                            {order.address_notes && (
                                <p className="text-xs italic text-gray-500 dark:text-gray-400">{order.address_notes}</p>
                            )}
                        </div>
                    </div>

                    {order.dropoff_address && (
                        <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                            <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400 dark:text-gray-500">Rute Pengantaran</p>
                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{order.dropoff_address}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                        <Package size={16} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 dark:text-gray-500">Deskripsi Item Dititipkan</p>
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{order.item_description ?? '-'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 dark:border-gray-700/40 text-sm">
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Durasi Penitipan</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{order.duration ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Status Pick Up</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{order.pickup_status ?? '-'}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 border-b border-green-200/70 pb-4 dark:border-green-900/40">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {isSaldo ? (
                                <ShieldCheck size={15} className="text-gray-400" />
                            ) : isCash ? (
                                <HandCoins size={15} className="text-gray-400" />
                            ) : (
                                <Image size={15} className="text-gray-400" />
                            )}
                            {isSaldo ? 'Pembayaran Saldo' : isCash ? 'Pembayaran Tunai' : 'Bukti Pembayaran'}
                        </p>
                        {(isSaldo || order.payment_verified_at) && (
                            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700 dark:bg-green-950/40 dark:text-[#4ade80]">
                                <ShieldCheck size={12} />
                                Terverifikasi
                            </span>
                        )}
                    </div>

                    {isSaldo ? (
                        <p className="text-center text-xs text-gray-400 py-4">
                            Pembayaran dipotong otomatis dari saldo customer{order.payment_verified_at ? ` pada ${order.payment_verified_at}` : ''}. Tidak perlu verifikasi manual.
                        </p>
                    ) : isCash ? (
                        order.payment_verified_at ? (
                            <p className="text-center text-xs text-gray-400 py-4">
                                Pembayaran tunai sudah dikonfirmasi pada {order.payment_verified_at}
                            </p>
                        ) : (
                            <>
                                <p className="text-center text-xs italic text-gray-400 pb-3">
                                    Customer membayar tunai langsung saat serah-terima barang. Konfirmasi setelah uang benar-benar diterima.
                                </p>
                                <button
                                    type="button"
                                    onClick={verifikasiPembayaran}
                                    disabled={isVerifying}
                                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#15803d] dark:bg-green-700 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
                                >
                                    <HandCoins size={16} />
                                    {isVerifying ? 'Memproses...' : 'Konfirmasi Uang Tunai Diterima'}
                                </button>
                            </>
                        )
                    ) : order.payment_receipt ? (
                        <>
                            <a
                                href={getFileUrl(order.payment_receipt)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3.5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50"
                            >
                                <span>Lihat Bukti Transfer</span>
                                <ExternalLink size={16} />
                            </a>

                            {order.payment_verified_at ? (
                                <p className="mt-3 text-center text-xs text-gray-400">
                                    Sudah diverifikasi pada {order.payment_verified_at}
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={verifikasiPembayaran}
                                    disabled={isVerifying}
                                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#15803d] dark:bg-green-700 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
                                >
                                    <ShieldCheck size={16} />
                                    {isVerifying ? 'Memverifikasi...' : 'Verifikasi Pembayaran'}
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-xs text-gray-400 italic py-4">
                            Customer belum mengunggah bukti pembayaran.
                        </p>
                    )}
                </div>

                {order.denda > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-amber-900/50 dark:bg-gray-800">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-300">
                                <Image size={15} className="text-amber-600 dark:text-amber-400" />
                                Bukti Pembayaran Denda
                            </p>
                            {order.status_denda === 'terverifikasi' && (
                                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700 dark:bg-green-950/40 dark:text-[#4ade80]">
                                    <ShieldCheck size={12} />
                                    Terverifikasi
                                </span>
                            )}
                        </div>

                        {order.bukti_denda ? (
                            <>
                                <a
                                    href={getFileUrl(order.bukti_denda)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50"
                                >
                                    <span>Lihat Bukti Pembayaran Denda</span>
                                    <ExternalLink size={16} />
                                </a>

                                {order.status_denda === 'terverifikasi' ? (
                                    <p className="mt-3 text-center text-xs text-gray-400">
                                        Pembayaran denda telah diverifikasi.
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={verifikasiDenda}
                                        disabled={isVerifyingDenda}
                                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-600 dark:bg-amber-700 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
                                    >
                                        <ShieldCheck size={16} />
                                        {isVerifyingDenda ? 'Memverifikasi...' : 'Verifikasi Denda'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="text-center text-xs text-gray-400 italic py-4">
                                Customer belum mengunggah bukti pembayaran denda.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </MitraLayout>
    );
}