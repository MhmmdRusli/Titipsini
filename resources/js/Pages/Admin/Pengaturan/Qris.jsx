import { useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { QrCode, UploadCloud, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Qris() {
    const { qris_url } = usePage().props; // URL gambar QRIS yang sudah tersimpan (jika ada), dikirim dari controller
    const [preview, setPreview] = useState(qris_url ?? null);
    const fileInput = useRef(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        qris_image: null,
    });

    const handleFile = (file) => {
        if (!file) return;
        setData('qris_image', file);
        setPreview(URL.createObjectURL(file));
    };

    const onDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files?.[0]);
    };

    const clearImage = () => {
        setData('qris_image', null);
        setPreview(null);
        if (fileInput.current) fileInput.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.pengaturan.qris.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="QRIS">
            <div className="max-w-lg">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal-100 text-brand-teal-700">
                            <QrCode size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Gambar QRIS</h2>
                            <p className="text-sm text-gray-500">Unggah gambar QRIS statis yang akan ditampilkan ke customer saat pembayaran.</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={onDrop}
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center"
                        >
                            {preview ? (
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Pratinjau QRIS"
                                        className="mx-auto h-56 w-56 rounded-lg border border-gray-200 object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-red-600 shadow hover:bg-red-50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={28} className="mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-600">
                                        Seret gambar ke sini, atau{' '}
                                        <button
                                            type="button"
                                            onClick={() => fileInput.current?.click()}
                                            className="font-medium text-brand-teal-700 hover:underline"
                                        >
                                            pilih file
                                        </button>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">PNG atau JPG, maksimal 2MB</p>
                                </>
                            )}
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={(e) => handleFile(e.target.files?.[0])}
                                className="hidden"
                            />
                        </div>
                        {errors.qris_image && (
                            <p className="text-xs text-red-600">{errors.qris_image}</p>
                        )}

                        {!preview && (
                            <button
                                type="button"
                                onClick={() => fileInput.current?.click()}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Pilih gambar
                            </button>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing || !data.qris_image}
                                className="rounded-lg bg-brand-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-teal-800 disabled:opacity-50"
                            >
                                Simpan QRIS
                            </button>
                            {recentlySuccessful && (
                                <span className="text-sm text-brand-teal-700">QRIS berhasil disimpan</span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}