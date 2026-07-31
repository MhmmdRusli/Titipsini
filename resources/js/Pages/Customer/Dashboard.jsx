import { useState, useRef, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, History, Package, Building2, Car, Truck, ChevronRight, ChevronDown, MapPin, Clock, Search, Inbox, User, LogOut } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const CATEGORIES = [
    { key: 'barang', label: 'Barang', icon: Package, href: '/app/services?kategori=barang' },
    { key: 'bangunan', label: 'Bangunan', icon: Building2, href: '/app/services?kategori=bangunan' },
    { key: 'kendaraan', label: 'Kendaraan', icon: Car, href: '/app/services?kategori=kendaraan' },
    { key: 'pindahan', label: 'Pindahan', icon: Truck, href: '/app/services?kategori=pindahan' },
];

// Label & warna badge status order, dipakai di section "Aktivitas Terakhir"
const ORDER_STATUS_LABEL = {
    baru: 'Menunggu',
    diproses: 'Diproses',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
};

const ORDER_STATUS_STYLE = {
    baru: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    diproses: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    selesai: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400',
    dibatalkan: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400',
};

// Label kategori layanan, dipakai untuk menampilkan judul di kartu Aktivitas Terakhir
const SERVICE_TYPE_LABEL = {
    barang: 'Titip Barang',
    bangunan: 'Titip Bangunan',
    kendaraan: 'Titip Kendaraan',
    pindahan: 'Jasa Pindahan',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
        .format(value ?? 10000)
        .replace("IDR", "Rp");
}

function formatTanggal(value) {
    if (!value) return 'Terbaru';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 19) return 'Selamat Sore';
    return 'Selamat Malam';
}

function BoxIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 8l9-4 9 4-9 4-9-4z" />
            <path d="M3 8v8l9 4 9-4V8" />
            <path d="M12 12v8" />
        </svg>
    );
}

export default function Dashboard({ user, saldo = 10000, vendors = [], berita = [], aktivitasTerakhir = null }) {
    // Pakai auth.user yang di-share global lewat Inertia (HandleInertiaRequests)
    // sebagai sumber utama, dengan fallback ke prop `user` halaman ini. Jadi
    // begitu foto profil diganti di halaman Profil (yang meng-update auth.user
    // yang sama), avatar di Dashboard otomatis ikut ter-update juga tanpa perlu
    // reload manual, karena keduanya membaca dari satu sumber yang sama.
    const { props: pageProps } = usePage();
    const currentUser = pageProps.auth?.user ?? user;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
    const [selectedWilayah, setSelectedWilayah] = useState(currentUser?.wilayah ?? 'Daerah Istimewa Yogyakarta');
    const [searchQuery, setSearchQuery] = useState('');

    const dropdownRef = useRef(null);
    const avatarMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
                setIsAvatarMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayBerita = berita.length > 0 ? berita : [
        { id: 1, judul: 'Rilis. Buat Akun Lebih Mudah...', published_at: null, foto: null },
        { id: 2, judul: 'Terbaru yang menarik di Titipsini...', published_at: null, foto: null },
        { id: 3, judul: 'Aplikasi Titipsini.Com terbaru Rilis, Buat...', published_at: null, foto: null },
    ];

    const firstName = (currentUser?.name ?? 'Riza Hidayat').split(' ')[0];

    // Daftar Wilayah Utama / Kota-Kota Besar Seluruh Indonesia
    const daftarWilayahIndonesia = [
        // JAWA & DIY
        'Daerah Istimewa Yogyakarta', 'Kota Yogyakarta', 'Kab. Sleman', 'Kab. Bantul', 'Kab. Kulon Progo', 'Kab. Gunungkidul',
        'DKI Jakarta', 'Kota Jakarta Pusat', 'Kota Jakarta Selatan', 'Kota Jakarta Barat', 'Kota Jakarta Timur', 'Kota Jakarta Utara',
        'Jawa Barat', 'Kota Bandung', 'Kab. Bandung', 'Kota Bekasi', 'Kab. Bekasi', 'Kota Depok', 'Kota Bogor', 'Kota Cimahi',
        'Jawa Tengah', 'Kota Semarang', 'Kota Surakarta (Solo)', 'Kab. Klaten', 'Kab. Banyumas', 'Kota Salatiga',
        'Jawa Timur', 'Kota Surabaya', 'Kota Malang', 'Kab. Malang', 'Kota Sidoarjo', 'Kab. Gresik', 'Kota Kediri',
        'Banten', 'Kota Tangerang', 'Kota Tangerang Selatan', 'Kab. Tangerang', 'Kota Serang',

        // SUMATERA
        'Sumatera Utara', 'Kota Medan', 'Kab. Deli Serdang', 'Kota Pematangsiantar',
        'Sumatera Barat', 'Kota Padang', 'Kota Bukittinggi',
        'Riau', 'Kota Pekanbaru', 'Kota Dumai',
        'Sumatera Selatan', 'Kota Palembang', 'Kota Lubuklinggau',
        'Lampung', 'Kota Bandar Lampung', 'Kota Metro',
        'Aceh', 'Kota Banda Aceh', 'Kota Lhokseumawe',

        // KALIMANTAN
        'Kalimantan Timur', 'Kota Samarinda', 'Kota Balikpapan', 'IKN Nusantara',
        'Kalimantan Selatan', 'Kota Banjarmasin', 'Kota Banjarbaru',
        'Kalimantan Barat', 'Kota Pontianak', 'Kota Singkawang',

        // SULAWESI & BALI / NUSA TENGGARA
        'Bali', 'Kota Denpasar', 'Kab. Badung', 'Kab. Gianyar',
        'Sulawesi Selatan', 'Kota Makassar', 'Kota Palopo',
        'Sulawesi Utara', 'Kota Manado', 'Kota Bitung',
        'Nusa Tenggara Barat (NTB)', 'Kota Mataram', 'Kota Bima',
        'Nusa Tenggara Timur (NTT)', 'Kota Kupang',

        // PAPUA & MALUKU
        'Papua', 'Kota Jayapura',
        'Maluku', 'Kota Ambon',
    ];

    const filteredWilayah = daftarWilayahIndonesia.filter((wilayah) =>
        wilayah.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <CustomerLayout>
            <Head title="Beranda" />

            <div className="px-4 pt-2 pb-6">
                {/* Greeting Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative shrink-0" ref={avatarMenuRef}>
                            <button
                                type="button"
                                onClick={() => setIsAvatarMenuOpen((v) => !v)}
                                className="block cursor-pointer"
                            >
                                {currentUser?.avatar ? (
                                    <img
                                        src={currentUser.avatar}
                                        alt={currentUser.name}
                                        className="h-11 w-11 rounded-full border border-gray-200 object-cover transition hover:border-green-400 dark:border-gray-700 dark:hover:border-green-500"
                                    />
                                ) : (
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-green-200 bg-green-50 text-sm font-semibold text-[#15803d] transition hover:border-green-400 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300 dark:hover:border-green-500">
                                        {firstName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </button>

                            {isAvatarMenuOpen && (
                                <div className="absolute left-0 z-50 mt-2 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                                    <Link
                                        href="/app/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <User size={15} />
                                        Profil Saya
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                                    >
                                        <LogOut size={15} />
                                        Keluar
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
                                {getGreeting()}, {firstName}
                            </h2>

                            {/* Wrapper Dropdown */}
                            <div className="relative mt-0.5 inline-block" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDropdownOpen(!isDropdownOpen);
                                        setSearchQuery('');
                                    }}
                                    className="inline-flex items-center gap-1 text-xs text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                                >
                                    <MapPin size={13} />
                                    <span className="max-w-[180px] truncate">{selectedWilayah}</span>
                                    <ChevronDown size={12} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Menu Dropdown All Indonesia */}
                                {isDropdownOpen && (
                                    <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-xl border border-gray-100 dark:border-gray-700 z-50">

                                        {/* Kolom Pencarian */}
                                        <div className="mb-2 relative">
                                            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Cari kota / provinsi..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 pl-8 pr-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                autoFocus
                                            />
                                        </div>

                                        {/* Daftar Pilihan */}
                                        <div className="space-y-0.5 max-h-60 overflow-y-auto pr-1">
                                            {filteredWilayah.length > 0 ? (
                                                filteredWilayah.map((wilayah, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedWilayah(wilayah);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                                                            selectedWilayah === wilayah
                                                                ? 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400 font-bold'
                                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        <span className="truncate">{wilayah}</span>
                                                        {selectedWilayah === wilayah && <MapPin size={12} className="shrink-0 text-green-600 dark:text-green-400" />}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="py-3 text-center text-xs text-gray-400">Wilayah tidak ditemukan</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kartu Saldo Hijau */}
                <div className="mt-4 rounded-xl bg-green-600 dark:bg-green-700 p-4 text-white shadow-sm">
                    <div className="flex items-center justify-between text-xs font-medium text-green-100">
                        <span>Saldo Titip Saat Ini</span>
                        <div className="flex items-center gap-4">
                            <Link href="/app/saldo/topup" className="flex items-center gap-1 hover:text-white">
                                <span>Top UP</span>
                                <Plus size={14} strokeWidth={3} className="border border-white rounded-full p-0.5 w-4 h-4" />
                            </Link>
                            <Link href="/app/saldo/riwayat" className="flex items-center gap-1 hover:text-white">
                                <span>Riwayat</span>
                                <History size={14} strokeWidth={3} className="border border-white rounded-full p-0.5 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <p className="mt-2 text-2xl font-bold tracking-wide">{formatRupiah(saldo)}</p>
                </div>

                {/* Kategori Layanan Section */}
                <div className="mt-5">
                    <p className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">Mau nitip apa hari ini?</p>
                    <div className="grid grid-cols-4 gap-2.5">
                        {CATEGORIES.map(({ key, label, icon: Icon, href }) => (
                            <Link
                                key={key}
                                href={href}
                                className="flex flex-col items-center justify-center rounded-xl border border-gray-300 bg-white py-4 shadow-sm transition-all active:scale-95 dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="text-gray-800 dark:text-gray-200 mb-2">
                                    <Icon size={24} strokeWidth={1.5} />
                                </div>
                                <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Banner Promo */}
                <div className="mt-5 relative flex h-[128px] rounded-2xl shadow-md">
                    <div
                        className="absolute inset-0 rounded-2xl bg-green-600 dark:bg-green-700"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 10px)',
                        }}
                    />

                    <div className="relative z-10 flex flex-1 flex-col justify-between p-4">
                        <div>
                            <p className="font-mono text-[10px] tracking-[0.2em] text-green-100">
                                TIKET-PROMO &middot; BULAN INI
                            </p>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-[13px] font-semibold text-green-100">Cashback</span>
                                <span className="text-4xl font-black italic leading-none text-amber-300">30%</span>
                            </div>
                            <p className="mt-1 text-[10px] text-green-100">
                                untuk penitipan Barang, Bangunan & Kendaraan
                            </p>
                        </div>
                        <p className="font-mono text-[9px] text-green-200">Berlaku s.d. akhir bulan &middot; S&amp;K berlaku</p>
                    </div>

                    <div className="relative z-10 flex w-16 shrink-0 flex-col items-center justify-between py-3">
                        <div className="absolute inset-y-2 left-0 border-l-2 border-dashed border-green-300/50" />
                        <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-gray-50 dark:bg-gray-900" />
                        <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-gray-50 dark:bg-gray-900" />

                        <BoxIcon className="h-6 w-6 text-green-100" />
                        <span
                            className="font-mono text-[10px] font-bold tracking-wider text-green-100"
                            style={{ writingMode: 'vertical-rl' }}
                        >
                            NO. 0030
                        </span>
                    </div>

                    <div className="pointer-events-none absolute -right-3 -top-3 z-20 rotate-[18deg]">
                        <div className="rounded-md border-[3px] border-red-600 bg-red-600/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-red-600">
                            Promo
                        </div>
                    </div>
                </div>

                {/* Section Berita */}
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Berita</p>
                        <Link href="/app/berita" className="flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
                            Lihat semua
                        </Link>
                    </div>

                    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
                        {displayBerita.map((b) => (
                            <Link
                                key={b.id}
                                href={`/app/berita/${b.id}`}
                                className="flex w-[62%] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800"
                            >
                                <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950">
                                    {b.foto && (
                                        <img
                                            src={b.foto}
                                            alt={b.judul}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    )}
                                    <div className="relative z-10 flex h-full flex-col justify-between p-3">
                                        <div className="self-start rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                            Titipsini
                                        </div>
                                        <p className="text-[10px] font-medium text-white drop-shadow">
                                            {b.waktu ?? formatTanggal(b.published_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <p className="line-clamp-2 text-[11px] font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                                        {b.judul}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Section Mitra & Lokasi Penitipan */}
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Mitra & Lokasi Penitipan</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">Pilihan lokasi aman terdekat di wilayahmu</p>
                        </div>
                        <Link href="/app/services" className="flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
                            Lihat semua
                        </Link>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-[#4ade80]">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">Titip Barang & Kendaraan Yogya</p>
                                    <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">Buka 24 Jam &middot; Keamanan Terjaga</p>
                                </div>
                            </div>
                            <Link
                                href="/app/services"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300 transition hover:bg-gray-100"
                            >
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Section Aktivitas Terakhir - sekarang pakai data order asli dari backend */}
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Aktivitas Terakhir</p>
                        <Link href="/app/orders" className="flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
                            Lihat semua</Link>
                    </div>

                    {aktivitasTerakhir ? (
                        <Link
                            href={`/app/orders/${aktivitasTerakhir.id}`}
                            className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                                {aktivitasTerakhir.item_name || SERVICE_TYPE_LABEL[aktivitasTerakhir.service_type] || 'Pesanan'}
                                            </p>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                                                    ORDER_STATUS_STYLE[aktivitasTerakhir.status] ??
                                                    'bg-gray-50 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400'
                                                }`}
                                            >
                                                {ORDER_STATUS_LABEL[aktivitasTerakhir.status] ?? aktivitasTerakhir.status}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                                            {aktivitasTerakhir.duration ? `Durasi: ${aktivitasTerakhir.duration} \u00b7 ` : ''}
                                            {formatRupiah(aktivitasTerakhir.total_price)}
                                        </p>
                                    </div>
                                </div>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    <ChevronRight size={16} />
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-8 text-center dark:border-gray-700 dark:bg-gray-800">
                            <Inbox size={28} className="mb-2 text-gray-300 dark:text-gray-600" />
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Belum ada aktivitas</p>
                            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">Pesanan kamu akan muncul di sini</p>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}