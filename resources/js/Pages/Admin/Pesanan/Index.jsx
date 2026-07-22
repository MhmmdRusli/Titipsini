import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Eye, Truck, X, FileText, Image, ExternalLink, Trash2 } from 'lucide-react';

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

const STATUS_STYLE = {
    baru: 'bg-blue-50 text-blue-600',
    diproses: 'bg-amber-50 text-amber-600',
    selesai: 'bg-brand-teal-100 text-brand-teal-700',
    dibatalkan: 'bg-red-50 text-red-600',
};

const SERVICE_LABEL = {
    barang: 'Barang',
    kendaraan: 'Kendaraan',
    bangunan: 'Bangunan',
    pindahan: 'Pindahan',
};

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

    return (
        <AdminLayout title="Pesanan">
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="relative w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari kode pesanan / customer..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500"
                    />
                </form>

                <select
                    value={serviceType}
                    onChange={(e) => {
                        setServiceType(e.target.value);
                        applyFilters({ service_type: e.target.value });
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500"
                >
                    {SERVICE_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        applyFilters({ status: e.target.value });
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500"
                >
                    {STATUSES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {cities.length > 0 && (
                    <select
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value);
                            applyFilters({ city: e.target.value });
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500"
                    >
                        <option value="">Semua Kota</option>
                        {cities.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                            <th className="px-6 py-3">Kode Pesanan</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Vendor</th>
                            <th className="px-6 py-3">Layanan</th>
                            <th className="px-6 py-3">Kota</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.data.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-10 text-center text-gray-400">
                                    Belum ada pesanan yang cocok dengan filter ini.
                                </td>
                            </tr>
                        )}
                        {orders.data.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div>{order.order_code}</div>
                                    {order.payment_receipt && (
                                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                            <FileText size={11} /> Bukti Diunggah
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-600">{order.customer?.name ?? '-'}</td>
                                <td className="px-6 py-4 text-gray-600">{order.partner?.name ?? '-'}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 text-gray-600">
                                        {SERVICE_LABEL[order.service_type] ?? order.service_type}
                                        {order.is_pickup && <Truck size={13} className="text-brand-teal-600" />}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{order.city}</td>
                                <td className="px-6 py-4 text-gray-600">{formatRupiah(order.total_price)}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                            STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedOrder(order)}
                                            className="inline-flex items-center gap-1 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-teal-700"
                                            title="Detail Pesanan"
                                        >
                                            <Eye size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(order)}
                                            className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                            title="Hapus Pesanan"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.links && orders.links.length > 3 && (
                    <div className="flex items-center justify-end gap-1 border-t border-gray-100 px-6 py-3">
                        {orders.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                                className={`rounded-md px-3 py-1.5 text-xs ${
                                    link.active
                                        ? 'bg-brand-teal-700 text-white'
                                        : link.url
                                        ? 'text-gray-500 hover:bg-gray-100'
                                        : 'text-gray-300 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-base font-semibold text-gray-900">Hapus Pesanan?</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Pesanan dengan kode "{deleteTarget.order_code}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

function OrderDetailModal({ order, onClose }) {
    const [previewImage, setPreviewImage] = useState(false);
    const { data, setData, errors } = useForm({
        status: order.status,
        cancel_reason: order.cancel_reason ?? '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const nextActions = {
        baru: ['diproses', 'dibatalkan'],
        diproses: ['selesai', 'dibatalkan'],
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
                    console.error('Gagal memperbarui status:', err);
                },
            }
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="mb-4 flex items-center justify-between border-b pb-3">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">{order.order_code}</h2>
                        <span
                            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {order.status}
                        </span>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>

                <dl className="grid grid-cols-2 gap-y-3 text-sm">
                    <dt className="text-gray-500">Customer</dt>
                    <dd className="text-gray-900 font-medium">{order.customer?.name ?? '-'}</dd>

                    <dt className="text-gray-500">Vendor</dt>
                    <dd className="text-gray-900">{order.partner?.name ?? 'Belum ditugaskan'}</dd>

                    <dt className="text-gray-500">Jenis Layanan</dt>
                    <dd className="text-gray-900">{SERVICE_LABEL[order.service_type] ?? order.service_type}</dd>

                    <dt className="text-gray-500">Antar-Jemput</dt>
                    <dd className="text-gray-900">{order.is_pickup ? 'Ya' : 'Tidak'}</dd>

                    <dt className="text-gray-500">Metode Bayar</dt>
                    <dd className="text-gray-900 uppercase font-medium">{order.payment_method ?? '-'}</dd>

                    <dt className="text-gray-500">Kota</dt>
                    <dd className="text-gray-900">{order.city}</dd>

                    <dt className="text-gray-500">Total Harga</dt>
                    <dd className="text-gray-900 font-bold text-brand-teal-700">{formatRupiah(order.total_price)}</dd>

                    {order.status === 'dibatalkan' && order.cancel_reason && (
                        <>
                            <dt className="text-gray-500">Alasan Batal</dt>
                            <dd className="text-red-600">{order.cancel_reason}</dd>
                        </>
                    )}
                </dl>

                <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase text-gray-600 flex items-center gap-1.5">
                            <Image size={14} /> Bukti Pembayaran
                        </span>
                    </div>

                    {order.payment_receipt ? (
                        <div className="space-y-2">
                            <div className="relative group overflow-hidden rounded-lg border bg-white">
                                <img
                                    src={order.payment_receipt}
                                    alt="Bukti Transfer"
                                    className="h-40 w-full object-contain bg-gray-100 cursor-pointer"
                                    onClick={() => setPreviewImage(true)}
                                />
                                <div 
                                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer text-white text-xs font-medium gap-1"
                                    onClick={() => setPreviewImage(true)}
                                >
                                    <ExternalLink size={14} /> Klik untuk memperbesar
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic">Customer belum mengunggah bukti pembayaran.</p>
                    )}
                </div>

                {nextActions.length > 0 && (
                    <div className="mt-5 border-t border-gray-100 pt-4">
                        {nextActions.includes('dibatalkan') && (
                            <div className="mb-3">
                                <label className="mb-1 block text-xs font-medium text-gray-600">
                                    Alasan pembatalan (wajib jika membatalkan)
                                </label>
                                <input
                                    type="text"
                                    value={data.cancel_reason}
                                    onChange={(e) => setData('cancel_reason', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500"
                                    placeholder="Contoh: Bukti pembayaran tidak valid"
                                />
                                {errors.cancel_reason && (
                                    <p className="mt-1 text-xs text-red-500">{errors.cancel_reason}</p>
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
                                    className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                                        next === 'dibatalkan'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-brand-teal-700 hover:bg-brand-teal-800'
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
                    <div className="relative max-w-3xl max-h-[90vh]">
                        <img 
                            src={order.payment_receipt} 
                            alt="Bukti Transfer Perbesar" 
                            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
                        />
                        <button 
                            type="button"
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
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