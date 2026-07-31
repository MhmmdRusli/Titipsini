import { useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Package, Bell, User, LayoutGrid, ChevronLeft } from 'lucide-react';

const navItems = [
    { label: 'Beranda', href: '/app/dashboard', icon: LayoutGrid },
    { label: 'Pesanan Saya', href: '/app/orders', icon: Package },
    { label: 'Notifikasi', href: '/app/notifikasi', icon: Bell },
    { label: 'Profil', href: '/app/profile', icon: User },
];

export default function CustomerLayout({ children, title, backHref }) {
    const { url } = usePage();

    useEffect(() => {
        const isDark = typeof window !== 'undefined' && localStorage.getItem('titipsini_theme') === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    return (
        <div className="min-h-dvh bg-gray-200 dark:bg-gray-950 sm:flex sm:items-center sm:justify-center sm:py-6">
            {/* Ubah overflow-y-auto menjadi overflow-x-hidden / overflow-visible agar popup tidak terpotong container */}
            <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-x-hidden bg-gray-50 dark:bg-gray-900 sm:h-[850px] sm:overflow-y-auto sm:shadow-xl">
                
                {/* Naikkan z-index header menjadi z-40 agar selalu di atas konten */}
                <header className="sticky top-0 z-40 shrink-0 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
                    <div
                        className="flex items-center gap-3 px-4 pb-3"
                        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
                    >
                        {backHref ? (
                            <>
                                <Link href={backHref} className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                    <ChevronLeft size={22} />
                                </Link>
                                <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                            </>
                        ) : title ? (
                            // Halaman dengan title (mis. "Pesanan Saya") tampilkan
                            // title itu di header, GANTIKAN logo - konsisten dengan
                            // halaman lain, dan tidak perlu heading duplikat lagi
                            // di bawah header (lihat <main> di bawah).
                            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                        ) : (
                            // Tanpa title (mis. Dashboard) tetap tampilkan logo seperti semula.
                            <Link href="/app/dashboard" className="flex items-center gap-1.5">
                                <img
                                    src="/images/logo-titipsini.png"
                                    alt="Logo"
                                    className="h-6 w-auto object-contain"
                                />
                                <span className="text-base font-bold tracking-tight text-[#15803d] dark:text-[#4ade80]">
                                    Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                                </span>
                            </Link>
                        )}
                    </div>
                </header>

                <main className="flex-1 pb-20 relative z-0">
                    {children}
                </main>

                <nav
                    className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 flex w-full max-w-[430px] justify-around border-t border-gray-200 bg-white/95 py-2 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95"
                    style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
                >
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = url.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-0.5 px-2 text-[11px] ${
                                    active ? 'text-[#15803d] dark:text-[#4ade80]' : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                <Icon size={20} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}