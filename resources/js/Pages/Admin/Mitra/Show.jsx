import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_STYLE = {
    pendaftar: 'bg-slate-100 text-slate-600',
    verifikasi_akun: 'bg-amber-100 text-amber-700',
    terverifikasi: 'bg-emerald-100 text-emerald-700',
    ditolak: 'bg-red-100 text-red-700',
    ditangguhkan: 'bg-orange-100 text-orange-700',
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
                className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
                &larr; Kembali ke daftar Vendor
            </Link>

            <div className="mt-4 grid gap-6 lg:grid-cols-3">
                {/* Kartu identitas */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-1">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-2xl font-semibold text-teal-700">
                            {partner.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-slate-900">{partner.name}</h2>
                        <p className="text-sm text-slate-500">ID Vendor #{partner.id}</p>
                        <span
                            className={`mt-3 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[currentStatus]
                                }`}
                        >
                            {STATUS_LABEL[currentStatus]}
                        </span>
                    </div>

                    <dl className="mt-6 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Email</dt>
                            <dd className="font-medium text-slate-800">{partner.email}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">No. Telepon</dt>
                            <dd className="font-medium text-slate-800">{partner.phone ?? '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Jenis Kelamin</dt>
                            <dd className="font-medium text-slate-800">
                                {partner.gender === 'male' ? 'Laki-laki' : partner.gender === 'female' ? 'Perempuan' : '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Kota</dt>
                            <dd className="font-medium text-slate-800">{partner.city ?? '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Bergabung</dt>
                            <dd className="font-medium text-slate-800">{formatDate(partner.created_at)}</dd>
                        </div>
                        {partner.address && (
                            <div>
                                <dt className="text-slate-500">Alamat</dt>
                                <dd className="mt-1 font-medium text-slate-800">{partner.address}</dd>
                            </div>
                        )}
                        {partner.rejection_reason && (
                            <div>
                                <dt className="text-slate-500">Catatan / Alasan</dt>
                                <dd className="mt-1 font-medium text-red-600">{partner.rejection_reason}</dd>
                            </div>
                        )}
                        {partner.suspended_at && (
                            <div>
                                <dt className="text-slate-500">Ditangguhkan Sejak</dt>
                                <dd className="mt-1 font-medium text-orange-600">{formatDate(partner.suspended_at)}</dd>
                            </div>
                        )}
                        {partner.restoration_requested_at && (
                            <div>
                                <dt className="text-slate-500">Mengajukan Pemulihan</dt>
                                <dd className="mt-1 font-medium text-teal-600">{formatDate(partner.restoration_requested_at)}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Aksi moderasi */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
                    <h3 className="text-base font-semibold text-slate-900">Tindakan Verifikasi</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Ubah status akun vendor ini sesuai hasil peninjauan data legalitas atau pelanggaran.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            disabled={processing || currentStatus === 'terverifikasi'}
                            onClick={() => submitStatus('terverifikasi')}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                            Verifikasi / Setujui
                        </button>
                        <button
                            disabled={processing}
                            onClick={() => setReasonModal('ditolak')}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            Tolak
                        </button>
                        <button
                            disabled={processing || currentStatus === 'ditangguhkan'}
                            onClick={() => setReasonModal('ditangguhkan')}
                            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                        >
                            Tangguhkan Akun
                        </button>

                        {/* TOMBOL PEMULIHAN AKUN (Hanya tampil jika akun sedang ditangguhkan) */}
                        {isSuspended && partner.restoration_requested_at && (
                            <Link
                                href={`/admin/partners/${partner.id}/restore`}
                                method="patch"
                                as="button"
                                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition"
                            >
                                Pulihkan Akun Mitra
                            </Link>
                        )}
                    </div>

                    {reasonModal && (
                        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <label className="block text-sm font-medium text-slate-700">
                                Alasan {reasonModal === 'ditolak' ? 'penolakan' : 'penangguhan'}
                            </label>
                            <textarea
                                rows={3}
                                value={data.rejection_reason}
                                onChange={(e) => setData('rejection_reason', e.target.value)}
                                className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                placeholder="Tuliskan alasannya di sini..."
                            />
                            <div className="mt-3 flex gap-2">
                                <button
                                    disabled={processing || !data.rejection_reason}
                                    onClick={() => submitStatus(reasonModal, data.rejection_reason)}
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    Kirim
                                </button>
                                <button
                                    onClick={() => setReasonModal(null)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
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