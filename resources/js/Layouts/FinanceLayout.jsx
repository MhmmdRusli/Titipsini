import { useEffect, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Clock, LayoutDashboard, LogOut, Receipt, Wallet, Sun, Moon, X, Menu, Calendar, Undo2, QrCode, ClipboardList } from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/finance/dashboard', icon: LayoutDashboard },
    { label: 'Top Up', href: '/finance/topup', icon: Wallet },
    { label: 'Penarikan', href: '/finance/penarikan', icon: Wallet },
    { label: 'Pengembalian Dana', href: '/finance/pengembalian-dana', icon: Undo2 },
    { label: 'Pendapatan', href: '/finance/pendapatan', icon: Receipt },
    { label: 'Verifikasi Pembayaran', href: '/finance/orders', icon: ClipboardList },
    { label: 'Kelola QRIS', href: '/finance/qris', icon: QrCode },
];

const WEATHER_LAT = -7.7956;
const WEATHER_LON = 110.3695;

function weatherFromCode(code) {
    if (code === 0) return { label: 'Cerah', Icon: Sun };
    if ([1, 2, 3].includes(code)) return { label: 'Berawan', Icon: Sun };
    if ([45, 48].includes(code)) return { label: 'Berkabut', Icon: Sun };
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Hujan', Icon: Sun };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Bersalju', Icon: Sun };
    if ([95, 96, 99].includes(code)) return { label: 'Badai Petir', Icon: Sun };
    return { label: 'Cerah Berawan', Icon: Sun };
}

function useJamTanggal() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const tanggal = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return { jam, tanggal };
}

export default function FinanceLayout({ children, title }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const { jam, tanggal } = useJamTanggal();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    const [openMenu, setOpenMenu] = useState(() => {
        const active = navItems.find(
            (item) => item.children && item.children.some((c) => url.startsWith(c.href))
        );
        return active?.label ?? null;
    });

    const handleLogout = () => {
        setIsLoggingOut(true);
        router.post('/logout', {}, {
            onFinish: () => {
                setIsLoggingOut(false);
                setShowLogoutModal(false);
            },
        });
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-100 overflow-hidden transition-colors duration-300">
            <style>{`
                .dark main .bg-white {
                    background-color: #111827 !important;
                    color: #f3f4f6 !important;
                    border-color: #1f2937 !important;
                }
                .dark main .text-gray-900,
                .dark main .text-gray-800,
                .dark main .text-gray-700 {
                    color: #f3f4f6 !important;
                }
                .dark main .text-slate-950,
                .dark main .text-slate-900,
                .dark main .text-slate-800 {
                    color: #f3f4f6 !important;
                }
                .dark main .text-slate-500,
                .dark main .text-slate-600 {
                    color: #9ca3af !important;
                }
                .dark main .border-slate-200,
                .dark main .border-slate-100 {
                    border-color: #1f2937 !important;
                }
                .dark main input,
                .dark main select,
                .dark main textarea {
                    background-color: #1f2937 !important;
                    color: #ffffff !important;
                    border-color: #374151 !important;
                }
            `}</style>

            {sidebarOpen && (
                <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col bg-[#0d5235] dark:bg-[#093221] text-gray-100 border-r border-[#0a422a] dark:border-gray-800 shadow-md transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : ''}`}>
                <div className="px-5 py-6 border-b border-white/10 flex flex-col items-center text-center shrink-0">
                    <img
                        src="/images/admin-titipsini.png"
                        alt="Logo"
                        className="h-20 w-auto object-contain mb-2 drop-shadow-sm"
                    />
                    <span className="text-base font-bold tracking-tight text-white">
                        Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                    </span>
                    <span className="text-[11px] text-emerald-200/80 font-medium mt-0.5">
                        Finance portal
                    </span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = url.startsWith(href);
                        const hasChildren = false;

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                                    active
                                        ? 'bg-[#15803d] text-white shadow-sm font-semibold'
                                        : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <Icon size={16} className={active ? 'text-[#fbbf24]' : 'text-emerald-200/70'} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-white/10 p-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-red-400 border border-red-500/40 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                    >
                        <LogOut size={16} />
                        Keluar
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden relative">
                <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800/80 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md px-6 py-4 shadow-sm shrink-0 sticky top-0 z-30 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                            aria-label="Buka menu"
                        >
                            <Menu size={21} />
                        </button>
                        <div>
                            <h1 className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white">{title}</h1>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={13} className="text-emerald-600 dark:text-emerald-400" />
                                    {tanggal}
                                </span>
                                <span className="flex items-center gap-1.5 tabular-nums">
                                    <Clock size={13} className="text-emerald-600 dark:text-emerald-400" />
                                    {jam}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-amber-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
                            title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

                        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                            <span className="text-xs font-semibold">{user?.name ?? 'Finance'}</span>
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                                />
                            ) : (
                                <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold border border-emerald-300/40 dark:border-emerald-800">
                                    {(user?.name ?? 'F').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 relative z-10 transition-colors">{children}</main>
            </div>

            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                                    <X size={22} />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                    Konfirmasi Keluar
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                            Apakah kamu yakin ingin keluar dari halaman finance dashboard?
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={() => setShowLogoutModal(false)}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={handleLogout}
                                className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-60"
                            >
                                {isLoggingOut ? 'Memproses...' : 'Ya, Keluar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
