import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft, Mail } from 'lucide-react';

const DURASI_TUNGGU = 60; // detik sebelum bisa kirim ulang

export default function VerifikasiRekening({ rekeningId, email }) {
    const [sisaWaktu, setSisaWaktu] = useState(DURASI_TUNGGU);
    const [mengirimUlang, setMengirimUlang] = useState(false);

    const { data, setData, post, processing, errors } = useForm({ kode: '' });

    useEffect(() => {
        if (sisaWaktu <= 0) return;
        const timer = setInterval(() => setSisaWaktu((s) => s - 1), 1000);
        return () => clearInterval(timer);
    }, [sisaWaktu]);

    const submitKode = (e) => {
        e.preventDefault();
        if (data.kode.length < 6) return;
        post(`/mitra/rekening/${rekeningId}/verifikasi/konfirmasi`);
    };

    const kirimUlang = () => {
        setMengirimUlang(true);
        post(`/mitra/rekening/${rekeningId}/verifikasi/kirim-ulang`, {
            preserveScroll: true,
            onFinish: () => {
                setMengirimUlang(false);
                setSisaWaktu(DURASI_TUNGGU);
            },
        });
    };

    return (
        <MitraLayout>
            <Head title="Verifikasi" />

            <div className="flex flex-col items-center px-4 pb-4 pt-10 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                    <Mail size={26} className="text-green-600" />
                </div>

                <p className="text-sm font-semibold text-gray-900">Masukkan Kode Verifikasi</p>
                <p className="mt-1 text-xs text-gray-500">
                    Kode verifikasi telah dikirim melalui Email <span className="font-medium text-gray-700">{email}</span>
                </p>

                <form onSubmit={submitKode} className="mt-6 w-full max-w-xs">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="______"
                        value={data.kode}
                        onChange={(e) => setData('kode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={`w-full rounded-lg text-center text-lg tracking-[0.5em] ${
                            errors.kode ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        }`}
                        autoFocus
                    />
                    {errors.kode && <p className="mt-1.5 text-xs text-red-600">{errors.kode}</p>}

                    <p className="mt-4 text-xs text-gray-500">
                        {sisaWaktu > 0 ? (
                            <>
                                Mohon tunggu dalam <span className="font-semibold text-gray-700">{sisaWaktu} detik</span> untuk kirim ulang
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={kirimUlang}
                                disabled={mengirimUlang}
                                className="font-semibold text-green-700 hover:text-green-600 disabled:opacity-50"
                            >
                                Kirim Ulang Kode
                            </button>
                        )}
                    </p>

                    <button
                        type="submit"
                        disabled={processing || data.kode.length < 6}
                        className="mt-6 w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50"
                    >
                        Verifikasi
                    </button>
                </form>
            </div>
        </MitraLayout>
    );
}