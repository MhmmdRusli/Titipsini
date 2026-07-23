import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { AlertTriangle, Upload, CheckCircle2 } from 'lucide-react';

export default function Lapor({ order }) {
    const { data, setData, post, processing, errors } = useForm({
        description: '',
        evidence: null,
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('evidence', file);
        setPreviewUrl(URL.createObjectURL(file));
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(`/app/orders/${order.id}/lapor`, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <CustomerLayout backHref={`/app/orders/${order.id}`} title="Laporkan Vendor">
            <Head title="Laporkan Vendor" />

            <div className="px-4 py-4">
                <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                        Laporan ini akan ditinjau oleh tim kami. Pastikan alasan yang kamu sampaikan
                        jelas dan sesuai fakta.
                    </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 text-sm">
                        <div className="flex justify-between py-1">
                            <span className="text-gray-500 dark:text-gray-400">Kode Pesanan</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {order.order_code}
                            </span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-500 dark:text-gray-400">Vendor</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {order.vendor_nama ?? '-'}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300">
                                Alasan Laporan
                            </label>
                            <textarea
                                rows={5}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan masalah yang kamu alami dengan vendor ini..."
                                className="w-full rounded-xl border-none bg-[#f4f7fc] px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:bg-gray-700 dark:text-gray-100"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300">
                                Bukti Foto (opsional)
                            </label>
                            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 dark:border-gray-600 dark:bg-gray-900/40">
                                {previewUrl ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <img
                                            src={previewUrl}
                                            alt="Preview bukti"
                                            className="max-h-40 rounded-lg border object-contain dark:border-gray-600"
                                        />
                                        <span className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                                            <CheckCircle2 size={14} /> Foto siap diunggah
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="mb-2 h-7 w-7 text-gray-400" />
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                            Klik untuk pilih foto
                                        </span>
                                        <span className="mt-1 text-[10px] text-gray-400">
                                            Format: JPG, PNG (Maks 4MB)
                                        </span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                />
                            </div>
                            {errors.evidence && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.evidence}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !data.description.trim()}
                            className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Laporan'}
                        </button>

                        <Link
                            href={`/app/orders/${order.id}`}
                            className="block w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Batal
                        </Link>
                    </form>
                </div>
            </div>
        </CustomerLayout>
    );
}