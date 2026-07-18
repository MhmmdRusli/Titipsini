import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Eye, Truck, X } from 'lucide-react';

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

// Expected props from OrderController@index:
//   orders: { data: [{ id, order_code, customer, partner, service_type,
//              is_pickup, city, status, cancel_reason, total_price, created_at }], links }
//   filters: { search, service_type, status, city }
//   cities: string[]   <- distinct list of order cities, for the filter dropdown
export default function PesananIndex({ orders, filters, cities = [] }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [serviceType, setServiceType] = useState(filters?.service_type ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');
    const [city, setCity] = useState(filters?.city ?? '');
    const [selectedOrder, setSelectedOrder] = useState(null);

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
                                <td className="px-6 py-4 font-medium text-gray-900">{order.order_code}</td>
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
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="inline-flex items-center gap-1 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-teal-700"
                                    >
                                        <Eye size={15} />
                                        Detail
                                    </button>
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
        </AdminLayout>
    );
}

function OrderDetailModal({ order, onClose }) {
    const { data, setData, patch, processing, errors } = useForm({
        status: order.status,
        cancel_reason: order.cancel_reason ?? '',
    });

    const nextActions = {
        baru: ['diproses', 'dibatalkan'],
        diproses: ['selesai', 'dibatalkan'],
        selesai: [],
        dibatalkan: [],
    }[order.status] ?? [];

    const actionLabel = {
        diproses: 'Proses Pesanan',
        selesai: 'Selesaikan Pesanan',
        dibatalkan: 'Batalkan Pesanan',
    };

    function submitStatus(nextStatus) {
        if (nextStatus === 'dibatalkan' && !data.cancel_reason.trim()) {
            return;
        }
        setData('status', nextStatus);
        patch(`/admin/orders/${order.id}/status`, {
            data: { status: nextStatus, cancel_reason: data.cancel_reason },
            onSuccess: onClose,
            preserveScroll: true,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
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
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>

                <dl className="grid grid-cols-2 gap-y-3 text-sm">
                    <dt className="text-gray-500">Customer</dt>
                    <dd className="text-gray-900">{order.customer?.name ?? '-'}</dd>

                    <dt className="text-gray-500">Vendor</dt>
                    <dd className="text-gray-900">{order.partner?.name ?? 'Belum ditugaskan'}</dd>

                    <dt className="text-gray-500">Jenis Layanan</dt>
                    <dd className="text-gray-900">{SERVICE_LABEL[order.service_type] ?? order.service_type}</dd>

                    <dt className="text-gray-500">Antar-Jemput</dt>
                    <dd className="text-gray-900">{order.is_pickup ? 'Ya' : 'Tidak'}</dd>

                    <dt className="text-gray-500">Kota</dt>
                    <dd className="text-gray-900">{order.city}</dd>

                    <dt className="text-gray-500">Total Harga</dt>
                    <dd className="text-gray-900">{formatRupiah(order.total_price)}</dd>

                    {order.status === 'dibatalkan' && order.cancel_reason && (
                        <>
                            <dt className="text-gray-500">Alasan Batal</dt>
                            <dd className="text-gray-900">{order.cancel_reason}</dd>
                        </>
                    )}
                </dl>

                {nextActions.length > 0 && (
                    <div className="mt-5 border-t border-gray-100 pt-4">
                        {nextActions.includes('dibatalkan') && (
                            <div className="mb-3">
                                <label className="mb-1 block text-xs font-medium text-gray-600">
                                    Alasan pembatalan (wajib diisi kalau membatalkan)
                                </label>
                                <input
                                    type="text"
                                    value={data.cancel_reason}
                                    onChange={(e) => setData('cancel_reason', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500"
                                    placeholder="Contoh: Customer membatalkan sendiri"
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
                                    disabled={processing}
                                    onClick={() => submitStatus(next)}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                                        next === 'dibatalkan'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-brand-teal-700 hover:bg-brand-teal-800'
                                    }`}
                                >
                                    {actionLabel[next]}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}   