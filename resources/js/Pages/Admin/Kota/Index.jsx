import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, Search, X, MapPin } from 'lucide-react';

// Expected props from the Laravel controller (Kota\index()):
//   kota: { data: [{ id, nama, provinsi, is_active, jumlah_vendor }], links: [...] }  <- paginated
//   filters: { search: '' }
export default function KotaIndex({ kota, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingKota, setEditingKota] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nama: '',
        provinsi: '',
        is_active: true,
        foto: null,
    });

    function handleSearch(e) {
        e.preventDefault();
        router.get('/admin/kota', { search }, { preserveState: true, replace: true });
    }

    function openCreateModal() {
        reset();
        clearErrors();
        setEditingKota(null);
        setModalOpen(true);
    }

    function openEditModal(item) {
        setEditingKota(item);
        setData({
            nama: item.nama,
            provinsi: item.provinsi,
            is_active: item.is_active,
            foto: null,
        });
        setFotoPreview(item.foto_url ?? null);
        clearErrors();
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingKota(null);
        setFotoPreview(null);
        reset();
        clearErrors();
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (editingKota) {
            router.post(`/admin/kota/${editingKota.id}`, { ...data, _method: 'put' }, {
                forceFormData: true,
                onSuccess: closeModal,
            });
        } else {
            post('/admin/kota', { forceFormData: true, onSuccess: closeModal });
        }
    }

    function handleDelete() {
        router.delete(`/admin/kota/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function handleFotoChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setFotoPreview(URL.createObjectURL(file));
        }
    }

    return (
        <AdminLayout title="Kota">
            <div className="flex items-center justify-between mb-6">
                <form onSubmit={handleSearch} className="relative w-72">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama kota..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 shadow-sm"
                    />
                </form>

                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 transition shadow-sm select-none"
                >
                    <Plus size={16} />
                    Tambah Kota
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/70 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <th className="px-6 py-3.5">Nama Kota</th>
                            <th className="px-6 py-3.5">Provinsi</th>
                            <th className="px-6 py-3.5">Jumlah Vendor</th>
                            <th className="px-6 py-3.5">Status</th>
                            <th className="px-6 py-3.5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {kota.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-xs">
                                    Belum ada data kota.
                                </td>
                            </tr>
                        )}
                        {kota.data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2.5 font-medium text-gray-800 text-xs">
                                        {item.foto_url ? (
                                            <img src={item.foto_url} alt={item.nama} className="h-8 w-8 rounded-lg object-cover border border-gray-200 shadow-sm" />
                                        ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-green-700 shadow-sm">
                                                <MapPin size={15} />
                                            </div>
                                        )}
                                        {item.nama}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-xs">{item.provinsi}</td>
                                <td className="px-6 py-4 text-gray-600 text-xs">{item.jumlah_vendor ?? 0}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold border ${
                                            item.is_active
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}
                                    >
                                        {item.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-700 transition"
                                            title="Edit Kota"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(item)}
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                                            title="Hapus Kota"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {kota.links && kota.links.length > 3 && (
                    <div className="flex items-center justify-end gap-1 border-t border-gray-200 px-6 py-3 bg-gray-50/50">
                        {kota.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                    link.active
                                        ? 'bg-green-700 text-white shadow-sm'
                                        : link.url
                                        ? 'text-gray-600 hover:bg-gray-100 border border-gray-200 bg-white'
                                        : 'text-gray-300 border border-gray-200 bg-gray-50 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
                        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                            <h2 className="text-sm font-semibold text-gray-900">
                                {editingKota ? 'Edit Kota' : 'Tambah Kota'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-700">Foto / Ikon Kota</label>
                                <label
                                    htmlFor="foto-kota"
                                    className="flex h-28 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition shadow-sm"
                                >
                                    {fotoPreview ? (
                                        <img src={fotoPreview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-xs text-gray-400 font-medium">Klik untuk pilih foto</span>
                                    )}
                                    <input id="foto-kota" type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                                </label>
                                {errors.foto && <p className="mt-1 text-xs text-red-600">{errors.foto}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Nama Kota</label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 shadow-sm"
                                    placeholder="Contoh: Bandung"
                                />
                                {errors.nama && <p className="mt-1 text-xs text-red-600">{errors.nama}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Provinsi</label>
                                <input
                                    type="text"
                                    value={data.provinsi}
                                    onChange={(e) => setData('provinsi', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 shadow-sm"
                                    placeholder="Contoh: Jawa Barat"
                                />
                                {errors.provinsi && <p className="mt-1 text-xs text-red-600">{errors.provinsi}</p>}
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5 bg-gray-50/50">
                                <span className="text-xs font-medium text-gray-700">Status Aktif</span>
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        data.is_active ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            data.is_active ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-60 shadow-sm transition select-none"
                                >
                                    {editingKota ? 'Simpan Perubahan' : 'Tambah Kota'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900">Hapus Kota?</h2>
                        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                            Kota "<span className="font-medium text-gray-700">{deleteTarget.nama}</span>" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 shadow-sm transition select-none"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}