import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Pencil, AlertTriangle, Info, X, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import MitraLayout from '@/Layouts/MitraLayout';

function Baris({ label, value }) {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="flex gap-4 py-2 text-sm">
            <span className="w-40 shrink-0 text-gray-500">{label}</span>
            <span className="text-gray-500">:</span>
            <span className="flex-1 text-gray-900 break-words">{value}</span>
        </div>
    );
}

const KATEGORI_LABELS = {
    barang: 'Gudang Barang',
    kendaraan: 'Lahan Parkir',
    bangunan: 'Ruang Bangunan',
    pindahan: 'Kendaraan Pick Up',
};

export default function Detail({ layanan }) {
    const [showBanner, setShowBanner] = useState(true);
    const [loadingToggle, setLoadingToggle] = useState(false);
    const status = layanan.verification_status ?? 'pending';
    const kategori = layanan.kategori || 'barang';
    const judulDetail = KATEGORI_LABELS[kategori] || 'Detail Layanan';

    const handleToggleActive = () => {
        if (loadingToggle) return;
        setLoadingToggle(true);
        router.patch(
            `/mitra/layanan/${layanan.id}/toggle-aktif`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoadingToggle(false),
            }
        );
    };

    // Tentukan URL edit berdasarkan kategori
    const getEditUrl = () => {
        const editPath = kategori === 'barang' ? 'barang' : kategori === 'bangunan' ? 'bangunan' : kategori === 'pindahan' ? 'pindahan' : 'kendaraan';
        return `/mitra/layanan/${editPath}?edit=${layanan.id}`;
    };

    // Tentukan pesan status berdasarkan kategori
    const getStatusMessage = () => {
        const messages = {
            barang: 'Gudang belum di verifikasi',
            kendaraan: 'Lahan Parkir belum di verifikasi',
            bangunan: 'Bangunan dan Penjaga belum di verifikasi',
            pindahan: 'Kendaraan dan Driver belum di verifikasi',
        };
        return messages[kategori] || 'Layanan belum di verifikasi';
    };

    const getStatusVerifiedMessage = () => {
        const messages = {
            barang: 'Gudang telah di verifikasi',
            kendaraan: 'Lahan Parkir telah di verifikasi',
            bangunan: 'Bangunan dan Penjaga telah di verifikasi',
            pindahan: 'Kendaraan dan Driver telah di verifikasi',
        };
        return messages[kategori] || 'Layanan telah di verifikasi';
    };

    const getStatusLabel = () => {
        const labels = {
            barang: 'Status Gudang',
            kendaraan: 'Status Lahan Parkir',
            bangunan: 'Status Bangunan',
            pindahan: 'Status Layanan Pick Up',
        };
        return labels[kategori] || 'Status Layanan';
    };

    return (
        <MitraLayout title={judulDetail}>
            <Head title={judulDetail} />

            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                <Link href="/mitra/layanan/pindahan" className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-base font-semibold text-gray-900">{judulDetail}</h1>
            </div>

            <div className="px-4 py-4">
                {status === 'pending' && showBanner && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />
                        <p className="flex-1 text-xs font-medium text-red-700">{getStatusMessage()}</p>
                        <button onClick={() => setShowBanner(false)} className="shrink-0 text-red-400 hover:text-red-600">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {status === 'terverifikasi' && (
                    <div className="mb-3 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
                        <Info size={16} className="shrink-0 text-blue-500" />
                        <p className="text-xs font-medium text-blue-700">{getStatusVerifiedMessage()}</p>
                    </div>
                )}

                {status === 'ditolak' && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />
                        <p className="text-xs font-medium text-red-700">
                            Maaf Verifikasi anda di tolak{layanan.rejection_reason ? `, ${layanan.rejection_reason}` : ''}.
                            Silahkan isi kembali dengan benar
                        </p>
                    </div>
                )}

                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="mb-3 flex items-center justify-end border-b border-gray-200 pb-3">
                        <Link
                            href={getEditUrl()}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <Pencil size={16} />
                        </Link>
                    </div>

                    {/* Detail Barang */}
                    {kategori === 'barang' && (
                        <>
                            <Baris label="Nama Usaha" value={layanan.nama_usaha} />
                            <Baris label="Provinsi" value={layanan.provinsi} />
                            <Baris label="Kabupaten" value={layanan.kabupaten_kota} />
                            <Baris label="Kecamatan" value={layanan.kecamatan} />
                            <Baris label="Alamat Lengkap" value={layanan.alamat_lengkap} />

                            <div className="mt-3 border-t border-gray-200 pt-3">
                                <p className="mb-2 text-sm font-semibold text-gray-800">Luas Lahan</p>
                                <Baris label="Panjang" value={layanan.panjang ? `${layanan.panjang} M` : null} />
                                <Baris label="Lebar" value={layanan.lebar ? `${layanan.lebar} M` : null} />
                                <Baris label="Jumlah Tampung" value={layanan.jumlah_tampung} />
                                <Baris label="Catatan" value={layanan.catatan_alamat} />
                            </div>
                        </>
                    )}

                    {/* Detail Kendaraan (Parkir) */}
                    {kategori === 'kendaraan' && (
                        <>
                            <Baris label="Nama Layanan" value={layanan.nama} />
                            <Baris label="Jenis Kendaraan" value={layanan.jenis_kendaraan} />
                            <Baris label="Kota" value={layanan.kota} />
                            <Baris label="Kecamatan" value={layanan.kecamatan} />
                            <Baris label="Harga/Hari" value={layanan.harga ? `Rp ${parseInt(layanan.harga).toLocaleString('id-ID')}` : null} />
                        </>
                    )}

                    {/* Detail Bangunan */}
                    {kategori === 'bangunan' && (
                        <>
                            <Baris label="Nama Usaha" value={layanan.nama_usaha} />
                            <Baris label="Jenis Bangunan" value={layanan.jenis_bangunan} />
                            <Baris label="Nama Penjaga" value={layanan.nama_penjaga} />
                            <Baris label="Nomor Telepon" value={layanan.nomor_telepon} />
                            <Baris label="Tanggal Lahir" value={layanan.tanggal_lahir} />
                            <Baris label="Status Kepemilikan" value={layanan.status_kepemilikan} />

                            <div className="mt-3 border-t border-gray-200 pt-3">
                                <p className="mb-2 text-sm font-semibold text-gray-800">Lokasi Bangunan</p>
                                <Baris label="Provinsi" value={layanan.provinsi} />
                                <Baris label="Kabupaten" value={layanan.kabupaten_kota} />
                                <Baris label="Kecamatan" value={layanan.kecamatan} />
                                <Baris label="Alamat Lengkap" value={layanan.alamat_lengkap} />
                            </div>

                            <div className="mt-3 border-t border-gray-200 pt-3">
                                <Baris label="Dokumen" value={
                                    layanan.upload_berkas ? (
                                        <a href={layanan.upload_berkas} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            Lihat Dokumen
                                        </a>
                                    ) : null
                                } />
                            </div>
                        </>
                    )}

                    {/* Detail Pindahan (Pick Up) */}
                    {kategori === 'pindahan' && (
                        <>
                            <Baris label="Nama Usaha" value={layanan.nama_usaha} />
                            <Baris label="Nomor Kendaraan" value={layanan.nomor_polisi} />
                            <Baris label="Nomor Kir Kendaraan" value={layanan.nomor_kir} />
                            <Baris label="Merk Kendaraan" value={layanan.merek_kendaraan} />
                            <Baris label="Jenis Kendaraan" value={layanan.jenis_pickup} />
                            <Baris label="Harga/Hari" value={layanan.harga ? `Rp ${parseInt(layanan.harga).toLocaleString('id-ID')}` : null} />

                            <div className="mt-3 border-t border-gray-200 pt-3">
                                <p className="mb-2 text-sm font-semibold text-gray-800">Dokumen Kendaraan</p>
                                <Baris label="Link Dokumen" value={
                                    layanan.upload_berkas ? (
                                        <a href={layanan.upload_berkas} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                                            {layanan.upload_berkas}
                                        </a>
                                    ) : null
                                } />
                            </div>
                        </>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{getStatusLabel()}</p>
                            <p className="text-xs text-gray-500">
                                {layanan.is_active ? 'Sedang menerima pesanan' : 'Ditutup sementara, tidak menerima pesanan'}
                            </p>
                        </div>
                        <button
                            type="button"
                            disabled={loadingToggle}
                            onClick={handleToggleActive}
                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                                layanan.is_active ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                    layanan.is_active ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {status === 'ditolak' && (
                    <Link
                        href={getEditUrl()}
                        className="mt-4 block w-full rounded-xl bg-green-600 py-3 text-center text-sm font-bold text-white hover:bg-green-700"
                    >
                        Verifikasi Ulang
                    </Link>
                )}
            </div>
        </MitraLayout>
    );
}