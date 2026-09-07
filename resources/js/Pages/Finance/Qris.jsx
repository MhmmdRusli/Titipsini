import { useState, useRef, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { QrCode, UploadCloud, Trash2, CheckCircle2, ShieldAlert, Store } from 'lucide-react';
import FinanceLayout from '@/Layouts/FinanceLayout';

export default function Qris({ qris_url, merchant_name }) {
    const [preview, setPreview] = useState(qris_url ?? null);
    const fileInput = useRef(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        qris_image: null,
        merchant_name: merchant_name ?? '',
    });

    useEffect(() => {
        setPreview(qris_url ?? null);
    }, [qris_url]);

    const handleFile = (file) => {
        if (!file) return;
        setData('qris_image', file);
        setPreview(URL.createObjectURL(file));
    };

    const onDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files?.[0]);
    };

    const handleRemoveImage = () => {
        if (data.qris_image) {
            setData('qris_image', null);
            setPreview(qris_url ?? null);
            if (fileInput.current) fileInput.current.value = '';
        } else if (qris_url) {
            if (confirm('Apakah Anda yakin ingin menghapus QRIS ini?')) {
                router.delete(route('finance.qris.destroy'), {
                    onSuccess: () => {
                        setPreview(null);
                        if (fileInput.current) fileInput.current.value = '';
                    },
                });
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('finance.qris.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <FinanceLayout title="Kelola QRIS">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111827] transition-colors">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700 dark:bg-green-950/60 dark:border dark:border-green-800/50 dark:text-green-400">
                            <QrCode size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">QRIS Penerimaan</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Unggah gambar barcode QRIS statis perusahaan untuk operasional pencairan dan penerimaan dana.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={onDrop}
                            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1f293d]/30 p-8 text-center transition-colors"
                        >
                            {preview ? (
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Pratinjau QRIS"
                                        className="mx-auto h-64 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 object-contain p-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -right-2 -top-2 rounded-full border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5 text-red-600 dark:text-red-400 shadow-md transition hover:bg-red-50 dark:hover:bg-red-950/50"
                                        title="Hapus QRIS"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={32} className="mb-2 text-gray-400 dark:text-gray-500" />
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Seret gambar ke sini, atau{' '}
                                        <button
                                            type="button"
                                            onClick={() => fileInput.current?.click()}
                                            className="font-semibold text-green-700 dark:text-green-400 hover:underline"
                                        >
                                            pilih file
                                        </button>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">PNG atau JPG, maksimal 2MB</p>
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
                            <p className="text-xs text-red-600 dark:text-red-400">{errors.qris_image}</p>
                        )}

                        {!preview && (
                            <button
                                type="button"
                                onClick={() => fileInput.current?.click()}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Pilih gambar
                            </button>
                        )}

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                Nama Pemilik Account / Merchant
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={data.merchant_name}
                                    onChange={(e) => setData('merchant_name', e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 px-3 py-2.5 text-sm text-gray-900 bg-gray-50/50 focus:bg-white dark:bg-[#1f293d] dark:text-gray-100 dark:focus:bg-[#1f293d] focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                                    placeholder="Contoh: PT Nama Perusahaan / Nama Toko"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing || !data.qris_image}
                                className="rounded-xl bg-green-700 dark:bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-800 dark:hover:bg-emerald-500 disabled:opacity-50"
                            >
                                Simpan QRIS
                            </button>
                            {recentlySuccessful && (
                                <span className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-emerald-400">
                                    <CheckCircle2 size={14} />
                                    QRIS berhasil disimpan
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                <div className="rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-6 shadow-sm transition-colors">
                    <div className="flex items-start gap-2.5">
                        <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <div>
                            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Batasan Akses</p>
                            <p className="mt-1 text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-300/80">
                                Menu ini hanya untuk mengelola gambar QRIS statis dan nama merchant. Konfigurasi API Payment Gateway serta pengaturan komisi dan denda hanya dapat diakses oleh Super Admin.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </FinanceLayout>
    );
}
