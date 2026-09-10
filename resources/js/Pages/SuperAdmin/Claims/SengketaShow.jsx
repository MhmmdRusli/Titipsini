import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft, Image as ImgIcon, ExternalLink, ShieldCheck, Clock,
    AlertTriangle, AlertCircle, CheckCircle2, XCircle, FileText, User,
    Edit, Trash2, Gavel
} from 'lucide-react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

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

export default function Show({ claim }) {
    const { errors } = usePage().props;
    const statusInfo = STATUS_CONFIG[claim.status] ?? STATUS_CONFIG.klaim_diajukan;
    const StatusIcon = statusInfo.icon;
    const [keputusan, setKeputusan] = useState('setujui');
    const [persentaseRefund, setPersentaseRefund] = useState(claim.persentase_refund ?? 60);
    const [superAdminKeputusan, setSuperAdminKeputusan] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const canPutuskan = claim.status === 'sengketa';

    function handlePutuskan() {
        if (!superAdminKeputusan.trim()) {
            alert('Keputusan wajib diisi.');
            return;
        }
        if (keputusan === 'setujui' && (!persentaseRefund || persentaseRefund < 1 || persentaseRefund > 100)) {
            alert('Persentase refund harus antara 1-100%.');
            return;
        }
        setShowModal(true);
    }

    function confirmPutuskan() {
        setIsSubmitting(true);
        router.patch(
            `/super-admin/klaim-sengketa/${claim.id}/putuskan`,
            {
                keputusan,
                persentase_refund: keputusan === 'setujui' ? persentaseRefund : null,
                super_admin_keputusan: superAdminKeputusan,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsSubmitting(false);
                    setShowModal(false);
                },
            }
        );
    }

    return (
        <SuperAdminLayout title={`Sengketa Klaim #${claim.id} - ${claim.order_code}`}>
            <Head title={`Sengketa Klaim #${claim.id} - ${claim.order_code} - Super Admin Titipsini`} />

            <div className="p-6 space-y-6 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 transition"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Sengketa Klaim #{claim.id}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Order: {claim.order_code}</p>
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${statusInfo.color}`}>
                        <StatusIcon size={16} />
                        {statusInfo.label}
                    </span>
                </div>

                {/* Order Info */}
                {claim.order && (
                    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Item</p>
                                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{claim.order.item_name}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total Pesanan</p>
                                <p className="mt-1 text-sm font-bold text-[#15803d] dark:text-[#4ade80]">{formatRupiah(claim.order.total_price)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status Order</p>
                                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 capitalize">{claim.order.status}</p>
                            </div>
                            <div className="md:col-span-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</p>
                                <p className="mt-1 text-sm text-gray-800 dark:text-gray-100">{claim.order.customer?.name} ({claim.order.customer?.email})</p>
                            </div>
                            <div className="md:col-span-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mitra</p>
                                <p className="mt-1 text-sm text-gray-800 dark:text-gray-100">{claim.order.partner?.name ?? '-'} ({claim.order.partner?.email ?? '-'})</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Kondisi Awal (Documentation from Mitra) */}
                {claim.kondisi_awal && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                        <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wide">Dokumentasi Kondisi Awal (saat Mitra terima barang)</p>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-blue-700/90 dark:text-blue-300/80"><strong>Dibuat:</strong> {claim.kondisi_awal.dokumentasi_at}</p>
                                <p className="text-xs text-blue-700/90 dark:text-blue-300/80"><strong>Catatan Mitra:</strong> {claim.kondisi_awal.catatan ?? '-'}</p>
                            </div>
                            <div>
                                {claim.kondisi_awal.foto_urls && claim.kondisi_awal.foto_urls.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {claim.kondisi_awal.foto_urls.slice(0, 4).map((url, i) => (
                                            <a key={i} href={getFileUrl(url)} target="_blank" rel="noreferrer" className="h-16 w-16 rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800">
                                                <img src={getFileUrl(url)} alt={`Kondisi awal ${i + 1}`} className="h-full w-full object-cover" />
                                            </a>
                                        ))}
                                        {claim.kondisi_awal.foto_urls.length > 4 && (
                                            <span className="flex h-16 w-16 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                                +{claim.kondisi_awal.foto_urls.length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Claim Details */}
                <div className="space-y-4">
                    {/* Alasan */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Alasan Klaim Customer</p>
                        <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">{claim.alasan}</p>
                    </div>

                    {/* Foto Bukti Customer */}
                    {claim.foto_urls && claim.foto_urls.length > 0 && (
                        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Foto Bukti Customer</p>
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

                    {/* Admin Validation Result */}
                    {claim.admin_validated_at && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide">Hasil Pemeriksaan Admin</p>
                            <div className="mt-2 space-y-1 text-xs text-amber-700/90 dark:text-amber-300/80">
                                <p><strong>Diperiksa oleh:</strong> {claim.admin_validator_name ?? 'Admin'} pada {claim.admin_validated_at}</p>
                                {claim.admin_catatan && <p><strong>Catatan:</strong> {claim.admin_catatan}</p>}
                                {claim.persentase_refund && <p><strong>Persentase Refund Admin:</strong> {claim.persentase_refund}%</p>}
                                {claim.jumlah_refund && <p><strong>Jumlah Refund Admin:</strong> {formatRupiah(claim.jumlah_refund)}</p>}
                            </div>
                        </div>
                    )}

                    {/* Mitra Klarifikasi */}
                    {claim.mitra_klarifikasi && (
                        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/50 dark:bg-purple-950/30">
                            <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wide">Klarifikasi Mitra</p>
                            <p className="mt-1 text-sm text-purple-700/90 dark:text-purple-300/80">{claim.mitra_klarifikasi}</p>
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
                                <p className="mt-1 text-xs text-purple-600/80 dark:text-purple-400/80">Direspons pada {claim.mitra_responded_at}</p>
                            )}
                        </div>
                    )}

                    {/* Dispute Info */}
                    {claim.status === 'sengketa' && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                            <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                                <AlertTriangle size={18} className="shrink-0" />
                                <p className="text-sm font-semibold">Masuk Tahap Sengketa</p>
                            </div>
                            <p className="mt-1 text-xs text-red-700/90 dark:text-red-300/80">
                                Mitra menolak klaim. Super Admin (Anda) harus membuat keputusan final.
                            </p>
                            {claim.super_admin_keputusan && (
                                <div className="mt-3 p-3 rounded-lg bg-white dark:bg-gray-800">
                                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Keputusan Super Admin Sebelumnya:</p>
                                    <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{claim.super_admin_keputusan}</p>
                                    {claim.super_admin_decided_at && (
                                        <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">Diputuskan pada {claim.super_admin_decided_at} oleh {claim.super_admin_name}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Previous SuperAdmin Decision */}
                    {['disetujui', 'ditolak'].includes(claim.status) && claim.super_admin_keputusan && (
                        <div className={`rounded-xl p-4 ${claim.status === 'disetujui' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30' : 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30'}`}>
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">Keputusan Super Admin</p>
                            <div className="mt-2 space-y-1 text-xs text-gray-700/90 dark:text-gray-300/80">
                                <p><strong>Keputusan:</strong> {claim.status === 'disetujui' ? 'DISETUJUI' : 'DITOLAK'}</p>
                                <p><strong>Oleh:</strong> {claim.super_admin_name ?? 'Super Admin'} pada {claim.super_admin_decided_at}</p>
                                <p><strong>Alasan:</strong> {claim.super_admin_keputusan}</p>
                                {claim.status === 'disetujui' && claim.persentase_refund && (
                                    <p><strong>Persentase Refund:</strong> {claim.persentase_refund}%</p>
                                )}
                                {claim.status === 'disetujui' && claim.jumlah_refund && (
                                    <p><strong>Jumlah Refund:</strong> {formatRupiah(claim.jumlah_refund)}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* SuperAdmin Action */}
                {canPutuskan && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                        <p className="text-xs font-semibold text-red-800 dark:text-red-300 uppercase tracking-wide mb-4">Keputusan Super Admin (Final)</p>
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="setujui"
                                        checked={keputusan === 'setujui'}
                                        onChange={(e) => setKeputusan(e.target.value)}
                                        className="h-4 w-4 accent-red-600"
                                    />
                                    <span className="text-sm text-gray-800 dark:text-gray-200">SETUJUI - Berikan refund</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="tolak"
                                        checked={keputusan === 'tolak'}
                                        onChange={(e) => setKeputusan(e.target.value)}
                                        className="h-4 w-4 accent-red-600"
                                    />
                                    <span className="text-sm text-gray-800 dark:text-gray-200">TOLAK - Klaim tidak valid</span>
                                </label>
                            </div>

                            {keputusan === 'setujui' && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Persentase Refund (%)</label>
                                    <input
                                        type="number"
                                        value={persentaseRefund}
                                        onChange={(e) => setPersentaseRefund(Math.max(1, Math.min(100, parseInt(e.target.value) || 0)))}
                                        min="1"
                                        max="100"
                                        className="mt-1 w-full max-w-xs rounded-xl border border-gray-200 p-3 text-sm text-gray-800 focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Estimasi refund: {claim.order?.total_price ? formatRupiah(Math.round(claim.order.total_price * persentaseRefund / 100)) : '-'}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Alasan Keputusan <span className="text-red-500">*</span></label>
                                <textarea
                                    value={superAdminKeputusan}
                                    onChange={(e) => setSuperAdminKeputusan(e.target.value)}
                                    rows={3}
                                    required
                                    placeholder={keputusan === 'setujui' ? 'Alasan menyetujui klaim ini...' : 'Alasan menolak klaim ini...'}
                                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
                                />
                            </div>

                            <button
                                onClick={handlePutuskan}
                                disabled={isSubmitting}
                                className={`w-full rounded-xl py-2.5 text-sm font-bold text-white transition ${keputusan === 'setujui' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50`}
                            >
                                {isSubmitting ? 'Memproses...' : keputusan === 'setujui' ? 'Setujui Klaim (Final)' : 'Tolak Klaim (Final)'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Timeline */}
                <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Timeline</p>
                    <div className="mt-3 space-y-3 border-l border-gray-200 pl-4 dark:border-gray-700">
                        <div className="relative">
                            <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-blue-500" />
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Klaim Diajukan</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.created_at} oleh {claim.customer_name}</p>
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
                        {claim.status === 'sengketa' && (
                            <div className="relative">
                                <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-red-500" />
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Masuk Sengketa</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Menunggu keputusan Super Admin</p>
                            </div>
                        )}
                        {['disetujui', 'diproses_finance', 'refund_berhasil'].includes(claim.status) && claim.super_admin_decided_at && (
                            <div className="relative">
                                <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Disetujui Super Admin</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.super_admin_decided_at} oleh {claim.super_admin_name}</p>
                            </div>
                        )}
                        {claim.status === 'ditolak' && claim.super_admin_decided_at && (
                            <div className="relative">
                                <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-red-500" />
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Ditolak Super Admin</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.super_admin_decided_at} oleh {claim.super_admin_name}</p>
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
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Dana masuk ke saldo customer</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}