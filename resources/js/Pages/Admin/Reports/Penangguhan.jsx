import { Link } from '@inertiajs/react';
import { ChevronRight, ShieldOff } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

// `vendor` dikirim dari ReportController@penangguhan:
// { nama_vendor, ditangguhkan_at, alasan_penangguhan }

export default function Penangguhan({ vendor, report_id }) {
    return (
        <AdminLayout title="Detail Penangguhan">
            <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
                <Link href={route('admin.reports.index')} className="hover:text-brand-teal-700">
                    Laporan
                </Link>
                <ChevronRight size={14} />
                <Link href={route('admin.reports.show', report_id)} className="hover:text-brand-teal-700">
                    Detail Laporan
                </Link>
                <ChevronRight size={14} />
                <span className="text-gray-700">Detail Penangguhan</span>
            </div>

            <div className="max-w-lg rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <ShieldOff size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">{vendor.nama_vendor}</h2>
                        <p className="text-sm text-gray-500">Akun vendor sedang ditangguhkan</p>
                    </div>
                </div>

                <div className="divide-y divide-gray-100 text-sm">
                    <div className="flex items-center justify-between py-2">
                        <span className="text-gray-500">Ditangguhkan sejak</span>
                        <span className="font-medium text-gray-900">{vendor.ditangguhkan_at ?? '-'}</span>
                    </div>
                </div>

                <div className="mt-3">
                    <p className="mb-1 text-sm text-gray-500">Alasan Penangguhan</p>
                    <p className="text-sm leading-relaxed text-gray-800">
                        {vendor.alasan_penangguhan || 'Tidak ada catatan alasan yang dilampirkan.'}
                    </p>
                </div>

                <div className="mt-6">
                    <Link
                        href={route('admin.reports.show', report_id)}
                        className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Kembali ke Detail Laporan
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}