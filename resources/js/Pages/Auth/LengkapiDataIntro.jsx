import { Head, Link } from '@inertiajs/react';

export default function LengkapiDataIntro() {
    return (
        <div className="flex min-h-screen w-full justify-center bg-gray-100 font-sans">
            <Head title="Lengkapi Data Diri" />

            {/* Layout Batas Layar HP (Siku / Tanpa Radius di Ujung Batas HP) */}
            <div className="relative flex w-full max-w-md min-h-screen flex-col justify-between bg-white px-6 py-8 shadow-md border-0 sm:border border-gray-100 overflow-hidden rounded-none">
                
                {/* 1. Header: Logo Titipsini */}
                <div className="flex flex-col items-center pt-2">
                    <div className="flex items-center gap-1.5 text-2xl font-bold text-[#3B8F55]">
                        <img 
                            src="/images/logo-titipsini.png" 
                            alt="Logo Titipsini" 
                            className="h-8 w-auto object-contain" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <span className="tracking-tight font-extrabold text-[#3B8F55]">
                            Titipsini<span className="text-yellow-400 mx-0.5">●</span>Com
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-1 font-medium">
                        Titip Barang Menjadi Lebih Mudah
                    </p>
                </div>

                {/* 2. Body: Ilustrasi Mobile */}
                <div className="my-auto flex flex-col items-center justify-center py-6">
                    <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
                        <img 
                            src="/images/illustration-lengkapi-data.png" 
                            alt="Ilustrasi Lengkapi Data" 
                            className="w-full h-full object-contain drop-shadow-sm"
                            onError={(e) => {
                                e.target.src = "https://placehold.co/320x320/f3f4f6/9ca3af?text=Ilustrasi+Kurir";
                            }}
                        />
                    </div>

                    {/* Teks Deskripsi */}
                    <div className="text-center mt-6 px-2">
                        <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-snug">
                            Lengkapi Data Diri<br />Kamu Sekarang!
                        </h1>
                        <p className="mt-2 text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                            Lengkapi data diri Kamu untuk layanan yang aman, terpercaya, dan manfaatkan fitur-fitur menarik Titipsini.com.
                        </p>
                    </div>
                </div>

                {/* 3. Footer: Tombol Utama (Kembali Memakai Radius) */}
                <div className="w-full pt-4 pb-2">
                    <Link
                        href={route('customer.lengkapi-data.form')}
                        className="flex w-full items-center justify-center rounded-2xl bg-[#3B8F55] py-4 text-center text-sm font-bold text-white shadow-lg shadow-[#3B8F55]/20 hover:bg-[#317646] active:scale-[0.98] transition-all"
                    >
                        Lengkapi Data Diri Sekarang
                    </Link>
                </div>

            </div>
        </div>
    );
}