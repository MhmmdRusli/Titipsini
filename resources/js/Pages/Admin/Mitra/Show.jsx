import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

/* ---------------------------------------------
   STATUS HELPERS
--------------------------------------------- */
const STATUS_STYLE = {
    pendaftar: 'bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300',
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

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
    });
}

/* ---------------------------------------------
   FOTO HELPERS
   Backend bisa saja mengirim foto sebagai:
   - string path ("lahan/abc.jpg")
   - string URL penuh ("https://.../abc.jpg")
   - array of string (["lahan/a.jpg", "lahan/b.jpg"])
   - array of object ([{ path: "..." }, { url: "..." }])
   - object tunggal ({ path: "..." } / { url: "..." })
   - null / undefined (belum ada foto)

   resolveFotoUrl menormalkan semua kemungkinan itu menjadi
   satu string URL siap pakai, atau null kalau memang tidak ada.
--------------------------------------------- */
function resolveFotoUrl(foto) {
    if (!foto) return null;

    // Kalau array (relasi banyak foto), ambil elemen pertama
    if (Array.isArray(foto)) {
        foto = foto.length > 0 ? foto[0] : null;
    }

    // Kalau object relasi, ambil field yang paling mungkin berisi path/url
    if (foto && typeof foto === 'object') {
        foto = foto.path ?? foto.url ?? foto.foto_lahan ?? foto.foto ?? null;

        // Kalau ternyata masih object/array bersarang, coba sekali lagi
        if (foto && typeof foto === 'object') {
            foto = Array.isArray(foto) ? foto[0] : null;
        }
    }

    if (typeof foto !== 'string' || foto.trim() === '') return null;

    return foto.startsWith('http') ? foto : `/storage/${foto}`;
}

/* ---------------------------------------------
   ICONS
--------------------------------------------- */
function IconEye() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
        <svg xmlns="http://www.w3.org/2000/svg" className={className || 'h-4 w-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );
}
function IconMap({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className || 'h-4 w-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}
function IconChevronLeft() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    );
}
function IconPhone() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    );
}
function IconPin() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}
function IconCalendar() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}
function IconImage() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16v12H4V6z" />
        </svg>
    );
}

/* ---------------------------------------------
   STATUS BADGE
--------------------------------------------- */
function SectionBadge({ status }) {
    if (status === 'terverifikasi') {
        return (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-400">
                <IconCheck /> Disetujui
            </span>
        );
    }
    if (status === 'ditolak') {
        return (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400">
                <IconX /> Ditolak
            </span>
        );
    }
    return (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
            <IconWarn /> Menunggu
        </span>
    );
}

/* ---------------------------------------------
   STAT CHIP — kecil, satu baris
--------------------------------------------- */
function StatChip({ icon, label, value }) {
    return (
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-gray-800 dark:bg-gray-900/40">
            <span className="text-slate-400 dark:text-gray-500">{icon}</span>
            <span className="text-xs text-slate-400 dark:text-gray-500">{label}:</span>
            <span className="truncate text-xs font-medium text-slate-700 dark:text-gray-200">{value}</span>
        </div>
    );
}

/* ---------------------------------------------
   PHOTO PREVIEW — kecil, untuk foto KTP saja
--------------------------------------------- */
function PhotoPreview({ src, alt }) {
    if (!src) {
        return (
            <div className="flex h-28 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-300 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-600">
                <IconImage />
                <span className="text-[10px] font-medium">Tidak ada</span>
            </div>
        );
    }
    return (
        <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block h-28 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-gray-800 dark:bg-gray-900"
        >
            <img src={src} alt={alt} className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition-all group-hover:bg-slate-900/40 group-hover:opacity-100">
                <IconEye className="text-white" />
            </span>
        </a>
    );
}

/* ---------------------------------------------
   FACT ROW — pasangan label/nilai biasa (bukan baris tabel)
--------------------------------------------- */
function FactRow({ label, value }) {
    return (
        <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 py-2 last:border-0 dark:border-gray-800/60">
            <dt className="shrink-0 text-xs text-slate-500 dark:text-gray-400">{label}</dt>
            <dd className="truncate text-right text-sm font-semibold text-slate-900 dark:text-gray-100">
                {value || <span className="font-normal italic text-slate-400 dark:text-gray-600">-</span>}
            </dd>
        </div>
    );
}

/* ---------------------------------------------
   COMPARE ROW — baris <tr> untuk tabel perbandingan
   "Data Input Mitra" vs "Data di Foto KTP".
   Sebelumnya komponen ini dipakai di JSX tapi tidak pernah
   didefinisikan di file — inilah penyebab error "CompareRow is
   not defined".
--------------------------------------------- */
function CompareRow({ label, inputValue, ktpValue }) {
    return (
        <tr>
            <td className="px-4 py-3 align-top text-xs font-medium text-slate-500 dark:text-gray-400">
                {label}
            </td>
            <td className="px-4 py-3 align-top text-sm font-semibold text-slate-900 dark:text-gray-100">
                {inputValue || <span className="font-normal italic text-slate-400 dark:text-gray-600">-</span>}
            </td>
            <td className="px-4 py-3 align-top text-sm text-slate-500 dark:text-gray-400">
                {ktpValue || <span className="italic text-slate-400 dark:text-gray-600">Cek manual pada foto</span>}
            </td>
        </tr>
    );
}

/* ---------------------------------------------
   LINK ROW — untuk foto lahan (tautan biasa, bukan thumbnail)
--------------------------------------------- */
function PhotoLinkRow({ href }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900/40">
            <span className="text-xs text-slate-500 dark:text-gray-400">Foto Lahan</span>
            {href ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline dark:text-green-400"
                >
                    <IconEye /> Lihat Foto
                </a>
            ) : (
                <span className="text-xs italic text-slate-400 dark:text-gray-600">Belum ada</span>
            )}
        </div>
    );
}

/* ---------------------------------------------
   REJECT / SUSPEND MODAL
--------------------------------------------- */
function RejectModal({ title, onConfirm, onCancel, processing }) {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-[#111827]">
                <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                        <IconX />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-gray-100">Konfirmasi Penolakan</h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400">{title}</p>
                    </div>
                </div>

                <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-gray-300">
                    Catatan penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tuliskan alasan penolakan..."
                    className="w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-100"
                />

                <div className="mt-3 flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Batal
                    </button>
                    <button
                        disabled={!reason.trim() || processing}
                        onClick={() => onConfirm(reason)}
                        className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi Tolak'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------------------------------------------
   SECTION CARD WRAPPER
--------------------------------------------- */
function SectionCard({ icon, title, subtitle, badge, children }) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111827]">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-4 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-gray-100">{title}</h2>
                        {subtitle && <p className="text-xs text-slate-500 dark:text-gray-400">{subtitle}</p>}
                    </div>
                </div>
                {badge}
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

/* ---------------------------------------------
   MAIN PAGE
--------------------------------------------- */
export default function Show({ partner, reportCount = 0, latestReports = [], reportSuspendThreshold = 5 }) {
    const isSuspended = Boolean(partner.suspended_at);
    const currentStatus = isSuspended ? 'ditangguhkan' : partner.verification_status;

    const identityForm = useForm({
        verification_status: currentStatus,
        rejection_reason: partner.rejection_reason ?? '',
    });

    const [landRejectionModal, setLandRejectionModal] = useState(null);
    const [landProcessing, setLandProcessing] = useState(false);
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
            `/admin/partners/${partner.id}/services/${serviceId}/status`,
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

            <div className="mx-auto max-w-3xl">
                {/* Back link + status */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <Link
                        href="/admin/partners"
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                        <IconChevronLeft />
                        Kembali
                    </Link>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[currentStatus] ?? 'bg-slate-100 text-slate-600'}`}>
                        {STATUS_LABEL[currentStatus] ?? currentStatus}
                    </span>
                </div>

                {/* Partner hero */}
                <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white">
                            {partner.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="truncate text-sm font-semibold text-slate-900 dark:text-gray-100">{partner.name}</h1>
                            <p className="truncate text-xs text-slate-500 dark:text-gray-400">{partner.email} · #{partner.id}</p>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <StatChip icon={<IconPhone />} label="Telp" value={partner.phone ?? '-'} />
                        <StatChip icon={<IconPin />} label="Kota" value={partner.city ?? '-'} />
                        <StatChip icon={<IconCalendar />} label="Bergabung" value={formatDate(partner.created_at)} />
                        {partner.suspended_at && (
                            <StatChip icon={<IconWarn />} label="Ditangguhkan" value={formatDate(partner.suspended_at)} />
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                {reportCount >= reportSuspendThreshold && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/40 dark:bg-red-950/20">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0 text-red-600 dark:text-red-400">
                                <IconWarn />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                                    Sudah ada {reportCount} laporan kepada vendor ini
                                </p>
                                <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                                    Vendor ini telah melebihi ambang batas laporan ({reportSuspendThreshold}). Pertimbangkan untuk menangguhkan akun ini.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {latestReports && latestReports.length > 0 && (
                    <SectionCard
                        icon={<IconWarn />}
                        title="Laporan Terbaru"
                        subtitle="5 laporan terakhir terhadap vendor ini"
                    >
                        <div className="space-y-2">
                            {latestReports.map((r) => (
                                <div key={r.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-gray-800 dark:bg-gray-900/40">
                                    <p className="text-xs font-semibold text-slate-700 dark:text-gray-200">#{r.order?.order_code ?? r.order_id}</p>
                                    <p className="mt-1 text-xs text-slate-600 dark:text-gray-300">{r.description || '-'}</p>
                                    <p className="mt-1 text-[10px] text-slate-400 dark:text-gray-500">
                                        {r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}
                    {/* SECTION 1 – IDENTITAS */}
                    <SectionCard
                        icon={<IconShield />}
                        title="Verifikasi Identitas"
                        subtitle="Bandingkan foto KTP dengan data mitra"
                        badge={<SectionBadge status={currentStatus} />}
                    >
                        {currentStatus === 'pendaftar' ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-gray-800 dark:text-gray-500">
                                    <IconShield className="h-5 w-5" />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                    Mitra belum mengajukan verifikasi identitas (KTP)
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <p className="text-xs text-slate-500 dark:text-gray-400">
                                        Foto KTP yang diunggah mitra
                                    </p>
                                    {partner.foto_ktp ? (
                                        <a
                                            href={`/storage/${partner.foto_ktp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                                        >
                                            <IconEye /> Lihat Foto KTP
                                        </a>
                                    ) : (
                                        <span className="shrink-0 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-400 dark:bg-gray-800 dark:text-gray-500">
                                            Belum Ada Foto
                                        </span>
                                    )}
                                </div>

                                <div className="mb-5">
                                    <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-gray-200">
                                        Perbandingan Data NIK &amp; Nama
                                    </h3>
                                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700">
                                        <table className="w-full text-left">
                                            <thead className="border-b border-slate-200 bg-slate-50 dark:border-gray-700 dark:bg-gray-800/60">
                                                <tr>
                                                    <th className="w-1/3 px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400">
                                                        Atribut
                                                    </th>
                                                    <th className="w-1/3 px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                            Data Input Mitra
                                                        </span>
                                                    </th>
                                                    <th className="w-1/3 px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                            Data di Foto KTP
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white dark:divide-gray-800 dark:bg-[#111827]">
                                                <CompareRow label="NIK" inputValue={partner.nik} />
                                                <CompareRow label="Nama Lengkap" inputValue={partner.name} />
                                                <CompareRow
                                                    label="Jenis Kelamin"
                                                    inputValue={
                                                        partner.gender === 'male'
                                                            ? 'Laki-laki'
                                                            : partner.gender === 'female'
                                                            ? 'Perempuan'
                                                            : null
                                                    }
                                                />
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-2">
                                        <FactRow label="Tanggal Lahir" value={formatDate(partner.birth_date)} />
                                    </div>
                                </div>

                                {partner.rejection_reason && (
                                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/40 dark:bg-red-950/20">
                                        <p className="mb-0.5 text-xs font-semibold text-red-700 dark:text-red-400">
                                            Catatan Penolakan Sebelumnya
                                        </p>
                                        <p className="text-xs text-red-700 dark:text-red-300">{partner.rejection_reason}</p>
                                    </div>
                                )}

                                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-gray-800">
                                    <button
                                        disabled={identityForm.processing || identityApproved}
                                        onClick={() => submitIdentityStatus('terverifikasi')}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <IconCheck />
                                        {identityApproved ? 'Sudah Disetujui' : 'Setujui Identitas'}
                                    </button>

                                    <button
                                        disabled={identityForm.processing || identityRejected}
                                        onClick={() => setShowIdentityRejectModal(true)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-700 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
                                    >
                                        <IconX />
                                        {identityRejected ? 'Sudah Ditolak' : 'Tolak Identitas'}
                                    </button>

                                    <button
                                        disabled={identityForm.processing || isSuspended}
                                        onClick={() => setShowSuspendModal(true)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-orange-700 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-950/60"
                                    >
                                        <IconWarn />
                                        {isSuspended ? 'Akun Ditangguhkan' : 'Tangguhkan Akun'}
                                    </button>

                                    {isSuspended && partner.restoration_requested_at && (
                                        <Link
                                            href={`/admin/partners/${partner.id}/restore`}
                                            method="patch"
                                            as="button"
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                                        >
                                            <IconCheck /> Pulihkan Akun
                                        </Link>
                                    )}
                                </div>
                            </>
                        )}
                    </SectionCard>

                    {/* SECTION 2 – VALIDASI LAHAN */}
                    {partner.services && partner.services.length > 0 ? (
                        partner.services.map((svc) => {
                            const svcApproved = svc.verification_status === 'terverifikasi';
                            const svcRejected = svc.verification_status === 'ditolak';

                            // Normalkan foto lahan (bisa string, array, atau object relasi)
                            // sebelum dipakai sebagai href, supaya tidak crash saat
                            // bentuk datanya bukan string murni.
                            const fotoHref = resolveFotoUrl(svc.foto_lahan) ?? resolveFotoUrl(svc.foto_kendaraan) ?? resolveFotoUrl(svc.foto);

                            return (
                                <SectionCard
                                    key={svc.id}
                                    icon={<IconMap />}
                                    title={`Validasi Lahan · ${svc.nama_usaha || svc.nama || `Layanan #${svc.id}`}`}
                                    subtitle="Periksa lokasi sebelum mengaktifkan layanan mitra"
                                    badge={<SectionBadge status={svc.verification_status} />}
                                >
                                    {!svcApproved && (
                                        <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/40 dark:bg-amber-950/20">
                                            <div className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400">
                                                <IconWarn />
                                            </div>
                                            <p className="text-xs text-amber-800 dark:text-amber-300">
                                                <strong>Wajib disetujui</strong> agar layanan mitra dapat diaktifkan dan menerima pesanan.
                                            </p>
                                        </div>
                                    )}

                                    <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                                        {svc.nama_usaha || svc.nama}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-600 dark:text-gray-300">
                                        {svc.alamat_lengkap || 'Alamat belum diisi'}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-500">
                                        {[svc.kecamatan, svc.kabupaten_kota || svc.kota, svc.provinsi].filter(Boolean).join(', ') || '-'}
                                    </p>
                                    {svc.catatan_alamat && (
                                        <p className="mt-1 text-xs italic text-slate-400 dark:text-gray-500">"{svc.catatan_alamat}"</p>
                                    )}

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {(svc.panjang || svc.lebar) && (
                                            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                                                {svc.panjang ?? '-'} × {svc.lebar ?? '-'} M
                                            </span>
                                        )}
                                        {svc.jumlah_tampung && (
                                            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                                                Kapasitas {svc.jumlah_tampung}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        <PhotoLinkRow href={fotoHref} />
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-gray-800">
                                        <button
                                            disabled={landProcessing || svcApproved}
                                            onClick={() => submitLandStatus(svc.id, 'terverifikasi')}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <IconCheck />
                                            {svcApproved ? 'Lahan Disetujui' : 'Setujui Lahan'}
                                        </button>

                                        <button
                                            disabled={landProcessing || svcRejected}
                                            onClick={() => setLandRejectionModal(svc.id)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-700 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
                                        >
                                            <IconX />
                                            {svcRejected ? 'Lahan Ditolak' : 'Tolak Lahan'}
                                        </button>
                                    </div>
                                </SectionCard>
                            );
                        })
                    ) : (
                        <SectionCard
                            icon={<IconMap />}
                            title="Validasi Lahan"
                            subtitle="Periksa detail gudang/lahan sebelum mengaktifkan layanan mitra"
                            badge={<SectionBadge status={null} />}
                        >
                            <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-gray-800 dark:text-gray-500">
                                    <IconMap className="h-5 w-5" />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-gray-400">Mitra belum menambahkan informasi lahan/gudang</p>
                            </div>
                        </SectionCard>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}