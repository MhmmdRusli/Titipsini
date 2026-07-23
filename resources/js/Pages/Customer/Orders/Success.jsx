import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Success({ orderId }) {
    return (
        <CustomerLayout>
            <Head title="Pesanan Berhasil" />

            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#15803d] dark:bg-[#4ade80] text-white shadow-md">
                    <CheckCircle2 size={40} />
                </div>

                <h1 className="mt-5 text-lg font-bold text-gray-900 dark:text-gray-100">Pesanan Berhasil Dibuat! 🎉</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Satu langkah lagi! Silakan selesaikan pembayaran kamu.
                </p>

                <div className="mt-8 w-full max-w-xs space-y-3">
                    {/* Tombol Utama Pembayaran */}
                    <Link
                        href={`/app/orders/${orderId}/pembayaran`}
                        className="block w-full rounded-xl bg-[#15803d] hover:bg-[#166534] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] py-3 text-sm font-bold text-white shadow-sm transition"
                    >
                        Lakukan Pembayaran
                    </Link>
                    
                    {/* Tombol Sekunder Pesanan Saya */}
                    <Link
                        href="/app/orders"
                        className="block w-full rounded-xl border border-green-200 bg-green-50 py-3 text-sm font-bold text-[#15803d] hover:bg-green-100 dark:border-green-900/50 dark:bg-green-950/40 dark:text-[#4ade80] dark:hover:bg-green-900/50 transition"
                    >
                        Pesanan Saya
                    </Link>
                </div>
            </div>
        </CustomerLayout>
    );
}