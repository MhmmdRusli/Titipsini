import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
            <Head title="Titipsini" />
            <span className="font-mono text-xs tracking-widest text-brand-teal-700">TITIPSINI.COM</span>
            <h1 className="mt-3 max-w-xl text-3xl font-bold text-gray-900">
                Titip Barang, Kendaraan, dan Properti. Aman & Terjangkau.
            </h1>
            <p className="mt-3 max-w-md text-gray-600">
                Kini juga tersedia layanan pindahan rumah, apartemen, dan kos.
            </p>
            <Link
                href="/login"
                className="mt-6 rounded-lg bg-brand-teal-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-teal-600"
            >
                Masuk / Daftar
            </Link>
        </div>
    );
}
