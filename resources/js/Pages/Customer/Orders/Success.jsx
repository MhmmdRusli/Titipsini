import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Success({ orderId }) {
    return (
        <CustomerLayout>
            <Head title="Pesanan Berhasil" />

            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-teal-700 text-white">
                    <CheckCircle2 size={40} />
                </div>

                <h1 className="mt-5 text-lg font-bold text-gray-900">Pesanan Berhasil Dibuat! 🎉</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Satu langkah lagi! Silakan selesaikan pembayaran kamu.
                </p>

                <div className="mt-8 w-full max-w-xs space-y-3">
                    {/* Mengarahkan ke halaman instruksi / proses pembayaran */}
                    <Link
                        href={`/app/orders/${orderId}/pembayaran`}
                        className="block w-full rounded-xl bg-brand-teal-700 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-teal-800 transition"
                    >
                        Lakukan Pembayaran
                    </Link>
                    
                    <Link
                        href="/app/orders"
                        className="block w-full rounded-xl border border-brand-teal-200 bg-brand-teal-50 py-3 text-sm font-bold text-brand-teal-700 hover:bg-brand-teal-100 transition"
                    >
                        Pesanan Saya
                    </Link>
                </div>
            </div>
        </CustomerLayout>
    );
}