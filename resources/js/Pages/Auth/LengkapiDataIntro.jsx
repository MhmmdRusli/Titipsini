import { Head, Link } from '@inertiajs/react';
import { ClipboardCheck } from 'lucide-react';

export default function LengkapiDataIntro() {
    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-between bg-white px-8 py-12 text-center">
            <Head title="Lengkapi Data Diri" />

            <div />

            <div className="flex flex-col items-center">
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-brand-teal-50">
                    <ClipboardCheck size={64} strokeWidth={1.25} className="text-brand-teal-600" />
                </div>
                <h1 className="mt-8 text-xl font-semibold text-gray-900">
                    Lengkapi Data Diri Kamu Sekarang!
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Lengkapi data diri kamu untuk layanan yang aman, terpercaya, dan bermanfaat bagi
                    para pemilik Titipsini.com
                </p>
            </div>

            <Link
                href={route('customer.lengkapi-data.form')}
                className="w-full rounded-xl bg-brand-teal-700 py-3 text-center text-sm font-semibold text-white"
            >
                Lengkapi Data Diri Sekarang
            </Link>
        </div>
    );
}