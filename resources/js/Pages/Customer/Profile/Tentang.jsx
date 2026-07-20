import { Head } from '@inertiajs/react';
import { PackageCheck, FileText, ShieldCheck, ChevronRight } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Tentang({ version }) {
    return (
        <CustomerLayout title="Tentang Aplikasi" backHref="/app/profile">
            <Head title="Tentang Aplikasi" />

            <div className="px-4 py-6">
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white">
                        <PackageCheck size={28} />
                    </div>
                    <h2 className="mt-3 text-base font-bold text-gray-900">Titipsini.Com</h2>
                    <p className="text-xs text-gray-400">Versi {version}</p>

                    <p className="mt-4 text-xs leading-relaxed text-gray-500">
                        Titipsini adalah platform layanan penitipan barang, kendaraan, dan properti yang
                        dirancang untuk memberikan kemudahan, keamanan, serta harga yang terjangkau bagi
                        masyarakat, dilengkapi juga dengan layanan pindahan rumah, apartemen, hingga kos.
                    </p>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <a
                        href="/app/profile/tentang/syarat-ketentuan"
                        className="flex items-center justify-between border-b border-gray-50 px-4 py-3"
                    >
                        <span className="flex items-center gap-3 text-sm text-gray-700">
                            <FileText size={17} className="text-gray-500" />
                            Syarat & Ketentuan
                        </span>
                        <ChevronRight size={16} className="text-gray-300" />
                    </a>
                    <a
                        href="/app/profile/tentang/kebijakan-privasi"
                        className="flex items-center justify-between px-4 py-3"
                    >
                        <span className="flex items-center gap-3 text-sm text-gray-700">
                            <ShieldCheck size={17} className="text-gray-500" />
                            Kebijakan Privasi
                        </span>
                        <ChevronRight size={16} className="text-gray-300" />
                    </a>
                </div>
            </div>
        </CustomerLayout>
    );
}   