import { Head } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function SyaratKetentuan() {
    return (
        <CustomerLayout title="Syarat & Ketentuan" backHref="/app/profile/tentang">
            <Head title="Syarat & Ketentuan" />

            <div className="px-4 py-4">
                {/*
                    PLACEHOLDER: isi resmi Syarat & Ketentuan Titipsini belum ada.
                    Ganti paragraf di bawah ini dengan teks legal yang sudah
                    disusun/ditinjau tim kamu (idealnya oleh yang berkompeten
                    secara hukum) sebelum dipakai di production.
                */}
                <p className="text-xs leading-relaxed text-gray-500">
                    Konten Syarat & Ketentuan belum tersedia. Silakan lengkapi halaman ini dengan
                    ketentuan resmi penggunaan layanan Titipsini sebelum dipublikasikan.
                </p>
            </div>
        </CustomerLayout>
    );
}