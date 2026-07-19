import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Delete, ShieldCheck } from 'lucide-react';

export default function BuatPin() {
    const [step, setStep] = useState('input'); // 'input' | 'confirm'
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [mismatch, setMismatch] = useState(false);

    const [processing, setProcessing] = useState(false);

    const activePin = step === 'input' ? pin : confirmPin;
    const setActivePin = step === 'input' ? setPin : setConfirmPin;

    function handleKeyPress(digit) {
        if (activePin.length >= 6) return;
        setMismatch(false);
        const next = activePin + digit;
        setActivePin(next);

        if (next.length === 6) {
            if (step === 'input') {
                setTimeout(() => setStep('confirm'), 200);
            } else {
                if (next === pin) {
                    submitPin(next);
                } else {
                    setMismatch(true);
                    setTimeout(() => {
                        setConfirmPin('');
                        setMismatch(false);
                    }, 800);
                }
            }
        }
    }

    function handleBackspace() {
        setActivePin(activePin.slice(0, -1));
    }

    function submitPin(finalPin) {
    setProcessing(true);
    router.post(
        route('customer.pin.store'),
        { pin: finalPin },
        {
            preserveScroll: true,
            onError: () => {
                setProcessing(false);
                setStep('input');
                setPin('');
                setConfirmPin('');
            },
        }
    );
}

    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center bg-white px-8 py-12">
            <Head title="Buat PIN Keamanan" />

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal-50">
                <ShieldCheck size={28} className="text-brand-teal-600" />
            </div>

            <h1 className="mt-6 text-lg font-semibold text-gray-900">
                {step === 'input' ? 'Buat PIN Keamanan' : 'Konfirmasi PIN Kamu'}
            </h1>
            <p className="mt-1 text-center text-sm text-gray-500">
                {step === 'input'
                    ? 'PIN ini akan digunakan untuk mengonfirmasi transaksi kamu'
                    : 'Masukkan sekali lagi PIN yang sama'}
            </p>

            <div className="mt-8 flex gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <span
                        key={i}
                        className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                            mismatch
                                ? 'border-red-400 bg-red-400'
                                : i < activePin.length
                                ? 'border-brand-teal-600 bg-brand-teal-600'
                                : 'border-gray-300 bg-transparent'
                        }`}
                    />
                ))}
            </div>

            {mismatch && <p className="mt-3 text-xs text-red-500">PIN tidak cocok, coba lagi</p>}

            <div className="mt-12 grid w-full max-w-xs grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                        key={n}
                        type="button"
                        disabled={processing}
                        onClick={() => handleKeyPress(String(n))}
                        className="flex h-16 items-center justify-center rounded-full text-xl font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200"
                    >
                        {n}
                    </button>
                ))}
                <div />
                <button
                    type="button"
                    disabled={processing}
                    onClick={() => handleKeyPress('0')}
                    className="flex h-16 items-center justify-center rounded-full text-xl font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200"
                >
                    0
                </button>
                <button
                    type="button"
                    disabled={processing}
                    onClick={handleBackspace}
                    className="flex h-16 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
                >
                    <Delete size={20} />
                </button>
            </div>
        </div>
    );
}