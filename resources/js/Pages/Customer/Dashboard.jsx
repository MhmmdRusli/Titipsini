import { Head, Link } from '@inertiajs/react';
import { Plus, History, Package, Building2, Car, ChevronRight, MapPin } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

// Kategori disesuaikan persis dengan 3 item utama pada mockup gambar
const CATEGORIES = [
    { key: 'barang', label: ' Barang', icon: Package, href: '/app/services/barang/paket-pilihan' }, // diubah
    { key: 'bangunan', label: ' Bangunan', icon: Building2, href: '/app/services?kategori=bangunan' },
    { key: 'kendaraan', label: ' Kendaraan', icon: Car, href: '/app/services?kategori=kendaraan' },
];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
        .format(value ?? 10000) // Default Rp 10.000 sesuai mockup jika data kosong
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

// Ikon kotak titipan sederhana untuk stub tiket
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
    // Data berita tiruan agar langsung memunculkan list item sesuai mockup jika kosong
    const displayBerita = berita.length > 0 ? berita : [
        { id: 1, judul: 'Rilis. Buat Akun Lebih Muda...', published_at: null, foto: null },
        { id: 2, judul: 'Terbaru yang me...', published_at: null, foto: null },
        { id: 3, judul: 'Aplikasi Titipsini.Com terbaru Rilis, Buat...', published_at: null, foto: null },
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

                {/* Banner Promo — konsep "tiket klaim penitipan", bukan banner iklan generik */}
                <div className="mt-5 relative flex h-[128px] rounded-2xl shadow-md">
                    {/* pola garis diagonal halus di background, kesan kertas keamanan/tiket */}
                    <div
                        className="absolute inset-0 rounded-2xl bg-green-700"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 10px)',
                        }}
                    />

                    {/* bagian utama tiket */}
                    <div className="relative z-10 flex flex-1 flex-col justify-between p-4">
                        <div>
                            <p className="font-mono text-[10px] tracking-[0.2em] text-green-200">
                                TIKET-PROMO &middot; BULAN INI
                            </p>
                            <div className="mt-1 flex items-baseline gap-1">
                                <span className="text-[13px] font-semibold text-green-100">Cashback</span>
                                <span className="text-4xl font-black italic leading-none text-amber-300">30%</span>
                            </div>
                            <p className="mt-1 text-[10px] text-green-200">
                                untuk penitipan Barang, Bangunan & Kendaraan
                            </p>
                        </div>
                        <p className="font-mono text-[9px] text-green-300">Berlaku s.d. akhir bulan &middot; S&amp;K berlaku</p>
                    </div>

                    {/* stub tiket di kanan, dipisah garis perforasi */}
                    <div className="relative z-10 flex w-16 shrink-0 flex-col items-center justify-between py-3">
                        {/* garis perforasi putus-putus */}
                        <div className="absolute inset-y-2 left-0 border-l-2 border-dashed border-green-400/50" />
                        {/* lubang tiket atas & bawah, warnanya samakan dengan bg halaman (gray-50) supaya kesan "bolong" */}
                        <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-gray-50" />
                        <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-gray-50" />

                        <BoxIcon className="h-6 w-6 text-green-200" />
                        <span
                            className="font-mono text-[10px] font-bold tracking-wider text-green-100"
                            style={{ writingMode: 'vertical-rl' }}
                        >
                            NO. 0030
                        </span>
                    </div>

                    {/* cap tinta "PROMO" miring di pojok, kesan stempel */}
                    <div className="pointer-events-none absolute -right-3 -top-3 z-20 rotate-[18deg]">
                        <div className="rounded-md border-[3px] border-red-600 bg-red-600/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-red-600">
                            Promo
                        </div>
                    </div>
                </div>

                {/* Section Berita - scroll horizontal, kartu ~62% lebar biar kelihatan 1.5 kartu */}
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">Berita</p>
                        <Link href="/app/berita" className="flex items-center text-xs font-semibold text-green-600">
                            Lihat semua
                        </Link>
                    </div>

                    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
                        {displayBerita.map((b) => (
                            <Link
                                key={b.id}
                                href={`/app/berita/${b.id}`}
                                className="flex w-[62%] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                            >
                                {/* Thumbnail Box Berita */}
                                <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
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