import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Building2, Copy, Check, ChevronDown } from 'lucide-react';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        value ?? 0
    );
}

export default function Instruksi({ topup }) {
    const [copied, setCopied] = useState(false);
    const [openAccordion, setOpenAccordion] = useState('mbanking');
    const [confirming, setConfirming] = useState(false);

    function copyVa() {
        navigator.clipboard.writeText(topup.va_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleSelesai() {
        setConfirming(true);
        router.post(
            `/app/saldo/topup/${topup.id}/konfirmasi`,
            {},
            { onFinish: () => setConfirming(false) }
        );
    }

    return (
        <CustomerLayout title="Instruksi Pembayaran" backHref="/app/dashboard">
            <Head title="Instruksi Pembayaran" />

            <div className="px-4 py-4">
                {topup.metode_pembayaran === 'transfer_bank' ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <Building2 size={16} className="text-green-600" />
                            Bank {topup.channel}
                        </div>
                        <p className="mt-3 text-xs text-gray-500">No. Rekening Virtual Account</p>
                        <div className="mt-1 flex items-center justify-between">
                            <p className="text-xl font-bold tracking-wide text-gray-900">{topup.va_number}</p>
                            <button
                                onClick={copyVa}
                                className="flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700"
                            >
                                {copied ? <Check size={13} /> : <Copy size={13} />}
                                {copied ? 'Tersalin' : 'Salin'}
                            </button>
                        </div>
                        <p className="mt-2 text-[11px] text-amber-600">
                            Proses verifikasi kurang dari 10 menit setelah pembayaran berhasil.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <Building2 size={16} className="text-green-600" />
                            {topup.channel}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Buka aplikasi {topup.channel}, lalu selesaikan pembayaran sebesar{' '}
                            <span className="font-semibold text-gray-800">{formatRupiah(topup.total)}</span>.
                        </p>
                    </div>
                )}

                {topup.metode_pembayaran === 'transfer_bank' && (
                    <div className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white shadow-sm">
                        <button
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === 'mbanking' ? '' : 'mbanking')}
                            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-800"
                        >
                            m-Banking
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform ${
                                    openAccordion === 'mbanking' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {openAccordion === 'mbanking' && (
                            <ol className="space-y-1.5 px-4 pb-4 text-xs text-gray-500">
                                <li>1. Buka aplikasi {topup.channel}mo dan Login.</li>
                                <li>2. Pilih menu BRIVA.</li>
                                <li>3. Pilih Pembayaran Baru dan masukkan nomor Virtual Account.</li>
                                <li>4. Konfirmasi detail transaksi dan masukkan PIN {topup.channel}mo Anda.</li>
                            </ol>
                        )}

                        <button
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === 'ibanking' ? '' : 'ibanking')}
                            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-800"
                        >
                            i-Banking
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform ${
                                    openAccordion === 'ibanking' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {openAccordion === 'ibanking' && (
                            <p className="px-4 pb-4 text-xs text-gray-500">
                                Login ke i-Banking {topup.channel}, pilih menu Pembayaran &gt; Virtual Account, masukkan
                                nomor VA di atas, lalu konfirmasi.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === 'atm' ? '' : 'atm')}
                            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-800"
                        >
                            ATM {topup.channel}
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform ${
                                    openAccordion === 'atm' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {openAccordion === 'atm' && (
                            <p className="px-4 pb-4 text-xs text-gray-500">
                                Masukkan kartu, pilih Transfer &gt; Virtual Account, masukkan nomor VA di atas, lalu
                                konfirmasi nominal.
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Subtotal Top Up</span>
                        <span className="text-gray-800">{formatRupiah(topup.nominal)}</span>
                    </div>
                    <div className="mt-1.5 flex justify-between text-xs text-gray-500">
                        <span>Biaya Admin</span>
                        <span className="text-gray-800">{formatRupiah(topup.biaya_admin)}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 text-sm font-semibold text-gray-900">
                        <span>Total Bayar</span>
                        <span>{formatRupiah(topup.total)}</span>
                    </div>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-16 px-4 pb-2">
                <button
                    type="button"
                    disabled={confirming}
                    onClick={handleSelesai}
                    className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-60"
                >
                    {confirming ? 'Memproses...' : 'Selesai'}
                </button>
            </div>
        </CustomerLayout>
    );
}