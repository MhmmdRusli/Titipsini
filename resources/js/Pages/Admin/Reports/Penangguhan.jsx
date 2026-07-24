import { Link, Head } from '@inertiajs/react';
import { ChevronRight, ShieldOff } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

// `vendor` dikirim dari ReportController@penangguhan:
// { nama_vendor, ditangguhkan_at, alasan_penangguhan }

export default function Penangguhan({ vendor, report_id }) {
    return (
        <AdminLayout title="Detail Penangguhan">
            <Head title="Detail Penangguhan Vendor" />

            {/* Breadcrumb Navigasi */}
            <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 select-none">
                <Link 
                    href={route('admin.reports.index')} 
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                    Laporan
                </Link>
                <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />
                <Link 
                    href={route('admin.reports.show', report_id)} 
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                    Detail Laporan
                </Link>
                <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Detail Penangguhan</span>
            </div>

            {/* Card Detail Penangguhan */}
            <div className="max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm transition-colors">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                        <ShieldOff size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{vendor.nama_vendor}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Akun vendor sedang ditangguhkan</p>
                    </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800/60 border-y border-gray-100 dark:border-gray-800/60 text-xs">
                    <div className="flex items-center justify-between py-2.5">
                        <span className="text-gray-500 dark:text-gray-400">Ditangguhkan sejak</span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">{vendor.ditangguhkan_at ?? '-'}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="mb-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alasan Penangguhan</p>
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-900/60 p-3.5 border border-gray-100 dark:border-gray-800/50">
                        <p className="text-xs leading-relaxed text-gray-800 dark:text-gray-300">
                            {vendor.alasan_penangguhan || 'Tidak ada catatan alasan yang dilampirkan.'}
                        </p>
                    </div>
                </div>

                <div className="mt-6 pt-2">
                    <Link
                        href={route('admin.reports.show', report_id)}
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all select-none"
                    >
                        Kembali ke Detail Laporan
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}