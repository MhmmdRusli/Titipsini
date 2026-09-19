import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Package, Bell, User, LayoutGrid, ChevronLeft, CheckCircle2, XCircle, X } from 'lucide-react';

const navItems = [
    { label: 'Beranda', href: '/app/dashboard', icon: LayoutGrid },
    { label: 'Pesanan Saya', href: '/app/orders', icon: Package },
    { label: 'Notifikasi', href: '/app/notifikasi', icon: Bell },
    { label: 'Profil', href: '/app/profile', icon: User },
];

export default function CustomerLayout({ children, title, backHref }) {
    const { url, props } = usePage();
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const isDark = typeof window !== 'undefined' && localStorage.getItem('titipsini_theme') === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    useEffect(() => {
        if (props.flash?.success) {
            setToast({ type: 'success', message: props.flash.success });
        } else if (props.flash?.error) {
            setToast({ type: 'error', message: props.flash.error });
        }
    }, [props.flash?.success, props.flash?.error]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(t);
    }, [toast]);

    return (
        <div className="min-h-dvh bg-gray-200 dark:bg-gray-950 sm:flex sm:items-center sm:justify-center sm:py-6">
            {/* Container HP-style: pada mobile punya scroll sendiri setinggi viewport (100dvh)
                supaya sticky navbar menempel di bawah area scroll, tidak ke viewport body.
                Pada sm: jadi 850px simulator phone dengan scroll sendiri. */}
            <div className="relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900 sm:h-[850px] sm:shadow-xl">
                
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
                            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">{title}</h1>
                        ) : (
                            // Tanpa title (mis. Dashboard) tetap tampilkan logo seperti semula.
                            <Link href="/app/dashboard" className="flex items-center gap-1.5">
                                <img
                                    src="/images/logo-titipsini.png"
                                    alt="Logo"
                                    className="h-6 w-auto object-contain"
                                />
                                <span className="text-base font-bold tracking-tight text-green-700 dark:text-green-400">
                                    Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                                </span>
                            </Link>
                        )}
                    </div>
                </header>

                <main className="flex-1 pb-20">
                    {children}
                </main>

                                <nav
                    className="sticky bottom-0 z-30 flex w-full justify-around border-t border-gray-200 bg-white/95 py-2 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95"
                    style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
                >
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = url.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-0.5 px-2 text-[11px] ${
                                    active ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                <Icon size={20} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {toast && (
                    <div className="pointer-events-none absolute inset-x-0 top-3 z-[60] flex justify-center px-4">
                        <div
                            role="status"
                            className={`pointer-events-auto flex w-full max-w-[400px] items-start gap-2 rounded-xl border px-3.5 py-3 shadow-lg ${
                                toast.type === 'success'
                                    ? 'border-green-200 bg-green-50 dark:border-green-900/60 dark:bg-green-950/80'
                                    : 'border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/80'
                            }`}
                        >
                            {toast.type === 'success' ? (
                                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
                            ) : (
                                <XCircle size={18} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                            )}
                            <p
                                className={`flex-1 text-sm ${
                                    toast.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-700 dark:text-red-200'
                                }`}
                            >
                                {toast.message}
                            </p>
                            <button
                                type="button"
                                onClick={() => setToast(null)}
                                className={toast.type === 'success' ? 'text-green-500' : 'text-red-400'}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}