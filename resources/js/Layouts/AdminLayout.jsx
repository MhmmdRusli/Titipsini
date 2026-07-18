import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, Handshake, Package, Wallet,
    Megaphone, MessageSquareWarning, BarChart3, LogOut,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Pengguna', href: '/admin/pengguna', icon: Users },
    { label: 'Mitra', href: '/admin/partners', icon: Handshake },
    { label: 'Pesanan', href: '/admin/orders', icon: Package },
    { label: 'Pembayaran', href: '/admin/payments', icon: Wallet },
    { label: 'Promo & Konten', href: '/admin/promotions', icon: Megaphone },
    { label: 'Komplain', href: '/admin/complaints', icon: MessageSquareWarning },
    { label: 'Laporan', href: '/admin/reports', icon: BarChart3 },
];

export default function AdminLayout({ children, title }) {
    const { url, props } = usePage();
    const user = props.auth?.user;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 shrink-0 bg-brand-navy-900 text-gray-200 flex flex-col">
                <div className="px-5 py-5 border-b border-white/10">
                    <span className="font-mono text-xs tracking-widest text-brand-teal-400">TITIPSINI</span>
                    <p className="text-sm font-semibold text-white">Admin Panel</p>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = url.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                                    active
                                        ? 'bg-brand-teal-700 text-white'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-white/10 px-3 py-4">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                        <LogOut size={18} />
                        Keluar
                    </Link>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                    <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{user?.name ?? 'Admin'}</span>
                        <div className="h-8 w-8 rounded-full bg-brand-teal-100 text-brand-teal-700 flex items-center justify-center text-xs font-semibold">
                            {(user?.name ?? 'A').charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}