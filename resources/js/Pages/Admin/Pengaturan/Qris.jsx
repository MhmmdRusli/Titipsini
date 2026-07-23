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
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center"
                        >
                            {preview ? (
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Pratinjau QRIS"
                                        className="mx-auto h-64 w-64 rounded-lg border border-gray-200 object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -right-2 -top-2 rounded-full bg-white p-1.5 text-red-600 shadow-md hover:bg-red-50 border border-gray-100 transition"
                                        title="Hapus QRIS"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={32} className="mb-2 text-gray-400" />
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

                {/* Kolom kanan: tips + catatan keamanan, biar sepadan sama tinggi card kiri */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 rounded-xl border border-amber-100 bg-amber-50/60 p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                <Lightbulb size={20} />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">Tips Penggunaan QRIS</h2>
                                <p className="text-sm text-gray-500">Beberapa hal yang perlu diperhatikan sebelum mengunggah.</p>
                            </div>
                        </div>

                        <ul className="space-y-3.5">
                            {TIPS.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-amber-500" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">Yang Dilihat Customer</h2>
                                <p className="text-sm text-gray-500">
                                    Gambar ini muncul di halaman pembayaran, sebagai satu-satunya opsi QRIS untuk semua transaksi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 rounded-lg bg-gray-50 px-3.5 py-3 text-xs text-gray-600">
                            <ShieldAlert size={15} className="mt-0.5 shrink-0 text-gray-400" />
                            Karena berlaku untuk semua transaksi, pastikan QRIS ini benar-benar aktif dan terverifikasi sebelum disimpan — kesalahan di sini berdampak ke seluruh pembayaran QRIS platform.
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}