import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Package, Bell, User, LogOut, ChevronDown } from 'lucide-react';

const navItems = [
    { label: 'Beranda', href: '/mitra/dashboard', icon: LayoutGrid },
    { label: 'Pesanan', href: '/mitra/pesanan', icon: Package },
    { label: 'Notifikasi', href: '/mitra/notifikasi', icon: Bell },
    { label: 'Profil', href: '/mitra/profil', icon: User },
];

export default function MitraLayout({ children, title }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-dvh bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-6">
            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-gray-50 sm:h-[850px] sm:shadow-xl">
                <header className="z-10 shrink-0 border-b border-gray-200 bg-white">
                    <div
                        className="flex items-center justify-between px-4 pb-3"
                        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
                    >
                        <Link href="/mitra/dashboard" className="flex items-center gap-2">
                            <span className="font-mono text-xs tracking-widest text-green-600">TITIPSINI &middot; MITRA</span>
                        </Link>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                <div className="h-8 w-8 rounded-full bg-brand-amber-50 text-brand-amber-700 flex items-center justify-center text-xs font-semibold">
                                    {(user?.name ?? 'M').charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown size={14} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {menuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                    <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                        <Link
                                            href="/mitra/profil"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <User size={15} />
                                            Profil Saya
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={15} />
                                            Keluar
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto pb-20">
                    {title && (
                        <div className="px-4 pt-4">
                            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                        </div>
                    )}
                    {children}
                </main>

                <nav
                    className="absolute inset-x-0 bottom-0 z-10 flex justify-around border-t border-gray-200 bg-white py-2"
                    style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
                >
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = url.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-0.5 px-2 text-[11px] ${
                                    active ? 'text-green-600' : 'text-gray-500'
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