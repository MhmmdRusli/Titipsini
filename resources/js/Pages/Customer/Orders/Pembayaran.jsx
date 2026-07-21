import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';

export default function BuktiPembayaran({ order }) {
    const { data, setData, post, processing, errors } = useForm({
        payment_receipt: null,
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('payment_receipt', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.payment_receipt) return;

        post(`/app/orders/${order.id}/upload-bukti`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <CustomerLayout>
            <Head title="Upload Bukti Pembayaran" />

            <div className="mx-auto max-w-lg px-4 py-8">
                <div className="mb-6 flex items-center gap-3">
                    <Link href={`/app/orders/${order?.id}/pembayaran`} className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900">Upload Bukti Transfer</h1>
                </div>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
                    <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                            <span>Kode Pesanan:</span>
                            <span className="font-semibold text-gray-800">{order?.order_code || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Tagihan:</span>
                            <span className="font-bold text-brand-teal-700">
                                Rp {Number(order?.total_price || 0).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                            Foto / Screenshot Bukti Transfer
                        </label>
                        
                        <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-brand-teal-700 transition bg-gray-50/50 cursor-pointer">
                            {previewUrl ? (
                                <div className="flex flex-col items-center gap-2">
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview Bukti" 
                                        className="max-h-48 rounded-lg border object-contain"
                                    />
                                    <span className="text-xs text-brand-teal-700 font-medium flex items-center gap-1 mt-2">
                                        <CheckCircle2 size={14} /> File Siap Diunggah
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-xs font-medium text-gray-600">Klik di sini untuk memilih foto</span>
                                    <span className="text-[10px] text-gray-400 mt-1">Format: JPG, PNG (Maks 2MB)</span>
                                </>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        {errors.payment_receipt && (
                            <p className="mt-1 text-xs text-red-500">{errors.payment_receipt}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !data.payment_receipt}
                        className="w-full rounded-xl bg-brand-teal-700 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                        {processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}