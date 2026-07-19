import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Package, Bell, User, LayoutGrid, LogOut, ChevronDown } from 'lucide-react';

const navItems = [
    { label: 'Home', href: '/app/dashboard', icon: LayoutGrid },
    { label: 'Order', href: '/app/orders', icon: Package },
    { label: 'Notifikasi', href: '/app/notifications', icon: Bell },
    { label: 'Profile', href: '/app/profile', icon: User },
];

export default function CustomerLayout({ children, title }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-dvh bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-6">
            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-white sm:h-[850px] sm:shadow-xl">
                
                {/* Header (Hanya muncul jika bukan halaman utama atau jika ingin logo tetap di atas) */}
                <header className="z-10 shrink-0 bg-white px-4 pt-3 pb-1">
                    <div
                        className="flex items-center justify-between"
                        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
                    >
                        {/* Judul Halaman dinamis / Nama Aplikasi */}
                        <Link href="/app/dashboard" className="flex items-center gap-1">
                            <span className="font-bold text-base tracking-tight text-green-600">Titipsini</span>
                            <span className="font-bold text-base tracking-tight text-yellow-500">•</span>
                            <span className="font-bold text-base tracking-tight text-gray-900">Com</span>
                        </Link>

                        {/* Dropdown Menu User */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex items-center gap-1 rounded-full p-1 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-semibold overflow-hidden">
                                    {user?.foto ? (
                                        <img src={user.foto} alt="User" className="h-full w-full object-cover" />
                                    ) : (
                                        (user?.name ?? 'P').charAt(0).toUpperCase()
                                    )}
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

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto pb-24">
                    {children}
                </main>

                {/* Bottom Navigation Bar (Persis seperti di Mockup Home) */}
                <nav
                    className="absolute inset-x-0 bottom-0 z-10 flex justify-around border-t border-gray-100 bg-white py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
                    style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
                >
                    {navItems.map(({ label, href, icon: Icon }) => {
                        // Cek keaktifan menu nav
                        const active = url.startsWith(href) || (href === '/app/dashboard' && url === '/app');
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-0.5 px-2 text-[10px] font-medium transition-colors ${
                                    active ? 'text-green-600' : 'text-gray-400'
                                }`}
                            >
                                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}