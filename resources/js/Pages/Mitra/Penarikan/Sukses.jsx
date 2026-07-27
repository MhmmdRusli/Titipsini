import { Head, Link } from '@inertiajs/react';
import { Clock3, ArrowLeft } from 'lucide-react';

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID').format(value ?? 0);
}

// Komponen Baris Rincian
const Row = ({ label, value, bold }) => (
    <div className="flex justify-between items-center text-[11px] py-1.5 border-b border-emerald-100 dark:border-gray-800 last:border-b-0">
        <span className="text-gray-400 dark:text-gray-500">{label}</span>
        <span className={`${bold ? 'font-bold text-[#15803d] dark:text-[#4ade80]' : 'font-medium text-gray-800 dark:text-gray-200'}`}>
            {value}
        </span>
    </div>
);

export default function PenarikanSukses({ penarikan }) {
    // Data dari Controller Laravel (penarikan) / fallback dummy jika dipanggil manual
    const data = penarikan || {
        id: Date.now(),
        jumlah: 0,
        nama_bank: '-',
        nomor_rekening: '-',
        nama_pemilik: '-',
        status: 'pending'
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-200 dark:bg-gray-950 p-4">
            <Head title="Penarikan Diajukan" />

            {/* Container Mobile View */}
            <div className="relative flex h-[850px] w-full max-w-[430px] flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-xl rounded-lg">
                
                {/* NAVBAR STANDAR (BACK KE DASHBOARD MITRA) */}
                <header className="relative z-20 flex h-14 items-center justify-between border-b border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 px-4">
                    <Link
                        href={typeof route !== 'undefined' ? route('mitra.dashboard') : '/mitra/dashboard'}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Detail Penarikan
                    </h1>
                    <div className="w-9" />
                </header>

                {/* CEKUNGAN HIJAU */}
                <div className="absolute inset-x-0 top-14 h-44 bg-emerald-100/80 dark:bg-emerald-950/50 -translate-y-4 rounded-b-[100%] z-0 border-b border-emerald-200/60 dark:border-emerald-800/40" />

                {/* Main Content */}
                <div className="relative z-10 flex flex-grow flex-col items-center justify-start text-center p-5 pt-6">
                    
                    {/* LOGO */}
                    <div className="mb-2 flex items-center justify-center">
                        <img
                            src="/images/logo-titipsini.png"
                            alt="Logo Titipsini"
                            className="h-24 w-auto object-contain drop-shadow-md"
                        />
                    </div>

                    {/* BRAND TEXT */}
                    <div className="mb-6 pt-8">
                        <span className="text-2xl font-bold tracking-tight text-[#15803d] dark:text-[#4ade80]">
                            Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                        </span>
                    </div>

                    {/* ICON JAM STATUS */}
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-full mb-2 border border-amber-200/50 dark:border-amber-800/30 shadow-sm">
                        <Clock3 size={36} className="text-amber-500" />
                    </div>

                    <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                        Penarikan Diajukan & Sedang Diproses
                    </h2>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-400 max-w-[280px] leading-relaxed">
                        Dana akan masuk ke rekening Anda dalam waktu 1x24 jam. Harap tunggu konfirmasi sistem kami.
                    </p>

                    {/* RINGKASAN PENARIKAN */}
                    <div className="mt-4 w-full rounded-2xl border border-emerald-100 dark:border-gray-800 bg-white dark:bg-gray-800/50 p-4 text-left shadow-sm">
                        <div className="flex justify-center mb-3">
                            <span className="text-[10px] font-bold text-[#15803d] dark:text-[#4ade80] uppercase tracking-wider px-3 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-full border border-emerald-200 dark:border-emerald-800">
                                Ringkasan Penarikan
                            </span>
                        </div>

                        <Row 
                            label="Nomor Referensi" 
                            value={`PNR-${String(data.id).padStart(6, '0')}`} 
                        />
                        <Row 
                            label="Bank Tujuan" 
                            value={data.nama_bank} 
                        />
                        <Row 
                            label="Nomor Rekening" 
                            value={data.nomor_rekening} 
                        />
                        <Row 
                            label="Nama Pemilik" 
                            value={data.nama_pemilik} 
                        />
                        <Row 
                            label="Total Dana" 
                            value={`Rp ${formatRupiah(data.jumlah)}`} 
                            bold 
                        />
                        
                        <div className="flex items-center justify-between py-1.5 border-t border-emerald-100 dark:border-gray-800 mt-1">
                            <span className="text-gray-400 dark:text-gray-500 text-[11px]">Status</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 capitalize">
                                {data.status || 'Diproses'}
                            </span>
                        </div>
                    </div>

                    {/* TOMBOL KEMBALI KE BERANDA */}
                    <div className="absolute bottom-6 left-5 right-5 z-20">
                        <Link
                            href={typeof route !== 'undefined' ? route('mitra.dashboard') : '/mitra/dashboard'}
                            className="block w-full rounded-lg bg-[#15803d] py-3 text-xs font-semibold text-white shadow-md hover:bg-green-800 transition text-center active:bg-green-900 dark:bg-[#15803d] dark:hover:bg-green-700"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}