import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { ArrowLeft, FileText, User, Building2, Calendar, AlertTriangle, Mail, MapPin } from 'lucide-react';

export default function Show({ report }) {
    return (
        <SuperAdminLayout title="Detail Laporan">
            <Head title={`Detail Laporan #${report.id}`} />

            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/super-admin/laporan"
                    className="rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100">Detail Laporan</h1>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">Laporan dari {report.pelapor?.nama}</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Kolom Utama: Detail Laporan */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Card: Informasi Laporan */}
                    <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-[#15803d] dark:text-emerald-400">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100">Informasi Laporan</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-gray-400">ID Pesanan</p>
                                    <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-gray-100">{report.order_code}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-gray-400">Jenis Layanan</p>
                                    <span className="mt-1 inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-bold text-[#15803d] dark:text-emerald-400">
                                        {report.service_type}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-gray-400">Tanggal Laporan</p>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-900 dark:text-gray-100">
                                        <Calendar size={14} />
                                        {report.tanggal_laporan}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Isi Laporan */}
                    <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                                <AlertTriangle size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100">Isi Laporan</h2>
                        </div>

                        <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/50 p-4">
                            <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                                {report.deskripsi || 'Tidak ada deskripsi'}
                            </p>
                        </div>

                        {report.foto_bukti_url && (
                            <div className="mt-4">
                                <p className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-gray-400">Bukti Visual</p>
                                <img
                                    src={report.foto_bukti_url}
                                    alt="Bukti laporan"
                                    className="max-h-96 rounded-xl border border-slate-200 dark:border-gray-800 object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Kolom Kanan: Informasi Pihak */}
                <div className="space-y-4">
                    {/* Card: Pelapor */}
                    <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                                <User size={18} />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-gray-100">Pelapor</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400">Nama</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-gray-100">{report.pelapor?.nama}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400 flex items-center gap-1">
                                    <Mail size={12} /> Email
                                </p>
                                <p className="mt-1 text-xs text-slate-600 dark:text-gray-400 break-all">{report.pelapor?.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400">ID Customer</p>
                                <p className="mt-1 font-mono text-xs font-bold text-slate-700 dark:text-gray-300">{report.pelapor?.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card: Vendor/Partner */}
                    <div className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-emerald-950/60 text-green-600 dark:text-emerald-400">
                                <Building2 size={18} />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-gray-100">Vendor</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400">Nama Vendor</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-gray-100">{report.vendor?.nama}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400 flex items-center gap-1">
                                    <Mail size={12} /> Email
                                </p>
                                <p className="mt-1 text-xs text-slate-600 dark:text-gray-400 break-all">{report.vendor?.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400 flex items-center gap-1">
                                    <MapPin size={12} /> Alamat
                                </p>
                                <p className="mt-1 text-xs text-slate-600 dark:text-gray-400">{report.vendor?.alamat}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400">Kota</p>
                                <p className="mt-1 text-xs text-slate-600 dark:text-gray-400">{report.vendor?.kota}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400">Status</p>
                                <span
                                    className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                        report.vendor?.status === 'ditangguhkan'
                                            ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-[#15803d] dark:text-emerald-400'
                                    }`}
                                >
                                    {report.vendor?.status === 'ditangguhkan' ? 'Ditangguhkan' : 'Aktif'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card: Aksi */}
                    <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-4">
                        <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-3">⚠️ Informasi Lanjutan</p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            Laporan ini telah tercatat di sistem. Ikuti tindakan lanjutan melalui panel admin atau hubungi vendor untuk penyelesaian.
                        </p>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}