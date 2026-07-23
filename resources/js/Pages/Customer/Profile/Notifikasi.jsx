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
        router.patch('/app/profile/notifikasi', next, { preserveScroll: true, preserveState: true });
    }

    return (
        <CustomerLayout title="Notifikasi" backHref="/app/profile">
            <Head title="Notifikasi" />

            <div className="px-4 py-3">
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    {ITEMS.map((item, i) => (
                        <div
                            key={item.key}
                            className={`flex items-center justify-between px-4 py-3.5 ${
                                i < ITEMS.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/60' : ''
                            }`}
                        >
                            <div className="pr-3">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.label}</p>
                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => toggle(item.key)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                    values[item.key] ? 'bg-[#15803d] dark:bg-[#22c55e]' : 'bg-gray-300 dark:bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                                        values[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}