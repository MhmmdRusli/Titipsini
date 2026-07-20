import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Home, Building2, Handshake, Rocket, ChevronRight } from 'lucide-react';

const SLIDES = [
    {
        key: 'ajakan',
        icon: Home,
        title: 'Punya Aset atau Lahan Menganggur?',
        description: 'Ubah properti, gudang, atau lahan kosong kamu jadi sumber penghasilan baru dengan bergabung sebagai mitra Titipsini.',
    },
    {
        key: 'profil',
        icon: Building2,
        title: 'Kenalan dengan Titipsini',
        description: 'Titipsini menghubungkan ribuan pelanggan yang butuh tempat penitipan barang, kendaraan, hingga bangunan — dengan mitra terpercaya sepertimu.',
    },
    {
        key: 'panduan',
        icon: Handshake,
        title: 'Daftar Jadi Mitra, Gampang Kok',
        description: 'Isi data diri, lengkapi info lokasi/asetmu, tunggu verifikasi singkat dari tim kami — akun mitra kamu langsung siap dipakai.',
    },
    {
        key: 'cta',
        icon: Rocket,
        title: 'Yuk, Mulai Sekarang',
        description: 'Jadi bagian dari ekosistem Titipsini dan raih peluang penghasilan dari asetmu hari ini juga.',
        isFinal: true,
    },
];

export default function Onboarding() {
    const [showSplash, setShowSplash] = useState(true);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => setShowSplash(false), 1400);
        return () => clearTimeout(t);
    }, []);

    const isLast = step === SLIDES.length - 1;
    const slide = SLIDES[step];
    const Icon = slide.icon;

    const next = () => {
        if (!isLast) setStep((s) => s + 1);
    };

    return (
        <div className="min-h-dvh bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Jadi Mitra Titipsini" />

            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-white sm:h-[850px] sm:shadow-xl">
                {showSplash ? (
                    <div className="flex flex-1 flex-col items-center justify-center bg-green-600 text-white">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15">
                            <Handshake size={36} />
                        </div>
                        <p className="mt-4 font-mono text-sm tracking-widest">TITIPSINI</p>
                        <p className="mt-1 text-xs text-green-100">Mitra Partner</p>
                    </div>
                ) : (
                    <>
                        {/* Skip, kecuali di slide terakhir */}
                        <div className="flex justify-end px-4 pt-4">
                            {!isLast && (
                                <button
                                    type="button"
                                    onClick={() => setStep(SLIDES.length - 1)}
                                    className="text-xs font-medium text-gray-400 hover:text-gray-600"
                                >
                                    Lewati
                                </button>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-50 text-green-600">
                                <Icon size={48} strokeWidth={1.5} />
                            </div>
                            <h1 className="mt-8 text-xl font-bold text-gray-900">{slide.title}</h1>
                            <p className="mt-3 text-sm leading-relaxed text-gray-500">{slide.description}</p>
                        </div>

                        {/* Dot indicator */}
                        <div className="flex justify-center gap-1.5 pb-6">
                            {SLIDES.map((s, i) => (
                                <span
                                    key={s.key}
                                    className={`h-1.5 rounded-full transition-all ${
                                        i === step ? 'w-6 bg-green-600' : 'w-1.5 bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="px-6 pb-8">
                            {isLast ? (
                                <div className="flex flex-col gap-2.5">
                                    <Link
                                        href={route('mitra.register')}
                                        className="flex w-full items-center justify-center gap-1 rounded-full bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
                                    >
                                        Daftar Jadi Mitra
                                    </Link>
                                    <Link
                                        href={route('mitra.login')}
                                        className="flex w-full items-center justify-center rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        Masuk
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={next}
                                    className="flex w-full items-center justify-center gap-1 rounded-full bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
                                >
                                    Lanjut
                                    <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}