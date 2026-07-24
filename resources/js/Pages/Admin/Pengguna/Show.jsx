import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_STYLE = {
    pendaftar: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    verifikasi_akun: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 dark:border dark:border-amber-800/50',
    terverifikasi: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/50',
    ditolak: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 dark:border dark:border-red-800/50',
};

const STATUS_LABEL = {
    pendaftar: 'Pendaftar',
    verifikasi_akun: 'Verifikasi Akun',
    terverifikasi: 'Terverifikasi',
    ditolak: 'Ditolak',
};

const ORDER_STATUS_STYLE = {
    baru: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 dark:border dark:border-blue-800/50',
    diproses: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 dark:border dark:border-amber-800/50',
    selesai: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/50',
    dibatalkan: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 dark:border dark:border-red-800/50',
};

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

export default function Show({ user }) {
    return (
        <AdminLayout title="Detail Pengguna">
            <Head title={`Detail - ${user.name}`} />

            <Link
                href={route('admin.pengguna.index')}
                className="mb-4 inline-flex items-center text-sm font-medium text-green-700 dark:text-emerald-400 hover:text-green-800 dark:hover:text-emerald-300 transition-colors"
            >
                ← Kembali ke daftar pengguna
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Profile card */}
                <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 lg:col-span-1 shadow-sm transition-colors">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-emerald-950/50 text-2xl font-semibold text-green-700 dark:text-emerald-400 border border-green-100 dark:border-emerald-800/40 overflow-hidden">
                            {user.foto ? (
                                <img src={user.foto} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
                            ) : (
                                user.name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <h2 className="mt-3 text-base font-semibold text-slate-800 dark:text-gray-100">{user.name}</h2>
                        <span
                            className={`mt-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                                STATUS_STYLE[user.verification_status] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                        >
                            {STATUS_LABEL[user.verification_status] ?? user.verification_status}
                        </span>
                    </div>

                    {user.verification_status === 'ditolak' && user.rejection_reason && (
                        <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/40 p-3 text-xs text-red-700 dark:text-red-300">
                            <span className="font-medium">Alasan ditolak: </span>
                            {user.rejection_reason}
                        </div>
                    )}

                    <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-gray-400">Email</dt>
                            <dd className="text-slate-800 dark:text-gray-200 font-medium">{user.email}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-gray-400">No. Telepon</dt>
                            <dd className="text-slate-800 dark:text-gray-200 font-medium">{user.phone ?? '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-gray-400">Jenis Kelamin</dt>
                            <dd className="text-slate-800 dark:text-gray-200 font-medium">{user.gender ?? '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-gray-400">Tanggal Lahir</dt>
                            <dd className="text-slate-800 dark:text-gray-200 font-medium">{formatDate(user.tanggal_lahir)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-gray-400">Terdaftar Sejak</dt>
                            <dd className="text-slate-800 dark:text-gray-200 font-medium">{formatDate(user.created_at)}</dd>
                        </div>
                    </dl>

                    <div className="mt-5 border-t border-slate-100 dark:border-gray-800 pt-4 text-sm">
                        <p className="mb-1 font-medium text-slate-600 dark:text-gray-400">Alamat</p>
                        <p className="text-slate-800 dark:text-gray-200">{user.address ?? '-'}</p>
                        <p className="mt-1 text-slate-500 dark:text-gray-400">
                            {[user.wilayah, user.kecamatan, user.city, user.provinsi].filter(Boolean).join(', ') || '-'}
                        </p>
                    </div>
                </div>

                {/* Order history */}
                <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] lg:col-span-2 shadow-sm overflow-hidden transition-colors">
                    <div className="border-b border-slate-100 dark:border-gray-800 px-6 py-4">
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-gray-100">Riwayat Pesanan</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-gray-900/50 text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400 border-b border-slate-100 dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-3">Kode Pesanan</th>
                                    <th className="px-6 py-3">Layanan</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Tanggal</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                                {(!user.orders_as_customer || user.orders_as_customer.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400 dark:text-gray-500">
                                            Belum ada riwayat pesanan.
                                        </td>
                                    </tr>
                                )}
                                {user.orders_as_customer?.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-800 dark:text-gray-200">{order.order_code}</td>
                                        <td className="px-6 py-3 text-slate-600 dark:text-gray-300 capitalize">{order.service_type}</td>
                                        <td className="px-6 py-3 text-slate-600 dark:text-gray-300">{formatRupiah(order.total_price)}</td>
                                        <td className="px-6 py-3 text-slate-600 dark:text-gray-400">{formatDate(order.created_at)}</td>
                                        <td className="px-6 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                                    ORDER_STATUS_STYLE[order.status] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}