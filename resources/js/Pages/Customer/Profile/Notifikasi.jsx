import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const ITEMS = [
    {
        key: 'notif_push',
        label: 'Push Notification',
        description: 'Terima info terupdate lewat HP kamu',
    },
    {
        key: 'notif_email',
        label: 'Email Notification',
        description: 'Update dikirimkan lewat email kamu',
    },
    {
        key: 'notif_promo',
        label: 'Promo & Voucher',
        description: 'Penawaran menarik & diskon spesial',
    },
];

export default function NotifikasiSettings({ preferences }) {
    const [values, setValues] = useState(preferences);

    function toggle(key) {
        const next = { ...values, [key]: !values[key] };
        setValues(next);
        // Menggunakan preserveScroll dan preserveState untuk pengalaman pengguna yang mulus
        router.patch('/app/profile/notifikasi', next, { preserveScroll: true, preserveState: true });
    }

    return (
        <CustomerLayout title="Notifikasi" backHref="/app/profile">
            <Head title="Notifikasi" />

            {/* Memberikan sedikit ruang di atas container utama */}
            <div className="px-4 py-6">
                {/* Container kartu dengan sudut yang lebih membulat (rounded-2xl) dan shadow lebih lembut */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-100/50 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
                    {ITEMS.map((item, i) => (
                        <div
                            key={item.key}
                            // Sedikit menyesuaikan padding vertikal agar lebih nyaman (py-4)
                            className={`flex items-center justify-between gap-4 px-5 py-4 ${
                                i < ITEMS.length - 1 ? 'border-b border-gray-100 dark:border-gray-800/60' : ''
                            }`}
                        >
                            <div className="pr-3">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{item.label}</p>
                                {/* Deskripsi menggunakan warna teks yang sedikit lebih gelap untuk kontras yang lebih baik */}
                                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => toggle(item.key)}
                                // Warna aktif menggunakan kelas warna Emerald
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${
                                    values[item.key] ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        values[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
                {/* Pesan tambahan opsional */}
                <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-500">
                    Pengaturan ini berlaku untuk semua perangkat Anda.
                </p>
            </div>
        </CustomerLayout>
    );
}