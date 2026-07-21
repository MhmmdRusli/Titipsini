import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Building2, Wallet, X } from 'lucide-react';

const BANK_CHANNELS = ['BRI', 'BCA', 'Mandiri', 'BNI'];
const EWALLET_CHANNELS = ['OVO', 'GoPay', 'DANA', 'ShopeePay'];

const PRESET_NOMINAL = [100000, 200000, 300000, 400000, 500000, 700000];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        value ?? 0
    );
}

export default function PilihMetode() {
    const [numpadOpen, setNumpadOpen] = useState(false);
    const [numpadValue, setNumpadValue] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        metode_pembayaran: '',
        channel: '',
        nominal: 0,
    });

    function selectMetode(metode) {
        setData((prev) => ({ ...prev, metode_pembayaran: metode, channel: '' }));
    }

    function openNumpad() {
        setNumpadValue(data.nominal ? String(data.nominal) : '');
        setNumpadOpen(true);
    }

    function pressDigit(digit) {
        if (digit === 'back') {
            setNumpadValue((v) => v.slice(0, -1));
        } else if (numpadValue.length < 9) {
            setNumpadValue((v) => v + digit);
        }
    }

    function confirmNumpad() {
        setData('nominal', parseInt(numpadValue || '0', 10));
        setNumpadOpen(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        post('/app/saldo/topup');
    }

    const channels = data.metode_pembayaran === 'transfer_bank' ? BANK_CHANNELS : EWALLET_CHANNELS;

    return (
        <CustomerLayout title="Top Up Saldo" backHref="/app/dashboard">
            <Head title="Top Up Saldo" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-4">
                <div>
                    <p className="mb-2 text-sm font-semibold text-gray-900">Pilih Metode Pembayaran</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => selectMetode('transfer_bank')}
                            className={`flex flex-col items-center gap-2 rounded-xl border py-4 text-sm font-medium ${
                                data.metode_pembayaran === 'transfer_bank'
                                    ? 'border-green-600 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-600'
                            }`}
                        >
                            <Building2 size={20} />
                            Transfer Bank
                        </button>
                        <button
                            type="button"
                            onClick={() => selectMetode('e_wallet')}
                            className={`flex flex-col items-center gap-2 rounded-xl border py-4 text-sm font-medium ${
                                data.metode_pembayaran === 'e_wallet'
                                    ? 'border-green-600 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-600'
                            }`}
                        >
                            <Wallet size={20} />
                            E-Wallet
                        </button>
                    </div>
                    {errors.metode_pembayaran && (
                        <p className="mt-1 text-xs text-red-500">{errors.metode_pembayaran}</p>
                    )}
                </div>

                {data.metode_pembayaran && (
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-600">
                            Pilih {data.metode_pembayaran === 'transfer_bank' ? 'Bank' : 'E-Wallet'}
                        </label>
                        <select
                            value={data.channel}
                            onChange={(e) => setData('channel', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="">Pilih salah satu</option>
                            {channels.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        {errors.channel && <p className="mt-1 text-xs text-red-500">{errors.channel}</p>}
                    </div>
                )}

                <div>
                    <p className="mb-2 text-sm font-semibold text-gray-900">Nominal Top Up</p>
                    <button
                        type="button"
                        onClick={openNumpad}
                        className="w-full rounded-xl border border-gray-200 bg-white py-4 text-center text-2xl font-bold text-gray-900"
                    >
                        {formatRupiah(data.nominal)}
                    </button>
                    {errors.nominal && <p className="mt-1 text-xs text-red-500">{errors.nominal}</p>}

                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {PRESET_NOMINAL.map((n) => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => setData('nominal', n)}
                                className={`rounded-lg border py-2.5 text-sm font-medium ${
                                    data.nominal === n
                                        ? 'border-green-600 bg-green-50 text-green-700'
                                        : 'border-gray-200 text-gray-600'
                                }`}
                            >
                                {formatRupiah(n)}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing || !data.metode_pembayaran || !data.channel || !data.nominal}
                    className="mt-2 w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white disabled:opacity-40"
                >
                    Lanjutkan
                </button>
            </form>

            {/* Numpad modal - input nominal manual */}
            {numpadOpen && (
                <div className="absolute inset-0 z-20 flex items-end bg-black/40">
                    <div className="w-full rounded-t-2xl bg-white p-5 pb-8">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900">Nominal Top Up</h2>
                            <button onClick={() => setNumpadOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-500">Masukkan Jumlah Top Up</p>
                        <p className="mt-1 text-center text-3xl font-bold text-gray-900">
                            {formatRupiah(parseInt(numpadValue || '0', 10))}
                        </p>
                        <p className="mt-1 text-center text-[11px] text-green-600">Min. Rp 10.000</p>

                        <div className="mt-5 grid grid-cols-3 gap-2">
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'].map((key, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={key === ''}
                                    onClick={() => key && pressDigit(key)}
                                    className="rounded-lg py-3.5 text-lg font-semibold text-gray-800 hover:bg-gray-100 disabled:opacity-0"
                                >
                                    {key === 'back' ? '⌫' : key}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={confirmNumpad}
                            disabled={parseInt(numpadValue || '0', 10) < 10000}
                            className="mt-4 w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white disabled:opacity-40"
                        >
                            Lanjutkan
                        </button>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}