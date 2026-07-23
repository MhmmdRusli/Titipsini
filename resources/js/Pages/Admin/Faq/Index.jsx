import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Pencil, Trash2, X, HelpCircle, GripVertical } from 'lucide-react';

export default function FaqIndex({ faq }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        pertanyaan: '',
        jawaban: '',
        urutan: '',
        is_active: true,
    });

    function openCreateModal() {
        reset();
        clearErrors();
        setEditingFaq(null);
        setModalOpen(true);
    }

    function openEditModal(item) {
        setEditingFaq(item);
        setData({
            pertanyaan: item.pertanyaan,
            jawaban: item.jawaban,
            urutan: item.urutan,
            is_active: item.is_active,
        });
        clearErrors();
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingFaq(null);
        reset();
        clearErrors();
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (editingFaq) {
            put(`/admin/faq/${editingFaq.id}`, { onSuccess: closeModal });
        } else {
            post('/admin/faq', { onSuccess: closeModal });
        }
    }

    function handleDelete() {
        router.delete(`/admin/faq/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <AdminLayout title="FAQ">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Kelola daftar pertanyaan umum yang tampil di halaman Pusat Bantuan Pelanggan.
                </p>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 rounded-lg bg-brand-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-teal-800 transition-colors"
                >
                    <Plus size={16} />
                    Tambah FAQ
                </button>
            </div>

            <div className="space-y-3">
                {faq.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-400">
                        Belum ada data FAQ.
                    </div>
                )}

                {faq.map((item) => (
                    <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="flex items-start gap-3">
                            <GripVertical size={16} className="mt-1 shrink-0 text-gray-300" />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <HelpCircle size={15} className="shrink-0 text-brand-teal-600" />
                                    <p className="font-medium text-gray-900">{item.pertanyaan}</p>
                                    {!item.is_active && (
                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                            Nonaktif
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1.5 text-sm text-gray-500">{item.jawaban}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-teal-700"
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
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-gray-900">
                                {editingFaq ? 'Edit FAQ' : 'Tambah FAQ'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Pertanyaan</label>
                                <input
                                    type="text"
                                    value={data.pertanyaan}
                                    onChange={(e) => setData('pertanyaan', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500"
                                    placeholder="Contoh: Bagaimana cara membatalkan pesanan?"
                                />
                                {errors.pertanyaan && <p className="mt-1 text-xs text-red-500">{errors.pertanyaan}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Jawaban</label>
                                <textarea
                                    rows={4}
                                    value={data.jawaban}
                                    onChange={(e) => setData('jawaban', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500"
                                    placeholder="Tulis jawabannya di sini..."
                                />
                                {errors.jawaban && <p className="mt-1 text-xs text-red-500">{errors.jawaban}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Urutan Tampil</label>
                                <input
                                    type="number"
                                    value={data.urutan}
                                    onChange={(e) => setData('urutan', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none focus:ring-1 focus:ring-brand-teal-500"
                                    placeholder="0"
                                />
                                <p className="mt-1 text-xs text-gray-400">Angka lebih kecil tampil lebih dulu. Kosongkan untuk otomatis di urutan terakhir.</p>
                                {errors.urutan && <p className="mt-1 text-xs text-red-500">{errors.urutan}</p>}
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5">
                                <span className="text-sm text-gray-600">Status Aktif</span>
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`relative h-6 w-11 rounded-full transition-colors ${
                                        data.is_active ? 'bg-brand-teal-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                            data.is_active ? 'translate-x-5' : 'translate-x-0.5'
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
                                    className="rounded-lg bg-brand-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-teal-800 disabled:opacity-60"
                                >
                                    {editingFaq ? 'Simpan Perubahan' : 'Tambah FAQ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-base font-semibold text-gray-900">Hapus FAQ?</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            "{deleteTarget.pertanyaan}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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