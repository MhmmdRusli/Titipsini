import { Head, Link } from '@inertiajs/react';
import { MapPin, Clock } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

/**
 * Props expected from ServiceController@showBarangMitra:
 * service: {
 *   id, nama, kota, kecamatan, alamatLengkap,
 *   jamBuka, jamTutup, isBuka, harga
 * }
 */
export default function DetailMitra({ service }) {
    return (
        <CustomerLayout title="Detail Mitra" backHref="/app/services?kategori=barang&browse=1">
            <Head title="Detail Mitra" />

            <div className="px-4 py-4">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start justify-between">
                        <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">{service.nama}</h1>
                        <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                service.isBuka
                                    ? 'bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-[#4ade80]'
                                    : 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400'
                            }`}
                        >
                            {service.isBuka ? 'Buka' : 'Tutup'}
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="flex items-start gap-3 text-sm">
                            <Clock size={16} className="mt-0.5 shrink-0 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Buka</p>
                                <p className="text-gray-800 dark:text-gray-200">
                                    {service.jamBuka && service.jamTutup
                                        ? `${service.jamBuka} - ${service.jamTutup}`
                                        : 'Tidak tersedia'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-sm">
                            <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Alamat Lengkap</p>
                                <p className="text-gray-800 dark:text-gray-200">{service.alamatLengkap}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    href={`/app/services/barang/paket-pilihan?service_id=${service.id}`}
                    className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-bold text-white ${
                        service.isBuka
                            ? 'bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600'
                            : 'pointer-events-none bg-gray-300 dark:bg-gray-700'
                    }`}
                >
                    Titip Disini
                </Link>
                {!service.isBuka && (
                    <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
                        Mitra sedang tutup, coba lagi saat jam operasional.
                    </p>
                )}
            </div>
        </CustomerLayout>
    );
}