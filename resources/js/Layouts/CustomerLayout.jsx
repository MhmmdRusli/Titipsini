import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Package, Bell, User, LayoutGrid, LogOut, ChevronDown } from 'lucide-react';

const navItems = [
    { label: 'Beranda', href: '/app/dashboard', icon: LayoutGrid },
    { label: 'Pesanan Saya', href: '/app/orders', icon: Package },
    { label: 'Notifikasi', href: '/app/notifications', icon: Bell },
    { label: 'Profil', href: '/app/profile', icon: User },
];

export default function CustomerLayout({ children, title }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                    <Link href="/app/dashboard" className="flex items-center gap-2">
                        <span className="font-mono text-xs tracking-widest text-brand-teal-700">TITIPSINI</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map(({ label, href, icon: Icon }) => {
                            const active = url.startsWith(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-brand-teal-50 text-brand-teal-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                        >
                            <span className="hidden sm:inline">{user?.name ?? 'Pelanggan'}</span>
                            <div className="h-8 w-8 rounded-full bg-brand-amber-50 text-brand-amber-700 flex items-center justify-center text-xs font-semibold">
                                {(user?.name ?? 'P').charAt(0).toUpperCase()}
                            </div>
                            <ChevronDown size={14} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                    <Link
                                        href="/app/profile"
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

            <main className="mx-auto max-w-6xl px-6 py-6">
                {title && <h1 className="mb-4 text-xl font-semibold text-gray-900">{title}</h1>}
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t border-gray-200 bg-white py-2 md:hidden">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const active = url.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-0.5 px-2 text-[11px] ${
                                active ? 'text-brand-teal-700' : 'text-gray-500'
                            }`}
                        >
                            <Icon size={20} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}