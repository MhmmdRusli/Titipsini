import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, Landmark, Wallet, HandCoins } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const BANKS = [
    { value: 'bca', label: 'Bank BCA' },
    { value: 'bni', label: 'Bank BNI' },
    { value: 'bri', label: 'Bank BRI' },
    { value: 'mandiri', label: 'Bank Mandiri' },
];

const EWALLETS = [
    { value: 'ovo', label: 'OVO' },
    { value: 'dana', label: 'Dana' },
    { value: 'linkaja', label: 'LinkAja' },
    { value: 'shopeepay', label: 'Shopee Pay' },
];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);
}

export default function MetodePembayaranLayanan({ serviceId, total = 0 }) {
    const [bankOpen, setBankOpen] = useState(true);
    const [selected, setSelected] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function confirm() {
        if (!selected) return;
        setSubmitting(true);
        router.post(
            `/app/services/${serviceId}/konfirmasi`,
            { payment_method: selected },
            { onFinish: () => setSubmitting(false) }
        );
    }

    return (
        <CustomerLayout title="Pilih Metode Pembayaran" backHref={`/app/services/${serviceId}`}>
            <Head title="Metode Pembayaran" />

            <div className="px-4 py-3">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-xs text-gray-500">Total Pembayaran</p>
                    <p className="mt-0.5 text-xl font-bold text-gray-900">{formatRupiah(total)}</p>
                </div>

                <div className="mt-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <button
                        type="button"
                        onClick={() => setBankOpen((v) => !v)}
                        className="flex w-full items-center justify-between px-4 py-3"
                    >
                        <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <Landmark size={16} className="text-green-600" />
                            Transfer Bank
                        </span>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${bankOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {bankOpen && (
                        <div className="border-t border-gray-100">
                            {BANKS.map((bank) => (
                                <PaymentRow key={bank.value} label={bank.label} active={selected === bank.value} onClick={() => setSelected(bank.value)} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        <Wallet size={14} />
                        Dompet Digital
                    </div>
                    <div className="border-t border-gray-100">
                        {EWALLETS.map((wallet) => (
                            <PaymentRow key={wallet.value} label={wallet.label} active={selected === wallet.value} onClick={() => setSelected(wallet.value)} />
                        ))}
                    </div>
                </div>

                <div className="mt-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <PaymentRow icon={HandCoins} label="Bayar di tempat" active={selected === 'cod'} onClick={() => setSelected('cod')} />
                </div>

                <p className="mt-4 text-center text-[11px] text-gray-400">
                    Metode pembayaran tersedia dapat berubah sewaktu-waktu tergantung syarat dan ketentuan yang berlaku.
                </p>

                <button
                    type="button"
                    disabled={!selected || submitting}
                    onClick={confirm}
                    className="mt-5 w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition disabled:opacity-40"
                >
                    {submitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
                </button>
            </div>
        </CustomerLayout>
    );
}

function PaymentRow({ label, active, onClick, icon: Icon }) {
    return (
        <button type="button" onClick={onClick} className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3 last:border-b-0">
            {Icon ? <Icon size={16} className="text-green-600" /> : <span className="h-2 w-2" />}
            <span className="flex-1 text-left text-sm font-medium text-gray-800">{label}</span>
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-green-600' : 'border-gray-300'}`}>
                {active && <span className="h-2.5 w-2.5 rounded-full bg-green-600" />}
            </span>
        </button>
    );
}