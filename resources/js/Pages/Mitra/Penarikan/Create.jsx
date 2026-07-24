import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Delete } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const PRESETS = [100000, 150000, 250000, 300000, 500000, 1000000];
const PIN_LENGTH = 6;

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID').format(value ?? 0);
}

export default function PenarikanCreate({ saldo, rekening }) {
    const [step, setStep] = useState('jumlah'); // 'jumlah' | 'pin'
    const [jumlah, setJumlah] = useState('');
    const [pin, setPin] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const jumlahNumber = Number(jumlah) || 0;
    const isValidJumlah = jumlahNumber >= 100000 && jumlahNumber <= saldo && !!rekening;

    function pickPreset(value) {
        setJumlah(String(value));
    }

    function handleJumlahChange(e) {
        const digitsOnly = e.target.value.replace(/\D/g, '');
        setJumlah(digitsOnly);
    }

    function goToPin() {
        if (!isValidJumlah) return;
        setError('');
        setStep('pin');
    }

    function pressDigit(digit) {
        if (pin.length >= PIN_LENGTH) return;
        const next = pin + digit;
        setPin(next);
        if (next.length === PIN_LENGTH) {
            submit(next);
        }
    }

    function pressBackspace() {
        setPin((prev) => prev.slice(0, -1));
    }

    function submit(finalPin) {
        setProcessing(true);
        setError('');
        router.post(
            '/mitra/pendapatan/penarikan',
            { jumlah: jumlahNumber, pin: finalPin },
            {
                onError: (errors) => {
                    setProcessing(false);
                    setPin('');
                    setError(errors.pin ?? errors.jumlah ?? 'Terjadi kesalahan, coba lagi.');
                },
            }
        );
    }

    if (step === 'pin') {
        return (
            <MitraLayout>
                <Head title="Verifikasi PIN" />

                <div className="flex h-full flex-col px-4 py-3">
                    <div className="mb-6 flex items-center gap-3">
                        <button type="button" onClick={() => { setStep('jumlah'); setPin(''); setError(''); }} className="text-gray-700">
                            <ChevronLeft size={22} />
                        </button>
                        <h1 className="text-base font-bold text-gray-900">Verifikasi PIN</h1>
                    </div>

                    <div className="flex flex-1 flex-col items-center pt-6">
                        <p className="text-center text-sm text-gray-500">
                            Masukkan PIN Anda untuk mengonfirmasi transaksi ini senilai
                        </p>
                        <p className="mt-1 text-lg font-extrabold text-gray-900">Rp{formatRupiah(jumlahNumber)}</p>

                        <div className="mt-6 flex gap-3">
                            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`h-3 w-3 rounded-full border-2 ${i < pin.length ? 'border-green-600 bg-green-600' : 'border-gray-300 bg-transparent'
                                        }`}
                                />
                            ))}
                        </div>

                        {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}
                        {processing && <p className="mt-3 text-xs text-gray-400">Memverifikasi...</p>}
                    </div>

                    {/* Keypad numerik */}
                    <div className="mb-6 grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                            <button
                                key={n}
                                type="button"
                                disabled={processing}
                                onClick={() => pressDigit(String(n))}
                                className="rounded-xl bg-gray-100 py-3.5 text-lg font-semibold text-gray-800 active:bg-gray-200 disabled:opacity-50"
                            >
                                {n}
                            </button>
                        ))}
                        <div />
                        <button
                            type="button"
                            disabled={processing}
                            onClick={() => pressDigit('0')}
                            className="rounded-xl bg-gray-100 py-3.5 text-lg font-semibold text-gray-800 active:bg-gray-200 disabled:opacity-50"
                        >
                            0
                        </button>
                        <button
                            type="button"
                            disabled={processing}
                            onClick={pressBackspace}
                            className="flex items-center justify-center rounded-xl bg-gray-100 py-3.5 text-gray-600 active:bg-gray-200 disabled:opacity-50"
                        >
                            <Delete size={18} />
                        </button>
                    </div>
                </div>
            </MitraLayout>
        );
    }

    return (
        <MitraLayout>
            <Head title="Penarikan" />

            <div className="px-4 py-3">
                <div className="mb-4 flex items-center gap-3">
                    <Link href="/mitra/dashboard" className="text-gray-700">
                        <ChevronLeft size={22} />
                    </Link>
                    <h1 className="text-base font-bold text-gray-900">Penarikan</h1>
                </div>

                {/* Saldo aktif */}
                <div className="rounded-xl bg-green-50 px-4 py-3">
                    <p className="text-[11px] text-green-700">Saldo aktif</p>
                    <p className="text-lg font-extrabold text-green-800">Rp{formatRupiah(saldo)}</p>
                </div>

                {/* Nominal cepat */}
                <p className="mb-2 mt-5 text-sm font-bold text-gray-900">Jumlah Penarikan (Rp)</p>
                <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => pickPreset(value)}
                            className={`rounded-xl border py-2.5 text-xs font-semibold transition ${jumlahNumber === value
                                    ? 'border-green-600 bg-green-600 text-white'
                                    : 'border-gray-200 bg-white text-gray-700'
                                }`}
                        >
                            Rp{formatRupiah(value)}
                        </button>
                    ))}
                </div>

                {/* Input manual */}
                <p className="mb-1.5 mt-4 text-xs font-medium text-gray-500">Masukkan Jumlah</p>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                    <span className="mr-1 text-lg font-bold text-gray-400">Rp</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={jumlah ? formatRupiah(jumlahNumber) : ''}
                        onChange={handleJumlahChange}
                        placeholder="0"
                        className="w-full border-none p-0 text-lg font-bold text-gray-900 focus:outline-none focus:ring-0"
                    />
                </div>
                {jumlahNumber > 0 && jumlahNumber < 100000 && (
                    <p className="mt-1.5 text-xs text-red-500">Minimal penarikan Rp100.000.</p>
                )}
                {jumlahNumber > saldo && (
                    <p className="mt-1.5 text-xs text-red-500">Saldo kamu tidak mencukupi.</p>
                )}

                {/* Rekening tujuan */}
                <p className="mb-1.5 mt-5 text-sm font-bold text-gray-900">Rekening Tujuan</p>
                {rekening ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                        <p className="text-xs font-semibold text-gray-900">{rekening.nama_bank}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{rekening.nomor_rekening} &middot; a.n. {rekening.nama_pemilik}</p>
                    </div>
                ) : (
                    <Link
                        href="/mitra/rekening"
                        className="flex items-center gap-2 rounded-xl border border-dashed border-green-300 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"
                    >
                        + Tambah Rekening
                    </Link>
                )}

                <button
                    type="button"
                    disabled={!isValidJumlah}
                    onClick={goToPin}
                    className="mt-6 w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition disabled:opacity-40"
                >
                    Tarik
                </button>
            </div>
        </MitraLayout>
    );
}