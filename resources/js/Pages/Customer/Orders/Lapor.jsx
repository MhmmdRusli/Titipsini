import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { AlertTriangle, Upload, CheckCircle2, MessageSquareWarning, PackageX, X, Check } from 'lucide-react';

const CATEGORIES = [
    {
        key: 'complain',
        label: 'Komplain Pelayanan',
        desc: 'Layanan tidak sesuai, mitra tidak responsif, dll.',
        Icon: MessageSquareWarning,
    },
    {
        key: 'kerugian',
        label: 'Ajukan Pengembalian Dana',
        desc: 'Ajukan permintaan pengembalian dana untuk barang rusak/hilang.',
        Icon: PackageX,
    },
];

export default function Lapor({ order }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category: 'complain',
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

    function clearFile() {
        setData('evidence', null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(`/app/orders/${order.id}/lapor`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            },
        });
    }

    return (
        <CustomerLayout backHref="/app/orders" title="Lapor Pesanan">
            <Head title="Lapor Pesanan" />

            <div className="px-4 py-4">
                <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                        Laporan akan ditinjau oleh tim admin. Pilih kategori yang sesuai
                        dan sertakan bukti foto agar laporan lebih cepat diproses.
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
                        {order.item_name && (
                            <div className="flex justify-between py-1">
                                <span className="text-gray-500 dark:text-gray-400">Barang</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {order.item_name}
                                </span>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300">
                                Kategori Laporan <span className="text-red-500">*</span>
                            </label>
                            <div className="grid gap-2">
                                {CATEGORIES.map(({ key, label, desc, Icon }) => {
                                    const active = data.category === key;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setData('category', key)}
                                            className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                                                active
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                                                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/40 hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                        >
                                            <Icon
                                                size={20}
                                                className={`mt-0.5 shrink-0 ${
                                                    active
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-gray-400'
                                                }`}
                                            />
                                            <div className="flex-1">
                                                <p
                                                    className={`text-sm font-semibold ${
                                                        active
                                                            ? 'text-green-700 dark:text-green-300'
                                                            : 'text-gray-800 dark:text-gray-100'
                                                    }`}
                                                >
                                                    {label}
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                                                    {desc}
                                                </p>
                                            </div>
                                            <div
                                                className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
                                                    active
                                                        ? 'border-green-600 bg-green-600 text-white'
                                                        : 'border-gray-300 dark:border-gray-600 bg-transparent'
                                                }`}
                                            >
                                                {active && <Check size={10} strokeWidth={3} />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.category && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.category}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300">
                                Kronologi / Deskripsi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={5}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan masalah yang kamu alami..."
                                className="w-full rounded-xl border-none bg-[#f4f7fc] px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:bg-gray-700 dark:text-gray-100"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-gray-300">
                                Bukti Foto <span className="text-red-500">*</span>
                            </label>
                            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 dark:border-gray-600 dark:bg-gray-900/40">
                                {previewUrl ? (
                                    <div className="flex w-full flex-col items-center gap-2">
                                        <img
                                            src={previewUrl}
                                            alt="Preview bukti"
                                            className="max-h-44 rounded-lg border object-contain dark:border-gray-600"
                                        />
                                        <span className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                                            <CheckCircle2 size={14} /> Foto siap diunggah
                                        </span>
                                        <button
                                            type="button"
                                            onClick={clearFile}
                                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-gray-500 shadow-sm hover:bg-red-50 hover:text-red-600 dark:bg-gray-800/80"
                                            title="Hapus foto"
                                        >
                                            <X size={14} />
                                        </button>
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
                            disabled={processing || !data.description.trim() || !data.evidence}
                            className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Laporan'}
                        </button>

                        <Link
                            href="/app/orders"
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