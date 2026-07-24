import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    MapPin, LayoutDashboard, CircleUserRound, Users, Handshake,
    Package, BarChart3, Settings, LogOut, ChevronDown, Wallet, Newspaper,
    HelpCircle, Clock, Calendar, Sun, Cloud, CloudRain, CloudFog, CloudLightning,
    CloudSnow, Moon,
} from 'lucide-react';

const navItems = [
    { label: 'Kota', href: '/admin/kota', icon: MapPin },
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Profil', href: '/admin/profil', icon: CircleUserRound },
    { label: 'Customer', href: '/admin/pengguna', icon: Users },
    { label: 'Vendor', href: '/admin/partners', icon: Handshake },
    { label: 'Berita', href: '/admin/berita', icon: Newspaper },
    { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
    { label: 'Top Up', href: '/admin/topup', icon: Wallet },
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
            { label: 'Komisi', href: '/admin/pengaturan/komisi' },
            { label: 'Qris', href: '/admin/pengaturan/qris' },
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

function useCuaca() {
    const [cuaca, setCuaca] = useState(null);

    useEffect(() => {
        let cancelled = false;

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current_weather=true`)
            .then((res) => res.json())
            .then((data) => {
                if (!cancelled && data?.current_weather) {
                    setCuaca({
                        suhu: Math.round(data.current_weather.temperature),
                        ...weatherFromCode(data.current_weather.weathercode),
                    });
                }
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, []);

    return cuaca;
}

export default function AdminLayout({ children, title }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const { jam, tanggal } = useJamTanggal();
    const cuaca = useCuaca();

    // State & Preference Dark Mode
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

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-gray-800 dark:text-gray-100 overflow-hidden transition-colors duration-300">
            {/* Style Injection khusus agar komponen child (Cards/Charts) otomatis menyesuaikan Mode Gelap */}
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
                .dark main .text-[#111827] {
                    color: #f3f4f6 !important;
                }
                .dark main .text-gray-500,
                .dark main .text-gray-600 {
                    color: #9ca3af !important;
                }
                .dark main .border-gray-100,
                .dark main .border-gray-200 {
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

            {/* Sidebar */}
            <aside className="w-64 shrink-0 bg-[#0d5235] dark:bg-[#093221] text-gray-100 flex flex-col border-r border-[#0a422a] dark:border-gray-800 shadow-md h-full transition-colors">
                {/* Logo Section */}
                <div className="px-5 py-6 border-b border-white/10 flex flex-col items-center text-center shrink-0">
                    <img
                        src="/images/admin-titipsini.png"
                        alt="Logo"
                        className="h-24 w-auto object-contain mb-2 drop-shadow-sm"
                    />
                    <span className="text-base font-bold tracking-tight text-white">
                        Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                    </span>
                    <span className="text-[11px] text-emerald-200/80 font-medium mt-0.5">
                        titipkan semua urusanmu disini
                    </span>
                </div>

                {/* Nav items */}
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
                                            ? 'bg-[#15803d] text-white shadow-sm font-semibold'
                                            : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon size={16} className={active ? 'text-[#fbbf24]' : 'text-emerald-200/70'} />
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
                                            ? 'bg-[#15803d] text-white shadow-sm font-semibold'
                                            : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon size={16} className={active && !isOpen ? 'text-[#fbbf24]' : 'text-emerald-200/70'} />
                                    <span className="flex-1 text-left">{label}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform text-emerald-200/70 ${isOpen ? 'rotate-180 text-white' : ''}`}
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
                                                            : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
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

                {/* Tombol Keluar */}
                <div className="border-t border-white/10 p-3 shrink-0">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-red-400 border border-red-500/40 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
                    >
                        <LogOut size={16} />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Area Utama (Kanan) */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden relative">
                {/* Header Navbar */}
                <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800/80 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md px-6 py-4 shadow-sm shrink-0 sticky top-0 z-30 transition-colors duration-300">
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
                            {cuaca && (
                                <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                                    <cuaca.Icon size={13} className="text-amber-500" />
                                    {cuaca.label}, {cuaca.suhu}&deg;C
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Tombol Toggle Mode Gelap/Terang */}
                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-amber-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
                            title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

                        {/* Profil User */}
                        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                            <span className="text-xs font-semibold">{user?.name ?? 'Apip'}</span>
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                                />
                            ) : (
                                <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold border border-emerald-300/40 dark:border-emerald-800">
                                    {(user?.name ?? 'A').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Konten Utama */}
                <main className="flex-1 p-6 relative z-10 transition-colors">{children}</main>
            </div>
        </div>
    );
}