import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { ArrowLeft, CheckCircle2, XCircle, Ban, Power, MapPin, User as UserIcon, X } from 'lucide-react';

const BASE_PATH = '/super-admin/layanan';

const STATUS_STYLE = {
    pendaftar: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    verifikasi_akun: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    terverifikasi: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400',
    ditolak: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400',
    ditangguhkan: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400',
};

const STATUS_LABEL = {
    pendaftar: 'Pendaftar',
    verifikasi_akun: 'Verifikasi Akun',
    terverifikasi: 'Terverifikasi',
    ditolak: 'Ditolak',
    ditangguhkan: 'Ditangguhkan',
};

const KATEGORI_LABEL = {
    barang: 'Barang',
    kendaraan: 'Kendaraan',
    bangunan: 'Bangunan',
    pindahan: 'Pick Up',
};

function formatHarga(value) {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function LayananShow({ layanan }) {
    const [rejectModal, setRejectModal] = useState(null); // 'ditolak' | 'ditangguhkan' | null
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const isBarang = layanan.kategori === 'barang';

    function submitStatus(status, rejectionReason = '') {
        setProcessing(true);
        router.patch(`${BASE_PATH}/${layanan.id}/status`, {
            verification_status: status,
            rejection_reason: rejectionReason,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setRejectModal(null);
                setReason('');
            },
        });
    }

    function handleToggleActive() {
        router.patch(`${BASE_PATH}/${layanan.id}/toggle-active`, {}, { preserveScroll: true });
    }

    const approved = layanan.verification_status === 'terverifikasi';
    const rejected = layanan.verification_status === 'ditolak';
    const suspended = layanan.verification_status === 'ditangguhkan';

    return (
        <SuperAdminLayout title="Detail Layanan">
            <Head title={`Detail - ${layanan.nama_usaha || layanan.nama}`} />

            <Link
                href={BASE_PATH}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
            >
                <ArrowLeft size={16} />
                Kembali ke daftar layanan
            </Link>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Info Utama */}
                <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <span className="inline-block rounded-full bg-slate-100 dark:bg-gray-800 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-gray-300 mb-2">
                                {KATEGORI_LABEL[layanan.kategori] ?? layanan.kategori}
                            </span>
                            <h1 className="text-base font-bold text-slate-900 dark:text-gray-100">
                                {layanan.nama_usaha || layanan.nama}
                            </h1>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[layanan.verification_status] ?? STATUS_STYLE.pendaftar}`}>
                            {STATUS_LABEL[layanan.verification_status] ?? layanan.verification_status}
                        </span>
                    </div>

                    {layanan.rejection_reason && (rejected || suspended) && (
                        <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 p-3 text-xs text-red-700 dark:text-red-300">
                            <span className="font-semibold">Catatan: </span>
                            {layanan.rejection_reason}
                        </div>
                    )}

                    <dl className="mt-5 space-y-3 text-sm">
                        {isBarang ? (
                            <>
                                <Row label="Alamat Lengkap" value={layanan.alamat_lengkap} />
                                <Row label="Wilayah" value={[layanan.kecamatan, layanan.kabupaten_kota, layanan.provinsi].filter(Boolean).join(', ')} />
                                <Row label="Ukuran" value={layanan.panjang && layanan.lebar ? `${layanan.panjang} × ${layanan.lebar} M` : '-'} />
                                <Row label="Kapasitas" value={layanan.jumlah_tampung} />
                                {layanan.catatan_alamat && <Row label="Catatan" value={layanan.catatan_alamat} />}
                            </>
                        ) : (
                            <>
                                <Row label="Kota" value={layanan.kota} />
                                <Row label="Kecamatan" value={layanan.kecamatan} />
                                <Row label="Harga" value={formatHarga(layanan.harga)} />
                                {layanan.jenis_kendaraan && <Row label="Jenis Kendaraan" value={layanan.jenis_kendaraan} />}
                                {layanan.jenis_bangunan && <Row label="Jenis Bangunan" value={layanan.jenis_bangunan} />}
                            </>
                        )}
                        <Row
                            label="Status Aktif"
                            value={
                                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                    layanan.is_active
                                        ? 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                    {layanan.is_active ? 'Aktif — menerima pesanan' : 'Nonaktif'}
                                </span>
                            }
                        />
                    </dl>

                    {/* Foto lahan (khusus barang) */}
                    {isBarang && layanan.foto_lahan_url?.length > 0 && (
                        <div className="mt-5">
                            <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-gray-400">Foto Lahan</p>
                            <div className="flex flex-wrap gap-2">
                                {layanan.foto_lahan_url.map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                        <img src={url} alt={`Foto lahan ${i + 1}`} className="h-20 w-20 rounded-lg object-cover border border-slate-200 dark:border-gray-700" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    {!isBarang && layanan.foto_url && (
                        <div className="mt-5">
                            <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-gray-400">Foto</p>
                            <a href={layanan.foto_url} target="_blank" rel="noopener noreferrer">
                                <img src={layanan.foto_url} alt={layanan.nama} className="h-32 w-32 rounded-lg object-cover border border-slate-200 dark:border-gray-700" />
                            </a>
                        </div>
                    )}

                    {/* Aksi Verifikasi */}
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 dark:border-gray-800 pt-4">
                        <button
                            type="button"
                            disabled={processing || approved}
                            onClick={() => submitStatus('terverifikasi')}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCircle2 size={14} />
                            {approved ? 'Sudah Disetujui' : 'Setujui Layanan'}
                        </button>

                        <button
                            type="button"
                            disabled={processing || rejected}
                            onClick={() => setRejectModal('ditolak')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-700 dark:bg-red-950/30 dark:text-red-400"
                        >
                            <XCircle size={14} />
                            {rejected ? 'Sudah Ditolak' : 'Tolak Layanan'}
                        </button>

                        <button
                            type="button"
                            disabled={processing || suspended}
                            onClick={() => setRejectModal('ditangguhkan')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-orange-700 dark:bg-orange-950/30 dark:text-orange-400"
                        >
                            <Ban size={14} />
                            {suspended ? 'Sudah Ditangguhkan' : 'Tangguhkan Layanan'}
                        </button>

                        <button
                            type="button"
                            onClick={handleToggleActive}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                                layanan.is_active
                                    ? 'border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                    : 'bg-green-700 text-white hover:bg-green-700'
                            }`}
                        >
                            <Power size={14} />
                            {layanan.is_active ? 'Tutup Paksa' : 'Buka Kembali'}
                        </button>
                    </div>
                </div>

                {/* Info Vendor */}
                <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                            <UserIcon size={16} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-gray-100">Pemilik Layanan</h3>
                    </div>
                    <dl className="space-y-3 text-sm">
                        <Row label="Nama Vendor" value={layanan.user?.name} />
                        <Row label="Email" value={layanan.user?.email} />
                        <Row label="No. Telepon" value={layanan.user?.phone} />
                        <Row label="Kota Vendor" value={layanan.user?.city} />
                    </dl>
                    {layanan.user?.id && (
                        <Link
                            href={`/super-admin/user/vendor/${layanan.user.id}`}
                            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-green-700 text-green-700 dark:border-green-500 dark:text-green-400 px-4 py-2 text-xs font-bold hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
                        >
                            <MapPin size={14} />
                            Lihat Profil Vendor
                        </Link>
                    )}
                </div>
            </div>

            {/* Modal Tolak / Tangguhkan */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-[#111827]">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                                {rejectModal === 'ditolak' ? 'Tolak Layanan' : 'Tangguhkan Layanan'}
                            </h3>
                            <button type="button" onClick={() => setRejectModal(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-gray-300">
                            Catatan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Tuliskan alasannya..."
                            className="w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-100"
                        />

                        <div className="mt-3 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setRejectModal(null)}
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={!reason.trim() || processing}
                                onClick={() => submitStatus(rejectModal, reason)}
                                className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'Konfirmasi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between gap-3">
            <dt className="shrink-0 text-slate-500 dark:text-gray-400">{label}</dt>
            <dd className="text-right font-medium text-slate-800 dark:text-gray-200">
                {value || <span className="italic text-slate-400 dark:text-gray-600">-</span>}
            </dd>
        </div>
    );
}