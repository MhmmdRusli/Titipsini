import { Head, Link } from '@inertiajs/react';
import { Plus, History, Package, Building2, Car, Truck, ChevronRight, ChevronDown, MapPin, Clock } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const CATEGORIES = [
    { key: 'barang', label: 'Barang', icon: Package, href: '/app/services?kategori=barang' },
    { key: 'bangunan', label: 'Bangunan', icon: Building2, href: '/app/services?kategori=bangunan' },
    { key: 'kendaraan', label: 'Kendaraan', icon: Car, href: '/app/services?kategori=kendaraan' },
    { key: 'pindahan', label: 'Pindahan', icon: Truck, href: '/app/services?kategori=pindahan' },
];

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

// Sapaan dinamis berdasarkan jam di device user
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

export default function Dashboard({ user, saldo = 10000, vendors = [], berita = [] }) {
    const displayBerita = berita.length > 0 ? berita : [
        { id: 1, judul: 'Rilis. Buat Akun Lebih Mudah...', published_at: null, foto: null },
        { id: 2, judul: 'Terbaru yang menarik di Titipsini...', published_at: null, foto: null },
        { id: 3, judul: 'Aplikasi Titipsini.Com terbaru Rilis, Buat...', published_at: null, foto: null },
    ];

    const firstName = (user?.name ?? 'Riza Hidayat').split(' ')[0];

    return (
        <CustomerLayout>
            <Head title="Beranda" />

            {/* Diberi pb-6 yang pas agar jarak ke navbar bawah ideal dan tidak terlalu kosong */}
            <div className="px-4 pt-2 pb-6">
                {/* Greeting Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                            {getGreeting()}, {firstName} <span className="text-xl">👋</span>
                        </h2>
                        <button
                            type="button"
                            className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <MapPin size={11} className="text-gray-400 dark:text-gray-500" />
                            {user?.wilayah ?? 'Daerah Istimewa Yogyakarta'}
                            <ChevronDown size={11} className="text-gray-400 dark:text-gray-500" />
                        </button>
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

                {/* Banner Promo - warna dasar disamakan dengan card Top Up
                    (green-600 / dark:green-700), desain tiket & layout aslinya
                    tetap dipertahankan sesuai permintaan. */}
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

                {/* Section Aktivitas Terakhir (Diubah jadi Card Simulasi/Interaktif agar tidak kosong) */}
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Aktivitas Terakhir</p>
                        <Link href="/app/orders" className="flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
                            Lihat semua
                        </Link>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100">Titip Barang Elektronik</p>
                                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 uppercase">
                                            Diproses
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">Durasi: 3 Hari &middot; Rp 45.000</p>
                                </div>
                            </div>
                            <Link
                                href="/app/orders"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300 transition hover:bg-gray-100"
                            >
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}