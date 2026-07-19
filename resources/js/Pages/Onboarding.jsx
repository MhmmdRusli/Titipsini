import { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Package, Bike, MapPin, ShieldCheck } from 'lucide-react';

const SLIDES = [
    {
        icon: Package,
        title: 'Bingung mau nitip barang dimana?',
        subtitle: 'Nikmati pengalaman menitipkan barang yang lebih nyaman dengan titipsini.com',
    },
    {
        icon: Bike,
        title: 'Bukan Hanya Penitipan Barang!',
        subtitle: 'Kami juga menawarkan solusi penitipan kendaraan dan bangunan kamu',
    },
    {
        icon: MapPin,
        title: 'Tersedia di Berbagai Kota di Indonesia',
        subtitle: 'Kamu dapat dengan mudah menemukan layanan terdekat di daerah kamu sendiri',
    },
];

export default function Onboarding() {
    const [showSplash, setShowSplash] = useState(true);
    const [slide, setSlide] = useState(0);
    const touchStartX = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 1800);
        return () => clearTimeout(timer);
    }, []);

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
                className="flex min-h-screen flex-col items-center justify-between bg-green-900 px-8 py-16 text-white"
            >
                <Head title="Titipsini.Com" />
                <div />
                <div className="flex flex-col items-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white">
                        <ShieldCheck size={44} strokeWidth={1.5} />
                    </div>
                    <h1 className="mt-5 text-2xl font-semibold">
                        Titipsini<span className="text-green-300">•</span>Com
                    </h1>
                    <p className="mt-2 max-w-[220px] text-center text-xs text-green-200">
                        Tempat Yang Aman Untuk Barang Berharga Anda
                    </p>
                </div>
                <p className="text-xs text-green-300">Versi Aplikasi 1.0.0.0</p>
            </div>
        );
    }

    const current = SLIDES[slide];
    const Icon = current.icon;

    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white">
            <Head title="Selamat Datang" />

            <div className="flex items-center justify-center gap-2 px-6 pt-6">
                <ShieldCheck size={18} className="text-brand-teal-600" />
                <span className="text-sm font-semibold text-gray-800">
                    Titipsini<span className="text-brand-teal-600">•</span>Com
                </span>
            </div>

            <div className="mt-4 flex gap-1.5 px-6">
                {SLIDES.map((_, i) => (
                    <span
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= slide ? 'bg-brand-teal-600' : 'bg-gray-200'
                        }`}
                    />
                ))}
            </div>

            <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative flex flex-1 flex-col items-center justify-center px-8"
            >
                {/* Tap left/right thirds to navigate, in addition to swipe */}
                {slide > 0 && (
                    <button
                        aria-label="Sebelumnya"
                        onClick={() => setSlide((s) => s - 1)}
                        className="absolute left-0 top-0 h-full w-1/3"
                    />
                )}
                {slide < SLIDES.length - 1 && (
                    <button
                        aria-label="Selanjutnya"
                        onClick={() => setSlide((s) => s + 1)}
                        className="absolute right-0 top-0 h-full w-1/3"
                    />
                )}

                <div className="flex h-52 w-52 items-center justify-center rounded-full bg-brand-teal-50">
                    <Icon size={72} strokeWidth={1.25} className="text-brand-teal-600" />
                </div>

                <h2 className="mt-8 text-center text-xl font-semibold text-gray-900">{current.title}</h2>
                <p className="mt-2 text-center text-sm text-gray-500">{current.subtitle}</p>
            </div>

            <div className="px-6 pb-10">
                <Link
                    href="/register"
                    className="block w-full rounded-xl bg-brand-teal-700 py-3 text-center text-sm font-semibold text-white"
                >
                    Daftar
                </Link>
                <Link
                    href="/login"
                    className="mt-3 block w-full rounded-xl border border-brand-teal-700 py-3 text-center text-sm font-semibold text-brand-teal-700"
                >
                    Masuk
                </Link>
            </div>
        </div>
    );
}