import { Head, Link } from '@inertiajs/react';
import { Plus, History, Package, Building2, Car, ChevronRight, MapPin } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

// Kategori disesuaikan persis dengan 3 item utama pada mockup gambar
const CATEGORIES = [
    { key: 'barang', label: ' Barang', icon: Package, href: '/app/services?kategori=barang' },
    { key: 'bangunan', label: ' Bangunan', icon: Building2, href: '/app/services?kategori=bangunan' },
    { key: 'kendaraan', label: ' Kendaraan', icon: Car, href: '/app/services?kategori=kendaraan' },
];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
        .format(value ?? 10000) // Default Rp 10.000 sesuai mockup jika data kosong
        .replace("IDR", "Rp");
}

export default function Dashboard({ user, saldo = 10000, vendors = [], berita = [] }) {
    // Data berita tiruan agar langsung memunculkan list item sesuai mockup jika kosong
    const displayBerita = berita.length > 0 ? berita : [
        { id: 1, judul: 'Rilis. Buat Akun Lebih Muda...', waktu: 'Terbaru', foto: null },
        { id: 2, judul: 'Terbaru yang me...', waktu: 'Terbaru', foto: null }
    ];

    return (
        <CustomerLayout>
            <Head title="Beranda" />

            <div className="px-4 py-2">
                {/* Greeting Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1">
                            Hello <span className="text-xl">👋</span>
                        </h2>
                        <p className="text-sm font-semibold text-gray-700 mt-[-2px]">{user?.name ?? 'Riza Hidayat'}</p>
                        <p className="mt-0.5 flex items-center gap-0.5 text-[11px] text-gray-400">
                            <MapPin size={11} className="text-gray-300" />
                            {user?.wilayah ?? 'Daerah Istimewa Yogyakarta'}
                        </p>
                    </div>
                </div>

                {/* Kartu Saldo Hijau (Persis Sesuai Desain Mockup Gambar) */}
                <div className="mt-4 rounded-xl bg-green-600 p-4 text-white shadow-sm">
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
                    <p className="mb-3 text-sm font-bold text-gray-900">Mau nitip apa hari ini?</p>
                    <div className="grid grid-cols-3 gap-4">
                        {CATEGORIES.map(({ key, label, icon: Icon, href }) => (
                            <Link
                                key={key}
                                href={href}
                                className="flex flex-col items-center justify-center rounded-xl border border-gray-300 bg-white py-4 shadow-sm transition-all active:scale-95"
                            >
                                <div className="text-gray-800 mb-2">
                                    <Icon size={24} strokeWidth={1.5} />
                                </div>
                                <span className="text-[11px] font-medium text-gray-600">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Banner Promo Cashback 30% */}
                <div className="mt-5 overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-4 text-white shadow-sm relative">
                    <div className="max-w-[65%]">
                        <p className="text-xl font-black italic tracking-wide">Cashback 30%</p>
                        <p className="text-[10px] font-light text-green-100 mt-0.5">Cuman ada di Titipsini.Com</p>
                        <div className="mt-3 flex gap-1">
                            <div className="bg-black text-[8px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                                Download on the
                            </div>
                            <div className="bg-black text-[9px] px-2 py-1 rounded font-black tracking-tight">
                                App Store
                            </div>
                        </div>
                    </div>
                    {/* Ilustrasi HP di sebelah kanan */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-24 bg-green-400/30 rounded-lg border border-white/20 rotate-12 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white/50">Titipsini</span>
                    </div>
                </div>

                {/* Section Berita */}
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">Berita</p>
                        <Link href="/app/berita" className="flex items-center text-xs font-semibold text-green-600">
                            Lihat semua
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {displayBerita.map((b) => (
                            <Link
                                key={b.id}
                                href={`/app/berita/${b.id}`}
                                className="flex flex-col rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm"
                            >
                                {/* Thumbnail Box Berita */}
                                <div className="h-24 w-full bg-gradient-to-br from-green-50 to-emerald-100 p-3 flex flex-col justify-between relative">
                                    <div className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded self-start font-medium">
                                        Titipsini
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium z-10">{b.waktu}</p>
                                    <div className="absolute right-2 bottom-2 w-10 h-10 bg-green-600/10 rounded-full" />
                                </div>
                                {/* Judul Berita */}
                                <div className="p-2">
                                    <p className="line-clamp-2 text-[11px] font-semibold text-gray-800 leading-tight">
                                        {b.judul}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}