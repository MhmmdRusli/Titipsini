import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Building2, Copy, Check, ChevronDown, Upload, X, QrCode } from 'lucide-react';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        value ?? 0
    );
}

export default function Instruksi({ topup }) {
    const [copied, setCopied] = useState(false);
    const [openAccordion, setOpenAccordion] = useState('mbanking');
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        bukti_transfer: null,
    });

    function copyVa() {
        navigator.clipboard.writeText(topup.va_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('bukti_transfer', file);
        setPreview(URL.createObjectURL(file));
    }

    function removeFile() {
        setData('bukti_transfer', null);
        setPreview(null);
    }

    function handleSelesai(e) {
        e.preventDefault();
        post(`/app/saldo/topup/${topup.id}/konfirmasi`, { forceFormData: true });
    }

    return (
        <CustomerLayout title="Instruksi Pembayaran" backHref="/app/dashboard">
            <Head title="Instruksi Pembayaran" />

            <div className="px-4 py-4 pb-32">
                {/* Info channel pembayaran */}
                {topup.metode_pembayaran === 'transfer_bank' ? (
                    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            <Building2 size={16} className="text-[#15803d] dark:text-[#4ade80]" />
                            Bank {topup.channel}
                        </div>
                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">No. Rekening Virtual Account</p>
                        <div className="mt-1 flex items-center justify-between">
                            <p className="text-xl font-bold tracking-wide text-gray-900 dark:text-gray-100">{topup.va_number}</p>
                            <button
                                type="button"
                                onClick={copyVa}
                                className="flex items-center gap-1 rounded-lg bg-green-50 dark:bg-green-950/40 px-2.5 py-1.5 text-xs font-medium text-[#15803d] dark:text-[#4ade80] hover:bg-green-100 dark:hover:bg-green-900/60 transition"
                            >
                                {copied ? <Check size={13} /> : <Copy size={13} />}
                                {copied ? 'Tersalin' : 'Salin'}
                            </button>
                        </div>
                        <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400">
                            Proses verifikasi kurang dari 10 menit setelah pembayaran berhasil.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            <Building2 size={16} className="text-[#15803d] dark:text-[#4ade80]" />
                            {topup.channel}
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Buka aplikasi {topup.channel}, lalu selesaikan pembayaran sebesar{' '}
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{formatRupiah(topup.total)}</span>.
                        </p>
                    </div>
                )}

                {/* Accordion cara bayar - khusus transfer bank */}
                {topup.metode_pembayaran === 'transfer_bank' && (
                    <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-700/60 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === 'mbanking' ? '' : 'mbanking')}
                            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                            m-Banking
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 dark:text-gray-500 transition-transform ${
                                    openAccordion === 'mbanking' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {openAccordion === 'mbanking' && (
                            <ol className="space-y-1.5 px-4 pb-4 text-xs text-gray-500 dark:text-gray-400">
                                <li>1. Buka aplikasi {topup.channel}mo dan Login.</li>
                                <li>2. Pilih menu BRIVA.</li>
                                <li>3. Pilih Pembayaran Baru dan masukkan nomor Virtual Account.</li>
                                <li>4. Konfirmasi detail transaksi dan masukkan PIN {topup.channel}mo Anda.</li>
                            </ol>
                        )}

                        <button
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === 'ibanking' ? '' : 'ibanking')}
                            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                            i-Banking
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 dark:text-gray-500 transition-transform ${
                                    openAccordion === 'ibanking' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {openAccordion === 'ibanking' && (
                            <p className="px-4 pb-4 text-xs text-gray-500 dark:text-gray-400">
                                Login ke i-Banking {topup.channel}, pilih menu Pembayaran &gt; Virtual Account, masukkan
                                nomor VA di atas, lalu konfirmasi.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === 'atm' ? '' : 'atm')}
                            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                            ATM {topup.channel}
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 dark:text-gray-500 transition-transform ${
                                    openAccordion === 'atm' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {openAccordion === 'atm' && (
                            <p className="px-4 pb-4 text-xs text-gray-500 dark:text-gray-400">
                                Masukkan kartu, pilih Transfer &gt; Virtual Account, masukkan nomor VA di atas, lalu
                                konfirmasi nominal.
                            </p>
                        )}
                    </div>
                )}

                {/* Rincian biaya */}
                <div className="mt-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Subtotal Top Up</span>
                        <span className="text-gray-800 dark:text-gray-200">{formatRupiah(topup.nominal)}</span>
                    </div>
                    <div className="mt-1.5 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Biaya Admin</span>
                        <span className="text-gray-800 dark:text-gray-200">{formatRupiah(topup.biaya_admin)}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-gray-100 dark:border-gray-700 pt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        <span>Total Bayar</span>
                        <span>{formatRupiah(topup.total)}</span>
                    </div>
                </div>

                {/* Bagian QRIS Pembayaran */}
                <div className="mt-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm text-center">
                    <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        <QrCode size={18} className="text-[#15803d] dark:text-[#4ade80]" />
                        <span>Scan QRIS untuk Membayar</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Scan QR di bawah ini menggunakan aplikasi e-wallet atau m-banking apa saja.
                    </p>
                    
                    <div className="inline-block p-3 bg-white rounded-xl border border-gray-200 shadow-inner">
                        <img 
                            src="/images/qris-admin.png" 
                            alt="QRIS Pembayaran" 
                            className="w-48 h-48 mx-auto object-contain rounded-md" 
                        />
                    </div>
                    <p className="mt-2 text-[11px] text-gray-400">
                        Nominal pembayaran sudah otomatis / sesuaikan dengan total tagihan.
                    </p>
                </div>

                {/* Upload bukti transfer */}
                <div className="mt-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Unggah Bukti Pembayaran</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Setelah transfer atau scan QRIS selesai, unggah screenshot bukti pembayaran. Tim kami akan
                        memverifikasi dalam waktu kurang dari 10 menit.
                    </p>

                    {preview ? (
                        <div className="relative mt-3">
                            <img src={preview} alt="Bukti transfer" className="w-full rounded-lg object-cover" />
                            <button
                                type="button"
                                onClick={removeFile}
                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 py-6 text-gray-400 dark:text-gray-500 hover:border-[#15803d] dark:hover:border-[#22c55e] transition">
                            <Upload size={20} />
                            <span className="text-xs">Tap untuk unggah gambar</span>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                    )}
                    {errors.bukti_transfer && (
                        <p className="mt-1.5 text-xs text-red-500">{errors.bukti_transfer}</p>
                    )}
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-16 px-4 pb-2 z-10 max-w-md mx-auto">
                <button
                    type="button"
                    disabled={processing || !data.bukti_transfer}
                    onClick={handleSelesai}
                    className="w-full rounded-xl bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600 py-3.5 text-sm font-bold text-white shadow-lg transition disabled:opacity-40"
                >
                    {processing ? 'Mengirim...' : 'Saya Sudah Bayar'}
                </button>
            </div>
        </CustomerLayout>
    );
}