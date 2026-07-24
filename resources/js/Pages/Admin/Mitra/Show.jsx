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

            <div className="mt-4 grid gap-6 lg:grid-cols-3">
                {/* Kartu identitas */}
                <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 lg:col-span-1 shadow-sm transition-colors">
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
                            <dt className="text-slate-500 dark:text-gray-400">Jenis Kelamin</dt>
                            <dd className="font-medium text-slate-800 dark:text-gray-200">
                                {partner.gender === 'male' ? 'Laki-laki' : partner.gender === 'female' ? 'Perempuan' : '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-gray-400">Kota</dt>
                            <dd className="font-medium text-slate-800 dark:text-gray-200">{partner.city ?? '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-gray-400">Bergabung</dt>
                            <dd className="font-medium text-slate-800 dark:text-gray-200">{formatDate(partner.created_at)}</dd>
                        </div>
                        {partner.address && (
                            <div>
                                <dt className="text-slate-500 dark:text-gray-400">Alamat</dt>
                                <dd className="mt-1 font-medium text-slate-800 dark:text-gray-200">{partner.address}</dd>
                            </div>
                        )}
                        {partner.rejection_reason && (
                            <div>
                                <dt className="text-slate-500 dark:text-gray-400">Catatan / Alasan</dt>
                                <dd className="mt-1 font-medium text-red-600 dark:text-red-400">{partner.rejection_reason}</dd>
                            </div>
                        )}
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

                {/* Aksi moderasi */}
                <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 lg:col-span-2 shadow-sm transition-colors">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100">Tindakan Verifikasi</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                        Ubah status akun vendor ini sesuai hasil peninjauan data legalitas atau pelanggaran.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            disabled={processing || currentStatus === 'terverifikasi'}
                            onClick={() => submitStatus('terverifikasi')}
                            className="rounded-lg bg-emerald-600 dark:bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors disabled:opacity-50"
                        >
                            Verifikasi / Setujui
                        </button>
                        <button
                            disabled={processing}
                            onClick={() => setReasonModal('ditolak')}
                            className="rounded-lg bg-red-600 dark:bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-500 transition-colors disabled:opacity-50"
                        >
                            Tolak
                        </button>
                        <button
                            disabled={processing || currentStatus === 'ditangguhkan'}
                            onClick={() => setReasonModal('ditangguhkan')}
                            className="rounded-lg bg-orange-600 dark:bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 dark:hover:bg-orange-500 transition-colors disabled:opacity-50"
                        >
                            Tangguhkan Akun
                        </button>

                        {/* TOMBOL PEMULIHAN AKUN (Hanya tampil jika akun sedang ditangguhkan) */}
                        {isSuspended && partner.restoration_requested_at && (
                            <Link
                                href={`/admin/partners/${partner.id}/restore`}
                                method="patch"
                                as="button"
                                className="rounded-lg bg-emerald-600 dark:bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 dark:hover:bg-emerald-500 transition-colors"
                            >
                                Pulihkan Akun Mitra
                            </Link>
                        )}
                    </div>

                    {reasonModal && (
                        <div className="mt-5 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/60 p-4 transition-colors">
                            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                                Alasan {reasonModal === 'ditolak' ? 'penolakan' : 'penangguhan'}
                            </label>
                            <textarea
                                rows={3}
                                value={data.rejection_reason}
                                onChange={(e) => setData('rejection_reason', e.target.value)}
                                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#111827] text-slate-900 dark:text-gray-100 p-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="Tuliskan alasannya di sini..."
                            />
                            <div className="mt-3 flex gap-2">
                                <button
                                    disabled={processing || !data.rejection_reason}
                                    onClick={() => submitStatus(reasonModal, data.rejection_reason)}
                                    className="rounded-lg bg-slate-900 dark:bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors disabled:opacity-50"
                                >
                                    Kirim
                                </button>
                                <button
                                    onClick={() => setReasonModal(null)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}