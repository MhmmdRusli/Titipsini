import { Head, Link } from '@inertiajs/react';
import { Boxes, CheckCircle2 } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

function formatRupiah(value) {
    return 'Rp' + Math.round(value || 0).toLocaleString('id-ID');
}

function formatDurasi(hari) {
    if (!hari) return '-';
    if (hari % 7 === 0) {
        const minggu = hari / 7;
        return `${minggu} Minggu`;
    }
    return `${hari} Hari`;
}

function Row({ label, value, bold }) {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
            <span className="shrink-0 text-gray-400 dark:text-gray-500">{label}</span>
            <span
                className={`text-right ${
                    bold ? 'font-bold text-gray-900 dark:text-gray-100' : 'font-medium text-gray-700 dark:text-gray-200'
                }`}
            >
                {value}
            </span>
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            {children}
        </p>
    );
}

export default function Invoice({ order }) {
    return (
        <CustomerLayout title="Invoice Pesanan" backHref="/app/dashboard">
            <Head title="Invoice Pesanan" />

            <div className="mx-auto max-w-lg px-4 py-6">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-900/5 dark:border-gray-800 dark:bg-gray-900">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
                        <div className="flex items-center gap-1.5">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#15803d] text-white dark:bg-[#22c55e]">
                                <Boxes size={14} />
                            </span>
                            <p className="text-sm font-extrabold text-gray-900 dark:text-gray-100">
                                Titipsini<span className="text-[#15803d] dark:text-[#4ade80]">•</span>Com
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">{order.tanggalDiterbitkan}</p>
                            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                ID Pesanan: {order.orderCode}
                            </p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mt-4">
                        {order.sudahDibayar ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-[#15803d] dark:bg-green-950/40 dark:text-green-400">
                                <CheckCircle2 size={13} />
                                Sudah Dibayar
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                Belum Dibayar
                            </span>
                        )}
                    </div>

                    {/* Diterbitkan Atas Nama */}
                    <div className="mt-4">
                        <SectionTitle>Diterbitkan Atas Nama</SectionTitle>
                        <p className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">{order.mitraNama}</p>
                    </div>

                    {/* Untuk */}
                    <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                        <SectionTitle>Untuk</SectionTitle>
                        <div className="mt-1.5">
                            <Row label="Customer" value={order.customerNama} />
                            <Row label="Nomor Telepon" value={order.customerTelepon} />
                            <Row label="Alamat Lengkap" value={order.alamatLengkap} />
                        </div>
                    </div>

                    {/* Detail Pesanan */}
                    <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                        <SectionTitle>Detail Pesanan</SectionTitle>
                        <div className="mt-1.5">
                            <Row label="Nama Barang" value={order.namaBarang} />
                            <Row label="Jumlah" value={order.jumlahBarang} />
                            <Row label="Keterangan" value={order.keterangan} />
                            <Row label="Tanggal Masuk" value={order.tanggalMasuk} />
                            <Row label="Tanggal Keluar" value={order.tanggalKeluar} />
                            <Row label="Durasi Waktu" value={formatDurasi(order.durasiHari)} />
                            <Row label="Layanan Pick Up" value={order.isPickup ? 'Ya' : 'Tidak'} />
                            {order.isPickup && <Row label="Jam Pick Up" value={order.jamPickup ? `${order.jamPickup} WIB` : '-'} />}
                            <Row label="Ukuran" value={order.ukuranBarangLabel} />
                        </div>
                    </div>

                    {/* Total Pembayaran */}
                    <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                        <SectionTitle>Total Pembayaran</SectionTitle>
                        <div className="mt-1.5">
                            <Row label="Nilai Harga" value={`${formatRupiah(order.nilaiHarga)} / hari`} />
                            <Row label="Durasi Penitipan" value={formatDurasi(order.durasiHari)} />
                            <Row label="Total Harga" value={formatRupiah(order.totalHarga)} />
                            {order.isPickup && <Row label="Biaya Pick Up" value={formatRupiah(order.biayaPickup)} />}
                            <Row label="Biaya Layanan" value={formatRupiah(order.biayaLayanan)} />
                        </div>

                        <div className="mt-2 flex items-center justify-between border-t border-dashed border-gray-200 pt-3 dark:border-gray-700">
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Total Pembayaran</span>
                            <span className="text-lg font-extrabold text-[#15803d] dark:text-green-400">
                                {formatRupiah(order.totalPembayaran)}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 space-y-2.5">
                        {!order.sudahDibayar && (
                            <Link
                                href={`/app/orders/${order.id}/pembayaran`}
                                className="flex w-full items-center justify-center rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98] dark:bg-[#22c55e] dark:hover:bg-green-600"
                            >
                                Bayar Langsung
                            </Link>
                        )}
                        <Link
                            href="/app/dashboard"
                            className="flex w-full items-center justify-center rounded-xl border border-[#15803d] py-3.5 text-sm font-bold text-[#15803d] transition hover:bg-green-50 active:scale-[0.98] dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/30"
                        >
                            Kembali Ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}