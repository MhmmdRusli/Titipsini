import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Search, Wallet, CheckCircle2, Clock3, Download, FileText, ExternalLink, ShieldCheck, X, Ban, Filter, Clock, XCircle } from 'lucide-react';

const FILTERS = [
    { value: 'semua', label: 'Semua', icon: 'Filter' },
    { value: 'menunggu', label: 'Menunggu', icon: 'Clock' },
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
    disetujui: 'bg-emerald-100 text-emerald-700',
    ditolak: 'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
    menunggu: 'Menunggu',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
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
   MODAL SETUJUI REFUND (dengan mode persen/nominal dinamis)
───────────────────────────────────────────── */
function ApproveModal({ refund, onClose }) {
    const total = Number(refund.total_price ?? 0);
    const isAlready = refund.refund_amount != null;

    const [mode, setMode] = useState('percent');
    const [percent, setPercent] = useState(50);
    const [nominal, setNominal] = useState('');
    const [adminNote, setAdminNote] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const computedAmount = mode === 'percent'
        ? Math.round((total * (Number(percent) || 0)) / 100)
        : Number(nominal || 0);

    const computedPercent = mode === 'percent'
        ? Number(percent || 0)
        : total > 0
            ? Math.round((Number(nominal || 0) / total) * 100)
            : 0;

    function submit() {
        setError(null);

        if (mode === 'percent') {
            if (!percent || percent < 1 || percent > 100) {
                setError('Persentase harus 1-100.');
                return;
            }
        } else {
            if (!nominal || Number(nominal) <= 0) {
                setError('Nominal refund harus lebih dari 0.');
                return;
            }
            if (Number(nominal) > total) {
                setError('Nominal refund tidak boleh melebihi total pesanan.');
                return;
            }
        }

        setProcessing(true);
        router.patch(
            `/super-admin/pengembalian-dana/${refund.id}/setujui`,
            {
                refund_mode: mode,
                refund_percent: mode === 'percent' ? percent : undefined,
                refund_nominal: mode === 'nominal' ? nominal : undefined,
                admin_note: adminNote,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => onClose(),
            }
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <ShieldCheck size={18} />
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
                    {isAlready && (
                        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                            <X size={14} className="mt-0.5 shrink-0" />
                            Order ini sudah pernah di-refund. Aksi tidak dapat dibatalkan.
                        </div>
                    )}

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                            Total Pesanan
                        </p>
                        <p className="mt-0.5 text-xl font-bold text-emerald-700 dark:text-emerald-300">
                            {formatRupiah(total)}
                        </p>
                    </div>

                    {refund.estimated_loss != null && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/30">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                                Taksiran Kerugian dari Customer
                            </p>
                            <p className="mt-0.5 text-base font-bold text-amber-900 dark:text-amber-200">
                                {formatRupiah(refund.estimated_loss)}
                            </p>
                            {refund.item_condition && (
                                <p className="mt-1 text-[11px] text-amber-800 dark:text-amber-200">
                                    Kondisi: {refund.item_condition}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Mode Refund
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { v: 'percent', l: 'Persentase (%)' },
                                { v: 'nominal', l: 'Nominal (Rp)' },
                            ].map((m) => (
                                <button
                                    key={m.v}
                                    type="button"
                                    onClick={() => setMode(m.v)}
                                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                                        mode === m.v
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300'
                                    }`}
                                >
                                    {m.l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {mode === 'percent' ? (
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                                Persentase Refund (1-100%)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={percent}
                                    onChange={(e) => setPercent(e.target.value)}
                                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900"
                                />
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">%</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {[10, 25, 50, 75, 100].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPercent(p)}
                                        className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    >
                                        {p}%
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                                Nominal Refund (Rp)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max={total}
                                value={nominal}
                                onChange={(e) => setNominal(e.target.value)}
                                placeholder={`Maks ${formatRupiah(total)}`}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900"
                            />
                        </div>
                    )}

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Akan dikreditkan ke saldo customer
                        </p>
                        <p className="mt-0.5 text-xl font-bold text-emerald-700 dark:text-emerald-400">
                            {formatRupiah(computedAmount)}
                        </p>
                        {computedPercent > 0 && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                ≈ {computedPercent}% dari total pesanan
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                            Catatan Admin <span className="font-normal text-gray-400">(opsional)</span>
                        </label>
                        <textarea
                            rows={3}
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="cth: Kerusakan barang sesuai bukti foto, refund disetujui."
                            className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900"
                        />
                    </div>

                    {error && (
                        <p className="rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-700">{error}</p>
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
                        disabled={processing}
                        className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi Setujui'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   MODAL TOLAK REFUND
───────────────────────────────────────────── */
function RejectModal({ refund, onClose }) {
    const [note, setNote] = useState('');
    const [processing, setProcessing] = useState(false);

    function submit() {
        if (!note.trim()) return;
        setProcessing(true);
        router.patch(`/super-admin/pengembalian-dana/${refund.id}/tolak`, { admin_note: note }, {
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

export default function Index({ refunds, filters, summary = {}, persenRefund = 60 }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? 'semua');
    const [modal, setModal] = useState(null); // { mode: 'approve'|'reject', refund }

    function applyFilters(nextStatus = status) {
        router.get('/super-admin/pengembalian-dana', {
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
        <SuperAdminLayout title="Pengembalian Dana">
            <Head title="Pengembalian Dana" />

            {modal && (
                modal.mode === 'approve' ? (
                    <ApproveModal refund={modal.refund} onClose={() => setModal(null)} />
                ) : (
                    <RejectModal refund={modal.refund} onClose={() => setModal(null)} />
                )
            )}

            <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                            <ShieldCheck size={12} />
                            Refund Review
                        </div>
                        <h1 className="text-2xl font-bold">Pengembalian Dana</h1>
                        <p className="mt-1 text-sm text-emerald-50/90">
                            Tinjau laporan kerugian barang dari customer dan proses refund dengan nominal atau persentase.
                            Untuk keluhan <strong>Komplain Pelayanan</strong>, buka menu <strong>Laporan Pelayanan</strong>.
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
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <Clock3 size={14} /> Menunggu
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.menunggu ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <CheckCircle2 size={14} /> Disetujui
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.disetujui ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
                            <Ban size={14} /> Ditolak
                        </div>
                        <div className="mt-2 text-2xl font-bold">{summary?.ditolak ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-xs text-emerald-100">
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
                                        ? 'bg-emerald-600 text-white shadow-sm'
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
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-gray-900/60">
                            <tr>
                                <th className="px-5 py-3">Order</th>
                                <th className="px-5 py-3">Customer / Vendor</th>
                                <th className="px-5 py-3">Kondisi / Taksiran</th>
                                <th className="px-5 py-3">Bukti</th>
                                <th className="px-5 py-3">Nominal Refund</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Tanggal</th>
                                <th className="px-5 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {(refunds?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-5 py-16 text-center">
                                        <div className="mx-auto max-w-md">
                                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                                <FileText size={28} />
                                            </div>
                                            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
                                                Belum ada data refund
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Data pengembalian dana akan muncul di sini ketika customer mengirim laporan kerugian barang.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                (refunds?.data ?? []).map((item) => (
                                    <tr key={item.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                {item.order_code ?? '-'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-800 dark:text-gray-200">
                                                {item.customer?.name ?? '-'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Vendor: {item.partner?.name ?? '-'}
                                            </div>
                                        </td>
                                        <td className="max-w-[200px] px-5 py-4">
                                            {item.estimated_loss != null ? (
                                                <>
                                                    <p className="line-clamp-1 text-xs text-gray-700 dark:text-gray-300">
                                                        {item.item_condition || '-'}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">
                                                        Taksiran: {formatRupiah(item.estimated_loss)}
                                                    </p>
                                                </>
                                            ) : (
                                                <span className="text-[11px] text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {item.evidence_url ? (
                                                <a href={item.evidence_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400"
                                                >
                                                    <ExternalLink size={12} />
                                                    Lihat
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400">Tidak ada</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
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
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                                STATUS_STYLE[item.status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                                {STATUS_LABEL[item.status] ?? item.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            {item.status === 'menunggu' ? (
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => setModal({ mode: 'approve', refund: item })}
                                                        className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                                    >
                                                        Setujui
                                                    </button>
                                                    <button
                                                        onClick={() => setModal({ mode: 'reject', refund: item })}
                                                        className="rounded-lg border border-red-300 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400"
                                                    >
                                                        Tolak
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    {item.reviewer ? `oleh ${item.reviewer}` : '-'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
