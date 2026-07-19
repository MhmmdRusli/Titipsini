import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeft, Mail, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

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

                {/* Header dengan Link Kembali ke Onboarding */}
                <div
                    className="flex items-center justify-between border-b border-gray-100 px-4 pb-4"
                    style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
                >
                    {/* Mengubah button menjadi Link Inertia */}
                    <Link 
                        href="/" // Sesuaikan dengan route halaman onboarding Anda (misal '/' atau '/onboarding')
                        className="text-gray-800 hover:opacity-70 flex items-center justify-center p-1 rounded-lg active:bg-gray-50"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </Link>
                    <h2 className="text-base font-bold text-gray-900">Masuk</h2>
                    <div className="w-6"></div> {/* Spacer penyeimbang */}
                </div>

                {/* Konten Utama */}
                <div className="flex-1 overflow-y-auto px-6 pt-10 pb-8">
                    
                    {/* Logo Image dan Teks Berdampingan */}
                    <div className="mb-10 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center justify-center gap-3">
                            <img
                                src="/images/logo-titipsini.png"
                                alt="Logo Icon"
                                className="h-10 w-auto object-contain"
                            />
                            <div className="text-2xl font-bold tracking-tight text-[#15803d]">
                                Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium tracking-wide mt-2.5">
                            Tempat Terbaik untuk Barang Berharga Anda
                        </p>
                    </div>

                    {/* Form Login */}
                    <form onSubmit={submit} className="space-y-5">
                        {/* Input Email */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="text-red-500 mr-0.5">*</span>Email
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <Mail size={16} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full rounded-xl border-none bg-[#f4f7fc] pl-11 pr-4 py-3.5 text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 transition-all ${
                                        errors.email ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            {errors.email && <p className="text-xs font-medium text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Input Password */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="text-red-500 mr-0.5">*</span>Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 8 Karakter"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full rounded-xl border-none bg-[#f4f7fc] px-4 py-3.5 text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 transition-all ${
                                        errors.password ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs font-medium text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Lupa Kata Sandi */}
                        <div className="text-right">
                            <Link href="/forgot-password" className="text-xs font-semibold text-[#16a34a] hover:underline">
                                Lupa Kata Sandi?
                            </Link>
                        </div>

                        {/* Tombol Submit Utama */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#166534] active:scale-[0.99] disabled:opacity-50 mt-2 shadow-sm"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    {/* Footer Pendaftaran */}
                    <div className="mt-8 text-center text-xs text-gray-400 font-medium">
                        Belum punya akun?{' '}
                        <Link href="/register" className="font-bold text-[#15803d] hover:underline">
                            Daftar disini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}