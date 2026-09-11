import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft, Image as ImgIcon, ExternalLink, ShieldCheck, Clock,
    AlertTriangle, AlertCircle, CheckCircle2, XCircle, FileText, User
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

function getFileUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/storage/')) {
        return path;
    }
    return `/storage/${path}`;
}

const STATUS_CONFIG = {
    klaim_diajukan: { label: 'Klaim Diajukan', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400', icon: Clock },
    menunggu_pemeriksaan_admin: { label: 'Menunggu Pemeriksaan Admin', color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400', icon: Clock },
    menunggu_klarifikasi_mitra: { label: 'Menunggu Klarifikasi Mitra', color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400', icon: Clock },
    disetujui: { label: 'Disetujui', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', icon: CheckCircle2 },
    diproses_finance: { label: 'Diproses Finance', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400', icon: Clock },
    refund_berhasil: { label: 'Refund Berhasil', color: 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-[#4ade80]', icon: CheckCircle2 },
    ditolak: { label: 'Ditolak', color: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400', icon: XCircle },
    sengketa: { label: 'Sengketa', color: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400', icon: AlertTriangle },
};

export default function ClaimShow({ claim }) {
    const statusInfo = STATUS_CONFIG[claim.status] ?? STATUS_CONFIG.klaim_diajukan;
    const StatusIcon = statusInfo.icon;

    return (
        <CustomerLayout>
            <Head title={`Klaim #${claim.id} - ${claim.order?.order_code} - Titipsini.com`} />

            <div className="mx-auto max-w-2xl px-4 py-6">
                <div className="mb-5 flex items-center gap-3">
                    <Link
                        href={`/app/orders/${claim.order?.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 transition"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Detail Klaim</h1>
                </div>

                {/* Status Badge */}
                <div className="mb-4 flex items-center gap-2.5">
                    <StatusIcon size={20} className="shrink-0" />
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                </div>

                {/* Order Info */}
                {claim.order && (
                    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{claim.order.item_name}</p>
                        <div className="mt-1 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Order: {claim.order.order_code}</span>
                            <span>Total: {formatRupiah(claim.order.total_price)}</span>
                            <span>Mitra: {claim.order.partner_name ?? '-'}</span>
                        </div>
                    </div>
                )}

                {/* Claim Details */}
                <div className="space-y-4">
                    {/* Alasan */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Alasan Klaim</p>
                        <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">{claim.alasan}</p>
                    </div>

                    {/* Foto Bukti Customer */}
                    {claim.foto_urls && claim.foto_urls.length > 0 && (
                        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Foto Bukti Anda</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {claim.foto_urls.map((url, i) => (
                                    <a key={i} href={getFileUrl(url)} target="_blank" rel="noreferrer" className="h-20 w-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img src={getFileUrl(url)} alt={`Bukti ${i + 1}`} className="h-full w-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Jumlah Klaim */}
                    {claim.jumlah_klaim && (
                        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Jumlah Klaim Diajukan</p>
                            <p className="mt-1 text-lg font-bold text-[#15803d] dark:text-[#4ade80]">{formatRupiah(claim.jumlah_klaim)}</p>
                        </div>
                    )}

                    {/* Admin Validation */}
                    {(claim.status !== 'klaim_diajukan' && claim.status !== 'ditolak') && (
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wide">Hasil Pemeriksaan Admin</p>
                            <div className="mt-2 space-y-1 text-xs text-blue-700/90 dark:text-blue-300/80">
                                <p><strong>Status:</strong> {claim.admin_validated_at ? 'Sudah diperiksa' : 'Belum diperiksa'}</p>
                                {claim.admin_validated_at && (
                                    <>
                                        <p><strong>Diperiksa oleh:</strong> {claim.admin_validator_name ?? 'Admin'} pada {claim.admin_validated_at}</p>
                                        <p><strong>Catatan Admin:</strong> {claim.admin_catatan ?? '-'}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mitra Klarifikasi */}
                    {claim.mitra_klarifikasi && (
                        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/50 dark:bg-purple-950/30">
                            <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wide">Klarifikasi Mitra</p>
                            <p className="mt-1 text-xs text-purple-700/90 dark:text-purple-300/80">{claim.mitra_klarifikasi}</p>
                            {claim.mitra_foto_urls && claim.mitra_foto_urls.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {claim.mitra_foto_urls.map((url, i) => (
                                        <a key={i} href={getFileUrl(url)} target="_blank" rel="noreferrer" className="h-16 w-16 rounded-lg overflow-hidden border border-purple-200 dark:border-purple-800">
                                            <img src={getFileUrl(url)} alt={`Mitra bukti ${i + 1}`} className="h-full w-full object-cover" />
                                        </a>
                                    ))}
                                </div>
                            )}
                            {claim.mitra_responded_at && (
                                <p className="mt-1 text-[10px] text-purple-600/80 dark:text-purple-400/80">
                                    Direspons pada {claim.mitra_responded_at}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Refund Details */}
                    {['disetujui', 'diproses_finance', 'refund_berhasil'].includes(claim.status) && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">Detail Refund</p>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-emerald-700/90 dark:text-emerald-300/80">
                                <div><strong>Persentase:</strong> {claim.persentase_refund ?? '-'}%</div>
                                <div><strong>Jumlah Refund:</strong> {claim.jumlah_refund ? formatRupiah(claim.jumlah_refund) : '-'}</div>
                            </div>
                        </div>
                    )}

                    {/* Finance Processing */}
                    {claim.status === 'diproses_finance' && (
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                            <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide">Sedang Diproses Finance</p>
                            {claim.finance_catatan && (
                                <p className="mt-1 text-xs text-indigo-700/90 dark:text-indigo-300/80">Catatan: {claim.finance_catatan}</p>
                            )}
                        </div>
                    )}

                    {/* Refund Success */}
                    {claim.status === 'refund_berhasil' && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30">
                            <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                                <CheckCircle2 size={18} className="shrink-0" />
                                <p className="text-sm font-semibold">Refund Berhasil Diproses</p>
                            </div>
                            <p className="mt-1 text-xs text-green-700/90 dark:text-green-300/80">
                                Dana refund sudah masuk ke saldo Anda.
                            </p>
                        </div>
                    )}

                    {/* Rejected */}
                    {claim.status === 'ditolak' && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                            <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                                <XCircle size={18} className="shrink-0" />
                                <p className="text-sm font-semibold">Klaim Ditolak</p>
                            </div>
                            {claim.admin_catatan && (
                                <p className="mt-1 text-xs text-red-700/90 dark:text-red-300/80">Alasan: {claim.admin_catatan}</p>
                            )}
                        </div>
                    )}

                    {/* Dispute */}
                    {claim.status === 'sengketa' && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                            <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                                <AlertTriangle size={18} className="shrink-0" />
                                <p className="text-sm font-semibold">Masuk Tahap Sengketa</p>
                            </div>
                            <p className="mt-1 text-xs text-red-700/90 dark:text-red-300/80">
                                Mitra menolak klaim. Super Admin akan membuat keputusan akhir.
                            </p>
                            {claim.super_admin_keputusan && (
                                <div className="mt-3 p-3 rounded-lg bg-white dark:bg-gray-800">
                                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Keputusan Super Admin:</p>
                                    <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{claim.super_admin_keputusan}</p>
                                    {claim.super_admin_decided_at && (
                                        <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">Diputuskan pada {claim.super_admin_decided_at}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Timeline</p>
                        <div className="mt-3 space-y-3 border-l border-gray-200 pl-4 dark:border-gray-700">
                            <div className="relative">
                                <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-blue-500" />
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Klaim Diajukan</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.created_at}</p>
                            </div>
                            {claim.admin_validated_at && (
                                <div className="relative">
                                    <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-amber-500" />
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Diperiksa Admin</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.admin_validated_at} oleh {claim.admin_validator_name ?? 'Admin'}</p>
                                </div>
                            )}
                            {claim.mitra_responded_at && (
                                <div className="relative">
                                    <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-purple-500" />
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Mitra Memberi Klarifikasi</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.mitra_responded_at}</p>
                                </div>
                            )}
                            {claim.status === 'disetujui' && (
                                <div className="relative">
                                    <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Disetujui</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Persentase: {claim.persentase_refund}% | Jumlah: {claim.jumlah_refund ? formatRupiah(claim.jumlah_refund) : '-'}</p>
                                </div>
                            )}
                            {claim.finance_processed_at && (
                                <div className="relative">
                                    <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-indigo-500" />
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Diproses Finance</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.finance_processed_at}</p>
                                </div>
                            )}
                            {claim.status === 'refund_berhasil' && (
                                <div className="relative">
                                    <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-green-500" />
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Refund Berhasil</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Dana masuk ke saldo</p>
                                </div>
                            )}
                            {claim.status === 'ditolak' && (
                                <div className="relative">
                                    <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-red-500" />
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Ditolak</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.admin_validated_at ?? claim.created_at}</p>
                                </div>
                            )}
                            {claim.status === 'sengketa' && claim.super_admin_decided_at && (
                                <div className="relative">
                                    <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-red-600" />
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Keputusan Super Admin</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.super_admin_decided_at}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Link
                    href="/app/orders"
                    className="mt-6 block w-full rounded-xl border border-gray-200 bg-white py-3 text-center text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/60 transition"
                >
                    Kembali ke Daftar Pesanan
                </Link>
            </div>
        </CustomerLayout>
    );
}