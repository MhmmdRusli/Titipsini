import { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';

const SLIDES = [
    {
        image: '/images/onboarding-1.png',
        title: 'Bingung mau nitip barang dimana?',
        subtitle: 'Nikmati pengalaman menitipkan barang yang lebih nyaman dengan titipsini.com',
    },
    {
        image: '/images/onboarding-2.png',
        title: 'Bukan Hanya Penitipan Barang!',
        subtitle: 'Kami juga menawarkan solusi penitipan kendaraan dan bangunan kamu',
    },
    {
        image: '/images/onboarding-3.png',
        title: 'Tersedia di Berbagai Kota di Indonesia',
        subtitle: 'Kamu dapat dengan mudah menemukan layanan terdekat di daerah kamu sendiri',
    },
];

export default function Onboarding() {
    const [showSplash, setShowSplash] = useState(true);
    const [slide, setSlide] = useState(0);
    const touchStartX = useRef(null);

    // Effect untuk menghilangkan Splash Screen
    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 1800);
        return () => clearTimeout(timer);
    }, []);

    // Effect untuk menjalankan Auto-Play Slide Otomatis
    useEffect(() => {
        if (showSplash) return;

        const autoPlay = setInterval(() => {
            setSlide((prevSlide) => (prevSlide + 1) % SLIDES.length);
        }, 3000);

        return () => clearInterval(autoPlay);
    }, [showSplash]);

    function handleTouchStart(e) {
        touchStartX.current = e.touches[0].clientX;
    }

    function handleTouchEnd(e) {
        if (touchStartX.current === null) return;
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (diff < -40 && slide < SLIDES.length - 1) setSlide((s) => s + 1);
        else if (diff > 40 && slide > 0) setSlide((s) => s - 1);
        touchStartX.current = null;
    }

    if (showSplash) {
        return (
            <div
                onClick={() => setShowSplash(false)}
                className="flex min-h-screen flex-col items-center justify-between bg-[#15803d] px-8 py-16 text-white"
            >
                <Head title="Titipsini.Com" />
                <div />
                
                <div className="flex flex-col items-center">
                    <img 
                        src="/images/logo-titipsini.png" 
                        alt="Logo White" 
                        className="h-24 w-auto object-contain brightness-0 invert" 
                    />
                    <h1 className="mt-5 text-2xl font-black tracking-tight text-white">
                        Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                    </h1>
                    <p className="mt-2 max-w-[240px] text-center text-xs text-gray-100/90 font-medium">
                        Tempat Yang Aman Untuk Barang Berharga Anda
                    </p>
                </div>
                
                <p className="text-[11px] text-gray-200/80 font-medium tracking-wide">Versi Aplikasi 1.0.0.0</p>
            </div>
        );
    }

    const current = SLIDES[slide];

    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white text-gray-900 selection:bg-green-100">
            <Head title="Selamat Datang" />

            {/* Header Logo Navigasi Atas - LOGO DIPERBESAR LAGI (h-12 & text-xl) */}
            <div className="flex items-center justify-center gap-3 px-6 pt-6 mb-2">
                <img 
                    src="/images/logo-titipsini.png" 
                    alt="Logo Icon" 
                    className="h-12 w-auto object-contain" 
                />
                <span className="text-xl font-black tracking-tight text-[#15803d]">
                    Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                </span>
            </div>

            {/* Konten Utama Gambar Ilustrasi dengan Efek Slide */}
            <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative flex flex-1 flex-col items-center px-6"
            >
                {/* Lingkaran / Curve Latar Belakang Gambar Ilustrasi */}
                <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-green-50/70 to-transparent mt-4">
                    <img 
                        src={current.image} 
                        alt={current.title} 
                        className="h-52 w-auto object-contain transition-all duration-500 transform ease-in-out"
                    />
                </div>

                {/* Indikator Progres Bar / Dots */}
                <div className="mt-8 flex w-full max-w-[120px] gap-1.5 justify-center">
                    {SLIDES.map((_, i) => (
                        <span
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === slide ? 'bg-[#15803d] w-6' : 'bg-gray-200 w-2'
                            }`}
                        />
                    ))}
                </div>

                {/* Judul & Subtitle Judul Konten */}
                <h2 className="mt-8 text-center text-xl font-bold text-gray-900 leading-snug px-2 min-h-[56px]">
                    {current.title}
                </h2>
                <p className="mt-3 text-center text-xs text-gray-400 font-medium leading-relaxed px-4 min-h-[40px]">
                    {current.subtitle}
                </p>
            </div>

            {/* Bagian Aksi Tombol Bawah (Footer Action Buttons) */}
            <div className="px-6 pb-10 space-y-3">
                <Link
                    href="/register"
                    className="block w-full rounded-xl bg-[#15803d] py-3.5 text-center text-sm font-bold text-white shadow-sm hover:bg-[#166534] transition-colors"
                >
                    Daftar
                </Link>
                <Link
                    href="/login"
                    className="block w-full rounded-xl border border-gray-300 py-3.5 text-center text-sm font-bold text-[#15803d] hover:bg-gray-50 transition-colors"
                >
                    Masuk
                </Link>
            </div>
        </div>
    );
}