import { useEffect, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    MapPin, LayoutDashboard, CircleUserRound, Users, Handshake,
    Package, BarChart3, Settings, LogOut, ChevronDown, Newspaper,
    HelpCircle, Clock, Calendar, Sun, Cloud, CloudRain, CloudFog, CloudLightning,
    CloudSnow, Moon, AlertCircle, X, ShieldCheck
} from 'lucide-react';

const navItems = [
    { label: 'Kota', href: '/admin/kota', icon: MapPin },
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Profil', href: '/admin/profil', icon: CircleUserRound },
    { label: 'Customer', href: '/admin/pengguna', icon: Users },
    { label: 'Vendor', href: '/admin/partners', icon: Handshake },
    { label: 'Validasi Laporan', href: '/admin/laporan-validasi', icon: ShieldCheck },
    { label: 'Berita', href: '/admin/berita', icon: Newspaper },
    { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
    {
        label: 'Pesanan',
        href: '/admin/orders',
        icon: Package,
        children: [
            { label: 'Barang', href: '/admin/orders?service_type=barang' },
            { label: 'Kendaraan', href: '/admin/orders?service_type=kendaraan' },
            { label: 'Bangunan', href: '/admin/orders?service_type=bangunan' },
            { label: 'Pick Up', href: '/admin/orders?is_pickup=1' },
        ],
    },
    { label: 'Laporan', href: '/admin/reports', icon: BarChart3 },
    {
        label: 'Pengaturan',
        href: '/admin/pengaturan',
        icon: Settings,
        children: [
            { label: 'Keamanan', href: '/admin/pengaturan/keamanan' },
        ],
    },
];

const WEATHER_LAT = -7.7956;
const WEATHER_LON = 110.3695;

function weatherFromCode(code) {
    if (code === 0) return { label: 'Cerah', Icon: Sun };
    if ([1, 2, 3].includes(code)) return { label: 'Berawan', Icon: Cloud };
    if ([45, 48].includes(code)) return { label: 'Berkabut', Icon: CloudFog };
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Hujan', Icon: CloudRain };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Bersalju', Icon: CloudSnow };
    if ([95, 96, 99].includes(code)) return { label: 'Badai Petir', Icon: CloudLightning };
    return { label: 'Cerah Berawan', Icon: Cloud };
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

function useCuaca(propsCuaca) {
    const [cuaca, setCuaca] = useState(null);

    useEffect(() => {
        if (propsCuaca) {
            setCuaca({
                label: propsCuaca.kondisi || 'Cerah',
                suhu: propsCuaca.suhu || '30°C',
                Icon: Cloud,
            });
            return;
        }

        // Fungsi fetch data cuaca berdasarkan koordinat
        const fetchWeather = (lat, lon) => {
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                .then((res) => res.json())
                .then((data) => {
                    if (data?.current_weather) {
                        setCuaca({
                            suhu: `${Math.round(data.current_weather.temperature)}°C`,
                            ...weatherFromCode(data.current_weather.weathercode),
                        });
                    }
                })
                .catch(() => {});
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                () => fetchWeather(WEATHER_LAT, WEATHER_LON) // Fallback ke koordinat default jika akses lokasi ditolak
            );
        } else {
            fetchWeather(WEATHER_LAT, WEATHER_LON);
        }
    }, [propsCuaca]);

    return cuaca;
}

export default function AdminLayout({ children, title }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const { jam, tanggal } = useJamTanggal();
    const cuaca = useCuaca(props.cuaca);

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
                    background-color: #166534 !important;
                    color: #f3f4f6 !important;
                    border-color: #0a422a !important;
                }
                .dark main .text-gray-900,
                .dark main .text-gray-800,
                .dark main .text-gray-700 {
                    color: #f3f4f6 !important;
                }
                .dark main .text-[#111827] {
                    color: #f3f4f6 !important;
                }
                .dark main .text-gray-500,
                .dark main .text-gray-600 {
                    color: #9ca3af !important;
                }
                .dark main .border-gray-100,
                .dark main .border-gray-200 {
                    border-color: #0a422a !important;
                }
                .dark main input, 
                .dark main select, 
                .dark main textarea {
                    background-color: #14532d !important;
                    color: #ffffff !important;
                    border-color: #0a422a !important;
                }
            `}</style>

            {/* Sidebar */}
            <aside className="w-64 shrink-0 bg-green-800 dark:bg-green-900 text-gray-100 flex flex-col border-r border-green-700 dark:border-gray-800 shadow-md h-full transition-colors">
                <div className="px-5 py-6 border-b border-white/10 flex flex-col items-center text-center shrink-0">
                    <img
                        src="/images/admin-titipsini.png"
                        alt="Logo"
                        className="h-24 w-auto object-contain mb-2 drop-shadow-sm"
                    />
                    <span className="text-base font-bold tracking-tight text-white">
                        Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                    </span>
                    <span className="text-[11px] text-green-200/80 font-medium mt-0.5">
                        titipkan semua urusanmu disini
                    </span>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                    {navItems.map(({ label, href, icon: Icon, children: subItems }) => {
                        const active = url.startsWith(href);
                        const hasChildren = !!subItems;
                        const isOpen = openMenu === label;

                        if (!hasChildren) {
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                                        active
                                            ? 'bg-green-700 text-white shadow-sm font-semibold'
                                            : 'text-green-100/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon size={16} className={active ? 'text-[#fbbf24]' : 'text-green-200/70'} />
                                    {label}
                                </Link>
                            );
                        }

                        return (
                            <div key={href}>
                                <button
                                    type="button"
                                    onClick={() => setOpenMenu(isOpen ? null : label)}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                                        active && !isOpen
                                            ? 'bg-green-700 text-white shadow-sm font-semibold'
                                            : 'text-green-100/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon size={16} className={active && !isOpen ? 'text-[#fbbf24]' : 'text-green-200/70'} />
                                    <span className="flex-1 text-left">{label}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform text-green-200/70 ${isOpen ? 'rotate-180 text-white' : ''}`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="mt-1 ml-4 space-y-1 border-l border-white/15 pl-4">
                                        {subItems.map((sub) => {
                                            const subActive = url.startsWith(sub.href);
                                            return (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    className={`block rounded-lg px-3 py-2 text-xs transition-colors ${
                                                        subActive
                                                            ? 'font-bold text-[#fbbf24] bg-white/10'
                                                            : 'text-green-100/70 hover:text-white hover:bg-white/5'
                                                    }`}
                                                >
                                                    {sub.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
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

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden relative">
                <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800/80 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md px-6 py-4 shadow-sm shrink-0 sticky top-0 z-30 transition-colors duration-300">
                    <div>
                        <h1 className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white">{title}</h1>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-green-600 dark:text-green-400" />
                                {tanggal}
                            </span>
                            <span className="flex items-center gap-1.5 tabular-nums">
                                <Clock size={13} className="text-green-600 dark:text-green-400" />
                                {jam}
                            </span>
                            {/* 💡 Widget Cuaca Konsisten */}
                            {cuaca && (
                                <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                                    {cuaca.Icon ? (
                                        <cuaca.Icon size={13} className="text-amber-500" />
                                    ) : (
                                        <span className="text-amber-500">🌤️</span>
                                    )}
                                    {cuaca.label}, {cuaca.suhu}
                                </span>
                            )}
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
                            <span className="text-xs font-semibold">{user?.name ?? 'Apip'}</span>
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                                />
                            ) : (
                                <div className="h-9 w-9 rounded-xl bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 flex items-center justify-center text-xs font-bold border border-green-300/40 dark:border-green-800">
                                    {(user?.name ?? 'A').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 relative z-10 transition-colors">{children}</main>
            </div>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                                    <AlertCircle size={22} />
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
                            Apakah kamu yakin ingin keluar dari halaman admin dashboard?
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