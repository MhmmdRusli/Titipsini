import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle2, ChevronLeft, Eye, EyeOff, Mail } from 'lucide-react';

/**
 * Halaman login tunggal untuk Customer dan Mitra.
 *
 * Satu form, satu endpoint (POST /login). Role user ditentukan di server
 * (App\Http\Controllers\Auth\AuthenticatedSessionController) yang lalu
 * mengarahkan ke dashboard sesuai role:
 *   - role customer -> /app/dashboard
 *   - role partner  -> /mitra/dashboard
 */
export default function Login() {
    const { flash } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        identifier: '',
        password: '',
    });

    const isFilled = data.identifier.trim().length > 0 && data.password.trim().length > 0;

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        // Backdrop abu-abu di layar lebar (desktop)
        <div className="min-h-dvh bg-gray-100 sm:flex sm:items-center sm:justify-center sm:py-6">
            {/* Bodi Aplikasi Mobile */}
            <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white sm:min-h-[850px] sm:shadow-xl">
                <Head title="Masuk" />

                {/* Header dengan Link Kembali */}
                <div
                    className="flex items-center justify-between border-b border-gray-100 px-4 pb-4"
                    style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
                >
                    <Link
                        href="/"
                        className="flex items-center justify-center rounded-lg p-1 text-gray-800 hover:opacity-70 active:bg-gray-50"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </Link>
                    <h2 className="text-base font-bold text-gray-900">Masuk</h2>
                    <div className="w-6" />
                </div>

                {/* Konten Utama */}
                <div className="flex-1 overflow-y-auto px-6 pt-10 pb-8">
                    {/* Logo Image dan Teks Berdampingan */}
                    <div className="mb-8 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center justify-center gap-3">
                            <img
                                src="/images/logo-titipsini.png"
                                alt="Logo Titipsini"
                                className="h-10 w-auto object-contain"
                            />
                            <div className="text-2xl font-bold tracking-tight text-[#15803d]">
                                Titipsini<span className="mx-0.5 text-[#fbbf24]">•</span>Com
                            </div>
                        </div>
                        <p className="mt-2.5 text-[10px] font-medium tracking-wide text-gray-400">
                            Tempat Terbaik untuk Barang Berharga Anda
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="mb-5 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3.5 py-3">
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                            <p className="flex-1 text-sm text-green-800">{flash.success}</p>
                        </div>
                    )}

                    <p className="mb-6 text-center text-xs leading-relaxed text-gray-500">
                        Masuk untuk akun Customer maupun Mitra.
                    </p>

                    {/* Form Login */}
                    <form onSubmit={submit} className="space-y-5">
                        {/* Input Email / Nomor Telepon */}
                        <div className="space-y-1.5">
                            <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700">
                                <span className="mr-0.5 text-red-500">*</span>Email/No Telp
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <Mail size={16} />
                                </span>
                                <input
                                    id="identifier"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="Email atau Nomor Telepon"
                                    value={data.identifier}
                                    onChange={(e) => setData('identifier', e.target.value)}
                                    className={`w-full rounded-xl border-none bg-[#f4f7fc] py-3.5 pr-4 pl-11 text-sm text-gray-800 placeholder-gray-400 transition-all focus:ring-2 focus:ring-[#15803d]/30 focus:outline-none ${
                                        errors.identifier ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            {errors.identifier && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.identifier}</p>
                            )}
                        </div>

                        {/* Input Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                <span className="mr-0.5 text-red-500">*</span>Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="Min. 8 Karakter"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full rounded-xl border-none bg-[#f4f7fc] px-4 py-3.5 pr-11 text-sm text-gray-800 placeholder-gray-400 transition-all focus:ring-2 focus:ring-[#15803d]/30 focus:outline-none ${
                                        errors.password ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Lupa Kata Sandi */}
                        <div className="text-right">
                            <Link
                                href="/forgot-password"
                                className="text-xs font-semibold text-[#16a34a] hover:underline"
                            >
                                Lupa Kata Sandi?
                            </Link>
                        </div>

                        {/* Tombol Submit Utama */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`mt-2 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 ${
                                isFilled ? 'bg-[#15803d] hover:bg-[#166534]' : 'bg-[#15803d]/60 hover:bg-[#15803d]'
                            }`}
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    {/* Footer Pendaftaran */}
                    <div className="mt-8 space-y-2 text-center text-xs font-medium text-gray-400">
                        <p>
                            Belum punya akun?{' '}
                            <Link href="/register" className="font-bold text-[#15803d] hover:underline">
                                Daftar disini
                            </Link>
                        </p>
                        <p>
                            Punya lahan untuk disewakan?{' '}
                            <Link href="/mitra/daftar" className="font-bold text-[#15803d] hover:underline">
                                Daftar Jadi Mitra
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
