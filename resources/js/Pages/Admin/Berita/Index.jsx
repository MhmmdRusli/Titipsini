import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, X, Search, Image as ImageIcon, Newspaper } from 'lucide-react';

export default function BeritaIndex({ berita, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        judul: '',
        konten: '',
        foto: null,
        is_published: true,
    });

    function handleSearch(e) {
        e.preventDefault();
        router.get('/admin/berita', { search }, { preserveState: true, replace: true });
    }

    function openCreateModal() {
        reset();
        clearErrors();
        setEditingItem(null);
        setModalOpen(true);
    }

    function openEditModal(item) {
        setEditingItem(item);
        setData({
            judul: item.judul,
            konten: item.konten ?? '',
            foto: null,
            is_published: !!item.published_at,
        });
        clearErrors();
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingItem(null);
        reset();
        clearErrors();
    }

    function handleSubmit(e) {
        e.preventDefault();

        const options = {
            forceFormData: true,
            onSuccess: () => {
                closeModal();
            },
            onError: (errors) => {
                console.log('[Berita] submit GAGAL, errors:', errors);
            },
        };

        if (editingItem) {
            router.post(
                `/admin/berita/${editingItem.id}`,
                { ...data, _method: 'put' },
                options
            );
        } else {
            post('/admin/berita', options);
        }
    }

    function handleDelete() {
        router.delete(`/admin/berita/${deleteTarget.id}`, {
            onSuccess: () => {
                setDeleteTarget(null);
            },
            onError: (errors) => {
                console.log('[Berita] hapus GAGAL, errors:', errors);
            },
        });
    }

    return (
        <AdminLayout title="Manajemen Berita">
            {/* Baris Pencarian & Tombol Tambah Berita Sejajar */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
                <form onSubmit={handleSearch} className="flex gap-2.5 max-w-md w-full">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                            <Search size={16} />
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul berita..."
                            className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2 text-xs text-gray-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 shadow-sm transition-all"
                    >
                        Cari
                    </button>
                </form>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 shadow-sm transition-all shrink-0"
                >
                    <Plus size={16} />
                    Tambah Berita
                </button>
            </div>

            {/* Tabel Data Berita */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200 select-none">
                        <tr>
                            <th className="px-4 py-3 font-bold">Foto</th>
                            <th className="px-4 py-3 font-bold">Judul</th>
                            <th className="px-4 py-3 font-bold">Status</th>
                            <th className="px-4 py-3 font-bold">Dibuat</th>
                            <th className="px-4 py-3 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {berita.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-gray-400 select-none">
                                    <div className="flex flex-col items-center justify-center">
                                        <Newspaper size={32} className="text-gray-300 mb-2" />
                                        <p className="text-sm font-medium text-gray-500">Belum ada berita ditemukan.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {berita.data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-4 py-3.5">
                                    <div className="h-10 w-14 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                        {item.foto ? (
                                            <img src={item.foto} alt={item.judul} className="h-full w-full object-cover" />
                                        ) : (
                                            <ImageIcon size={16} className="text-gray-300" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-gray-900 max-w-xs truncate">{item.judul}</td>
                                <td className="px-4 py-3.5 select-none">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                            item.published_at
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}
                                    >
                                        {item.published_at ? 'Terbit' : 'Draf'}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-gray-500">
                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="px-4 py-3.5 text-right select-none">
                                    <div className="inline-flex items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-green-700 transition-colors"
                                            title="Edit Berita"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(item)}
                                            className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            title="Hapus Berita"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {berita.links && berita.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-end gap-1.5 border-t border-gray-200 bg-gray-50/50 px-4 py-3 select-none">
                        {berita.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                                    link.active
                                        ? 'bg-green-700 text-white shadow-sm'
                                        : link.url
                                        ? 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                        : 'cursor-not-allowed text-gray-300 border border-gray-100 bg-gray-50/50'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Tambah / Edit Berita */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs select-none">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                            <h2 className="text-sm font-bold text-gray-900">
                                {editingItem ? 'Edit Berita' : 'Tambah Berita Baru'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">Judul Berita</label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 shadow-sm"
                                    placeholder="Masukkan judul berita..."
                                />
                                {errors.judul && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.judul}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">Konten</label>
                                <textarea
                                    rows={5}
                                    value={data.konten}
                                    onChange={(e) => setData('konten', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 shadow-sm"
                                    placeholder="Tulis isi berita di sini..."
                                />
                                {errors.konten && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.konten}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">
                                    Foto {editingItem && <span className="text-gray-400 font-normal">(kosongkan jika tidak diganti)</span>}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('foto', e.target.files[0])}
                                    className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                                />
                                {errors.foto && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.foto}</p>}
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5">
                                <span className="text-xs font-semibold text-gray-700">Terbitkan Sekarang</span>
                                <button
                                    type="button"
                                    onClick={() => setData('is_published', !data.is_published)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        data.is_published ? 'bg-green-700' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                            data.is_published ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-60 shadow-sm transition-all"
                                >
                                    {editingItem ? 'Simpan Perubahan' : 'Tambah Berita'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs select-none">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900">Hapus Berita?</h2>
                        <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                            "<span className="font-medium text-gray-700">{deleteTarget.judul}</span>" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 shadow-sm transition-all"
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