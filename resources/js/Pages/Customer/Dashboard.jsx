import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ activeOrder }) {
    return (
        <CustomerLayout title="Beranda">
            <Head title="Beranda" />

            {activeOrder ? (
                <div className="rounded-xl border border-brand-teal-200 bg-brand-teal-50 p-5">
                    <p className="text-sm font-medium text-brand-teal-700">Pesanan Berlangsung</p>
                    <p className="mt-1 text-gray-800">{activeOrder.serviceName} - {activeOrder.status}</p>
                    <Link href={`/app/orders/${activeOrder.id}`} className="mt-3 inline-block text-sm font-medium text-brand-teal-700 underline">
                        Lihat Detail
                    </Link>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                    Belum ada pesanan aktif.
                </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {['Penitipan Barang', 'Penitipan Kendaraan', 'Penitipan Properti', 'Layanan Pindahan'].map((s) => (
                    <Link
                        key={s}
                        href="/app/services"
                        className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm font-medium text-gray-700 hover:border-brand-teal-400 hover:text-brand-teal-700"
                    >
                        {s}
                    </Link>
                ))}
            </div>
        </CustomerLayout>
    );
}
