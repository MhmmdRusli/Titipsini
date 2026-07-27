import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Cek apakah kedua field sandi terisi
    const isFilled =
        data.password.trim().length > 0 &&
        data.password_confirmation.trim().length > 0;

    const submit = (e) => {
        e.preventDefault();
        post(route('mitra.password.update'));
    };

    return (
        <div className="min-h-dvh bg-gray-100 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Lupa Kata Sandi" />

            {/* Frame Utama (Ukuran Tampilan HP) */}
            <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white sm:min-h-[850px] sm:shadow-xl">
                
                {/* Header Top Bar dengan Back Button & Title */}
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
                    <div className="w-6" /> {/* Penyeimbang Header */}
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8">
                    
                    {/* Branding Logo Header */}
                    <div className="mb-8 flex items-center justify-center gap-2">
                        <img 
                            src="/images/logo-titipsini.png" 
                            alt="Logo" 
                            className="h-8 w-auto object-contain" 
                        />
                        <span className="text-xl font-extrabold tracking-tight text-[#15803d]">
                            Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                        </span>
                    </div>

                    {/* Form Reset Password */}
                    <form onSubmit={submit} className="space-y-4">
                        
                        {/* Input Kata Sandi Baru */}
                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-gray-800">
                                Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Kata Sandi Baru"
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
                            {errors.password && (
                                <p className="mt-1.5 text-[11px] font-medium text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Input Konfirmasi Kata Sandi Baru */}
                        <div>
                            <label htmlFor="password_confirmation" className="mb-1.5 block text-xs font-semibold text-gray-800">
                                Konfirmasi Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    type={showConfirm ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Konfirmasi Kata Sandi Baru"
                                    className={`block w-full rounded-xl bg-[#f4f7fc] px-4 py-3 pr-10 text-sm placeholder-gray-400 text-gray-900 transition-all focus:outline-none ${
                                        errors.password_confirmation
                                            ? 'border border-red-400 ring-1 ring-red-400'
                                            : data.password_confirmation
                                            ? 'border border-green-500 ring-1 ring-green-500'
                                            : 'border border-transparent focus:ring-2 focus:ring-green-500/30'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400 hover:text-gray-600"
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1.5 text-[11px] font-medium text-red-500">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        {/* Tombol Ubah Kata Sandi */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 mt-6 ${
                                isFilled 
                                    ? 'bg-[#237737] hover:bg-[#1c602c]' 
                                    : 'bg-[#237737]/80 hover:bg-[#237737]'
                            }`}
                        >
                            Ubah Kata Sandi
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}