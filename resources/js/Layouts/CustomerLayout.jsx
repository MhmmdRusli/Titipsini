import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Package, Bell, User, LayoutGrid, LogOut, ChevronDown, ChevronLeft } from 'lucide-react';

const navItems = [
    { label: 'Beranda', href: '/app/dashboard', icon: LayoutGrid },
    { label: 'Pesanan Saya', href: '/app/orders', icon: Package },
    { label: 'Notifikasi', href: '/app/notifikasi', icon: Bell },
    { label: 'Profil', href: '/app/profile', icon: User },
];

export default function CustomerLayout({ children, title, backHref }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const isDark = typeof window !== 'undefined' && localStorage.getItem('titipsini_theme') === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    return (
        <div className="min-h-dvh bg-gray-200 dark:bg-gray-950 sm:flex sm:items-center sm:justify-center sm:py-6">
            <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 sm:h-[850px] sm:shadow-xl">
                <header className="sticky top-0 z-20 shrink-0 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
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
                        ) : (
                            <div className="flex flex-1 items-center justify-between">
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

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setMenuOpen((v) => !v)}
                                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-brand-amber-50 text-brand-amber-700 flex items-center justify-center text-xs font-semibold">
                                                {(user?.name ?? 'P').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {menuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                            <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                                <Link
                                                    href="/app/profile"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <User size={15} />
                                                    Profil Saya
                                                </Link>
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                                                >
                                                    <LogOut size={15} />
                                                    Keluar
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Diubah menjadi pb-20 agar jarak bawah konten langsung pas di atas navbar */}
                <main className="flex-1 pb-20">
                    {!backHref && title && (
                        <div className="px-4 pt-4">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
                        </div>
                    )}
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