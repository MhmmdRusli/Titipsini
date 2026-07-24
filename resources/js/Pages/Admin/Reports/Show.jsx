import { Link, useForm, Head } from '@inertiajs/react';
import { 
    ChevronRight, 
    ShieldAlert, 
    User, 
    Store, 
    FileText, 
    Calendar, 
    Hash, 
    ExternalLink, 
    AlertTriangle, 
    CheckCircle2, 
    Info,
    Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 py-3 text-sm border-b border-gray-100 dark:border-gray-800/60 last:border-none">
            <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400">
                {Icon && <Icon size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />}
                <span>{label}</span>
            </div>
            <span className="max-w-[55%] text-right font-medium text-gray-900 dark:text-gray-100 break-words">
                {value || '-'}
            </span>
        </div>
    );
}

export default function Show({ report }) {
    const { pelapor, vendor } = report;
    const isSuspended = vendor.status === 'ditangguhkan';

    const suspendForm = useForm({});
    const restoreForm = useForm({});

    const handleSuspend = () => {
        if (!confirm(`Tangguhkan akun vendor ${vendor.nama_vendor}? Vendor tidak dapat beroperasi sampai dipulihkan.`)) return;
        suspendForm.put(route('admin.reports.suspend', report.id), { preserveScroll: true });
    };

    const handleRestore = () => {
        if (!confirm(`Pulihkan akses akun vendor ${vendor.nama_vendor}?`)) return;
        restoreForm.put(route('admin.reports.restore', report.id), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Detail Laporan">
            <Head title={`Detail Laporan #${report.id}`} />

            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 select-none">
                <Link href={route('admin.reports.index')} className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
                    Laporan
                </Link>
                <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />
                <span className="font-medium text-gray-800 dark:text-gray-200">Detail Laporan #{report.id}</span>
            </nav>

            {/* Header Banner Ringkasan */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 ring-4 ring-emerald-50/50 dark:ring-emerald-950/30">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">{pelapor.nama}</h1>
                            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300 capitalize">
                                {pelapor.role}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            ID Pelapor: <span className="font-medium text-gray-700 dark:text-gray-300">{pelapor.id_customer}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 border-t border-gray-100 dark:border-gray-800/60 pt-4 sm:border-t-0 sm:pt-0 sm:text-right">
                    <div>
                        <span className="block text-xs text-gray-400 dark:text-gray-500">Jenis Layanan</span>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{report.jenis_layanan}</span>
                    </div>
                    <div className="hidden sm:block h-8 w-[1px] bg-gray-200 dark:bg-gray-800" />
                    <div>
                        <span className="block text-xs text-gray-400 dark:text-gray-500">ID Pesanan</span>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">#{report.id_pesanan}</span>
                    </div>
                    <div className="hidden sm:block h-8 w-[1px] bg-gray-200 dark:bg-gray-800" />
                    <div>
                        <span className="block text-xs text-gray-400 dark:text-gray-500">Tanggal Dilaporkan</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{report.tanggal_laporan}</span>
                    </div>
                </div>
            </div>

            {/* Grid Konten Utama */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                
                {/* Kolom Kiri: Isi Laporan */}
                <div className="flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm transition-colors">
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                <FileText size={18} className="text-emerald-600 dark:text-emerald-400" />
                                Informasi Laporan
                            </h3>
                            <span className="rounded-md bg-amber-50 dark:bg-amber-950/60 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                Menunggu Tindakan
                            </span>
                        </div>

                        <div className="rounded-xl bg-gray-50/70 dark:bg-gray-900/60 p-4 mb-5 border border-gray-100 dark:border-gray-800/50">
                            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                                Alasan / Deskripsi Laporan
                            </span>
                            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {report.alasan}
                            </p>
                        </div>

                        {/* Foto Barang Bukti */}
                        <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                                    <ImageIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Foto Barang Bukti</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Lampiran foto dari pelapor</p>
                                </div>
                            </div>
                            {report.foto_bukti_url ? (
                                <a 
                                    href={report.foto_bukti_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span>Lihat Bukti</span>
                                    <ExternalLink size={12} className="text-gray-400 dark:text-gray-500" />
                                </a>
                            ) : (
                                <span className="text-xs text-gray-400 dark:text-gray-500 italic">Tidak ada foto</span>
                            )}
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                            <InfoItem icon={User} label="Nama Pelapor" value={pelapor.nama} />
                            <InfoItem icon={Hash} label="ID Customer" value={pelapor.id_customer} />
                            <InfoItem icon={Hash} label="ID Pesanan" value={`#${report.id_pesanan}`} />
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 p-3.5 border border-blue-100 dark:border-blue-900/40 flex items-start gap-3">
                        <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                            Pastikan Anda memeriksa bukti foto dan detail pesanan dengan teliti sebelum memutuskan untuk menangguhkan akun vendor.
                        </p>
                    </div>
                </div>

                {/* Kolom Kanan: Biodata Vendor & Aksi */}
                <div className="flex flex-col justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm transition-colors">
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                <Store size={18} className="text-emerald-600 dark:text-emerald-400" />
                                Biodata Vendor Terlapor
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                isSuspended 
                                    ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60' 
                                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                            }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${isSuspended ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                {isSuspended ? 'Ditangguhkan' : 'Aktif'}
                            </span>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-800/60 mb-6">
                            <InfoItem icon={Hash} label="ID Vendor" value={vendor.id_vendor} />
                            <InfoItem icon={User} label="Nama Pemilik/Vendor" value={vendor.nama_vendor} />
                            <InfoItem icon={Store} label="Nama Usaha" value={vendor.nama_usaha} />
                            <InfoItem icon={FileText} label="Jenis Layanan" value={vendor.jenis_layanan} />
                            <InfoItem icon={Calendar} label="Wilayah" value={vendor.wilayah} />
                            <InfoItem icon={Calendar} label="Alamat Lengkap" value={vendor.alamat_lengkap} />
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="border-t border-gray-100 dark:border-gray-800/60 pt-5">
                        {isSuspended ? (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href={route('admin.reports.penangguhan', report.id)}
                                    className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-[#111827] px-4 py-2.5 text-center text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
                                >
                                    Detail Penangguhan
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleRestore}
                                    disabled={restoreForm.processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                                >
                                    <CheckCircle2 size={16} />
                                    {restoreForm.processing ? 'Memproses...' : 'Pulihkan Akun'}
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSuspend}
                                disabled={suspendForm.processing}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50"
                            >
                                <AlertTriangle size={16} />
                                {suspendForm.processing ? 'Memproses...' : 'Tangguhkan Akun Vendor'}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}