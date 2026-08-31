import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_STYLE = {
    pendaftar: 'bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:border dark:border-slate-800',
    verifikasi_akun: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 dark:border dark:border-amber-800/50',
    terverifikasi: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/50',
    ditolak: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 dark:border dark:border-red-800/50',
    ditangguhkan: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 dark:border dark:border-orange-800/50',
};

const STATUS_LABEL = {
    pendaftar: 'Pendaftar',
    verifikasi_akun: 'Verifikasi Akun',
    terverifikasi: 'Terverifikasi',
    ditolak: 'Ditolak',
    ditangguhkan: 'Ditangguhkan',
};

export default function Show({ partner }) {
    const [reasonModal, setReasonModal] = useState(null); // 'ditolak' | 'ditangguhkan' | null

    // Tentukan status tampilan awal berdasarkan apakah partner sedang disuspend atau tidak
    const isSuspended = Boolean(partner.suspended_at);
    const currentStatus = isSuspended ? 'ditangguhkan' : partner.verification_status;

    const { data, setData, patch, processing } = useForm({
        verification_status: currentStatus,
        rejection_reason: partner.rejection_reason ?? '',
    });

    function submitStatus(status, reason = null) {
        const payloadStatus = status === 'ditangguhkan' ? 'ditangguhkan' : status;

        // Perbarui data form terlebih dahulu, lalu kirimkan patch
        setData({
            verification_status: payloadStatus,
            rejection_reason: reason ?? '',
        });

        patch(`/admin/partners/${partner.id}/status`, {
            preserveScroll: true,
            onSuccess: () => {
                setReasonModal(null);
            },
        });
    }

    function formatDate(value) {
        if (!value) return '-';
        return new Date(value).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }

    return (
        <AdminLayout title="Detail Vendor">
            <Head title={`Detail Vendor - ${partner.name}`} />

            <Link
                href="/admin/partners"
                className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
                &larr; Kembali ke daftar Vendor
            </Link>

            <div className="mt-4 flex flex-col gap-6">
                {/* 1. BAGIAN ATAS: Tautan Interaktif KTP */}
                <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100">Dokumen KTP & Selfie</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                            Klik tombol di sebelah kanan untuk melihat dokumen KTP dalam ukuran penuh tanpa mengambil ruang di halaman ini.
                        </p>
                    </div>
                    {partner.foto_ktp ? (
                        <a
                            href={`/storage/${partner.foto_ktp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-lg bg-slate-900 dark:bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shrink-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Lihat Foto KTP
                        </a>
                    ) : (
                        <span className="text-sm font-medium text-slate-400 bg-slate-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
                            Belum Ada Foto
                        </span>
                    )}
                </div>

                {/* 2. BAGIAN TENGAH: Profil & Tabel Perbandingan */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profil Singkat */}
                    <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm transition-colors">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-2xl font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40 overflow-hidden">
                                {partner.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-gray-100">{partner.name}</h2>
                            <p className="text-sm text-slate-500 dark:text-gray-400">ID Vendor #{partner.id}</p>
                            <span
                                className={`mt-3 rounded-full px-3 py-1 text-xs font-medium ${
                                    STATUS_STYLE[currentStatus] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                {STATUS_LABEL[currentStatus] ?? currentStatus}
                            </span>
                        </div>

                        <dl className="mt-6 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-slate-500 dark:text-gray-400">Email</dt>
                                <dd className="font-medium text-slate-800 dark:text-gray-200">{partner.email}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500 dark:text-gray-400">No. Telepon</dt>
                                <dd className="font-medium text-slate-800 dark:text-gray-200">{partner.phone ?? '-'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500 dark:text-gray-400">Kota</dt>
                                <dd className="font-medium text-slate-800 dark:text-gray-200">{partner.city ?? '-'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500 dark:text-gray-400">Bergabung</dt>
                                <dd className="font-medium text-slate-800 dark:text-gray-200">{formatDate(partner.created_at)}</dd>
                            </div>
                            {partner.suspended_at && (
                                <div>
                                    <dt className="text-slate-500 dark:text-gray-400">Ditangguhkan Sejak</dt>
                                    <dd className="mt-1 font-medium text-orange-600 dark:text-orange-400">{formatDate(partner.suspended_at)}</dd>
                                </div>
                            )}
                            {partner.restoration_requested_at && (
                                <div>
                                    <dt className="text-slate-500 dark:text-gray-400">Mengajukan Pemulihan</dt>
                                    <dd className="mt-1 font-medium text-emerald-600 dark:text-emerald-400">{formatDate(partner.restoration_requested_at)}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Tabel Perbandingan */}
                    <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm transition-colors lg:col-span-2 flex flex-col">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100 mb-4">Perbandingan Data Legalitas</h3>
                        <div className="overflow-x-auto border border-slate-200 dark:border-gray-700 rounded-lg">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-gray-400">
                                <thead className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="py-3 px-4 font-medium text-slate-900 dark:text-gray-100 w-1/3">Atribut</th>
                                        <th className="py-3 px-4 font-medium text-slate-900 dark:text-gray-100 w-1/3">Data Input Mitra</th>
                                        <th className="py-3 px-4 font-medium text-slate-900 dark:text-gray-100 w-1/3">Data di Foto KTP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-gray-200">NIK</td>
                                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-gray-200">{partner.nik ?? '-'}</td>
                                        <td className="py-3 px-4 text-slate-400 italic">Lihat KTP</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-gray-200">Nama Lengkap</td>
                                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-gray-200">{partner.name}</td>
                                        <td className="py-3 px-4 text-slate-400 italic">Lihat KTP</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-gray-200">Jenis Kelamin</td>
                                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-gray-200">{partner.gender === 'male' ? 'Laki-laki' : partner.gender === 'female' ? 'Perempuan' : '-'}</td>
                                        <td className="py-3 px-4 text-slate-400 italic">Lihat KTP</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-gray-200">Tanggal Lahir</td>
                                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-gray-200">{formatDate(partner.birth_date)}</td>
                                        <td className="py-3 px-4 text-slate-400 italic">Lihat KTP</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 3. BAGIAN BAWAH: Aksi Moderasi & Text Area */}
                <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm transition-colors">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100 mb-2">Panel Keputusan Verifikasi</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">
                        Berikan catatan jika ada penolakan, lalu pilih aksi verifikasi di bawah ini.
                    </p>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                            Catatan Penolakan / Penangguhan (Opsional)
                        </label>
                        <textarea
                            rows={3}
                            value={data.rejection_reason}
                            onChange={(e) => setData('rejection_reason', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#111827] text-slate-900 dark:text-gray-100 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Tuliskan catatan atau alasan penolakan di sini, lalu tekan tombol Tolak atau Tangguhkan..."
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            disabled={processing || currentStatus === 'terverifikasi'}
                            onClick={() => submitStatus('terverifikasi')}
                            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                            Verifikasi / Setujui
                        </button>
                        <button
                            disabled={processing || (currentStatus === 'ditolak' && !data.rejection_reason)}
                            onClick={() => submitStatus('ditolak', data.rejection_reason)}
                            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            Tolak
                        </button>
                        <button
                            disabled={processing || currentStatus === 'ditangguhkan'}
                            onClick={() => submitStatus('ditangguhkan', data.rejection_reason)}
                            className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                            Tangguhkan Akun
                        </button>

                        {isSuspended && partner.restoration_requested_at && (
                            <Link
                                href={`/admin/partners/${partner.id}/restore`}
                                method="patch"
                                as="button"
                                className="rounded-lg bg-slate-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                            >
                                Pulihkan Akun Mitra
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}