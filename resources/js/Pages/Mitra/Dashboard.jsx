import { Head, Link } from '@inertiajs/react';
import { Wallet, History, Clock, AlertTriangle, Package, Car, Building2, Truck, ChevronRight } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const LAYANAN_ICON = {
    barang: Package,
    kendaraan: Car,
    bangunan: Building2,
    pindahan: Truck,
};

const LAYANAN_LABEL = {
    barang: 'Titip Barang',
    kendaraan: 'Titip Kendaraan',
    bangunan: 'Titip Bangunan',
    pindahan: 'Layanan Pindahan',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Dashboard({ partner, saldo = 0, toko, layanan = [], pesanan }) {
    return (
        <MitraLayout title="Beranda">
            <Head title="Beranda Mitra" />

            <div className="px-4 py-4">
                {/* Banner verifikasi KTP - hanya muncul kalau belum verified */}
                {!partner?.is_verified && (
                    <Link
                        href="/mitra/legalitas"
                        className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 hover:bg-red-100"
                    >
                        <AlertTriangle size={20} className="shrink-0 text-red-600" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-red-700">Verifikasi KTP kamu belum selesai</p>
                            <p className="text-xs text-red-600">Lengkapi data legalitas untuk aktifkan semua fitur toko.</p>
                        </div>
                        <ChevronRight size={16} className="shrink-0 text-red-400" />
                    </Link>
                )}

                <p className="text-lg font-semibold text-gray-900">Hello, {partner?.name?.split(' ')[0] ?? 'Mitra'} 👋</p>

                {/* Kartu saldo */}
                <div className="mt-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <Wallet size={14} />
                            Saldo Kamu Saat Ini
                        </div>
                        <Link
                            href="/mitra/pendapatan/riwayat"
                            className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                        >
                            <History size={12} />
                            Riwayat Pendapatan
                        </Link>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{formatRupiah(saldo)}</p>
                </div>

                {/* Status operasional toko */}
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                toko?.buka ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            <Clock size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Toko {toko?.buka ? 'Buka' : 'Tutup'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {toko?.jam_buka && toko?.jam_tutup
                                    ? `Jam operasional ${toko.jam_buka} - ${toko.jam_tutup}`
                                    : 'Jam operasional belum diatur'}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/mitra/layanan/jam-operasional"
                        className="text-xs font-medium text-green-700 hover:underline"
                    >
                        Atur
                    </Link>
                </div>

                {/* Layanan vendor */}
                <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">Layanan Vendor</p>
                        <Link href="/mitra/layanan" className="flex items-center gap-0.5 text-xs font-medium text-green-700">
                            Kelola
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {layanan.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-400">
                            Belum ada kategori layanan yang diaktifkan.
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-2">
                            {layanan.map((key) => {
                                const Icon = LAYANAN_ICON[key] ?? Package;
                                return (
                                    <div
                                        key={key}
                                        className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-white py-3 text-center shadow-sm"
                                    >
                                        <Icon size={22} className="text-green-600" strokeWidth={1.75} />
                                        <span className="text-[11px] leading-tight text-gray-600">
                                            {LAYANAN_LABEL[key] ?? key}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Statistik jumlah pesanan aktif */}
                <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-gray-900">Jumlah Pesanan Aktif</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                                <Package size={18} />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{pesanan?.barang ?? 0}</p>
                            <p className="text-xs text-gray-500">Pesanan Barang</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                                <Car size={18} />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{pesanan?.kendaraan ?? 0}</p>
                            <p className="text-xs text-gray-500">Pesanan Kendaraan</p>
                        </div>
                    </div>
                </div>
            </div>
        </MitraLayout>
    );
}