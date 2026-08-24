import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Pencil, AlertTriangle, Info, X, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import MitraLayout from '@/Layouts/MitraLayout';

function Baris({ label, value }) {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="flex gap-4 py-2 text-sm">
            <span className="w-32 shrink-0 text-gray-500">{label}</span>
            <span className="text-gray-500">:</span>
            <span className="text-gray-900">{value}</span>
        </div>
    );
}

export default function Detail({ layanan }) {
    const [showBanner, setShowBanner] = useState(true);
    const status = layanan.verification_status ?? 'pending';

    return (
            <MitraLayout title="Detail Gudang">
            <Head title="Detail Gudang" />

            <div className="px-4 py-4">
                {status === 'pending' && showBanner && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-500" />
                        <p className="flex-1 text-xs font-medium text-amber-700">Lahan Parkir belum di validasi</p>
                        <button onClick={() => setShowBanner(false)} className="text-amber-400 hover:text-amber-600">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {status === 'terverifikasi' && (
                    <div className="mb-3 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
                        <Info size={15} className="shrink-0 text-blue-500" />
                        <p className="text-xs font-medium text-blue-700">Lahan Parkiran telah di verifikasi</p>
                    </div>
                )}

                {status === 'ditolak' && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-500" />
                        <p className="text-xs font-medium text-red-700">
                            Maaf Verifikasi anda di tolak{layanan.rejection_reason ? `, ${layanan.rejection_reason}` : ''}.
                            Silahkan isi kembali dengan benar
                        </p>
                    </div>
                )}

                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="mb-3 flex items-center justify-end border-b border-gray-200 pb-3">
                        <Link
                            href={`/mitra/layanan/${layanan.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                router.visit(`/mitra/layanan/barang`, { data: { edit: layanan.id } });
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <Pencil size={16} />
                        </Link>
                    </div>

                    <Baris label="Nama Usaha" value={layanan.nama_usaha} />
                    <Baris label="Provinsi" value={layanan.provinsi} />
                    <Baris label="Kabupaten" value={layanan.kabupaten_kota} />
                    <Baris label="Kecamatan" value={layanan.kecamatan} />
                    <Baris label="Alamat Lenkap" value={layanan.alamat_lengkap} />

                    <div className="mt-3 border-t border-gray-200 pt-3">
                        <p className="mb-1 text-sm font-semibold text-gray-800">Luas Lahan</p>
                        <Baris label="Panjang" value={layanan.panjang ? `${layanan.panjang} M` : null} />
                        <Baris label="Lebar" value={layanan.lebar ? `${layanan.lebar} M` : null} />
                        <Baris label="Jumlah tampung" value={layanan.jumlah_tampung} />
                        <Baris label="Catatan" value={layanan.catatan_alamat} />
                    </div>

                    {layanan.foto_lahan && (
                        <div className="mt-3 flex gap-4 border-t border-gray-200 pt-3 text-sm">
                            <span className="w-32 shrink-0 text-gray-500">Foto Lahan Parkir</span>
                            <span className="text-gray-500">:</span>
                            
                               <a href={layanan.foto_lahan}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all text-blue-500 underline"
                            >
                                {layanan.foto_lahan}
                            </a>
                        </div>
                    )}
                </div>

                {status === 'ditolak' && (
                    <Link
                        href={`/mitra/layanan/barang?edit=${layanan.id}`}
                        className="mt-4 block w-full rounded-xl bg-green-600 py-3 text-center text-sm font-bold text-white hover:bg-green-700"
                    >
                        Verikasi Ulang
                    </Link>
                )}
            </div>
        </MitraLayout>
    );
}