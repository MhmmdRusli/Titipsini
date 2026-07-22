import { Head, Link } from '@inertiajs/react';
import { Package, PackagePlus, Warehouse, ChevronRight, ShieldCheck } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const BENEFITS = [
    'Keamanan terjaga 24 jam',
    'Pengecekan barang berkala',
    'Bisa diambil kapan saja',
    'Asuransi kerusakan & kehilangan',
    'Konsultasi & Support',
];

export default function PilihPaket({ hargaMulai = 100000, serviceId }) {
    const formattedHarga = new Intl.NumberFormat('id-ID').format(hargaMulai);

    return (
        <CustomerLayout title="Pilih Paket" backHref="/app/dashboard">
            <Head title="Pilih Paket" />

            <div className="px-4 py-3">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-900 p-5 text-white shadow-md">
                    <div className="absolute right-4 top-4 rounded-xl bg-white/15 p-2">
                        <Package size={20} />
                    </div>

                    <p className="text-2xl font-extrabold leading-none">
                        {formattedHarga}
                        <span className="ml-1 text-sm font-semibold align-middle">(1 item)</span>
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/90">Layanan Terbaik Kami</p>

                    <ul className="mt-4 space-y-1.5">
                        {BENEFITS.map((benefit) => (
                            <li key={benefit} className="flex items-center gap-2 text-xs text-white/90">
                                <ShieldCheck size={14} className="shrink-0 text-white" />
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <Package size={96} className="pointer-events-none absolute -bottom-4 -right-4 text-white/15" />
                </div>

                <div className="mt-4 space-y-3">
                    <Link
                        href={`/app/services/barang?service_id=${serviceId ?? ''}`}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-600"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <PackagePlus size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pilih barang</p>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Kamu bisa titip barang apa aja di sini</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
                    </Link>

                    <Link
                        href="/app/services/barang"
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-green-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-600"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <Warehouse size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pilih paket</p>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Paket buat nitip barang sak kosanmu</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
                    </Link>
                </div>
            </div>
        </CustomerLayout>
    );
}