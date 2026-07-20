import { Head, Link } from '@inertiajs/react';
import { BadgeCheck } from 'lucide-react';

export default function RegisterSuccess({ name }) {
    return (
        <div className="min-h-dvh bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Akun Terverifikasi" />

            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col items-center justify-center bg-white px-8 text-center sm:h-[850px] sm:shadow-xl">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <BadgeCheck size={40} />
                </div>
                <h1 className="mt-6 text-xl font-bold text-gray-900">Akun Kamu Sudah Aktif!</h1>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Selamat datang{name ? `, ${name}` : ''}. Akun mitra kamu sudah terverifikasi penuh dan siap digunakan.
                </p>

                <Link
                    href={route('mitra.login')}
                    className="mt-8 w-full rounded-full bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                    Masuk ke Akun
                </Link>
            </div>
        </div>
    );
}