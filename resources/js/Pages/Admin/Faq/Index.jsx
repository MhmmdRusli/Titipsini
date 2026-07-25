import { useState } from 'react';
import { Link, router, useForm, Head } from '@inertiajs/react';
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
            <Head title="Kelola FAQ" />

            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Kelola daftar pertanyaan umum yang tampil di halaman Pusat Bantuan Pelanggan.
                </p>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shrink-0"
                >
                    <Plus size={16} />
                    Tambah FAQ
                </button>
            </div>

            {/* List FAQ */}
            <div className="space-y-3">
                {faq.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-white dark:bg-[#111827] p-10 text-center text-gray-400 dark:text-gray-500 text-sm">
                        Belum ada data FAQ.
                    </div>
                )}

                {faq.map((item) => (
                    <div 
                        key={item.id} 
                        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-4 shadow-sm transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            <GripVertical size={16} className="mt-1 shrink-0 text-gray-300 dark:text-gray-600 cursor-grab active:cursor-grabbing" />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <HelpCircle size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{item.pertanyaan}</p>
                                    {!item.is_active && (
                                        <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                            Nonaktif
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.jawaban}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="rounded-lg p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                >
                                    <Pencil size={15} />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(item)}
                                    className="rounded-lg p-2 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form Create/Edit */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-4 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-2xl transition-colors">
                        <div className="mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-3">
                            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                {editingFaq ? 'Edit FAQ' : 'Tambah FAQ'}
                            </h2>
                            <button 
                                onClick={closeModal} 
                                className="rounded-lg p-1 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Pertanyaan</label>
                                <input
                                    type="text"
                                    value={data.pertanyaan}
                                    onChange={(e) => setData('pertanyaan', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                                    placeholder="Contoh: Bagaimana cara membatalkan pesanan?"
                                />
                                {errors.pertanyaan && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.pertanyaan}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Jawaban</label>
                                <textarea
                                    rows={4}
                                    value={data.jawaban}
                                    onChange={(e) => setData('jawaban', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                                    placeholder="Tulis jawabannya di sini..."
                                />
                                {errors.jawaban && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.jawaban}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Urutan Tampil</label>
                                <input
                                    type="number"
                                    value={data.urutan}
                                    onChange={(e) => setData('urutan', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                                    placeholder="0"
                                />
                                <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">Angka lebih kecil tampil lebih dulu. Kosongkan untuk otomatis di urutan terakhir.</p>
                                {errors.urutan && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.urutan}</p>}
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 px-3.5 py-2.5">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Status Aktif</span>
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        data.is_active ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-250 ease-in-out ${
                                            data.is_active ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800/60">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-sm"
                                >
                                    {editingFaq ? 'Simpan Perubahan' : 'Tambah FAQ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-4 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-2xl transition-colors">
                        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Hapus FAQ?</h2>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            "{deleteTarget.pertanyaan}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
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