import { Head } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function KebijakanPrivasi() {
    return (
        <CustomerLayout title="Kebijakan Privasi" backHref="/app/profile/tentang">
            <Head title="Kebijakan Privasi" />

            <div className="px-4 py-4">
                {/*
                    PLACEHOLDER: isi resmi Kebijakan Privasi Titipsini belum ada.
                    Ganti paragraf di bawah ini dengan kebijakan privasi resmi
                    (idealnya ditinjau tim/berkompeten secara hukum) sebelum
                    dipakai di production.
                */}
                <p className="text-xs leading-relaxed text-gray-500">
                    Konten Kebijakan Privasi belum tersedia. Silakan lengkapi halaman ini dengan
                    kebijakan privasi resmi Titipsini sebelum dipublikasikan.
                </p>
            </div>
        </CustomerLayout>
    );
}