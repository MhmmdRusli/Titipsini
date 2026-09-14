import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ChevronLeft, ExternalLink, ShieldCheck, Ban, X,
    User as UserIcon, Store, AlertTriangle,
} from 'lucide-react';

const APPROVAL_STYLE = {
    pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border border-red-200',
};

const APPROVAL_LABEL = {
    pending: 'Menunggu Verifikasi',
    approved: 'Disetujui Admin',
    rejected: 'Ditolak Admin',
};

const STATUS_LABEL = {
    menunggu: 'Menunggu',
    siap_refund: 'Siap Refund (Finance)',
    disetujui: 'Disetujui Final',
    ditolak: 'Ditolak',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

/* ─────────────────────────────────────────────
   MODAL APPROVE (lolos verifikasi admin)
───────────────────────────────────────────── */
function ApproveModal({ report, onClose }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        admin_approval_note: '',
    });

    function submit() {
        patch(route('admin.laporan-validasi.approve', report.id), {
            preserveScroll: true,
            onSuccess: () => { reset(); onClose(); },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Setujui Laporan
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Order #{report.order_code}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-3 px-5 py-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Pastikan data kronologi, kondisi barang, dan foto bukti sudah logis.
                        Setelah disetujui, laporan akan diteruskan ke <strong>Finance</strong> untuk proses refund.
                    </p>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">
                        Catatan Verifikasi <span className="font-normal text-gray-400">(opsional)</span>
                    </label>
                    <textarea
                        rows={4}
                        value={data.admin_approval_note}
                        onChange={(e) => setData('admin_approval_note', e.target.value)}
                        placeholder="cth: Bukti foto konsisten dengan kronologi customer. Taksiran wajar."
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900"
                    />
                </div>

                <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-gray-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {processing ? 'Memproses...' : 'Setujui & Teruskan'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   MODAL REJECT (tolak verifikasi admin)
───────────────────────────────────────────── */
function RejectModal({ report, onClose }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        admin_approval_note: '',
    });

    function submit() {
        if (!data.admin_approval_note.trim()) return;
        patch(route('admin.laporan-validasi.reject', report.id), {
            preserveScroll: true,
            onSuccess: () => { reset(); onClose(); },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                            <Ban size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Tolak Laporan
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Order #{report.order_code}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-3 px-5 py-4">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200">
                        Alasan Penolakan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        value={data.admin_approval_note}
                        onChange={(e) => setData('admin_approval_note', e.target.value)}
                        placeholder="cth: Bukti foto tidak konsisten dengan kronologi, refund tidak dapat diproses."
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900"
                    />
                    {errors.admin_approval_note && (
                        <p className="text-xs text-red-500">{errors.admin_approval_note}</p>
                    )}
                </div>

                <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-900/40">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing || !data.admin_approval_note.trim()}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi Tolak'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Show({ report }) {
    const [modal, setModal] = useState(null);

    useEffect(() => {
        document.body.style.overflow = modal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [modal]);

    const isPending = report.admin_approval === 'pending';
    const backUrl = route('admin.laporan-validasi.index');

    return (
        <AdminLayout title="Detail Laporan Kerugian">
            <Head title={`Validasi #${report.order_code}`} />

            <Link
                href={backUrl}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
            >
                <ChevronLeft size={14} />
                Kembali ke daftar Validasi Laporan
            </Link>

            <div className="mt-4 grid gap-5 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Laporan Kerugian
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                                    #{report.order_code ?? '-'}
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Diajukan: {report.created_at ?? '-'}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                    APPROVAL_STYLE[report.admin_approval] ?? 'bg-gray-100 text-gray-700'
                                }`}>
                                    {APPROVAL_LABEL[report.admin_approval] ?? report.admin_approval}
                                </span>
                                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                                    Status: {STATUS_LABEL[report.status] ?? report.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3 text-sm">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Kronologi
                                </p>
                                <p className="mt-1 whitespace-pre-wrap rounded-xl bg-gray-50 p-3 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200">
                                    {report.description || '-'}
                                </p>
                            </div>

                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                                    Total Pesanan
                                </p>
                                <p className="mt-1 text-base font-bold text-emerald-700 dark:text-emerald-300">
                                    {formatRupiah(report.total_price)}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111827]">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                                    Perbandingan Bukti Foto
                                </p>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Foto Customer */}
                                    <div>
                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                            Foto Customer
                                        </p>
                                        {report.evidence_url ? (
                                            <a
                                                href={report.evidence_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                                            >
                                                <img
                                                    src={report.evidence_url}
                                                    alt="Bukti Customer"
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </a>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">Tidak ada bukti.</p>
                                        )}
                                    </div>

                                    {/* Foto Mitra (Kondisi Awal) */}
                                    <div>
                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                            Foto Mitra (Kondisi Awal)
                                        </p>
                                        {report.kondisi_awal?.foto_urls?.length ? (
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {report.kondisi_awal.foto_urls.map((url, i) => (
                                                    <a
                                                        key={i}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                                                    >
                                                        <img
                                                            src={url}
                                                            alt={`Mitra ${i + 1}`}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">Mitra belum mengirim dokumentasi.</p>
                                        )}
                                        {report.kondisi_awal?.catatan && (
                                            <p className="mt-2 text-[10px] text-gray-500 dark:text-gray-400">
                                                Catatan: {report.kondisi_awal.catatan}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {report.admin_approval_note && (
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Catatan Admin
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm italic text-gray-700 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                                        {report.admin_approval_note}
                                    </p>
                                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                        oleh {report.admin_approver_name ?? 'Admin'} - {report.admin_approval_at ?? '-'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Customer
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <UserIcon size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {report.customer_name ?? '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Vendor
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <Store size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    {report.partner_name ?? '-'}
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    {report.service_type ? `Layanan: ${report.service_type}` : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {isPending && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/30">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                                Verifikasi Admin
                            </p>
                            <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                                Periksa data kronologi, kondisi barang, dan foto bukti.
                                Setelah Anda setujui, laporan diteruskan ke <strong>Finance</strong>.
                            </p>
                            <div className="mt-3 space-y-2">
                                <button
                                    type="button"
                                    onClick={() => setModal({ kind: 'approve' })}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-gray-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Setujui & Teruskan ke Finance
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModal({ kind: 'reject' })}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:bg-transparent dark:hover:bg-red-950/30"
                                >
                                    <Ban size={14} />
                                    Tolak Laporan
                                </button>
                            </div>
                        </div>
                    )}

                    {!isPending && report.admin_approval === 'approved' && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                                Sudah Disetujui
                            </p>
                            <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-200">
                                Laporan diteruskan ke Finance untuk proses refund.
                                Status saat ini: <strong>{STATUS_LABEL[report.status]}</strong>.
                            </p>
                        </div>
                    )}

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-[11px] text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
                        <p className="font-semibold">
                            <AlertTriangle size={11} className="inline -mt-0.5" /> Info Alur 2-tier
                        </p>
                        <p className="mt-1">
                            Customer → <strong>Admin verifikasi</strong> (halaman ini) → <strong>Finance proses refund</strong>.
                            Finance tidak dapat memproses laporan sampai Anda setujui di sini.
                        </p>
                    </div>
                </div>
            </div>

            {modal?.kind === 'approve' && (
                <ApproveModal report={report} onClose={() => setModal(null)} />
            )}
            {modal?.kind === 'reject' && (
                <RejectModal report={report} onClose={() => setModal(null)} />
            )}
        </AdminLayout>
    );
}
