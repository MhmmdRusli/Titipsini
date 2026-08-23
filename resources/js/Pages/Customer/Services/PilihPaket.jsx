import { Head, Link } from '@inertiajs/react';
import { PackagePlus, ChevronRight, Boxes } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function PilihPaket({ serviceId }) {
    return (
        <CustomerLayout title="Pilih Paket" backHref="/app/dashboard">
            <Head title="Pilih Paket" />

            <div className="flex flex-col items-center px-6 py-8 text-center">
                {/* Logo / wordmark ala Titipsini.com */}
                <div className="flex items-center gap-1.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#15803d] text-white dark:bg-[#22c55e]">
                        <Boxes size={14} />
                    </span>
                    <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
                        Titipsini<span className="text-[#15803d] dark:text-[#4ade80]">•</span>Com
                    </p>
                </div>
                <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                    Tempat Yang Aman Untuk Barang Berharga Kamu
                </p>

                {/* Ilustrasi sederhana */}
                <div className="relative mt-8 flex h-40 w-40 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30">
                    <Boxes size={72} strokeWidth={1.3} className="text-[#15803d] dark:text-[#4ade80]" />
                </div>

                <h1 className="mt-6 text-lg font-bold text-gray-900 dark:text-gray-100">Pilih Paket</h1>
                <p className="mt-1.5 max-w-xs text-sm text-gray-400 dark:text-gray-500">
                    Titipkan barang berhargamu ke mitra terpercaya dengan keamanan terjamin.
                </p>

                {/* CTA utama ala tombol "Fitur Pencarian" di landing */}
                <Link
                    href={`/app/services/barang?service_id=${serviceId ?? ''}`}
                    className="mt-8 flex w-full items-center gap-3 rounded-2xl bg-[#15803d] p-4 text-left text-white shadow-md transition hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600"
                >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                        <PackagePlus size={20} />
                    </span>
                    <span className="flex-1">
                        <span className="block text-sm font-bold">Pilih Barang</span>
                        <span className="mt-0.5 block text-xs text-white/80">
                            Kamu bisa titip barang apa aja di sini
                        </span>
                    </span>
                    <ChevronRight size={18} className="text-white/70" />
                </Link>
            </div>
        </CustomerLayout>
    );
}