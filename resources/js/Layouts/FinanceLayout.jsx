import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BarChart3, ChevronLeft, CircleDollarSign, LogOut, Menu, Receipt, Wallet, X } from 'lucide-react';
import ProtectedRoute from '@/Components/ProtectedRoute';

const navItems = [
    { label: 'Ringkasan Keuangan', href: '/finance/dashboard', icon: BarChart3 },
    { label: 'Transaksi Masuk', href: '/finance/dashboard?status=semua', icon: Receipt },
    { label: 'Penarikan Dana / Payout', href: '/finance/payouts', icon: Wallet },
];

export default function FinanceLayout({ children }) {
    const { url, props } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = props.auth?.user;

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <ProtectedRoute allowedRoles={['finance', 'super_admin']}>
            <Head title="Finance Portal" />
            <div className="min-h-screen bg-[#f5f7f4] text-slate-800 lg:flex">
                {sidebarOpen && (
                    <button
                        type="button"
                        aria-label="Tutup menu"
                        onClick={closeSidebar}
                        className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
                    />
                )}

                <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col bg-[#123c2b] text-white shadow-xl transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : ''}`}>
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
                        <div>
                            <div className="flex items-center gap-2 text-lg font-bold">
                                <CircleDollarSign className="text-amber-300" size={24} />
                                Titipsini
                            </div>
                            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-emerald-200/70">Finance portal</p>
                        </div>
                        <button type="button" onClick={closeSidebar} className="lg:hidden" aria-label="Tutup sidebar">
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2 px-4 py-6">
                        {navItems.map(({ label, href, icon: Icon }) => {
                            const active = url.startsWith('/finance/dashboard') && href.startsWith('/finance/dashboard')
                                ? url.startsWith('/finance/dashboard')
                                : url.startsWith(href);
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    onClick={closeSidebar}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/20' : 'text-emerald-100/75 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <Icon size={18} />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-white/10 p-4">
                        <div className="mb-4 px-2">
                            <p className="truncate text-sm font-semibold">{user?.name || 'Pengguna Internal'}</p>
                            <p className="mt-1 text-xs capitalize text-emerald-200/70">{user?.role?.replace('_', ' ')}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-200 transition hover:bg-red-500/20 hover:text-white"
                        >
                            <LogOut size={18} />
                            Keluar
                        </button>
                    </div>
                </aside>

                <main className="min-w-0 flex-1">
                    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 lg:px-10">
                        <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Buka menu">
                            <Menu size={21} />
                        </button>
                        <div className="ml-auto flex items-center gap-3 text-right">
                            <div>
                                <p className="text-xs text-slate-500">Selamat datang kembali</p>
                                <p className="text-sm font-semibold text-slate-900">{user?.name || 'Finance Team'}</p>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
                                {(user?.name || 'F').charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </header>
                    <div className="mx-auto max-w-[1440px] px-5 py-7 lg:px-10 lg:py-10">{children}</div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
