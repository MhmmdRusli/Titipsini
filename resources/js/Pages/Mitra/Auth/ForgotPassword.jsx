import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

export default function ForgotPassword() {
    const { props } = usePage();
    const status = props.flash?.status;

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    // Cek apakah field email sudah terisi
    const isFilled = data.email.trim().length > 0;

    const submit = (e) => {
        e.preventDefault();
        post(route('mitra.password.email'));
    };

    return (
        <div className="min-h-dvh bg-gray-100 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Lupa Kata Sandi" />

            {/* Frame Utama (Ukuran HP) */}
            <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white sm:min-h-[850px] sm:shadow-xl">
                
                {/* Header Top Bar dengan Back Button & Judul */}
                <div 
                    className="flex items-center justify-between border-b border-gray-100 px-4 py-3"
                    style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
                >
                    <Link 
                        href={route('mitra.login')} 
                        className="flex items-center justify-center p-1 text-gray-800 hover:opacity-70 active:bg-gray-50 rounded-lg"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </Link>
                    <h2 className="text-base font-bold text-gray-900">Lupa Kata Sandi</h2>
                    <div className="w-6" /> {/* Spacer Penyeimbang */}
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
                    
                    {/* Logo Header Titipsini */}
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <img 
                            src="/images/logo-titipsini.png" 
                            alt="Logo" 
                            className="h-8 w-auto object-contain" 
                        />
                        <span className="text-xl font-extrabold tracking-tight text-[#15803d]">
                            Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                        </span>
                    </div>

                    {/* Ilustrasi Gambar Lupa Kata Sandi */}
                    <div className="my-2 flex justify-center">
                        <img 
                            src="/images/laptop-kuning.png" 
                            alt="Lupa Kata Sandi" 
                            className="h-40 w-auto object-contain"
                        />
                    </div>

                    {/* Judul & Deskripsi Utama */}
                    <div className="text-center mt-2 mb-6">
                        <h1 className="text-lg font-bold text-gray-900">Lupa Kata Sandi</h1>
                        <p className="mt-1 text-xs text-gray-400 font-medium leading-relaxed px-2">
                            Masukkan email yang Kamu gunakan pada saat mendaftar dan kami akan mengirimkan instruksi reset kata sandi ke email Kamu
                        </p>
                    </div>

                    {/* Form Input Email */}
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-gray-800">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email"
                                className={`block w-full rounded-xl bg-[#f4f7fc] px-4 py-3 text-sm placeholder-gray-400 text-gray-900 transition-all focus:outline-none ${
                                    errors.email
                                        ? 'border border-red-400 ring-1 ring-red-400'
                                        : data.email
                                        ? 'border border-green-500 ring-1 ring-green-500'
                                        : 'border border-transparent focus:ring-2 focus:ring-green-500/30'
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-[11px] font-medium text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Tombol Kirim */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 mt-6 ${
                                isFilled 
                                    ? 'bg-[#237737] hover:bg-[#1c602c]' 
                                    : 'bg-[#15803d] hover:bg-[#166534]'
                            }`}
                        >
                            Kirim
                        </button>
                    </form>

                </div>

                {/* MODAL POPUP: Cek Email Kamu (Muncul jika email berhasil dikirim / status tersedia) */}
                {status && (
                    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 p-4 transition-all">
                        <div className="w-full rounded-2xl bg-white p-6 text-center shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-4">
                            
                            {/* Icon / Ilustrasi Amplop Mail */}
                            <div className="my-2 flex justify-center">
                                <img 
                                    src="/images/email.png" 
                                    alt="Cek Email" 
                                    className="h-20 w-auto object-contain"
                                />
                            </div>

                            <h3 className="mt-3 text-base font-bold text-gray-900">
                                Cek Email Kamu
                            </h3>
                            
                            <p className="mt-1 text-xs text-gray-400 font-medium leading-relaxed px-4">
                                Mohon periksa email Kamu. Instruksi untuk melakukan reset kata sandi telah kami kirimkan.
                            </p>

                            <Link
                                href={route('mitra.login')}
                                className="mt-6 block w-full rounded-xl bg-[#15803d] py-3 text-sm font-bold text-white transition-all hover:bg-[#166534] active:scale-[0.99]"
                            >
                                Lanjutkan
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}