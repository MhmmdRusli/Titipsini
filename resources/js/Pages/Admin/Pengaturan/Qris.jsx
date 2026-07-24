import { useState, useRef, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { QrCode, UploadCloud, Trash2, Lightbulb, CheckCircle2, ShieldAlert, Smartphone } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

const TIPS = [
    'Gunakan gambar QRIS resmi dari penyedia (bank/PSP) yang sudah terdaftar, jangan hasil crop/edit manual.',
    'Pastikan kode QR terlihat jelas dan tidak buram — customer akan scan langsung dari layar HP mereka.',
    'Format PNG atau JPG, ukuran maksimal 2MB, disarankan rasio persegi (1:1) supaya tidak terpotong.',
    'Kalau QRIS diperbarui oleh penyedia pembayaran, segera unggah ulang di sini supaya transaksi customer tidak gagal.',
    'QRIS ini bersifat statis (nominal diisi manual oleh customer) — pastikan instruksi nominal sudah jelas di halaman pembayaran.',
    'Hindari menaruh watermark, logo tambahan, atau teks di atas kode QR — ini bisa bikin scanner gagal membaca.',
];

export default function Qris() {
    const { qris_url } = usePage().props;
    const [preview, setPreview] = useState(qris_url ?? null);
    const fileInput = useRef(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        qris_image: null,
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
                router.delete(route('admin.pengaturan.qris.destroy'), {
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
        post(route('admin.pengaturan.qris.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="QRIS">
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                {/* KARTU KIRI: FORM UNGGAH QRIS */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111827] transition-colors">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700 dark:bg-green-950/60 dark:border dark:border-green-800/50 dark:text-green-400">
                            <QrCode size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Gambar QRIS</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Unggah gambar QRIS statis yang akan ditampilkan ke customer saat pembayaran.</p>
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

                {/* KARTU KANAN: TIPS & KEAMANAN */}
                <div className="flex flex-col gap-6">
                    {/* CARD TIPS PENGGUNAAN */}
                    <div className="flex-1 rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-6 shadow-sm transition-colors">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                                <Lightbulb size={20} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Tips Penggunaan QRIS</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Beberapa hal yang perlu diperhatikan sebelum mengunggah.</p>
                            </div>
                        </div>

                        <ul className="space-y-3.5">
                            {TIPS.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300">
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-400" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CARD PRATINJAU DILIHAT CUSTOMER */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#111827] transition-colors">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Yang Dilihat Customer</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Gambar ini muncul di halaman pembayaran, sebagai satu-satunya opsi QRIS untuk semua transaksi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1f293d]/50 px-3.5 py-3 text-xs text-gray-600 dark:text-gray-300 transition-colors">
                            <ShieldAlert size={15} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                            Karena berlaku untuk semua transaksi, pastikan QRIS ini benar-benar aktif dan terverifikasi sebelum disimpan — kesalahan di sini berdampak ke seluruh pembayaran QRIS platform.
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}