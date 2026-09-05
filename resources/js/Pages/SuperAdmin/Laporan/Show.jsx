import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import {
    ChevronLeft, ExternalLink, AlertTriangle, Ban, X,
    MessageSquareWarning, User as UserIcon, Store,
} from 'lucide-react';

const STATUS_STYLE = {
    menunggu: 'bg-amber-100 text-amber-700 border border-amber-200',
    diproses: 'bg-blue-100 text-blue-700 border border-blue-200',
    disetujui: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    ditolak: 'bg-red-100 text-red-700 border border-red-200',
    selesai: 'bg-gray-100 text-gray-700 border border-gray-200',
};

const STATUS_LABEL = {
    menunggu: 'Menunggu',
    diproses: 'Diproses',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    selesai: 'Selesai',
};

/* ─────────────────────────────────────────────
   MODAL UPDATE STATUS
───────────────────────────────────────────── */
function StatusModal({ report, onClose }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        status: 'diproses',
        admin_note: report.admin_note ?? '',
    });

    function submit() {
        if (data.status === 'ditolak' && !data.admin_note.trim()) return;
        patch(route('super-admin.laporan-layanan.updateStatus', report.id), {
            preserveScroll: true,
            onSuccess: () => { reset(); onClose(); },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                            <MessageSquareWarning size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Update Status Laporan
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
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Status Baru
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['diproses', 'selesai', 'ditolak'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setData('status', s)}
                                    className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                                        data.status === s
                                            ? s === 'ditolak'
                                                ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                                                : 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300'
                                    }`}
                                >
                                    {STATUS_LABEL[s]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Catatan Admin {data.status === 'ditolak' && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            rows={4}
                            value={data.admin_note}
                            onChange={(e) => setData('admin_note', e.target.value)}
                            placeholder="Catatan untuk customer (wajib jika ditolak)..."
                            className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900"
                        />
                        {errors.admin_note && (
                            <p className="mt-1 text-xs text-red-500">{errors.admin_note}</p>
                        )}
                    </div>
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
                        disabled={processing || (data.status === 'ditolak' && !data.admin_note.trim())}
                        className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                            data.status === 'ditolak'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
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

    const isMenunggu = report.status === 'menunggu';
    const backUrl = route('super-admin.laporan-layanan.index');

    return (
        <SuperAdminLayout title="Detail Laporan Pelayanan">
            <Head title={`Laporan #${report.order_code}`} />

            <Link
                href={backUrl}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
            >
                <ChevronLeft size={14} />
                Kembali ke daftar Laporan Pelayanan
            </Link>

            <div className="mt-4 grid gap-5 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#111827]">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Laporan Pelayanan
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                                    #{report.order_code ?? '-'}
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Diajukan: {report.created_at ?? '-'}
                                </p>
                            </div>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                STATUS_STYLE[report.status] ?? 'bg-gray-100 text-gray-700'
                            }`}>
                                {STATUS_LABEL[report.status] ?? report.status}
                            </span>
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

                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Bukti Foto
                                </p>
                                {report.evidence_url ? (
                                    <a
                                        href={report.evidence_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-1 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-gray-700 dark:bg-gray-900/40 dark:text-emerald-400"
                                    >
                                        <ExternalLink size={14} />
                                        Lihat bukti foto
                                    </a>
                                ) : (
                                    <p className="mt-1 text-xs text-gray-400">Tidak ada bukti.</p>
                                )}
                            </div>

                            {report.admin_note && (
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Catatan Admin
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm italic text-gray-700 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                                        {report.admin_note}
                                    </p>
                                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                        oleh {report.reviewer_name ?? 'Super Admin'} - {report.reviewed_at ?? '-'}
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

                    {isMenunggu && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/30">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                                Aksi Super Admin
                            </p>
                            <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                                Laporan ini menunggu tinjauan Anda.
                            </p>
                            <div className="mt-3 space-y-2">
                                <button
                                    type="button"
                                    onClick={() => setModal({ kind: 'status' })}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    <MessageSquareWarning size={14} />
                                    Update Status Laporan
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-[11px] text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
                        <p className="font-semibold">
                            <AlertTriangle size={11} className="inline -mt-0.5" /> Info
                        </p>
                        <p className="mt-1">
                            Untuk laporan <strong>kerugian barang</strong> & proses refund,
                            buka menu <strong>Pengembalian Dana</strong> di sidebar.
                        </p>
                    </div>
                </div>
            </div>

            {modal?.kind === 'status' && (
                <StatusModal report={report} onClose={() => setModal(null)} />
            )}
        </SuperAdminLayout>
    );
}
