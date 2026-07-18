import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const cards = [
        { label: 'Total Pesanan', value: stats?.totalOrders ?? 0 },
        { label: 'Pesanan Aktif', value: stats?.activeOrders ?? 0 },
        { label: 'Mitra Terverifikasi', value: stats?.verifiedPartners ?? 0 },
        { label: 'Pendapatan Bulan Ini', value: stats?.monthlyRevenue ?? 'Rp 0' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((c) => (
                    <div key={c.label} className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="text-sm text-gray-500">{c.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">{c.value}</p>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
