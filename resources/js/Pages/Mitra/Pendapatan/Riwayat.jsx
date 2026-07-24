import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Package, Car, Building2, Truck, Wallet } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const SERVICE_ICON = {
    barang: Package,
    kendaraan: Car,
    bangunan: Building2,
    pindahan: Truck,
};

const SERVICE_LABEL = {
    barang: 'Titip Barang',
    kendaraan: 'Titip Kendaraan',
    bangunan: 'Titip Bangunan',
    pindahan: 'Layanan Pindahan',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function Riwayat({ riwayat, totalPendapatan = 0 }) {
    return (
        <MitraLayout>
            <Head title="Riwayat Pendapatan" />

            <div className="px-4 py-4">
                <Link href="/mitra/dashboard" className="mb-3 flex items-center gap-1 text-sm text-gray-500 hover:text-green-700">
                    <ChevronLeft size={16} />
                    Riwayat Pendapatan
                </Link>

                {/* Ringkasan total */}
                <div className="rounded-2xl bg-green-600 p-4 text-white shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                        <Wallet size={13} />
                        Total Pendapatan Selesai
                    </div>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight">{formatRupiah(totalPendapatan)}</p>
                </div>

                {/* List riwayat */}
                <div className="mt-4 space-y-2.5">
                    {riwayat.data.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
                            Belum ada pendapatan tercatat.
                        </div>
                    ) : (
                        riwayat.data.map((item) => {
                            const Icon = SERVICE_ICON[item.service_type] ?? Package;
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                                        <Icon size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-gray-900">
                                            {item.item_name || SERVICE_LABEL[item.service_type] || item.service_type}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-400">
                                            {item.order_code} &middot; {item.tanggal}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-sm font-bold text-green-700">
                                        +{formatRupiah(item.total_price)}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination sederhana */}
                {riwayat.links && riwayat.links.length > 3 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                        {riwayat.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                preserveScroll
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-md px-3 py-1.5 text-xs ${
                                    link.active
                                        ? 'bg-green-600 text-white'
                                        : link.url
                                        ? 'text-gray-500 hover:bg-gray-100'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MitraLayout>
    );
}