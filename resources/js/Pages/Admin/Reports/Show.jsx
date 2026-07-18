import { Link, useForm } from '@inertiajs/react';
import { ChevronRight, PawPrint } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

// `report` diharapkan dikirim dari controller, contoh bentuknya:
// {
//   id, tanggal_laporan, alasan, foto_bukti_url,
//   jenis_layanan, id_pesanan,
//   pelapor: { nama, id_customer, role },
//   vendor: { id_vendor, nama_vendor, nama_usaha, jenis_layanan, wilayah, alamat_lengkap, status }, // status: 'aktif' | 'ditangguhkan'
// }

function InfoRow({ label, value, isLink = false }) {
    return (
        <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
            <span className="text-gray-500">{label}</span>
            {isLink ? (
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-[60%] truncate text-right text-brand-teal-700 hover:underline"
                    title={value}
                >
                    {value}
                </a>
            ) : (
                <span className="max-w-[60%] text-right font-medium text-gray-900">{value}</span>
            )}
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
            <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
                <Link href={route('admin.reports.index')} className="hover:text-brand-teal-700">
                    Laporan
                </Link>
                <ChevronRight size={14} />
                <span className="text-gray-700">Detail Laporan</span>
            </div>

            <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal-100 text-brand-teal-700">
                        <PawPrint size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{pelapor.nama}</p>
                        <p className="text-xs text-gray-500">
                            {pelapor.id_customer} &middot; {pelapor.role}
                        </p>
                    </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                    <p className="font-medium text-gray-700">{report.jenis_layanan}</p>
                    <p>Id Pesanan {report.id_pesanan}</p>
                    <p>{report.tanggal_laporan}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Isi Laporan</h3>
                    <div className="divide-y divide-gray-100">
                        <InfoRow label="Pelapor" value={pelapor.nama} />
                        <InfoRow label="Id Customer" value={pelapor.id_customer} />
                        <InfoRow label="Id Pesanan" value={report.id_pesanan} />
                        <InfoRow label="Foto Barang Bukti" value={report.foto_bukti_url} isLink />
                    </div>
                    <div className="mt-3">
                        <p className="mb-1 text-sm text-gray-500">Alasan Laporan</p>
                        <p className="text-sm leading-relaxed text-gray-800">{report.alasan}</p>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Biodata Vendor</h3>
                    <div className="divide-y divide-gray-100">
                        <InfoRow label="Id Vendor" value={vendor.id_vendor} />
                        <InfoRow label="Nama Vendor" value={vendor.nama_vendor} />
                        <InfoRow label="Nama Usaha" value={vendor.nama_usaha} />
                        <InfoRow label="Jenis Layanan" value={vendor.jenis_layanan} />
                        <InfoRow label="Wilayah" value={vendor.wilayah} />
                        <InfoRow label="Alamat Lengkap" value={vendor.alamat_lengkap} />
                    </div>

                    <div className="mt-5">
                        {isSuspended ? (
                            <div className="flex gap-3">
                                <Link
                                    href={route('admin.reports.penangguhan', report.id)}
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Detail Penangguhan
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleRestore}
                                    disabled={restoreForm.processing}
                                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    Pulihkan Akun
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSuspend}
                                disabled={suspendForm.processing}
                                className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                Tangguhkan
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}