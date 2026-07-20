import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

const SLIDES = [
    {
        key: 'ajakan',
        image: '/images/onboarding-1.png',
        title: 'Memiliki lahan kosong tapi bingung mau diapakan?',
        description: 'Mari bergabung menjadi mitra pada platform Titipsini.com',
    },
    {
        key: 'profil',
        image: '/images/onboarding-2.png',
        title: 'Apa itu platform Titipsini.com?',
        description: 'Titipsini.com adalah aplikasi yang menyediakan layanan penitipan barang.',
    },
    {
        key: 'panduan',
        image: '/images/onboarding-3.png',
        title: 'Bagaimana cara menjadi mitra Titipsini.com?',
        description: 'Caranya gampang, silahkan mendaftarkan diri anda pada platform mitra kami.',
    },
    {
        key: 'cta',
        image: '/images/onboarding-4.png',
        title: 'Ayo Segera Bergabung!',
        description: '',
        isFinal: true,
    },
];

function Wordmark({ light = false }) {
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2">
                <img
                    src="/images/logo-titipsini.png"
                    alt="Logo Titipsini"
                    className={`h-6 w-auto object-contain ${light ? 'brightness-0 invert' : ''}`}
                />
                <span
                    className={`text-sm font-bold tracking-tight ${
                        light ? 'text-white' : 'text-[#15803d]'
                    }`}
                >
                    Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                </span>
            </div>
            <p className={`mt-0.5 text-[9px] ${light ? 'text-white/80' : 'text-gray-400'}`}>
                Tempat Yang Aman Untuk Barang Berharga Anda
            </p>
        </div>
    );
}

export default function Onboarding() {
    const [showSplash, setShowSplash] = useState(true);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => setShowSplash(false), 1400);
        return () => clearTimeout(t);
    }, []);

    const isLast = step === SLIDES.length - 1;
    const slide = SLIDES[step];

    const next = () => {
        if (!isLast) setStep((s) => s + 1);
    };

    return (
        <div className="min-h-dvh bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Jadi Mitra Titipsini" />

            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-white sm:h-[850px] sm:shadow-xl">
                {showSplash ? (
                    <div className="flex flex-1 flex-col items-center justify-between bg-green-600 px-8 py-16 text-white">
                        <div />

                        <div className="flex flex-col items-center">
                            <img
                                src="/images/logo-titipsini.png"
                                alt="Logo Titipsini"
                                className="h-20 w-auto object-contain brightness-0 invert"
                            />
                            <h1 className="mt-4 text-2xl font-black tracking-tight text-white">
                                Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                            </h1>
                            <p className="mt-2 max-w-[240px] text-center text-xs font-medium text-gray-100/90">
                                Tempat Yang Aman Untuk Barang Berharga Anda
                            </p>
                            <p className="mt-1 text-xs text-green-100">Mitra Partner</p>
                        </div>

                        <p className="text-[11px] font-medium tracking-wide text-gray-200/80">
                            Versi Aplikasi 1.0.0.0
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Progress bar paling atas */}
                        <div className="flex gap-1.5 px-4 pt-4">
                            {SLIDES.map((s, i) => (
                                <span
                                    key={s.key}
                                    className={`h-1.5 flex-1 rounded-full transition-all ${
                                        i === step ? 'bg-green-600' : 'bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Header logo + Skip, dikasih jarak dari progress bar & logo ditengahkan penuh */}
                        <div className="relative flex items-center justify-center px-4 pt-6">
                            <Wordmark />
                            {!isLast && (
                                <button
                                    type="button"
                                    onClick={() => setStep(SLIDES.length - 1)}
                                    className="absolute right-4 text-xs font-medium text-gray-400 hover:text-gray-600"
                                >
                                    Lewati
                                </button>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="h-52 w-auto object-contain"
                            />
                            <h1 className="mt-8 text-xl font-bold text-gray-900">{slide.title}</h1>
                            {slide.description && (
                                <p className="mt-3 text-sm leading-relaxed text-gray-500">{slide.description}</p>
                            )}
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