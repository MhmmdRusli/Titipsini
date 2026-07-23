import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, X, Search, Image as ImageIcon } from 'lucide-react';

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
                console.log('[Berita] submit SUKSES');
                closeModal();
            },
            onError: (errors) => {
                console.log('[Berita] submit GAGAL, errors:', errors);
            },
            onFinish: () => {
                console.log('[Berita] submit selesai (finally)');
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
                console.log('[Berita] hapus SUKSES');
                setDeleteTarget(null);
            },
            onError: (errors) => {
                console.log('[Berita] hapus GAGAL, errors:', errors);
            },
            onFinish: () => {
                console.log('[Berita] hapus selesai (finally)');
            },
        });
    }

    return (
        <AdminLayout title="Manajemen Berita">
            <div className="mb-6 flex items-center justify-between gap-3">
                <form onSubmit={handleSearch} className="relative w-72">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari judul berita..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </form>

                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                >
                    <Plus size={16} />
                    Tambah Berita
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                            <th className="px-6 py-3">Foto</th>
                            <th className="px-6 py-3">Judul</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Dibuat</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {berita.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                    Belum ada berita.
                                </td>
                            </tr>
                        )}
                        {berita.data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3">
                                    <div className="h-12 w-16 overflow-hidden rounded-lg bg-gray-100">
                                        {item.foto ? (
                                            <img src={item.foto} alt={item.judul} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-300">
                                                <ImageIcon size={18} />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-3 font-medium text-gray-900">{item.judul}</td>
                                <td className="px-6 py-3">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                            item.published_at
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        {item.published_at ? 'Terbit' : 'Draf'}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-600">
                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-green-700"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(item)}
                                            className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {berita.links && berita.links.length > 3 && (
                    <div className="flex items-center justify-end gap-1 border-t border-gray-100 px-6 py-3">
                        {berita.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-md px-3 py-1.5 text-xs ${
                                    link.active
                                        ? 'bg-green-700 text-white'
                                        : link.url
                                        ? 'text-gray-500 hover:bg-gray-100'
                                        : 'text-gray-300 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-gray-900">
                                {editingItem ? 'Edit Berita' : 'Tambah Berita'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Judul</label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="Judul berita"
                                />
                                {errors.judul && <p className="mt-1 text-xs text-red-500">{errors.judul}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Konten</label>
                                <textarea
                                    rows={5}
                                    value={data.konten}
                                    onChange={(e) => setData('konten', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="Isi berita..."
                                />
                                {errors.konten && <p className="mt-1 text-xs text-red-500">{errors.konten}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">
                                    Foto {editingItem && '(kosongkan kalau tidak diganti)'}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('foto', e.target.files[0])}
                                    className="w-full text-sm text-gray-600"
                                />
                                {errors.foto && <p className="mt-1 text-xs text-red-500">{errors.foto}</p>}
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5">
                                <span className="text-sm text-gray-600">Terbitkan Sekarang</span>
                                <button
                                    type="button"
                                    onClick={() => setData('is_published', !data.is_published)}
                                    className={`relative h-6 w-11 rounded-full transition-colors ${
                                        data.is_published ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                            data.is_published ? 'translate-x-5' : 'translate-x-0.5'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
                                >
                                    {editingItem ? 'Simpan Perubahan' : 'Tambah Berita'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-base font-semibold text-gray-900">Hapus Berita?</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            "{deleteTarget.judul}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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