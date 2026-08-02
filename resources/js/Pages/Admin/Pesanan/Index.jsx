import { useState, useRef, useEffect } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Eye, Truck, X, FileText, Image, ExternalLink, Trash2, ChevronDown, ChevronRight, Package, HandCoins, CheckCircle2 } from 'lucide-react';

const SERVICE_TYPES = [
    { value: '', label: 'Semua Layanan' },
    { value: 'barang', label: 'Barang' },
    { value: 'kendaraan', label: 'Kendaraan' },
    { value: 'bangunan', label: 'Bangunan' },
    { value: 'pindahan', label: 'Pindahan' },
];

const STATUSES = [
    { value: '', label: 'Semua Status' },
    { value: 'baru', label: 'Baru' },
    { value: 'diproses', label: 'Diproses' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
];

// Gaya badge disamakan dengan pola bordered di halaman Mitra & Dark Mode support
const STATUS_STYLE = {
    baru: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50',
    diproses: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
    selesai: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50',
    dibatalkan: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/50',
};

const SERVICE_LABEL = {
    barang: 'Barang',
    kendaraan: 'Kendaraan',
    bangunan: 'Bangunan',
    pindahan: 'Pindahan',
};

// Order dianggap "cash menunggu konfirmasi" kalau payment_method-nya 'cod'
// dan payment_verified_at masih kosong (belum dikonfirmasi admin).
function isCashPendingConfirmation(order) {
    return order.payment_method === 'cod' && !order.payment_verified_at;
}

// Order dianggap "siap diselesaikan" kalau:
// 1) pembayaran sudah diverifikasi (payment_verified_at keisi), DAN
// 2) fase operasionalnya sudah akhir (Mitra sudah tandai dititip lalu diambil/dst)
// tapi status masih 'diproses' — artinya tinggal nunggu Admin klik "Selesaikan Pesanan".
function isReadyToComplete(order) {
    return !!order.payment_verified_at && order.fase === 'akhir' && order.status === 'diproses';
}

// Label status yang ditampilkan ke Admin. Selagi pesanan masih 'diproses' dan
// ada fase_label (mis. "Sedang Disewa", "Dititipkan"), tampilkan itu supaya
// Admin lihat status operasional yang lebih jelas daripada tulisan "diproses"
// yang generik. Untuk status lain (baru/selesai/dibatalkan) tetap apa adanya.
function displayStatusLabel(order) {
    if (order.status === 'diproses' && order.fase_label) {
        return order.fase_label;
    }
    return order.status;
}

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function PesananIndex({ orders, filters, cities = [] }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [serviceType, setServiceType] = useState(filters?.service_type ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');
    const [city, setCity] = useState(filters?.city ?? '');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [cashConfirmTarget, setCashConfirmTarget] = useState(null);
    const [isCashConfirming, setIsCashConfirming] = useState(false);

    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const allOnPageSelected = orders.data.length > 0 && orders.data.every((o) => selectedIds.includes(o.id));

    function applyFilters(overrides = {}) {
        router.get(
            '/admin/orders',
            {
                search,
                service_type: serviceType,
                status,
                city,
                ...overrides,
            },
            { preserveState: true, replace: true }
        );
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters();
    }

    function handleDelete() {
        router.delete(`/admin/orders/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function handleConfirmCash() {
        setIsCashConfirming(true);
        router.post(
            `/admin/orders/${cashConfirmTarget.id}/konfirmasi-cash`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCashConfirming(false);
                    setCashConfirmTarget(null);
                    setSelectedOrder(null);
                },
                onError: () => setIsCashConfirming(false),
            }
        );
    }

    function toggleSelectMode() {
        setSelectMode((v) => !v);
        setSelectedIds([]);
    }

    function toggleSelectOne(id) {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    }

    function toggleSelectAllOnPage() {
        if (allOnPageSelected) {
            setSelectedIds((prev) => prev.filter((id) => !orders.data.some((o) => o.id === id)));
        } else {
            const pageIds = orders.data.map((o) => o.id);
            setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
        }
    }

    function handleBulkDelete() {
        setIsBulkDeleting(true);
        router.delete('/admin/orders/bulk-delete', {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                setIsBulkDeleting(false);
                setBulkDeleteConfirm(false);
                setSelectedIds([]);
                setSelectMode(false);
            },
            onError: () => {
                setIsBulkDeleting(false);
            },
        });
    }

    return (
        <AdminLayout title="Pesanan">
            {/* Search + filter */}
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <form onSubmit={handleSearchSubmit} className="relative w-64">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari kode pesanan / customer..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-gray-800 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                    />
                </form>

                <CustomSelect
                    value={serviceType}
                    options={SERVICE_TYPES}
                    onChange={(val) => {
                        setServiceType(val);
                        applyFilters({ service_type: val });
                    }}
                />

                <CustomSelect
                    value={status}
                    options={STATUSES}
                    onChange={(val) => {
                        setStatus(val);
                        applyFilters({ status: val });
                    }}
                />

                {cities.length > 0 && (
                    <CustomSelect
                        value={city}
                        options={[{ value: '', label: 'Semua Kota' }, ...cities.map((c) => ({ value: c, label: c }))]}
                        onChange={(val) => {
                            setCity(val);
                            applyFilters({ city: val });
                        }}
                    />
                )}

                <button
                    type="button"
                    onClick={toggleSelectMode}
                    className={`ml-auto rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-sm transition-all ${
                        selectMode
                            ? 'border-green-600 bg-green-50 text-green-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800'
                    }`}
                >
                    {selectMode ? 'Batal Pilih' : 'Pilih Banyak'}
                </button>
            </div>

            {selectMode && selectedIds.length > 0 && (
                <div className="mb-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
                    <span className="text-xs font-semibold text-green-800 dark:text-emerald-300">
                        {selectedIds.length} pesanan dipilih
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedIds([])}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-white dark:text-gray-300 dark:hover:bg-slate-800"
                        >
                            Batalkan Pilihan
                        </button>
                        <button
                            type="button"
                            onClick={() => setBulkDeleteConfirm(true)}
                            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
                        >
                            <Trash2 size={13} />
                            Hapus {selectedIds.length} Pesanan
                        </button>
                    </div>
                </div>
            )}

            {/* Tabel */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="select-none border-b border-gray-200 bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-slate-800/80 dark:text-gray-400">
                            <tr>
                                {selectMode && (
                                    <th className="w-10 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={allOnPageSelected}
                                            onChange={toggleSelectAllOnPage}
                                            className="rounded text-green-600 focus:ring-green-600 dark:border-gray-700 dark:bg-slate-800 dark:checked:bg-emerald-600"
                                        />
                                    </th>
                                )}
                                <th className="px-4 py-3 font-bold">Kode Pesanan</th>
                                <th className="px-4 py-3 font-bold">Customer</th>
                                <th className="px-4 py-3 font-bold">Vendor</th>
                                <th className="px-4 py-3 font-bold">Layanan</th>
                                <th className="px-4 py-3 font-bold">Periode</th>
                                <th className="px-4 py-3 font-bold">Kota</th>
                                <th className="px-4 py-3 font-bold">Total</th>
                                <th className="px-4 py-3 font-bold">Status</th>
                                <th className="px-4 py-3 text-right font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan={selectMode ? 10 : 9} className="select-none px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package size={32} className="mb-2 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Belum ada pesanan yang cocok dengan filter ini.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {orders.data.map((order) => {
                                const cashPending = isCashPendingConfirmation(order);
                                const readyToComplete = isReadyToComplete(order);
                                return (
                                    <tr
                                        key={order.id}
                                        className={`transition-colors hover:bg-gray-50/60 dark:hover:bg-slate-800/50 ${
                                            selectedIds.includes(order.id) ? 'bg-green-50/50 dark:bg-emerald-950/20' : ''
                                        }`}
                                    >
                                        {selectMode && (
                                            <td className="px-4 py-3.5">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(order.id)}
                                                    onChange={() => toggleSelectOne(order.id)}
                                                    className="rounded text-green-600 focus:ring-green-600 dark:border-gray-700 dark:bg-slate-800 dark:checked:bg-emerald-600"
                                                />
                                            </td>
                                        )}
                                        <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-gray-100">
                                            <div>{order.order_code}</div>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {order.payment_receipt && (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                        <FileText size={11} /> Bukti Diunggah
                                                    </span>
                                                )}
                                                {readyToComplete && (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                        <CheckCircle2 size={11} /> Siap Diselesaikan
                                                    </span>
                                                )}
                                                {order.payment_method === 'cod' && (
                                                    cashPending ? (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                                                            <HandCoins size={11} /> Cash - Belum Diterima
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                            <CheckCircle2 size={11} /> Cash Diterima
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{order.customer?.name ?? '-'}</td>
                                        <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{order.partner?.name ?? '-'}</td>
                                        <td className="px-4 py-3.5">
                                            <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                                {SERVICE_LABEL[order.service_type] ?? order.service_type}
                                                {order.is_pickup && <Truck size={13} className="text-green-700 dark:text-emerald-400" />}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                                            {order.start_date && order.end_date ? (
                                                <>
                                                    <div className="whitespace-nowrap text-xs">
                                                        {order.start_date} <span className="text-gray-300 dark:text-gray-600">→</span> {order.end_date}
                                                    </div>
                                                    {order.duration_label && (
                                                        <div className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                                                            {order.duration_label}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-xs italic text-gray-300 dark:text-gray-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{order.city}</td>
                                        <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300 font-medium">{formatRupiah(order.total_price)}</td>
                                        <td className="select-none px-4 py-3.5">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                                                    STATUS_STYLE[order.status] ?? 'border border-slate-200 bg-slate-100 text-slate-700 dark:border-gray-800 dark:bg-slate-800 dark:text-gray-400'
                                                }`}
                                            >
                                                {displayStatusLabel(order)}
                                            </span>
                                        </td>
                                        <td className="select-none px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {cashPending && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setCashConfirmTarget(order)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 transition hover:bg-orange-600 hover:text-white dark:border-orange-800/60 dark:bg-orange-950/50 dark:text-orange-400 dark:hover:bg-orange-600 dark:hover:text-white"
                                                        title="Konfirmasi Uang Diterima"
                                                    >
                                                        <HandCoins size={13} />
                                                        Konfirmasi Cash
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-600 hover:text-white dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white"
                                                >
                                                    Detail
                                                    <ChevronRight size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget(order)}
                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                                    title="Hapus Pesanan"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {orders.data.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 select-none">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Menampilkan <span className="font-semibold text-gray-700 dark:text-gray-200">{orders.from}</span> sampai{' '}
                        <span className="font-semibold text-gray-700 dark:text-gray-200">{orders.to}</span> dari{' '}
                        <span className="font-semibold text-gray-700 dark:text-gray-200">{orders.total}</span> data
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {orders.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                    link.active
                                        ? 'bg-green-700 text-white shadow-sm dark:bg-emerald-600'
                                        : link.url
                                        ? 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800'
                                        : 'cursor-not-allowed border border-gray-100 bg-gray-50/50 text-gray-300 dark:border-gray-800/50 dark:bg-slate-900/50 dark:text-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onConfirmCash={(order) => setCashConfirmTarget(order)}
                />
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-gray-800 dark:bg-slate-900">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Hapus Pesanan?</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Pesanan dengan kode "{deleteTarget.order_code}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {bulkDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-gray-800 dark:bg-slate-900">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Hapus {selectedIds.length} Pesanan?
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Semua pesanan yang dipilih akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setBulkDeleteConfirm(false)}
                                disabled={isBulkDeleting}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-60 dark:text-gray-300 dark:hover:bg-slate-800"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleBulkDelete}
                                disabled={isBulkDeleting}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
                            >
                                {isBulkDeleting ? 'Menghapus...' : 'Ya, Hapus Semua'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal konfirmasi khusus cash - terpisah dari modal hapus/bulk-delete */}
            {cashConfirmTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-gray-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                                <HandCoins size={18} />
                            </span>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Konfirmasi Uang Diterima?</h2>
                        </div>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            Pastikan uang tunai untuk pesanan <span className="font-semibold text-gray-800 dark:text-gray-200">{cashConfirmTarget.order_code}</span> sebesar{' '}
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{formatRupiah(cashConfirmTarget.total_price)}</span> sudah benar-benar diterima sebelum melanjutkan.
                            Status pesanan akan berubah menjadi <span className="font-semibold">Diproses</span>.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setCashConfirmTarget(null)}
                                disabled={isCashConfirming}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-60 dark:text-gray-300 dark:hover:bg-slate-800"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmCash}
                                disabled={isCashConfirming}
                                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:opacity-60"
                            >
                                {isCashConfirming ? 'Memproses...' : 'Ya, Uang Sudah Diterima'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

function CustomSelect({ value, options, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || options[0]?.label;

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex min-w-[140px] items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-800 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
            >
                <span>{selectedLabel}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform dark:text-gray-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 z-50 mt-1 w-full min-w-[160px] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-slate-900">
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left text-xs transition ${
                                    isSelected
                                        ? 'bg-green-700 font-medium text-white dark:bg-emerald-600'
                                        : 'text-gray-700 hover:bg-green-50 hover:text-green-800 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400'
                                }`}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function OrderDetailModal({ order, onClose, onConfirmCash }) {
    const [previewImage, setPreviewImage] = useState(false);
    const { data, setData, errors } = useForm({
        status: order.status,
        cancel_reason: order.cancel_reason ?? '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusError, setStatusError] = useState(null);

    const cashPending = isCashPendingConfirmation(order);
    const readyToComplete = isReadyToComplete(order);

    const nextActions = {
        baru: ['diproses', 'dibatalkan'],
        // Tombol 'selesai' cuma dimasukkan kalau readyToComplete true —
        // artinya pembayaran sudah diverifikasi DAN Mitra sudah menandai
        // fase akhir. Kalau belum, Admin cuma bisa membatalkan pesanan.
        diproses: [...(readyToComplete ? ['selesai'] : []), 'dibatalkan'],
        selesai: [],
        dibatalkan: [],
    }[order.status] ?? [];

    const actionLabel = {
        diproses: 'Verifikasi & Proses',
        selesai: 'Selesaikan Pesanan',
        dibatalkan: 'Batalkan Pesanan',
    };

    function submitStatus(nextStatus) {
        if (nextStatus === 'dibatalkan' && !data.cancel_reason.trim()) {
            alert('Mohon isi alasan pembatalan terlebih dahulu.');
            return;
        }

        setIsSubmitting(true);
        setStatusError(null);

        router.patch(
            `/admin/orders/${order.id}/status`,
            {
                status: nextStatus,
                cancel_reason: nextStatus === 'dibatalkan' ? data.cancel_reason : null,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                },
                onError: (err) => {
                    setIsSubmitting(false);
                    setStatusError(err.status ?? 'Gagal memperbarui status pesanan.');
                },
            }
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-gray-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{order.order_code}</h2>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                                    STATUS_STYLE[order.status] ?? 'border border-slate-200 bg-slate-100 text-slate-700 dark:border-gray-800 dark:bg-slate-800 dark:text-gray-400'
                                }`}
                            >
                                {displayStatusLabel(order)}
                            </span>
                            {readyToComplete && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <CheckCircle2 size={11} /> Siap Diselesaikan
                                </span>
                            )}
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={18} />
                    </button>
                </div>

                <dl className="grid grid-cols-2 gap-y-3 text-sm">
                    <dt className="text-gray-500 dark:text-gray-400">Customer</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{order.customer?.name ?? '-'}</dd>

                    <dt className="text-gray-500 dark:text-gray-400">Vendor</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{order.partner?.name ?? 'Belum ditugaskan'}</dd>

                    <dt className="text-gray-500 dark:text-gray-400">Jenis Layanan</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{SERVICE_LABEL[order.service_type] ?? order.service_type}</dd>

                    <dt className="text-gray-500 dark:text-gray-400">Antar-Jemput</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{order.is_pickup ? 'Ya' : 'Tidak'}</dd>

                    <dt className="text-gray-500 dark:text-gray-400">Metode Bayar</dt>
                    <dd className="font-medium uppercase text-gray-900 dark:text-gray-100">{order.payment_method ?? '-'}</dd>

                    <dt className="text-gray-500 dark:text-gray-400">Kota</dt>
                    <dd className="text-gray-900 dark:text-gray-100">{order.city}</dd>

                    {order.start_date && order.end_date && (
                        <>
                            <dt className="text-gray-500 dark:text-gray-400">Periode</dt>
                            <dd className="text-gray-900 dark:text-gray-100">
                                {order.start_date} → {order.end_date}
                                {order.duration_label && (
                                    <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">({order.duration_label})</span>
                                )}
                            </dd>
                        </>
                    )}

                    <dt className="text-gray-500 dark:text-gray-400">Total Harga</dt>
                    <dd className="font-bold text-green-700 dark:text-emerald-400">{formatRupiah(order.total_price)}</dd>

                    {order.status === 'dibatalkan' && order.cancel_reason && (
                        <>
                            <dt className="text-gray-500 dark:text-gray-400">Alasan Batal</dt>
                            <dd className="text-red-600 dark:text-red-400">{order.cancel_reason}</dd>
                        </>
                    )}
                </dl>

                {/* Blok khusus cash - hanya tampil kalau payment_method 'cod' */}
                {order.payment_method === 'cod' && (
                    <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/50 dark:bg-orange-950/30">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase text-orange-700 dark:text-orange-400">
                                <HandCoins size={14} /> Pembayaran Tunai
                            </span>
                            {!cashPending && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 size={12} /> Diterima {order.payment_verified_at}
                                </span>
                            )}
                        </div>

                        {cashPending ? (
                            <>
                                <p className="mt-2 text-xs text-orange-700/80 dark:text-orange-300/80">
                                    Uang untuk pesanan ini belum dikonfirmasi diterima. Konfirmasi setelah mitra/customer benar-benar menyerahkan uang tunai.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => onConfirmCash(order)}
                                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
                                >
                                    <HandCoins size={15} />
                                    Konfirmasi Uang Diterima
                                </button>
                            </>
                        ) : (
                            <p className="mt-2 text-xs text-emerald-700/80 dark:text-emerald-300/80">
                                Uang tunai untuk pesanan ini sudah dikonfirmasi diterima oleh admin.
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-slate-800/50">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                            <Image size={14} /> Bukti Pembayaran
                        </span>
                    </div>

                    {order.payment_receipt ? (
                        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-slate-800">
                            <img
                                src={order.payment_receipt}
                                alt="Bukti Transfer"
                                className="h-40 w-full cursor-pointer bg-gray-100 object-contain dark:bg-slate-900"
                                onClick={() => setPreviewImage(true)}
                            />
                            <div
                                className="absolute inset-0 flex cursor-pointer items-center justify-center gap-1 bg-black/40 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100"
                                onClick={() => setPreviewImage(true)}
                            >
                                <ExternalLink size={14} /> Klik untuk memperbesar
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs italic text-gray-400 dark:text-gray-500">Customer belum mengunggah bukti pembayaran.</p>
                    )}
                </div>

                {order.status === 'diproses' && !readyToComplete && (
                    <p className="mt-5 text-xs italic text-gray-400 dark:text-gray-500">
                        Menunggu {!order.payment_verified_at ? 'verifikasi pembayaran' : 'Mitra menandai fase akhir'} sebelum pesanan ini bisa diselesaikan.
                    </p>
                )}

                {nextActions.length > 0 && (
                    <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
                        {statusError && (
                            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                                {statusError}
                            </div>
                        )}
                        {nextActions.includes('dibatalkan') && (
                            <div className="mb-3">
                                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Alasan pembatalan (wajib jika membatalkan)
                                </label>
                                <input
                                    type="text"
                                    value={data.cancel_reason}
                                    onChange={(e) => setData('cancel_reason', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-800 dark:bg-slate-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                                    placeholder="Contoh: Bukti pembayaran tidak valid"
                                />
                                {errors.cancel_reason && (
                                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.cancel_reason}</p>
                                )}
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            {nextActions.map((next) => (
                                <button
                                    key={next}
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => submitStatus(next)}
                                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 ${
                                        next === 'dibatalkan'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-green-700 hover:bg-green-800 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                                    }`}
                                >
                                    {isSubmitting ? 'Memproses...' : actionLabel[next]}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setPreviewImage(false)}
                >
                    <div className="relative max-h-[90vh] max-w-3xl">
                        <img
                            src={order.payment_receipt}
                            alt="Bukti Transfer Perbesar"
                            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
                        />
                        <button
                            type="button"
                            className="absolute -top-10 right-0 text-white transition hover:text-gray-300"
                            onClick={() => setPreviewImage(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}