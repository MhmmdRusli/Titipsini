import { Head, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Delete, ShieldCheck } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const BRAND_GREEN = 'text-[#15803d] dark:text-[#4ade80]';

// Konfigurasi tiap langkah wizard: field, judul, dan subjudul.
const STEPS = {
    current: {
        field: 'current_pin',
        title: 'Masukkan PIN Anda saat ini',
        subtitle: 'PIN digunakan untuk bertransaksi di akun Anda',
    },
    new: {
        field: 'pin',
        title: 'Buat PIN baru',
        subtitle: 'PIN digunakan untuk bertransaksi di akun Anda',
    },
    confirm: {
        field: 'pin_confirmation',
        title: 'Konfirmasi PIN baru',
        subtitle: 'PIN digunakan untuk bertransaksi di akun Anda',
    },
};

export default function Pin() {
    const [step, setStep] = useState('current'); // current | new | confirm | success
    const [shake, setShake] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Digit yang sedang diketik disimpan di state lokal, SELALU diupdate
    // lewat functional updater (prev => ...) supaya tidak ada digit yang
    // hilang/dobel saat user mengetik cepat di keypad.
    const [digits, setDigits] = useState({
        current_pin: '',
        pin: '',
        pin_confirmation: '',
    });

    // PIN lama & PIN baru disimpan di ref begitu masing-masing step selesai,
    // supaya nilainya pasti "final" dan tidak bergantung pada timing re-render
    // saat dipakai untuk perbandingan maupun payload submit.
    const currentPinRef = useRef('');
    const newPinRef = useRef('');

    const config = STEPS[step] ?? STEPS.current;
    const value = digits[config.field] ?? '';
    const errorMessage = localError || errors[config.field];

    function resetDigitField(field) {
        setDigits((prev) => ({ ...prev, [field]: '' }));
    }

    function triggerError(message, field) {
        setLocalError(message);
        setShake(true);
        setTimeout(() => {
            setShake(false);
            resetDigitField(field);
            setLocalError(null);
        }, 900);
    }

    function handleDigit(d) {
        if (processing) return;
        if (errors[config.field]) {
            setErrors((prev) => ({ ...prev, [config.field]: undefined }));
        }
        setLocalError(null);

        setDigits((prev) => {
            const current = prev[config.field] ?? '';
            if (current.length >= 6) return prev; // sudah penuh, abaikan tap tambahan

            const next = current + d;
            const updated = { ...prev, [config.field]: next };

            if (next.length === 6) {
                setTimeout(() => advance(next), 150);
            }

            return updated;
        });
    }

    function handleBackspace() {
        if (processing) return;
        setDigits((prev) => ({ ...prev, [config.field]: (prev[config.field] ?? '').slice(0, -1) }));
    }

    function advance(finalValue) {
        if (step === 'current') {
            currentPinRef.current = finalValue;
            setStep('new');
            return;
        }
        if (step === 'new') {
            newPinRef.current = finalValue;
            setStep('confirm');
            return;
        }
        if (step === 'confirm') {
            if (finalValue !== newPinRef.current) {
                triggerError('PIN tidak sama', 'pin_confirmation');
                return;
            }
            submit(finalValue);
        }
    }

    function submit(confirmValue) {
        const payload = {
            current_pin: currentPinRef.current,
            pin: newPinRef.current,
            pin_confirmation: confirmValue,
        };

        // Pakai router.put langsung (bukan useForm().put) supaya payload yang
        // dikirim persis nilai yang sudah pasti final di atas — tidak
        // bergantung pada state `data` milik useForm yang update-nya async
        // dan sebelumnya menyebabkan current_pin terkirim kosong.
        router.put('/app/profile/keamanan/pin', payload, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                setDigits({ current_pin: '', pin: '', pin_confirmation: '' });
                currentPinRef.current = '';
                newPinRef.current = '';
                setErrors({});
                setStep('success');
            },
            onError: (backendErrors) => {
                setErrors(backendErrors);
                if (backendErrors.current_pin) {
                    setStep('current');
                    setShake(true);
                    setTimeout(() => {
                        setShake(false);
                        resetDigitField('current_pin');
                        currentPinRef.current = '';
                    }, 900);
                } else {
                    setStep('new');
                    resetDigitField('pin');
                    resetDigitField('pin_confirmation');
                    newPinRef.current = '';
                }
            },
        });
    }

    function handleBack() {
        if (step === 'new') {
            setStep('current');
            resetDigitField('current_pin');
            currentPinRef.current = '';
        } else if (step === 'confirm') {
            setStep('new');
            resetDigitField('pin');
            newPinRef.current = '';
        } else {
            window.location.href = '/app/profile/keamanan';
        }
    }

    if (step === 'success') {
        return <SuccessScreen />;
    }

    return (
        <CustomerLayout title="Ubah PIN" backHref="/app/profile/keamanan" onBack={handleBack}>
            <Head title="Ubah PIN" />

            <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col items-center px-6 pt-10 pb-6 text-center">
                    <h1
                        className={`text-base font-bold ${
                            errorMessage ? 'text-red-500' : 'text-gray-900 dark:text-gray-50'
                        }`}
                    >
                        {config.title}
                    </h1>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-[240px]">
                        {config.subtitle}
                    </p>

                    <div className={`flex gap-3 mt-8 ${shake ? 'animate-pulse' : ''}`} dir="ltr">
                        {[...Array(6)].map((_, i) => {
                            const filled = i < value.length;
                            return (
                                <span
                                    key={i}
                                    className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                                        errorMessage
                                            ? filled
                                                ? 'border-red-400 bg-red-400'
                                                : 'border-red-300 bg-transparent'
                                            : filled
                                            ? 'border-[#15803d] bg-[#15803d] dark:border-[#22c55e] dark:bg-[#22c55e]'
                                            : 'border-gray-300 dark:border-gray-700 bg-transparent'
                                    }`}
                                />
                            );
                        })}
                    </div>

                    {errorMessage && (
                        <p className="mt-4 text-xs font-medium text-red-500">{errorMessage}</p>
                    )}
                </div>

                <div className="flex-1" />

                <Keypad onDigit={handleDigit} onBackspace={handleBackspace} disabled={processing} />
            </div>
        </CustomerLayout>
    );
}

// --- Keypad numerik ala native phone dialer ---
function Keypad({ onDigit, onBackspace, disabled }) {
    const keys = [
        { d: '1', sub: '' }, { d: '2', sub: 'ABC' }, { d: '3', sub: 'DEF' },
        { d: '4', sub: 'GHI' }, { d: '5', sub: 'JKL' }, { d: '6', sub: 'MNO' },
        { d: '7', sub: 'PQRS' }, { d: '8', sub: 'TUV' }, { d: '9', sub: 'WXYZ' },
    ];

    return (
        <div className="bg-gray-900 dark:bg-black px-8 pt-6 pb-8 rounded-t-3xl">
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                {keys.map((k) => (
                    <button
                        key={k.d}
                        type="button"
                        disabled={disabled}
                        onClick={() => onDigit(k.d)}
                        className="flex flex-col items-center justify-center rounded-2xl bg-gray-800/80 hover:bg-gray-700 active:scale-95 transition py-3.5 disabled:opacity-50"
                    >
                        <span className="text-xl font-semibold text-white">{k.d}</span>
                        <span className="text-[9px] tracking-widest text-gray-400">{k.sub}</span>
                    </button>
                ))}

                <div />
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onDigit('0')}
                    className="flex items-center justify-center rounded-2xl bg-gray-800/80 hover:bg-gray-700 active:scale-95 transition py-3.5 disabled:opacity-50"
                >
                    <span className="text-xl font-semibold text-white">0</span>
                </button>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={onBackspace}
                    className="flex items-center justify-center rounded-2xl hover:bg-gray-800/60 active:scale-95 transition py-3.5 disabled:opacity-50"
                >
                    <Delete size={22} className="text-gray-300" />
                </button>
            </div>
        </div>
    );
}

// --- Layar sukses setelah PIN berhasil diubah ---
function SuccessScreen() {
    return (
        <CustomerLayout title="Ubah PIN" backHref="/app/profile/keamanan" hideHeader>
            <Head title="Berhasil" />

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-8 py-10 text-center bg-white dark:bg-gray-950">
                <div className="flex items-center gap-2 mb-10">
                    <ShieldCheck size={24} className={BRAND_GREEN} />
                    <span className="text-lg font-extrabold text-gray-900 dark:text-gray-50">
                        Titipsini<span className={BRAND_GREEN}>.Com</span>
                    </span>
                </div>

                <SuccessIllustration />

                <h1 className="mt-8 text-base font-bold text-gray-900 dark:text-gray-50">
                    Pembuatan PIN baru Berhasil
                </h1>
                <p className="mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                    Terima kasih telah membuat PIN baru. PIN ini digunakan untuk keamanan transaksi Anda.
                </p>
            </div>
        </CustomerLayout>
    );
}

function SuccessIllustration() {
    const dots = [
        { x: 20, y: 10, r: 4 }, { x: 70, y: 5, r: 3 }, { x: 110, y: 25, r: 5 },
        { x: 10, y: 55, r: 3 }, { x: 55, y: 40, r: 4 }, { x: 100, y: 60, r: 3 },
        { x: 30, y: 90, r: 3 }, { x: 85, y: 95, r: 4 }, { x: 120, y: 75, r: 3 },
        { x: 5, y: 100, r: 3 },
    ];
    return (
        <svg viewBox="0 0 130 110" className="w-40 h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {dots.map((d, i) => (
                <circle
                    key={i}
                    cx={d.x}
                    cy={d.y}
                    r={d.r}
                    className={i % 3 === 0 ? 'fill-[#15803d]' : 'fill-emerald-200 dark:fill-emerald-900'}
                    opacity={i % 2 === 0 ? 0.8 : 0.5}
                />
            ))}
            <circle cx={65} cy={55} r={2.5} className="fill-gray-900 dark:fill-gray-100" />
        </svg>
    );
}