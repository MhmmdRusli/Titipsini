import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Wallet, CheckCircle2, Clock3, Download, FileText, ExternalLink, ShieldCheck, X, Ban, Filter, Clock, XCircle } from 'lucide-react';

const FILTERS = [
    { value: 'semua', label: 'Semua', icon: 'Filter' },
    { value: 'siap_refund', label: 'Siap Refund', icon: 'CheckCircle2' },
    { value: 'disetujui', label: 'Disetujui', icon: 'CheckCircle2' },
    { value: 'ditolak', label: 'Ditolak', icon: 'XCircle' },
];

const ICON_MAP = {
    Filter: Filter,
    Clock: Clock,
    CheckCircle2: CheckCircle2,
    XCircle: XCircle,
};

const STATUS_STYLE = {
    menunggu: 'bg-amber-100 text-amber-700',
    siap_refund: 'bg-blue-100 text-blue-700',
    disetujui: 'bg-emerald-100 text-emerald-700',
    ditolak: 'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
    menunggu: 'Menunggu',
    siap_refund: 'Siap Refund',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
};

const ADMIN_APPROVAL_STYLE = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
};

const ADMIN_APPROVAL_LABEL = {
    pending: 'Menunggu Admin',
    approved: 'Disetujui Admin',
    rejected: 'Ditolak Admin',
};

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function formatDate(value) {
    if (!value) return '-';
    try {
        return new Date(value).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return value;
    }
}

/* ─────────────────────────────────────────────
   MODAL SETUJUI REFUND (otomatis 60%)
───────────────────────────────────────────── */
function ApproveModal({ refund, persenRefund, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Setujui Refund
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Order {refund.order_code} - {refund.customer?.name}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-4 px-5 py-4">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                            Total Pesanan
                        </p>
                        <p className="mt-0.5 text-xl font-bold text-emerald-700 dark:text-emerald-300">
                            {formatRupiah(refund.total_price ?? 0)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                            Refund Akan Diproses
                        </p>
                        <p className="mt-0.5 text-xl font-bold text-emerald-700 dark:text-emerald-300">
                            {formatRupiah(Math.round((refund.total_price ?? 0) * persenRefund / 100))}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                            ≈ {persenRefund}% dari total pesanan
                        </p>
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
                        onClick={onConfirm}
                        className="flex-1 rounded-xl border border-emerald-500 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-gray-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                    >
                        Konfirmasi Setujui
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   MODAL TOLAK REFUND
───────────────────────────────────────────── */
function RejectModal({ refund, onClose, urlTolak }) {
    const [note, setNote] = useState('');
    const [processing, setProcessing] = useState(false);

    function submit() {
        if (!note.trim()) return;
        setProcessing(true);
        router.patch(urlTolak.replace('__ID__', refund.id), { admin_note: note }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => onClose(),
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                            <Ban size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Tolak Refund</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{refund.order_code}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>

                <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Jelaskan alasan penolakan..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-900"
                />

                <div className="mt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing || !note.trim()}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi Tolak'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PengembalianDanaView({
    refunds,
    filters,
    summary = {},
    persenRefund = 60,
    urlIndex,
    urlSetujui,    // contoh: '/super-admin/pengembalian-dana/__ID__/setujui' atau '/finance/pengembalian-dana/__ID__/setujui'
    urlTolak,      // contoh: '/super-admin/pengembalian-dana/__ID__/tolak'
    gradientFrom = 'emerald-600',
    gradientTo = 'green-700',
    accentColor = 'emerald',
    accentText = 'emerald-100',
    accentBg = 'white/10',
    infoText = null,
    titlePage = 'Pengembalian Dana',
    description = 'Tinjau laporan kerugian barang dari customer dan proses refund dengan nominal atau persentase.',
}) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? 'semua');
    const [modal, setModal] = useState(null); // { mode: 'approve'|'reject', refund }

    function applyFilters(nextStatus = status) {
        router.get(urlIndex, {
            status: nextStatus,
            search,
        }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters();
    }

    function handleApprove(refund) {
        router.patch(
            urlSetujui.replace('__ID__', refund.id),
            {},
            {
                onSuccess: () => {
                    setModal(null);
                    router.reload({ only: ['refunds', 'summary'] });
                },
                onError: () => {
                    setModal(null);
                },
            }
        );
    }

    function exportPdf() {
        const rows = refunds?.data ?? [];
        if (!rows.length) return;

        const content = `
            <html>
                <head>
                    <title>Daftar Pengembalian Dana</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
                        h1 { font-size: 24px; margin-bottom: 16px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                        th, td { border: 1px solid #d1d5db; padding: 8px 10px; font-size: 12px; text-align: left; }
                        th { background: #f3f4f6; }
                    </style>
                </head>
                <body>
                    <h1>Daftar Pengembalian Dana</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Kode Order</th>
                                <th>Customer</th>
                                <th>Nominal</th>
                                <th>Status</th>
                                <th>Tgl. Pengajuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.map((item) => `
                                <tr>
                                    <td>${item.order_code ?? '-'}</td>
                                    <td>${item.customer?.name ?? '-'}</td>
                                    <td>${formatRupiah(item.refund_amount ?? item.refund_estimasi)}</td>
                                    <td>${STATUS_LABEL[item.status] ?? item.status}</td>
                                    <td>${formatDate(item.created_at)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) return;

        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    }

    return (
        <>
            <Head title={titlePage} />

            {flash?.success && (
                <div className="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <CheckCircle2 size={18} />
                    </div>
                    <div className="text-xs font-semibold">{flash.success}</div>
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                        <XCircle size={18} />
                    </div>
                    <div className="text-xs font-semibold">{flash.error}</div>
                </div>
            )}

            {modal && (
                modal.mode === 'approve' ? (
                    <ApproveModal refund={modal.refund} persenRefund={persenRefund} onClose={() => setModal(null)} onConfirm={() => handleApprove(modal.refund)} />
                ) : (
                    <RejectModal refund={modal.refund} onClose={() => setModal(null)} urlTolak={urlTolak} />
                )
            )}

            <div className={`mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-${gradientFrom} to-${gradientTo} p-6 text-white shadow-lg`}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className={`mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-${accentBg} px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-${accentText}`}>
                            <ShieldCheck size={12} />
                            Refund Review
                        </div>
                        <h1 className="text-2xl font-bold">{titlePage}</h1>
                        <p className={`mt-1 text-sm text-${accentText}/90`}>
                            {description}
                            {infoText}
                        </p>
                    </div>

                    <button
                        onClick={exportPdf}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
                    >
                        <Download size={16} />
                        Download PDF
                    </button>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                    <div className={`rounded-xl border border-white/20 bg-${accentBg} p-3 backdrop-blur-sm`}>
                        <div className={`flex items-center gap-2 text-xs text-${accentText}`}>
                            <ShieldCheck size={14} /> Siap Refund
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.siap_refund ?? 0}</div>
                    </div>
                    <div className={`rounded-xl border border-white/20 bg-${accentBg} p-3 backdrop-blur-sm`}>
                        <div className={`flex items-center gap-2 text-xs text-${accentText}`}>
                            <CheckCircle2 size={14} /> Disetujui
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.disetujui ?? 0}</div>
                    </div>
                    <div className={`rounded-xl border border-white/20 bg-${accentBg} p-3 backdrop-blur-sm`}>
                        <div className={`flex items-center gap-2 text-xs text-${accentText}`}>
                            <Ban size={14} /> Ditolak
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.ditolak ?? 0}</div>
                    </div>
                    <div className={`rounded-xl border border-white/20 bg-${accentBg} p-3 backdrop-blur-sm`}>
                        <div className={`flex items-center gap-2 text-xs text-${accentText}`}>
                            <Wallet size={14} /> Total Nilai Direfund
                        </div>
                        <div className="mt-2 text-2xl font-bold">{formatRupiah(summary?.totalNilai ?? 0)}</div>
                    </div>
                </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari kode order / nama customer"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-800 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-gray-800 dark:bg-[#111827] dark:text-gray-200"
                    />
                </form>

                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((tab) => {
                        const Icon = ICON_MAP[tab.icon];
                        return (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => {
                                    setStatus(tab.value);
                                    applyFilters(tab.value);
                                }}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                    status === tab.value
                                        ? `bg-${accentColor}-600 text-white shadow-sm`
                                        : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-[#111827] dark:text-gray-300 dark:ring-gray-800 dark:hover:bg-gray-800'
                                }`}
                            >
                                <Icon size={12} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#111827]">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-xs">
                        <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-900/60">
                            <tr>
                                <th className="px-3 py-2">Order</th>
                                <th className="px-3 py-2">Customer / Vendor</th>
                                <th className="px-3 py-2">Bukti</th>
                                <th className="px-3 py-2">Nominal Refund</th>
                                <th className="px-3 py-2">Approval Admin</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Tanggal</th>
                                <th className="px-3 py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {(refunds?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-3 py-10 text-center">
                                        <div className="mx-auto max-w-md">
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                                <FileText size={22} />
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                Belum ada data refund
                                            </h3>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                Data pengembalian dana akan muncul di sini setelah admin memverifikasi laporan kerugian customer.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                (refunds?.data ?? []).map((item) => {
                                    const adminApproved = item.admin_approval === 'approved';
                                    const adminPending  = item.admin_approval === 'pending';
                                    const adminRejected = item.admin_approval === 'rejected';
                                    const canFinanceAct = adminApproved && item.status === 'siap_refund';

                                    return (
                                        <tr key={item.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20">
                                            <td className="px-3 py-2.5">
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {item.order_code ?? '-'}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="font-medium text-gray-800 dark:text-gray-200">
                                                    {item.customer?.name ?? '-'}
                                                </div>
                                                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                                    Vendor: {item.partner?.name ?? '-'}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                {item.evidence_url ? (
                                                    <a href={item.evidence_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400"
                                                    >
                                                        <ExternalLink size={12} />
                                                        Lihat
                                                    </a>
                                                ) : (
                                                    <span className="text-[11px] text-gray-400">Tidak ada</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="font-bold text-emerald-700 dark:text-emerald-400">
                                                    {formatRupiah(item.refund_amount ?? item.refund_estimasi)}
                                                </div>
                                                {!item.refund_amount && (
                                                    <div className="text-[10px] text-gray-400">
                                                        estimasi {persenRefund}%
                                                    </div>
                                                )}
                                                {item.refund_percentage && (
                                                    <div className="text-[10px] text-gray-500">
                                                        {item.refund_percentage}% disetujui
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                    ADMIN_APPROVAL_STYLE[item.admin_approval] ?? 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {ADMIN_APPROVAL_LABEL[item.admin_approval] ?? '-'}
                                                </span>
                                                {item.admin_approver_name && (
                                                    <div className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                                                        oleh {item.admin_approver_name}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                    STATUS_STYLE[item.status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                                }`}>
                                                    {STATUS_LABEL[item.status] ?? item.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-[11px] text-gray-500 dark:text-gray-400">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                {adminPending ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                                                        <Clock size={12} />
                                                        Menunggu Admin
                                                    </span>
                                                ) : adminRejected ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700 dark:text-red-400">
                                                        <Ban size={12} />
                                                        Ditolak Admin
                                                    </span>
                                                ) : canFinanceAct ? (
                                                    <div className="flex gap-1.5">
                                                        <button
                                                            onClick={() => setModal({ mode: 'approve', refund: item })}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500 bg-white px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-gray-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                            Setujui
                                                        </button>
                                                        <button
                                                            onClick={() => setModal({ mode: 'reject', refund: item })}
                                                            className="rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-gray-400">
                                                        {item.reviewer ? `oleh ${item.reviewer}` : '-'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}