import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft, Camera, X, Trash2, AlertTriangle, Info,
    FileImage, ShieldCheck, Clock, AlertCircle
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

function getFileUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/storage/')) {
        return path;
    }
    return `/storage/${path}`;
}

export default function ClaimCreate({ order, kondisiAwal }) {
    const { errors } = usePage().props;
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [alasan, setAlasan] = useState('');
    const [jumlahKlaim, setJumlahKlaim] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleFileChange(e) {
        const newFiles = Array.from(e.target.files);
        const remainingSlots = 5 - files.length;
        const toAdd = newFiles.slice(0, remainingSlots);
        
        toAdd.forEach(file => {
            if (file.type.startsWith('image/') && file.size <= 4 * 1024 * 1024) {
                setFiles(prev => [...prev, file]);
                setPreviews(prev => [...prev, URL.createObjectURL(file)]);
            }
        });
    }

    function removeFile(index) {
        URL.revokeObjectURL(previews[index]);
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (files.length === 0) {
            alert('Minimal 1 foto bukti wajib diunggah.');
            return;
        }
        if (!alasan.trim()) {
            alert('Alasan klaim wajib diisi.');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        files.forEach(file => formData.append('foto[]', file));
        formData.append('alasan', alasan);
        if (jumlahKlaim) {
            formData.append('jumlah_klaim', jumlahKlaim);
        }

        router.post(
            `/app/orders/${order.id}/klaim`,
            formData,
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
            }
        );
    }

    const maxClaim = order.total_price ? formatRupiah(order.total_price) : '-';

    return (
        <CustomerLayout>
            <Head title={`Ajukan Klaim/Refund - ${order.order_code} - Titipsini.com`} />

            <div className="mx-auto max-w-2xl px-4 py-6">
                <div className="mb-5 flex items-center gap-3">
                    <Link
                        href={`/app/orders/${order.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 transition"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Ajukan Klaim / Refund</h1>
                </div>

                {/* Order Info */}
                <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{order.item_name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Order: {order.order_code}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-[#15803d] dark:text-[#4ade80]">{formatRupiah(order.total_price)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Pesanan</p>
                        </div>
                    </div>
                </div>

               
                {kondisiAwal && (
                    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                            <Info size={18} className="shrink-0" />
                            <p className="text-sm font-semibold">Dokumentasi Kondisi Awal (saat Mitra terima barang)</p>
                        </div>
                        <p className="mt-1 text-xs text-blue-700/90 dark:text-blue-300/80">
                            Dibuat pada {kondisiAwal.dokumentasi_at} oleh Mitra
                        </p>
                        {kondisiAwal.catatan && (
                            <p className="mt-2 text-xs text-blue-700/90 dark:text-blue-300/80">
                                Catatan Mitra: {kondisiAwal.catatan}
                            </p>
                        )}
                        {kondisiAwal.foto_urls && kondisiAwal.foto_urls.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {kondisiAwal.foto_urls.slice(0, 3).map((url, i) => (
                                    <a key={i} href={getFileUrl(url)} target="_blank" rel="noreferrer" className="h-16 w-16 rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800">
                                        <img src={getFileUrl(url)} alt={`Kondisi awal ${i + 1}`} className="h-full w-full object-cover" />
                                    </a>
                                ))}
                                {kondisiAwal.foto_urls.length > 3 && (
                                    <span className="flex h-16 w-16 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                        +{kondisiAwal.foto_urls.length - 3} foto lagi
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Claim Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                            <AlertTriangle size={18} className="shrink-0" />
                            <p className="text-sm font-semibold">Panduan Pengajuan Klaim</p>
                        </div>
                        <ul className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                            <li>Klaim hanya bisa diajukan untuk pesanan yang sudah <strong>dititip</strong> atau <strong>selesai</strong>.</li>
                            <li>Upload bukti foto kondisi barang saat ini (rusak, hilang, tidak sesuai, dll).</li>
                            <li>Isi alasan klaim dengan jelas dan detail.</li>
                            <li>Jumlah klaim opsional - admin akan menentukan persentase refund berdasarkan bukti.</li>
                            <li>Setelah diajukan, Admin akan memeriksa dan meminta klarifikasi ke Mitra.</li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                            Alasan Klaim <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={alasan}
                            onChange={(e) => setAlasan(e.target.value)}
                            rows={4}
                            required
                            placeholder="Jelaskan alasan klaim Anda dengan detail (contoh: barang rusak saat diterima, barang tidak sesuai deskripsi, barang hilang, dll.)"
                            className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
                        />
                        {errors.alasan && (
                            <p className="mt-1 text-xs text-red-500">{errors.alasan}</p>
                        )}
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                            Foto Bukti <span className="text-red-500">*</span> (Minimal 1, Maksimal 5)
                        </label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img src={preview} alt={`Bukti ${index + 1}`} className="h-24 w-24 object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {files.length < 5 && (
                                <label className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#15803d] hover:bg-green-50 dark:border-gray-700 dark:hover:border-green-600 dark:hover:bg-green-950/30 transition">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        multiple
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center gap-1 text-gray-400">
                                        <Camera size={24} />
                                        <span className="text-xs">Tambah Foto</span>
                                    </div>
                                </label>
                            )}
                        </div>
                        {files.length === 0 && (
                            <p className="mt-1 text-xs text-red-500">Minimal 1 foto bukti wajib diunggah</p>
                        )}
                        {errors.foto && (
                            <p className="mt-1 text-xs text-red-500">{errors.foto}</p>
                        )}
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                            Jumlah Klaim (Opsional)
                        </label>
                        <input
                            type="number"
                            value={jumlahKlaim}
                            onChange={(e) => setJumlahKlaim(e.target.value)}
                            min="0"
                            max={order.total_price}
                            step="1000"
                            placeholder="Contoh: 50000"
                            className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#15803d] focus:outline-none focus:ring-1 focus:ring-[#15803d] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Kosongkan jika tidak yakin nominalnya. Admin akan menentukan berdasarkan bukti.
                            <br />Maksimal: {maxClaim}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/app/orders/${order.id}`}
                            className="flex-1 rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60 transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || files.length === 0 || !alasan.trim()}
                            className="flex-1 rounded-xl bg-[#15803d] py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 transition"
                        >
                            {isSubmitting ? 'Mengajukan...' : 'Ajukan Klaim'}
                        </button>
                    </div>
                </form>

                {/* Flow Info */}
                <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Alur Proses Klaim</p>
                    <div className="mt-3 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <ShieldCheck size={14} className="text-[#15803d]" />
                            <span>1. Klaim Diajukan (Anda di sini)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 ml-6">
                            <Clock size={14} />
                            <span>2. Menunggu Pemeriksaan Admin</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 ml-6">
                            <Clock size={14} />
                            <span>3. Menunggu Klarifikasi Mitra</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 ml-6">
                            <Clock size={14} />
                            <span>4. Disetujui / Ditolak</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 ml-6">
                            <Clock size={14} />
                            <span>5. Diproses Finance (jika disetujui)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 ml-6">
                            <Clock size={14} />
                            <span>6. Refund Berhasil</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 ml-6">
                            <AlertCircle size={14} className="text-red-500" />
                            <span>Jika Mitra menolak → Sengketa → Super Admin putuskan</span>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}