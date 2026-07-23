import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Package, Tag, Minus, Plus } from 'lucide-react';

function formatRupiah(value) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
}

function formatTanggal(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export default function Pemesanan({ customer, items: initialItems, detail }) {
    const [items, setItems] = useState(initialItems);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const isDark = typeof window !== 'undefined' && localStorage.getItem('titipsini_theme') === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    function updateQty(index, delta) {
        setItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
        );
    }

    const subtotalPaket = items.reduce((sum, item) => sum + item.harga * item.qty, 0);

    function handleKonfirmasi() {
        setProcessing(true);
        router.post(
            '/app/services/barang/konfirmasi',
            { items },
            { onFinish: () => setProcessing(false) }
        );
    }

    return (
        <div className="min-h-dvh bg-gray-200 dark:bg-gray-950 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Pemesanan" />

            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 sm:h-[850px] sm:shadow-xl">
                <div
                    className="shrink-0 bg-green-600 dark:bg-green-800 px-4 pb-5 text-white"
                    style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
                >
                    <div className="flex items-center gap-3">
                        <Link href="/app/services/barang/paket-pilihan" className="p-1">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-base font-bold">Pemesanan</h1>
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto pb-32">
                    <div className="mx-4 -mt-3 rounded-3xl bg-white dark:bg-gray-800 px-4 pb-4 pt-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{customer.nama}</h2>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{customer.telepon}</p>
                                <p className="mt-1 text-sm leading-snug text-gray-500 dark:text-gray-400">{customer.alamat}</p>
                            </div>
                            <div className="flex shrink-0 flex-col items-center gap-2">
                                <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                >
                                    <Pencil size={14} />
                                </button>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                                    <Package size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="my-5 border-t border-gray-100 dark:border-gray-700" />

                        <div className="mb-2 flex items-center gap-2">
                            <Tag size={16} className="text-green-600 dark:text-green-400" />
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Jenis Barang</h3>
                        </div>

                        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-2 pb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                            <span>Product</span>
                            <span>Price</span>
                            <span className="text-center">Qty</span>
                            <span className="text-right">Subtotal</span>
                        </div>

                        {items.length === 0 && (
                            <p className="py-3 text-sm text-gray-400 dark:text-gray-500">Belum ada barang yang ditambahkan.</p>
                        )}

                        {items.map((item, index) => (
                            <div
                                key={item.nama + index}
                                className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 border-t border-gray-50 dark:border-gray-700 py-3"
                            >
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.nama}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{formatRupiah(item.harga)}</span>
                                <div className="flex items-center justify-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => updateQty(index, -1)}
                                        className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="w-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{item.qty}</span>
                                    <button
                                        type="button"
                                        onClick={() => updateQty(index, 1)}
                                        className="flex h-6 w-6 items-center justify-center rounded-md bg-green-600 text-white"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>
                                <span className="text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                                    {formatRupiah(item.harga * item.qty)}
                                </span>
                            </div>
                        ))}

                        <div className="my-5 border-t border-gray-100 dark:border-gray-700" />

                        <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">Detail Transaksi</h3>
                        <div className="space-y-2.5 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Check In</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{formatTanggal(detail.checkIn)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Check Out</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{formatTanggal(detail.checkOut)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Pick Up</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{detail.pickup ? 'Ya' : 'Tidak'}</span>
                            </div>
                        </div>

                        <div className="my-5 border-t border-gray-100 dark:border-gray-700" />

                        <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">Rincian Pembayaran</h3>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Subtotal Paket</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{formatRupiah(subtotalPaket)}</span>
                        </div>
                    </div>
                </main>

                <div
                    className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4"
                    style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
                >
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 pb-4 pt-3 shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center justify-between py-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Pembayaran</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {formatRupiah(subtotalPaket)}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleKonfirmasi}
                            disabled={processing || items.length === 0}
                            className="mt-2 w-full rounded-full bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition disabled:opacity-50"
                        >
                            {processing ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}