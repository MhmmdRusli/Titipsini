import { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { Search, FileDown, ChevronRight } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

const JENIS_LAYANAN_LABEL = {
    kendaraan: 'Kendaraan',
    barang: 'Barang',
    bangunan: 'Bangunan',
};

export default function Index({ reports = [] }) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return reports;
        return reports.filter((r) =>
            [r.pelapor_nama, r.vendor_nama, r.jenis_layanan, r.ulasan]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(q))
        );
    }, [query, reports]);

    return (
        <AdminLayout title="Laporan">
            <div className="rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
                    <div className="relative w-full max-w-xs">
                        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari pelapor, vendor, jenis layanan..."
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                        />
                    </div>
                    <a
                        href={route('admin.reports.export')}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <FileDown size={16} />
                        Unduh dokumen
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                                <th className="px-5 py-3 font-medium">Nama Pelapor</th>
                                <th className="px-5 py-3 font-medium">Nama Vendor</th>
                                <th className="px-5 py-3 font-medium">Jenis Layanan</th>
                                <th className="px-5 py-3 font-medium">Tanggal Laporan</th>
                                <th className="px-5 py-3 font-medium">Ulasan</th>
                                <th className="px-5 py-3 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                                        Belum ada laporan yang cocok.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-3 font-medium text-gray-900">{r.pelapor_nama}</td>
                                    <td className="px-5 py-3 text-gray-700">{r.vendor_nama}</td>
                                    <td className="px-5 py-3">
                                        <span className="rounded-full bg-brand-teal-100 px-2.5 py-1 text-xs font-medium text-brand-teal-700">
                                            {JENIS_LAYANAN_LABEL[r.jenis_layanan] ?? r.jenis_layanan}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-600">{r.tanggal_laporan}</td>
                                    <td className="max-w-xs truncate px-5 py-3 text-gray-600" title={r.ulasan}>
                                        {r.ulasan}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Link
                                            href={route('admin.reports.show', r.id)}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-brand-teal-700 hover:underline"
                                        >
                                            Detail
                                            <ChevronRight size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}