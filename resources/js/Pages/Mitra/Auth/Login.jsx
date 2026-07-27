import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        identifier: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    // Cek apakah kedua field sudah terisi
    const isFilled = data.identifier.trim().length > 0 && data.password.trim().length > 0;

    const submit = (e) => {
        e.preventDefault();
        post(route('mitra.login.store'));
    };

    return (
        <div className="min-h-dvh bg-gray-100 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Masuk" />

            {/* Bingkai HP / Mobile Layout */}
            <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white sm:min-h-[850px] sm:shadow-xl">
                
                {/* Header Top Bar */}
                <div 
                    className="flex items-center justify-between border-b border-gray-100 px-4 py-3"
                    style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
                >
                    <Link 
                        href="/" 
                        className="flex items-center justify-center p-1 text-gray-800 hover:opacity-70"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </Link>
                    <h2 className="text-base font-bold text-gray-900">Masuk</h2>
                    <div className="w-6" /> {/* Spacer Penyeimbang */}
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8">
                    
                    {/* Branding Logo Titipsini */}
                    <div className="mb-8 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center justify-center gap-2">
                            <img 
                                src="/images/logo-titipsini.png" 
                                alt="Logo" 
                                className="h-9 w-auto object-contain" 
                            />
                            <span className="text-2xl font-extrabold tracking-tight text-[#15803d]">
                                Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                            </span>
                        </div>
                        <p className="mt-1 text-[10px] font-medium tracking-wide text-gray-400">
                            tempat terbaik untuk barang berharga Anda
                        </p>
                    </div>

                    {/* Form Login */}
                    <form onSubmit={submit} className="space-y-4">
                        
                        {/* Field Email/No Telp */}
                        <div>
                            <label htmlFor="identifier" className="mb-1.5 block text-xs font-semibold text-gray-800">
                                Email/No Telp
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                autoComplete="username"
                                value={data.identifier}
                                onChange={(e) => setData('identifier', e.target.value)}
                                placeholder="Email"
                                className={`block w-full rounded-xl bg-[#f4f7fc] px-4 py-3 text-sm placeholder-gray-400 text-gray-900 transition-all focus:outline-none ${
                                    errors.identifier
                                        ? 'border border-red-400 ring-1 ring-red-400'
                                        : data.identifier
                                        ? 'border border-green-500 ring-1 ring-green-500'
                                        : 'border border-transparent focus:ring-2 focus:ring-green-500/30'
                                }`}
                            />
                            {errors.identifier && (
                                <p className="mt-1 text-[11px] font-medium text-red-500">
                                    {errors.identifier}
                                </p>
                            )}
                        </div>

                        {/* Field Kata Sandi */}
                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-gray-800">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min:8 Karakter"
                                    className={`block w-full rounded-xl bg-[#f4f7fc] px-4 py-3 pr-10 text-sm placeholder-gray-400 text-gray-900 transition-all focus:outline-none ${
                                        errors.password
                                            ? 'border border-red-400 ring-1 ring-red-400'
                                            : data.password
                                            ? 'border border-green-500 ring-1 ring-green-500'
                                            : 'border border-transparent focus:ring-2 focus:ring-green-500/30'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400 hover:text-gray-600"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            
                            {/* Error Msg & Link Lupa Kata Sandi */}
                            <div className="mt-1.5 flex items-center justify-between min-h-[18px]">
                                {errors.password ? (
                                    <p className="text-[11px] font-medium text-red-500">
                                        {errors.password}
                                    </p>
                                ) : (
                                    <div />
                                )}
                                <Link 
                                    href={route('mitra.password.request')} 
                                    className="ml-auto text-xs font-medium text-[#237737] hover:underline"
                                >
                                    Lupa Kata Sandi?
                                </Link>
                            </div>
                        </div>

                        {/* Tombol Masuk */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 mt-6 ${
                                isFilled 
                                    ? 'bg-[#237737] hover:bg-[#1c602c]' 
                                    : 'bg-[#94b395] hover:bg-[#85a586]'
                            }`}
                        >
                            Masuk
                        </button>
                    </form>

                    {/* Footer Register Link */}
                    <p className="mt-6 text-center text-xs font-medium text-gray-500">
                        Belum punya akun?{' '}
                        <Link 
                            href={route('mitra.register')} 
                            className="font-bold text-[#237737] hover:underline"
                        >
                            Daftar disini
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}