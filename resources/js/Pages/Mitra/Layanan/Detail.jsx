/**
 * SNIPPET UNTUK Mitra/Layanan/Detail.jsx
 * (saya tidak punya isi lengkap file ini, jadi berikut bagian yang relevan
 * saja - komponen toggle "Status Gudang" yang terlihat di screenshot Anda)
 */

import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil, Info } from 'lucide-react';
import { useState } from 'react';

export default function DetailGudang({ layanan, fiturPenuhAktif }) {
    const [processing, setProcessing] = useState(false);

    // Toggle individual HANYA aktif kalau fiturPenuhAktif true.
    // Kalau fiturPenuhAktif false, toggle otomatis tampak mati & disabled -
    // mengikuti aturan #1 & #3 dari spesifikasi.
    function handleToggleStatus() {
        if (!fiturPenuhAktif || processing) return;

        setProcessing(true);
        router.patch(
            route('mitra.layanan.toggle-aktif', layanan.id),
            {},
            { preserveScroll: true, onFinish: () => setProcessing(false) }
        );
    }

    // Status yang ditampilkan: kalau fitur penuh OFF, paksa tampil OFF di UI
    // meskipun nilai is_active di data belum sempat ke-refresh (defensif).
    const statusTampil = fiturPenuhAktif && layanan.is_active;

    return (
        <>
            <Head title="Detail Gudang" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-4">
                    <Link href={route('mitra.layanan.kategori', 'barang')} className="text-gray-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-base font-bold text-gray-900">Detail Gudang</h1>
                </div>

                <div className="p-4">
                    {/* ...bagian Nama Usaha / Provinsi / dst tetap sama seperti yang sudah ada... */}

                    {/* Peringatan kalau Fitur Penuh sedang OFF */}
                    {!fiturPenuhAktif && (
                        <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                            <Info size={14} className="mt-0.5 shrink-0" />
                            <span>
                                "Fitur Penuh" untuk kategori Barang sedang nonaktif, sehingga semua gudang
                                otomatis ditutup dan tidak bisa diubah manual. Aktifkan kembali dari halaman
                                Kelola Barang untuk mengatur status gudang ini.
                            </span>
                        </div>
                    )}

                    {/* Toggle Status Gudang */}
                    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4">
                        <div>
                            <p className="text-sm font-bold text-gray-900">Status Gudang</p>
                            <p className="text-xs text-gray-400">
                                {statusTampil ? 'Sedang menerima pesanan' : 'Sedang tidak menerima pesanan'}
                            </p>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={statusTampil}
                            disabled={!fiturPenuhAktif || processing}
                            onClick={handleToggleStatus}
                            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
                                statusTampil ? 'bg-[#15803d]' : 'bg-gray-300'
                            } ${!fiturPenuhAktif ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                            <span
                                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                                    statusTampil ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>

                    {/* ...bagian Foto Lahan Parkir dst tetap sama seperti yang sudah ada... */}
                </div>
            </div>
        </>
    );
}