import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    MapPin, LayoutDashboard, CircleUserRound, Users, Handshake,
    Package, BarChart3, Settings, LogOut, ChevronDown, Wallet, Newspaper,
    Clock, Calendar, Sun, Cloud, CloudRain, CloudFog, CloudLightning, CloudSnow,
} from 'lucide-react';

const navItems = [
    { label: 'Kota', href: '/admin/kota', icon: MapPin },
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Profil', href: '/admin/profil', icon: CircleUserRound },
    { label: 'Customer', href: '/admin/pengguna', icon: Users },
    { label: 'Vendor', href: '/admin/partners', icon: Handshake },
    { label: 'Berita', href: '/admin/berita', icon: Newspaper },
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
    const tanggal = now
        .toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

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
    const { url } = usePage();
    const { props } = usePage();
    const user = props.auth?.user;
    const { jam, tanggal } = useJamTanggal();
    const cuaca = useCuaca();

    const [openMenu, setOpenMenu] = useState(() => {
        const active = navItems.find(
            (item) => item.children && item.children.some((c) => url.startsWith(c.href))
        );
        return active?.label ?? null;
    });

    return (
        <div className="flex h-screen bg-gray-50/50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 bg-gradient-to-b from-green-900 via-emerald-900 to-green-950 text-gray-200 flex flex-col border-r border-green-800/40 shadow-sm h-full">
                <div className="px-5 py-6 border-b border-white/10 flex flex-col items-center text-center shrink-0">
                    <img
                        src="/images/admin-titipsini.png"
                        alt="Logo"
                        className="h-28 w-auto object-contain mb-3 drop-shadow-md"
                    />
                    <span className="text-base font-bold tracking-tight text-white">
                        Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                    </span>
                    <span className="text-[11px] text-gray-300 font-medium mt-0.5">titipkan semua urusanmu disini</span>
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
                                            ? 'bg-green-700 text-white shadow-sm ring-1 ring-green-600/50'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <Icon size={16} className={active ? 'text-amber-300' : 'text-gray-400'} />
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
                                            ? 'bg-green-700 text-white shadow-sm ring-1 ring-green-600/50'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <Icon size={16} className={active && !isOpen ? 'text-amber-300' : 'text-gray-400'} />
                                    <span className="flex-1 text-left">{label}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform text-gray-400 ${isOpen ? 'rotate-180 text-white' : ''}`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4">
                                        {subItems.map((sub) => {
                                            const subActive = url.startsWith(sub.href);
                                            return (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    className={`block rounded-lg px-3 py-2 text-xs transition-colors ${
                                                        subActive
                                                            ? 'font-bold text-amber-300 bg-white/5'
                                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
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

                <div className="border-t border-white/10 px-3 py-4 shrink-0">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-red-200 hover:bg-red-500/10 hover:text-red-100 transition-colors"
                    >
                        <LogOut size={16} />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Area Kanan */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden relative">
                <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm shrink-0 sticky top-0 z-30">
                    <div>
                        <h1 className="text-base font-extrabold tracking-tight text-gray-900">{title}</h1>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-green-600" />
                                {tanggal}
                            </span>
                            <span className="flex items-center gap-1.5 tabular-nums">
                                <Clock size={13} className="text-green-600" />
                                {jam}
                            </span>
                            {cuaca && (
                                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                                    <cuaca.Icon size={13} className="text-amber-500" />
                                    {cuaca.label}, {cuaca.suhu}&deg;C
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <span className="text-xs font-semibold">{user?.name ?? 'Admin'}</span>
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-9 w-9 rounded-xl object-cover"
                            />
                        ) : (
                            <div className="h-9 w-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                                {(user?.name ?? 'A').charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-6 relative z-10">{children}</main>
            </div>
        </div>
    );
}