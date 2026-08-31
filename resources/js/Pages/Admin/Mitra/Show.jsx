import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

/* ─────────────────────────────────────────────
   STATUS HELPERS
───────────────────────────────────────────── */
const STATUS_STYLE = {
    pendaftar:       'bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:border dark:border-slate-800',
    verifikasi_akun: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 dark:border dark:border-amber-800/50',
    terverifikasi:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/50',
    ditolak:         'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 dark:border dark:border-red-800/50',
    ditangguhkan:    'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 dark:border dark:border-orange-800/50',
};

const STATUS_LABEL = {
    pendaftar:       'Pendaftar',
    verifikasi_akun: 'Verifikasi Akun',
    terverifikasi:   'Terverifikasi',
    ditolak:         'Ditolak',
    ditangguhkan:    'Ditangguhkan',
};

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
    });
}

/* ─────────────────────────────────────────────
   ICON HELPERS (inline SVG)
───────────────────────────────────────────── */
function IconEye() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}
function IconExternal() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    );
}
function IconCheck() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}
function IconX() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}
function IconWarn() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );
}
function IconShield({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className || 'h-5 w-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );
}
function IconMap({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className || 'h-5 w-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

/* ─────────────────────────────────────────────
   SECTION STATUS BADGE
───────────────────────────────────────────── */
function SectionBadge({ status }) {
    if (status === 'terverifikasi') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 shrink-0">
                <IconCheck /> Disetujui
            </span>
        );
    }
    if (status === 'ditolak') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200/60 dark:border-red-800/50 shrink-0">
                <IconX /> Ditolak
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50 shrink-0">
            <IconWarn /> Menunggu Tinjauan
        </span>
    );
}

/* ─────────────────────────────────────────────
   REJECT / SUSPEND MODAL
───────────────────────────────────────────── */
function RejectModal({ title, onConfirm, onCancel, processing }) {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-gray-800 shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 shrink-0">
                        <IconX />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100">Konfirmasi Penolakan</h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{title}</p>
                    </div>
                </div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    Catatan Penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tuliskan alasan penolakan yang jelas agar mitra dapat memperbaiki pengajuannya..."
                    className="w-full rounded-xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50 text-slate-900 dark:text-gray-100 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                />
                <div className="mt-4 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-slate-300 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        disabled={!reason.trim() || processing}
                        onClick={() => onConfirm(reason)}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi Tolak'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   SECTION CARD WRAPPER
───────────────────────────────────────────── */
function SectionCard({ icon, title, subtitle, badge, children, accentColor = 'blue' }) {
    const headerBg = accentColor === 'blue'
        ? 'bg-gradient-to-r from-blue-500/8 to-transparent border-blue-100 dark:border-blue-900/40'
        : 'bg-gradient-to-r from-emerald-500/8 to-transparent border-emerald-100 dark:border-emerald-900/40';
    const iconBg = accentColor === 'blue'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm overflow-hidden transition-colors">
            <div className={`${headerBg} p-5 border-b border-slate-100 dark:border-gray-800`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} shrink-0`}>
                            {icon}
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-gray-100">{title}</h2>
                            {subtitle && <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
                        </div>
                    </div>
                    {badge}
                </div>
            </div>
            <div className="p-5">
                {children}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   DATA ROW
───────────────────────────────────────────── */
function DataRow({ label, value, highlight }) {
    return (
        <div className="grid grid-cols-5 gap-2 px-4 py-2.5 border-b border-slate-100 dark:border-gray-800/60 last:border-0">
            <dt className="col-span-2 text-sm text-slate-500 dark:text-gray-400 self-center">{label}</dt>
            <dd className={`col-span-3 text-sm self-center ${highlight ? 'font-semibold text-slate-900 dark:text-gray-100' : 'font-medium text-slate-700 dark:text-gray-300'}`}>
                {value || <span className="text-slate-400 dark:text-gray-600 italic font-normal">-</span>}
            </dd>
        </div>
    );
}

/* ─────────────────────────────────────────────
   COMPARISON TABLE ROW
───────────────────────────────────────────── */
function CompareRow({ label, inputValue }) {
    return (
        <tr className="border-b border-slate-100 dark:border-gray-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-colors">
            <td className="py-3 px-4 text-sm font-medium text-slate-600 dark:text-gray-400 w-1/3">{label}</td>
            <td className="py-3 px-4 text-sm font-semibold text-slate-900 dark:text-gray-100 w-1/3">
                {inputValue || <span className="text-slate-400 italic font-normal">-</span>}
            </td>
            <td className="py-3 px-4 text-sm text-slate-400 dark:text-gray-600 italic w-1/3">Lihat foto KTP</td>
        </tr>
    );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function Show({ partner }) {
    const isSuspended = Boolean(partner.suspended_at);
    const currentStatus = isSuspended ? 'ditangguhkan' : partner.verification_status;

    // Identity form
    const identityForm = useForm({
        verification_status: currentStatus,
        rejection_reason: partner.rejection_reason ?? '',
    });

    // Land modals & processing
    const [landRejectionModal, setLandRejectionModal] = useState(null); // svc.id | null
    const [landProcessing, setLandProcessing] = useState(false);

    // Identity modals
    const [showIdentityRejectModal, setShowIdentityRejectModal] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);

    function submitIdentityStatus(status, reason = '') {
        identityForm.setData({ verification_status: status, rejection_reason: reason });
        identityForm.patch(`/admin/partners/${partner.id}/status`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowIdentityRejectModal(false);
                setShowSuspendModal(false);
            },
        });
    }

    function submitLandStatus(serviceId, status, reason = '') {
        setLandProcessing(true);
        router.patch(
            `/admin/services/${serviceId}/verify`,
            { verification_status: status, rejection_reason: reason },
            {
                preserveScroll: true,
                onFinish: () => {
                    setLandProcessing(false);
                    setLandRejectionModal(null);
                },
            }
        );
    }

    const identityApproved = currentStatus === 'terverifikasi';
    const identityRejected = currentStatus === 'ditolak';

    return (
        <AdminLayout title="Panel Verifikasi Mitra">
            <Head title={`Verifikasi – ${partner.name}`} />

            {/* ── Modals ── */}
            {showIdentityRejectModal && (
                <RejectModal
                    title="Tolak Verifikasi Identitas"
                    processing={identityForm.processing}
                    onConfirm={(reason) => submitIdentityStatus('ditolak', reason)}
                    onCancel={() => setShowIdentityRejectModal(false)}
                />
            )}
            {showSuspendModal && (
                <RejectModal
                    title="Tangguhkan Akun Mitra"
                    processing={identityForm.processing}
                    onConfirm={(reason) => submitIdentityStatus('ditangguhkan', reason)}
                    onCancel={() => setShowSuspendModal(false)}
                />
            )}
            {landRejectionModal && (
                <RejectModal
                    title="Tolak Validasi Lahan"
                    processing={landProcessing}
                    onConfirm={(reason) => submitLandStatus(landRejectionModal, 'ditolak', reason)}
                    onCancel={() => setLandRejectionModal(null)}
                />
            )}

            {/* ── Back link + page title ── */}
            <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
                <Link
                    href="/admin/partners"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Daftar Mitra
                </Link>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[currentStatus] ?? 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_LABEL[currentStatus] ?? currentStatus}
                </span>
            </div>

            {/* ── Partner quick profile strip ── */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-5 shadow-sm">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-2xl font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
                    {partner.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-gray-100 truncate">{partner.name}</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 truncate">{partner.email} · ID Vendor #{partner.id}</p>
                </div>
                <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <div>
                        <dt className="text-xs text-slate-400 dark:text-gray-500">No. Telepon</dt>
                        <dd className="font-medium text-slate-700 dark:text-gray-300">{partner.phone ?? '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-slate-400 dark:text-gray-500">Kota</dt>
                        <dd className="font-medium text-slate-700 dark:text-gray-300">{partner.city ?? '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-slate-400 dark:text-gray-500">Bergabung</dt>
                        <dd className="font-medium text-slate-700 dark:text-gray-300">{formatDate(partner.created_at)}</dd>
                    </div>
                    {partner.suspended_at && (
                        <div>
                            <dt className="text-xs text-slate-400 dark:text-gray-500">Ditangguhkan</dt>
                            <dd className="font-medium text-orange-600 dark:text-orange-400">{formatDate(partner.suspended_at)}</dd>
                        </div>
                    )}
                </dl>
            </div>

            {/* ── Section divider label ── */}
            <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-gray-700 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-gray-500">Panel Verifikasi Independen</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-gray-700 to-transparent" />
            </div>

            <div className="flex flex-col gap-6">

                {/* SECTION 1 – VERIFIKASI IDENTITAS */}
                <SectionCard
                    accentColor="blue"
                    icon={<IconShield className="h-5 w-5" />}
                    title="Bagian 1 – Verifikasi Identitas"
                    subtitle="Periksa foto KTP dan kecocokan data yang diinputkan mitra."
                    badge={<SectionBadge status={currentStatus} />}
                >
                    {/* KTP photo link */}
                    <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-gray-200">Dokumen KTP &amp; Selfie</p>
                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                                Klik tombol untuk membuka foto KTP di tab baru dan periksa keasliannya.
                            </p>
                        </div>
                        {partner.foto_ktp ? (
                            
                              <a  href={`/storage/${partner.foto_ktp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 dark:bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors"
                            >
                                <IconEye /> Lihat Foto KTP
                            </a>
                        ) : (
                            <span className="shrink-0 rounded-xl bg-slate-100 dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-slate-400 dark:text-gray-500">
                                Belum Ada Foto
                            </span>
                        )}
                    </div>

                    {/* Comparison table */}
                    <div className="mb-5">
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-gray-200 mb-3">Tabel Perbandingan Data NIK / Nama</h3>
                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-gray-800/60 border-b border-slate-200 dark:border-gray-700">
                                    <tr>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400 w-1/3">Atribut</th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400 w-1/3">
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                Data Input Mitra
                                            </span>
                                        </th>
                                        <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400 w-1/3">
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                Data di Foto KTP
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-[#111827] divide-y divide-slate-100 dark:divide-gray-800">
                                    <CompareRow label="NIK" inputValue={partner.nik} />
                                    <CompareRow label="Nama Lengkap" inputValue={partner.name} />
                                    <CompareRow
                                        label="Jenis Kelamin"
                                        inputValue={
                                            partner.gender === 'male' ? 'Laki-laki'
                                            : partner.gender === 'female' ? 'Perempuan'
                                            : null
                                        }
                                    />
                                    <CompareRow label="Tanggal Lahir" inputValue={formatDate(partner.birth_date)} />
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-2 text-xs text-slate-400 dark:text-gray-600">
                            * Kolom "Data di Foto KTP" diisi secara manual oleh admin setelah membuka foto KTP di atas.
                        </p>
                    </div>

                    {/* Previous rejection reason */}
                    {partner.rejection_reason && (
                        <div className="mb-5 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-950/20 p-4">
                            <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide mb-1">Catatan Penolakan Sebelumnya</p>
                            <p className="text-sm text-red-700 dark:text-red-300">{partner.rejection_reason}</p>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="border-t border-slate-100 dark:border-gray-800 pt-4">
                        <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">
                            Setelah memeriksa foto KTP dan mencocokkan data di atas, pilih keputusan verifikasi identitas:
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                disabled={identityForm.processing || identityApproved}
                                onClick={() => submitIdentityStatus('terverifikasi')}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <IconCheck />
                                {identityApproved ? 'Sudah Disetujui' : 'Setujui Identitas'}
                            </button>

                            <button
                                disabled={identityForm.processing || identityRejected}
                                onClick={() => setShowIdentityRejectModal(true)}
                                className="inline-flex items-center gap-2 rounded-xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 px-6 py-2.5 text-sm font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <IconX />
                                {identityRejected ? 'Sudah Ditolak' : 'Tolak Identitas'}
                            </button>

                            <button
                                disabled={identityForm.processing || isSuspended}
                                onClick={() => setShowSuspendModal(true)}
                                className="inline-flex items-center gap-2 rounded-xl border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30 px-6 py-2.5 text-sm font-semibold text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <IconWarn />
                                {isSuspended ? 'Akun Ditangguhkan' : 'Tangguhkan Akun'}
                            </button>

                            {isSuspended && partner.restoration_requested_at && (
                                <Link
                                    href={`/admin/partners/${partner.id}/restore`}
                                    method="patch"
                                    as="button"
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    <IconCheck /> Pulihkan Akun
                                </Link>
                            )}
                        </div>
                    </div>
                </SectionCard>

                {/* ── Divider between the two sections ── */}
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-100 dark:bg-gray-800" />
                    <span className="text-xs text-slate-300 dark:text-gray-700 font-medium px-1">BAGIAN 2</span>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-gray-800" />
                </div>

                {/* SECTION 2 – VALIDASI LAHAN */}
                {partner.services && partner.services.length > 0 ? (
                    partner.services.map((svc) => {
                        const svcApproved = svc.verification_status === 'terverifikasi';
                        const svcRejected = svc.verification_status === 'ditolak';
                        const fotoUrl = svc.foto_lahan || svc.foto;
                        const fotoHref = fotoUrl
                            ? (fotoUrl.startsWith('http') ? fotoUrl : `/storage/${fotoUrl}`)
                            : null;

                        return (
                            <SectionCard
                                key={svc.id}
                                accentColor="emerald"
                                icon={<IconMap className="h-5 w-5" />}
                                title={`Bagian 2 – Validasi Lahan · ${svc.nama_usaha || svc.nama || `Layanan #${svc.id}`}`}
                                subtitle="Periksa detail gudang/lahan dan foto sebelum mengaktifkan layanan mitra."
                                badge={<SectionBadge status={svc.verification_status} />}
                            >
                                {/* Mandatory activation notice */}
                                {!svcApproved && (
                                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 p-4">
                                        <div className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400">
                                            <IconWarn />
                                        </div>
                                        <p className="text-sm text-amber-800 dark:text-amber-300">
                                            <strong>Wajib disetujui</strong> agar layanan mitra dapat diaktifkan.
                                            Tanpa persetujuan validasi lahan, mitra tidak dapat menerima pesanan.
                                        </p>
                                    </div>
                                )}

                                {/* Warehouse details grid */}
                                <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Location column */}
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500 mb-2">Lokasi &amp; Alamat</h3>
                                        <div className="rounded-xl border border-slate-100 dark:border-gray-800 overflow-hidden">
                                            <DataRow label="Nama Usaha"      value={svc.nama_usaha || svc.nama} highlight />
                                            <DataRow label="Provinsi"         value={svc.provinsi} />
                                            <DataRow label="Kabupaten / Kota" value={svc.kabupaten_kota || svc.kota} />
                                            <DataRow label="Kecamatan"        value={svc.kecamatan} />
                                            <DataRow label="Alamat Lengkap"   value={svc.alamat_lengkap} />
                                            {svc.catatan_alamat && (
                                                <DataRow label="Catatan Alamat" value={svc.catatan_alamat} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Dimensions + photo column */}
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500 mb-2">Dimensi Lahan</h3>
                                        <div className="rounded-xl border border-slate-100 dark:border-gray-800 overflow-hidden mb-4">
                                            <DataRow label="Panjang"        value={svc.panjang ? `${svc.panjang} M` : null} />
                                            <DataRow label="Lebar"          value={svc.lebar ? `${svc.lebar} M` : null} />
                                            <DataRow label="Jumlah Tampung" value={svc.jumlah_tampung} />
                                        </div>

                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500 mb-2">Foto Lahan</h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
                                            <p className="text-xs text-slate-500 dark:text-gray-400">
                                                Buka foto lahan di tab baru untuk memverifikasi lokasi.
                                            </p>
                                            {fotoHref ? (
                                                
                                                  <a  href={fotoHref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                                                >
                                                    <IconEye /> Lihat Foto Lahan <IconExternal />
                                                </a>
                                            ) : (
                                                <span className="shrink-0 rounded-lg bg-slate-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-slate-400 dark:text-gray-500">
                                                    Belum Ada Foto
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="border-t border-slate-100 dark:border-gray-800 pt-4">
                                    <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">
                                        Setelah memeriksa foto dan detail lahan di atas, pilih keputusan validasi lahan:
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            disabled={landProcessing || svcApproved}
                                            onClick={() => submitLandStatus(svc.id, 'terverifikasi')}
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                        >
                                            <IconCheck />
                                            {svcApproved ? 'Lahan Disetujui' : 'Setujui Lahan'}
                                        </button>

                                        <button
                                            disabled={landProcessing || svcRejected}
                                            onClick={() => setLandRejectionModal(svc.id)}
                                            className="inline-flex items-center gap-2 rounded-xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 px-6 py-2.5 text-sm font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <IconX />
                                            {svcRejected ? 'Lahan Ditolak' : 'Tolak Lahan'}
                                        </button>
                                    </div>
                                </div>
                            </SectionCard>
                        );
                    })
                ) : (
                    <SectionCard
                        accentColor="emerald"
                        icon={<IconMap className="h-5 w-5" />}
                        title="Bagian 2 – Validasi Lahan"
                        subtitle="Periksa detail gudang/lahan dan foto sebelum mengaktifkan layanan mitra."
                        badge={<SectionBadge status={null} />}
                    >
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-500">
                                <IconMap className="h-7 w-7" />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-gray-400">Mitra belum menambahkan informasi lahan/gudang.</p>
                            <p className="text-xs text-slate-400 dark:text-gray-600">Bagian ini akan muncul setelah mitra melengkapi data layanannya.</p>
                        </div>
                    </SectionCard>
                )}

            </div>
        </AdminLayout>
    );
}