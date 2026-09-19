import { Head, Link } from '@inertiajs/react';
import { Lock, KeyRound, ChevronRight, ShieldCheck } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

// --- Konstanta Global untuk Warna ---
// Menggunakan warna hijau khas Titipsini.com untuk konsistensi tema
const BRAND_GREEN_TEXT = 'text-green-700 dark:text-green-400';

// --- Komponen Utama ---
export default function Keamanan() {
    return (
        <CustomerLayout title="Keamanan" backHref="/app/profile">
            <Head title="Keamanan" />

            <div className="flex flex-col gap-6 px-5 py-6 md:px-6 md:py-8">
                <HeaderTitle />
                <MenuList />
            </div>
        </CustomerLayout>
    );
}

// --- Komponen Header Halaman ---
function HeaderTitle() {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-green-50/50 dark:bg-green-950/20 p-5 border border-green-100 dark:border-green-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/80 text-green-600 dark:text-lime-400">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h1 className="text-lg font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
                    Pusat Keamanan
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mt-0.5">
                    Kelola keamanan akun Anda untuk perlindungan yang lebih baik. Ubah kata sandi dan PIN transaksi Anda secara berkala.
                </p>
            </div>
        </div>
    );
}

// --- Daftar Menu Navigasi ---
function MenuList() {
    const menuItems = [
        {
            href: '/app/profile/keamanan/password',
            icon: Lock,
            label: 'Ubah Kata Sandi',
        },
        {
            href: '/app/profile/keamanan/pin',
            icon: KeyRound,
            label: 'Ubah PIN',
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            {menuItems.map((item) => (
                <MenuItem key={item.href} {...item} />
            ))}
        </div>
    );
}

// --- Komponen Item Menu ---
function MenuItem({ href, icon: Icon, label }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 rounded-2xl bg-slate-50 dark:bg-gray-900/60 border border-slate-100 dark:border-gray-800 px-5 py-4 transition hover:bg-green-50/60 dark:hover:bg-green-950/20 active:scale-[0.98]"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                <Icon size={20} className={BRAND_GREEN_TEXT} />
            </div>
            <span className="flex-1 text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {label}
            </span>
            <ChevronRight size={20} className="text-gray-400 dark:text-gray-500 shrink-0" />
        </Link>
    );
}