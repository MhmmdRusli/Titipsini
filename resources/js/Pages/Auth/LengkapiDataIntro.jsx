import { Head, Link } from '@inertiajs/react';

export default function LengkapiDataIntro() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 font-sans">
            <Head title="Lengkapi Data Diri" />

            {/* Frame Utama: Dibatasi max-w-[360px] agar tidak gendut */}
            <div className="flex w-full max-w-[360px] flex-col items-center overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                
                {/* Bagian Atas: Logo */}
                <div className="flex flex-col items-center">
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
                    <p className="text-[9px] text-gray-400 tracking-wider uppercase mt-1">
                        Titip Barang Menjadi Lebih Mudah
                    </p>
                </div>

                {/* Bagian Tengah: Ilustrasi */}
                <div className="w-full aspect-square flex items-center justify-center my-2">
                    <img 
                        src="/images/illustration-lengkapi-data.png" 
                        alt="Ilustrasi Lengkapi Data" 
                        className="w-full h-auto object-contain scale-105"
                        onError={(e) => {
                            e.target.src = "https://placehold.co/320x320/f3f4f6/9ca3af?text=Ilustrasi+Kurir";
                        }}
                    />
                </div>

                {/* Konten Teks */}
                <div className="text-center px-2">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-tight">
                        Lengkapi Data Diri<br />Kamu Sekarang!
                    </h1>
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                        Lengkapi data diri Kamu untuk layanan yang aman, terpercaya, dan manfaatkan fitur-fitur menarik Titipsini.com.
                    </p>
                </div>

                {/* Bagian Bawah: Tombol Aksi */}
                <div className="w-full mt-8">
                    <Link
                        href={route('customer.lengkapi-data.form')}
                        className="block w-full rounded-xl bg-[#3B8F55] py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-[#317646] transition-all active:scale-[0.98]"
                    >
                        Lengkapi Data Diri Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
}