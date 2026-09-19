import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { User, Menu, X } from 'lucide-react';

export default function Landing() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('beranda');

    const scrollToSection = (e, id) => {
        e.preventDefault();
        setActiveSection(id);
        setMenuOpen(false);

        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    useEffect(() => {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.4 }
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    const navLinkClass = (id) =>
        `text-lg font-semibold transition-colors duration-200 ${
            activeSection === id
                ? 'text-green-600 font-bold border-b-2 border-green-600 pb-1'
                : 'text-gray-700 hover:text-green-600'
        }`;

    return (
        <div className="min-h-screen w-full bg-white text-gray-900 font-sans antialiased scroll-smooth">
            <Head title="Titipsini.com — Titip Barang, Kendaraan, dan Bangunan Jadi Gampang" />

            {/* ============== NAVBAR ============== */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
                <div className="flex w-full items-center justify-between px-6 py-5 md:px-12 lg:px-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo-titipsini.png" alt="Titipsini" className="h-10 md:h-12 w-auto object-contain" />
                        <span className="text-2xl font-black tracking-tight text-green-600 md:text-3xl">
                            Titipsini<span className="text-amber-400">•</span>Com
                        </span>
                    </Link>

                    {/* Nav Links Desktop */}
                    <div className="hidden items-center gap-8 md:flex">
                        <nav className="flex items-center gap-8">
                            <a href="#beranda" onClick={(e) => scrollToSection(e, 'beranda')} className={navLinkClass('beranda')}>
                                Beranda
                            </a>
                            <a href="#tentang" onClick={(e) => scrollToSection(e, 'tentang')} className={navLinkClass('tentang')}>
                                Tentang
                            </a>
                            <a href="#layanan" onClick={(e) => scrollToSection(e, 'layanan')} className={navLinkClass('layanan')}>
                                Layanan
                            </a>
                            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className={navLinkClass('faq')}>
                                FAQ
                            </a>
                        </nav>

                        {/* Profil Icon Desktop */}
                        <Link 
                            href="/mulai" 
                            className="flex items-center justify-center rounded-full p-2 text-gray-800 transition hover:bg-green-50 hover:text-green-600"
                            title="Onboarding / Profil"
                        >
                            <User size={26} />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-gray-700 md:hidden"
                    >
                        {menuOpen ? <X size={30} /> : <Menu size={30} />}
                    </button>
                </div>

                {/* Mobile Nav Menu Dropdown */}
                {menuOpen && (
                    <div className="border-t border-gray-100 bg-white px-6 py-6 md:hidden">
                        <nav className="flex flex-col gap-5 text-lg font-semibold">
                            <a href="#beranda" onClick={(e) => scrollToSection(e, 'beranda')} className={navLinkClass('beranda')}>
                                Beranda
                            </a>
                            <a href="#tentang" onClick={(e) => scrollToSection(e, 'tentang')} className={navLinkClass('tentang')}>
                                Tentang
                            </a>
                            <a href="#layanan" onClick={(e) => scrollToSection(e, 'layanan')} className={navLinkClass('layanan')}>
                                Layanan
                            </a>
                            <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className={navLinkClass('faq')}>
                                FAQ
                            </a>
                            <Link 
                                href="/mulai" 
                                className="flex items-center gap-3 pt-2 text-gray-800 hover:text-green-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                <User size={24} />
                                <span>Profil / Onboarding</span>
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* ============== HERO SECTION ============== */}
            <section id="beranda" className="w-full px-6 py-12 md:px-12 lg:px-16 lg:py-16">
                <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <h1 className="text-4xl font-black leading-[1.1] text-gray-900 sm:text-6xl xl:text-7xl">
                            Bingung Mau Nitip <br />
                            Barang Dimana? <br />
                            <span className="text-green-600">Titipsini</span> aja!
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 leading-relaxed sm:text-2xl">
                            Semua bisa dititipkan termasuk barang, rumah atau kendaraan.
                        </p>
                        <div className="mt-10">
                            <a
                                href="#download"
                                className="inline-block rounded-2xl bg-green-600 px-10 py-5 text-lg font-bold text-white shadow-xl transition hover:bg-green-700 hover:shadow-2xl active:scale-95"
                            >
                                Download Sekarang
                            </a>
                        </div>
                    </div>

                    <div className="flex w-full justify-center lg:col-span-5 lg:justify-end">
                        <img
                            src="/images/hp.png"
                            alt="Titipsini Mobile App"
                            className="w-full max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* ============== SECTION 1 ============== */}
            <section id="tentang" className="w-full px-6 py-16 md:px-12 lg:px-16 lg:py-24 border-t border-gray-50">
                <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
                    <div className="flex w-full justify-center lg:col-span-6 lg:justify-start">
                        <img
                            src="/images/puzzle.png"
                            alt="Layanan Penitipan Pertama di Indonesia"
                            className="w-full max-w-[700px] xl:max-w-[850px] object-contain transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="lg:col-span-6">
                        <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-5xl xl:text-6xl">
                            Layanan Penitipan Pertama <br className="hidden sm:block" />
                            di Indonesia
                        </h2>
                        <p className="mt-6 text-xl text-gray-600 leading-relaxed sm:text-2xl">
                            Di sini kami menawarkan berbagai pilihan layanan penitipan seperti penitipan barang, kendaraan dan bangunan.
                        </p>
                    </div>
                </div>
            </section>

            {/* ============== SECTION 2 ============== */}
            <section id="layanan" className="w-full px-6 py-16 md:px-12 lg:px-16 lg:py-24">
                <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-5xl xl:text-6xl">
                            Tersedia di Berbagai <br className="hidden sm:block" />
                            Kota di Indonesia!
                        </h2>
                        <p className="mt-6 text-xl text-gray-600 leading-relaxed sm:text-2xl">
                            Anda dapat dengan mudah menemukan layanan terdekat di daerah Anda.
                        </p>
                    </div>
                    <div className="flex w-full justify-center lg:col-span-6 lg:justify-end">
                        <img
                            src="/images/lptp.png"
                            alt="Tersedia di Berbagai Kota"
                            className="w-full max-w-[600px] xl:max-w-[700px] object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* ============== SECTION 3 ============== */}
            <section id="faq" className="w-full px-6 py-16 md:px-12 lg:px-16 lg:py-24 border-t border-gray-50">
                <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
                    <div className="flex w-full justify-center lg:col-span-6 lg:justify-start">
                        <img
                            src="/images/diskon.png"
                            alt="Promo Cashback 30%"
                            className="w-full max-w-[600px] xl:max-w-[700px] object-contain"
                        />
                    </div>
                    <div className="lg:col-span-6">
                        <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-5xl xl:text-6xl">
                            Promo Cashback 30%
                        </h2>
                        <p className="mt-6 text-xl text-gray-600 leading-relaxed sm:text-2xl">
                            Khusus pengguna baru tersedia promo <span className="font-bold text-gray-900">cashback</span> besar besaran
                        </p>
                    </div>
                </div>
            </section>

            {/* ============== CTA BANNER ============== */}
            <section className="w-full px-6 py-12 md:px-12 lg:px-16 lg:py-20">
                <div className="w-full rounded-3xl bg-[#A2ABC2]/30 px-8 py-20 text-center lg:py-24">
                    <h2 className="text-3xl font-black text-gray-900 sm:text-5xl xl:text-6xl">
                        Tunggu Apalagi? <br />
                        Ayo Buruan Download Titipsini Sekarang!
                    </h2>
                    <p className="mt-6 text-lg text-gray-700 sm:text-2xl">
                        Semua bisa dititipkan termasuk barang, rumah atau kendaraan.
                    </p>
                    <div className="mt-10">
                        <a
                            href="#download"
                            className="inline-block rounded-2xl bg-green-600 px-10 py-5 text-lg font-bold text-white shadow-lg transition hover:bg-green-700"
                        >
                            Download Sekarang
                        </a>
                    </div>
                </div>
            </section>

            {/* ============== FOOTER ============== */}
            <footer className="w-full bg-green-600 text-white py-16 px-6 md:px-12 lg:px-16 mt-12">
                <div className="w-full grid grid-cols-1 gap-12 md:grid-cols-4 items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            <img src="/images/logo-titipsini.png" alt="Titipsini" className="h-9 w-auto brightness-0 invert" />
                            <span className="text-2xl font-bold">Titipsini•Com</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white text-xl mb-4">Produk</h4>
                        <ul className="space-y-3 text-lg text-white/90">
                            <li><a href="/syarat-ketentuan" className="hover:underline">Syarat & Ketentuan</a></li>
                            <li><a href="/kebijakan-privasi" className="hover:underline">Kebijakan Privasi</a></li>
                            <li><a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:underline">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white text-xl mb-4">Perusahaan</h4>
                        <ul className="space-y-3 text-lg text-white/90">
                            <li><a href="#tentang" onClick={(e) => scrollToSection(e, 'tentang')} className="hover:underline">Tentang Kami</a></li>
                            <li><a href="#kontak" className="hover:underline">Kontak Kami</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="space-y-2 text-lg">
                            <a href="#" className="block hover:underline">Facebook</a>
                            <a href="#" className="block hover:underline">Twitter</a>
                            <a href="#" className="block hover:underline">Instagram</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}