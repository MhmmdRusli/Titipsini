import { Head, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Wallet, Clock, CheckCircle2, XCircle, Loader2, ChevronRight } from 'lucide-react';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        value ?? 0
    );
}

function formatTanggal(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const STATUS_CONFIG = {
    pending: { label: 'Belum Dibayar', color: 'text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400', icon: Clock },
    menunggu_verifikasi: { label: 'Menunggu Verifikasi', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400', icon: Loader2 },
    berhasil: { label: 'Berhasil', color: 'text-[#15803d] bg-green-50 dark:bg-green-950/40 dark:text-[#4ade80]', icon: CheckCircle2 },
    ditolak: { label: 'Ditolak', color: 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400', icon: XCircle },
    gagal: { label: 'Gagal', color: 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400', icon: XCircle },
};

function targetHref(topup) {
    if (topup.status === 'pending') {
        return `/app/saldo/topup/${topup.id}/instruksi`;
    }
    if (topup.status === 'menunggu_verifikasi') {
        return `/app/saldo/topup/${topup.id}/menunggu`;
    }
    if (topup.status === 'berhasil') {
        return `/app/saldo/topup/${topup.id}/sukses`;
    }
    return null; // ditolak/gagal - tidak ada halaman detail lanjutan
}

export default function Riwayat({ topups, saldo }) {
    return (
        <CustomerLayout title="Riwayat Top Up" backHref="/app/dashboard">
            <Head title="Riwayat Top Up" />

            <div className="px-4 py-4">
                {/* Saldo saat ini */}
                <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3.5 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Wallet size={15} className="text-[#15803d] dark:text-[#4ade80]" />
                        Saldo Titip Saat Ini
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatRupiah(saldo)}</span>
                </div>

                <p className="mb-2 mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">Riwayat Transaksi</p>

                {topups.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-sm text-gray-400 dark:text-gray-500">
                        Belum ada riwayat top up.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {topups.data.map((topup) => {
                            const status = STATUS_CONFIG[topup.status] ?? STATUS_CONFIG.pending;
                            const StatusIcon = status.icon;
                            const href = targetHref(topup);

                            const Wrapper = href ? Link : 'div';
                            const wrapperProps = href ? { href } : {};

                            return (
                                <Wrapper
                                    key={topup.id}
                                    {...wrapperProps}
                                    className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition hover:border-gray-200 dark:hover:border-gray-600"
                                >
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${status.color}`}>
                                        <StatusIcon size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{topup.kode_transaksi}</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatRupiah(topup.nominal)}</p>
                                        </div>
                                        <div className="mt-0.5 flex items-center justify-between">
                                            <p className="text-xs text-gray-400 dark:text-gray-500">{formatTanggal(topup.created_at)}</p>
                                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>
                                    {href && <ChevronRight size={16} className="shrink-0 text-gray-300 dark:text-gray-600" />}
                                </Wrapper>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {topups.links?.length > 3 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                        {topups.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg px-3 py-1.5 text-xs transition ${
                                    link.active 
                                        ? 'bg-[#15803d] dark:bg-[#22c55e] text-white' 
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}