import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft, Image as ImgIcon, ExternalLink, ShieldCheck, Clock,
    AlertTriangle, AlertCircle, CheckCircle2, XCircle, FileText, User,
    Edit, Trash2, Gavel
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

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
    const [adminCatatan, setAdminCatatan] = useState('');
    const [persentaseRefund, setPersentaseRefund] = useState(claim.persentase_refund ?? 60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionType, setActionType] = useState(null); // 'mulai', 'setujui', 'tolak', 'sengketa'

    const canMulaiPemeriksaan = claim.status === 'klaim_diajukan';
    const canSetujui = ['menunggu_pemeriksaan_admin', 'menunggu_klarifikasi_mitra', 'sengketa'].includes(claim.status);
    const canTolak = ['menunggu_pemeriksaan_admin', 'menunggu_klarifikasi_mitra', 'sengketa'].includes(claim.status);
    const canSengketa = claim.status === 'menunggu_klarifikasi_mitra';

    function handleAction(type) {
        setActionType(type);
    }

    function confirmAction() {
        if (actionType === 'tolak' || actionType === 'sengketa') {
            if (!adminCatatan.trim()) {
                alert('Catatan wajib diisi.');
                return;
            }
        }
        if (actionType === 'setujui') {
            if (!persentaseRefund || persentaseRefund < 1 || persentaseRefund > 100) {
                alert('Persentase refund harus antara 1-100%.');
                return;
            }
        }

        setIsSubmitting(true);
        let url, method, data;
        
        switch (actionType) {
            case 'mulai':
                url = `/admin/klaim/${claim.id}/mulai-pemeriksaan`;
                method = 'post';
                data = {};
                break;
            case 'setujui':
                url = `/admin/klaim/${claim.id}/setujui`;
                method = 'patch';
                data = { persentase_refund: persentaseRefund, admin_catatan: adminCatatan };
                break;
            case 'tolak':
                url = `/admin/klaim/${claim.id}/tolak`;
                method = 'patch';
                data = { admin_catatan: adminCatatan };
                break;
            case 'sengketa':
                url = `/admin/klaim/${claim.id}/sengketa`;
                method = 'patch';
                data = { admin_catatan: adminCatatan };
                break;
        }

        router[method](url, data, {
            preserveScroll: true,
            onFinish: () => {
                setIsSubmitting(false);
                setActionType(null);
                setAdminCatatan('');
            },
        });
    }

    return (
        <AdminLayout title={`Klaim #${claim.id} - ${claim.order_code}`}>
            <Head title={`Klaim #${claim.id} - ${claim.order_code} - Admin Titipsini`} />

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
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Detail Klaim #{claim.id}</h1>
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

                    {/* Admin Validation Result */}
                    {claim.admin_validated_at && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">Hasil Pemeriksaan Admin</p>
                            <div className="mt-2 space-y-1 text-xs text-emerald-700/90 dark:text-emerald-300/80">
                                <p><strong>Diperiksa oleh:</strong> {claim.admin_validator_name ?? 'Admin'} pada {claim.admin_validated_at}</p>
                                {claim.admin_catatan && <p><strong>Catatan:</strong> {claim.admin_catatan}</p>}
                                {claim.persentase_refund && <p><strong>Persentase Refund:</strong> {claim.persentase_refund}%</p>}
                                {claim.jumlah_refund && <p><strong>Jumlah Refund:</strong> {formatRupiah(claim.jumlah_refund)}</p>}
                            </div>
                        </div>
                    )}

                    {/* Refund Details */}
                    {['disetujui', 'diproses_finance', 'refund_berhasil'].includes(claim.status) && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">Detail Refund Disetujui</p>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-emerald-700/90 dark:text-emerald-300/80">
                                <div><strong>Persentase:</strong> {claim.persentase_refund ?? '-'}%</div>
                                <div><strong>Jumlah:</strong> {claim.jumlah_refund ? formatRupiah(claim.jumlah_refund) : '-'}</div>
                            </div>
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

                    {/* Rejected Info */}
                    {claim.status === 'ditolak' && claim.admin_catatan && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                            <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                                <XCircle size={18} className="shrink-0" />
                                <p className="text-sm font-semibold">Klaim Ditolak</p>
                            </div>
                            <p className="mt-1 text-xs text-red-700/90 dark:text-red-300/80">Alasan: {claim.admin_catatan}</p>
                        </div>
                    )}
                </div>

                {/* Admin Actions */}
                {(canMulaiPemeriksaan || canSetujui || canTolak || canSengketa) && (
                    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Aksi Admin</p>
                        <div className="flex flex-wrap gap-3">
                            {canMulaiPemeriksaan && (
                                <button
                                    onClick={() => handleAction('mulai')}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    <Clock size={16} />
                                    Mulai Pemeriksaan
                                </button>
                            )}
                            {canSetujui && (
                                <button
                                    onClick={() => { setPersentaseRefund(claim.persentase_refund ?? 60); handleAction('setujui'); }}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                                >
                                    <CheckCircle2 size={16} />
                                    Setujui Klaim
                                </button>
                            )}
                            {canTolak && (
                                <button
                                    onClick={() => handleAction('tolak')}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition"
                                >
                                    <XCircle size={16} />
                                    Tolak Klaim
                                </button>
                            )}
                            {canSengketa && (
                                <button
                                    onClick={() => handleAction('sengketa')}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 transition"
                                >
                                    <Gavel size={16} />
                                    Naikkan ke Sengketa
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Modals */}
                {(actionType === 'setujui' || actionType === 'tolak' || actionType === 'sengketa') && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                {actionType === 'setujui' ? 'Setujui Klaim' : actionType === 'tolak' ? 'Tolak Klaim' : 'Naikkan ke Sengketa'}
                            </h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {actionType === 'setujui' 
                                    ? 'Tentukan persentase refund dan catatan (opsional).'
                                    : actionType === 'tolak'
                                    ? 'Masukkan alasan penolakan.'
                                    : 'Masukkan alasan pengenaikan ke sengketa.'}
                            </p>

                            {actionType === 'setujui' && (
                                <div className="mt-4 space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Persentase Refund (%)</label>
                                        <input
                                            type="number"
                                            value={persentaseRefund}
                                            onChange={(e) => setPersentaseRefund(Math.max(1, Math.min(100, parseInt(e.target.value) || 0)))}
                                            min="1"
                                            max="100"
                                            className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                        />
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Estimasi refund: {claim.order?.total_price ? formatRupiah(Math.round(claim.order.total_price * persentaseRefund / 100)) : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Catatan Admin (Opsional)</label>
                                        <textarea
                                            value={adminCatatan}
                                            onChange={(e) => setAdminCatatan(e.target.value)}
                                            rows={2}
                                            placeholder="Catatan untuk customer/mitra/finance..."
                                            className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
                                        />
                                    </div>
                                </div>
                            )}

                            {(actionType === 'tolak' || actionType === 'sengketa') && (
                                <div className="mt-4">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Alasan <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={adminCatatan}
                                        onChange={(e) => setAdminCatatan(e.target.value)}
                                        rows={3}
                                        required
                                        placeholder={actionType === 'tolak' ? 'Alasan penolakan klaim...' : 'Alasan pengenaikan ke sengketa...'}
                                        className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
                                    />
                                </div>
                            )}

                            <div className="mt-5 flex gap-3 justify-end">
                                <button
                                    onClick={() => setActionType(null)}
                                    disabled={isSubmitting}
                                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmAction}
                                    disabled={isSubmitting}
                                    className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition ${
                                        actionType === 'setujui' ? 'bg-emerald-600 hover:bg-emerald-700' :
                                        actionType === 'tolak' ? 'bg-red-600 hover:bg-red-700' :
                                        'bg-amber-600 hover:bg-amber-700'
                                    } disabled:opacity-50`}
                                >
                                    {isSubmitting ? 'Memproses...' : actionType === 'setujui' ? 'Setujui' : actionType === 'tolak' ? 'Tolak' : 'Naikkan ke Sengketa'}
                                </button>
                            </div>
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
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                    {claim.status === 'klaim_diajukan' ? 'Pemeriksaan Dimulai' : 'Diperiksa Admin'}
                                </p>
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
                        {['disetujui', 'diproses_finance', 'refund_berhasil'].includes(claim.status) && (
                            <div className="relative">
                                <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Disetujui Admin</p>
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
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Dana masuk ke saldo customer</p>
                            </div>
                        )}
                        {claim.status === 'ditolak' && (
                            <div className="relative">
                                <div className="absolute left-[-6px] top-0.5 h-2 w-2 rounded-full bg-red-500" />
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Ditolak Admin</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">{claim.admin_validated_at}</p>
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
        </AdminLayout>
    );
}