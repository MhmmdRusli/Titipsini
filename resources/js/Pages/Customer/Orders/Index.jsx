import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Star, Truck } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const TABS = [
    { value: '', label: 'Semua' },
    { value: 'baru', label: 'Belum Bayar' },
    { value: 'diproses', label: 'Dititipkan' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
];

const SERVICE_LABEL = {
    barang: 'Penitipan Barang',
    kendaraan: 'Penitipan Kendaraan',
    bangunan: 'Penitipan Bangunan',
    pindahan: 'Jasa Pindahan',
};

const STATUS_LABEL = {
    baru: 'Belum Bayar',
    diproses: 'Dititipkan',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
};

function getStatusLabel(order) {
    if (order.status === 'diproses' && !order.payment_verified_at) {
        return order.payment_receipt ? 'Menunggu Verifikasi Pembayaran' : 'Menunggu Pembayaran';
    }

    return STATUS_LABEL[order.status] ?? order.status;
}

const STATUS_COLOR = {
    baru: 'text-red-500',
    diproses: 'text-cyan-500',
    selesai: 'text-emerald-700 dark:text-emerald-400',
    dibatalkan: 'text-gray-500',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function OrdersIndex({ orders, filters }) {
    const activeStatus = filters?.status ?? '';
    const [processingOrderId, setProcessingOrderId] = useState(null);
    const [pickupConfirmOrder, setPickupConfirmOrder] = useState(null);
    const [completeConfirmOrder, setCompleteConfirmOrder] = useState(null);
    const [reviewOrderId, setReviewOrderId] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewing, setReviewing] = useState(false);

    function changeTab(status) {
        router.get('/app/orders', { status }, { preserveState: true, preserveScroll: true, replace: true });
    }

    function requestPickup(order) {
        setProcessingOrderId(order.id);
        router.patch(`/app/orders/${order.id}/ajukan-pengambilan`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessingOrderId(null),
            onSuccess: () => setPickupConfirmOrder(null),
        });
    }

    function completeOrder(order) {
        setProcessingOrderId(order.id);
        router.patch(`/app/orders/${order.id}/selesaikan`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessingOrderId(null),
            onSuccess: () => setCompleteConfirmOrder(null),
        });
    }

    function submitReview(orderId) {
        if (!reviewRating || !reviewText.trim()) return;
        setReviewing(true);
        router.post(`/app/orders/${orderId}/review`, {
            rating: reviewRating,
            review: reviewText,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReviewOrderId(null);
                setReviewText('');
                setReviewRating(0);
            },
            onFinish: () => setReviewing(false),
        });
    }

    return (
        <CustomerLayout title="Pesanan Saya" backHref="/app/dashboard">
            <Head title="Pesanan Saya" />

            <div className="min-h-screen bg-white pb-12 dark:bg-gray-900">
                {/* Header Tab Minimalis */}
                <div className="sticky top-0 z-30 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="no-scrollbar flex overflow-x-auto px-4">
                        {TABS.map((tab) => {
                            const isActive = activeStatus === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => changeTab(tab.value)}
                                    className={`relative shrink-0 px-3.5 py-3 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                                            : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
                                    }`}
                                >
                                    {tab.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-emerald-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Daftar Card Pesanan */}
                <div className="mt-4 px-4">
                    <div className="flex flex-col gap-4">
                        {orders.data.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
                                Belum ada pesanan untuk kategori ini.
                            </div>
                        )}

                        {orders.data.map((order) => {
                            const isDititipkan = order.status === 'diproses' && Boolean(order.payment_verified_at);
                            const isSelesai = order.status === 'selesai';
                            const isBelumBayar = order.status === 'baru';
                            const isBarang = order.service_type === 'barang';
                            const isPickupRequested = Boolean(order.pickup_requested_at);
                            const isReadyToComplete = isBarang && order.fase === 'akhir';
                            const isProcessing = processingOrderId === order.id;

                            return (
                                <div
                                    key={order.id}
                                    className="rounded-xl border border-emerald-300/70 bg-emerald-50/40 p-4 dark:border-emerald-800/60 dark:bg-emerald-950/20"
                                >
                                    {/* Header Kartu: Nama Vendor & Status */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                                {order.vendor_name ?? 'Experi'}
                                            </h3>
                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                                <MapPin size={13} className="shrink-0" />
                                                <span>{order.vendor_address ?? 'Jl. Janti, Bantul, Yogyakarta'}</span>
                                            </p>
                                        </div>
                                        <span className={`text-xs font-semibold ${STATUS_COLOR[order.status] ?? 'text-gray-400'}`}>
                                            {getStatusLabel(order)}
                                        </span>
                                    </div>

                                    {/* Badge Layanan */}
                                    <div className="mt-2.5">
                                        <span className="inline-block rounded-md border border-emerald-300/80 bg-emerald-100/60 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                            {SERVICE_LABEL[order.service_type] ?? 'Penitipan Barang'}
                                        </span>
                                    </div>

                                    {/* Rincian Durasi & Total */}
                                    <div className="mt-3.5 space-y-1.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                                        <div className="grid grid-cols-12 items-center">
                                            <span className="col-span-5 text-gray-900 font-medium dark:text-gray-200">Durasi Penitipan</span>
                                            <span className="col-span-1 text-center">:</span>
                                            <span className="col-span-6 text-right font-bold text-gray-900 dark:text-gray-100">
                                                {order.duration ?? '10 hari'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-12 items-center">
                                            <span className="col-span-5 text-gray-900 font-medium dark:text-gray-200">Total Pembayaran</span>
                                            <span className="col-span-1 text-center">:</span>
                                            <span className="col-span-6 text-right font-bold text-gray-900 dark:text-gray-100">
                                                {formatRupiah(order.total_price ?? 104500)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Section Ulasan (Hanya Tampil di Status Selesai) */}
                                    {isSelesai && !order.rating && (
                                        <div className="mt-3.5">
                                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-200">Ulasan</p>
                                            {reviewOrderId === order.id ? (
                                                <div className="mt-1.5 rounded-lg bg-emerald-100/30 p-3 dark:bg-emerald-950/40">
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button key={star} type="button" onClick={() => setReviewRating(star)} aria-label={`${star} bintang`}>
                                                                <Star size={20} className={star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <textarea
                                                        value={reviewText}
                                                        onChange={(e) => setReviewText(e.target.value)}
                                                        placeholder="Tulis ulasan kamu..."
                                                        rows={3}
                                                        className="mt-2 w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                                    />
                                                    <button type="button" disabled={!reviewRating || !reviewText.trim() || reviewing} onClick={() => submitReview(order.id)} className="mt-2 w-full rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white disabled:opacity-50">
                                                        {reviewing ? 'Mengirim...' : 'Kirim Ulasan'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => setReviewOrderId(order.id)} className="mt-1.5 w-full rounded-lg border border-emerald-300 p-2.5 text-left text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300">
                                                    Beri ulasan dan rating
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {isSelesai && order.rating && (
                                        <div className="mt-3.5">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} className={star <= order.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />)}
                                            </div>
                                            <div className="mt-1.5 rounded-lg bg-emerald-100/30 p-2.5 text-xs text-gray-600 dark:bg-emerald-950/40 dark:text-gray-300">{order.review}</div>
                                        </div>
                                    )}

                                    {/* Tombol Aksi */}
                                    <div className="mt-4">
                                        {/* Tab Dititipkan: Selesai, Detail Pesanan, dan Perpanjang Penitipan */}
                                        {isDititipkan && (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => isBarang && (isReadyToComplete
                                                            ? setCompleteConfirmOrder(order)
                                                            : setPickupConfirmOrder(order))}
                                                        disabled={!isBarang || isProcessing || isPickupRequested && !isReadyToComplete}
                                                        className="flex-1 rounded-lg border border-emerald-600 bg-white py-2 text-center text-xs font-medium text-emerald-600 transition active:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-400"
                                                    >
                                                        {isProcessing
                                                            ? 'Memproses...'
                                                            : isReadyToComplete
                                                            ? 'Selesaikan Pesanan'
                                                            : isBarang && isPickupRequested
                                                            ? 'Menunggu Mitra'
                                                            : isBarang
                                                            ? 'Ajukan Pengembalian'
                                                            : 'Selesai'}
                                                    </button>
                                                    <Link
                                                        href={`/app/orders/${order.id}`}
                                                        className="flex-1 rounded-lg border border-emerald-600 bg-white py-2 text-center text-xs font-medium text-emerald-600 transition active:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-400"
                                                    >
                                                        Detail Pesanan
                                                    </Link>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => router.get(`/app/orders/${order.id}/extend`)}
                                                    className="w-full rounded-lg border border-emerald-600 bg-white py-2 text-center text-xs font-medium text-emerald-600 transition active:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-400"
                                                >
                                                    Perpanjang Penitipan
                                                </button>
                                            </div>
                                        )}

                                        {/* Tab Selesai: Detail Pesanan dan Laporkan */}
                                        {isSelesai && (
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/app/orders/${order.id}`}
                                                    className="flex-1 rounded-lg border border-emerald-600 bg-white py-2 text-center text-xs font-medium text-emerald-600 transition active:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-400"
                                                >
                                                    Detail Pesanan
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => router.get(`/app/orders/${order.id}/report`)}
                                                    className="flex-1 rounded-lg border border-red-500 bg-white py-2 text-center text-xs font-medium text-red-500 transition active:bg-red-50 dark:bg-gray-800 dark:text-red-400"
                                                >
                                                    Laporkan
                                                </button>
                                            </div>
                                        )}

                                        {/* Tab Belum Bayar */}
                                        {isBelumBayar && (
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/app/orders/${order.id}`}
                                                    className="flex-1 rounded-lg border border-emerald-600 bg-white py-2 text-center text-xs font-semibold text-emerald-600 transition active:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-400"
                                                >
                                                    Bayar Sekarang
                                                </Link>
                                                <Link
                                                    href={`/app/orders/${order.id}`}
                                                    className="flex-1 rounded-lg border border-emerald-600 bg-white py-2 text-center text-xs font-medium text-emerald-600 transition active:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-400"
                                                >
                                                    Detail Pesanan
                                                </Link>
                                            </div>
                                        )}

                                        {/* Detail tetap tersedia saat pembayaran menunggu verifikasi atau order dibatalkan */}
                                        {!isDititipkan && !isSelesai && !isBelumBayar && (
                                            <Link
                                                href={`/app/orders/${order.id}`}
                                                className="block w-full rounded-lg border border-emerald-600 bg-white py-2 text-center text-xs font-medium text-emerald-600 transition active:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-400"
                                            >
                                                Detail Pesanan
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {pickupConfirmOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                                <Truck size={19} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                    Ajukan Pengembalian Barang?
                                </h2>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                    Mitra akan diberi tahu bahwa kamu siap mengambil barang di lokasi penyimpanan.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl bg-green-50 px-3 py-2.5 text-xs leading-relaxed text-green-800 dark:bg-green-950/30 dark:text-green-300">
                            Pastikan kamu sudah siap datang. Setelah pengajuan dikirim, tunggu mitra menyiapkan barang.
                        </div>

                        <div className="mt-5 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPickupConfirmOrder(null)}
                                disabled={processingOrderId === pickupConfirmOrder.id}
                                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => requestPickup(pickupConfirmOrder)}
                                disabled={processingOrderId === pickupConfirmOrder.id}
                                className="flex-1 rounded-xl bg-[#15803d] py-2.5 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                            >
                                {processingOrderId === pickupConfirmOrder.id ? 'Mengirim...' : 'Ya, Ajukan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {completeConfirmOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                                <CheckCircle2 size={19} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                    Selesaikan Pesanan?
                                </h2>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                    Pastikan barang sudah kamu terima dari mitra sebelum menyelesaikan pesanan ini.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl bg-green-50 px-3 py-2.5 text-xs leading-relaxed text-green-800 dark:bg-green-950/30 dark:text-green-300">
                            Setelah dikonfirmasi, pesanan akan berubah menjadi selesai dan tidak dapat dikembalikan ke status sebelumnya.
                        </div>

                        <div className="mt-5 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setCompleteConfirmOrder(null)}
                                disabled={processingOrderId === completeConfirmOrder.id}
                                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => completeOrder(completeConfirmOrder)}
                                disabled={processingOrderId === completeConfirmOrder.id}
                                className="flex-1 rounded-xl bg-[#15803d] py-2.5 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                            >
                                {processingOrderId === completeConfirmOrder.id ? 'Memproses...' : 'Ya, Selesaikan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .no-scrollbar {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </CustomerLayout>
    );
}