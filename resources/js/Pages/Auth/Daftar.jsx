import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Daftar() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/register');
    }

    const Label = ({ children }) => (
        <label className="mb-1 block text-sm font-medium text-gray-900">
            <span className="text-red-500">*</span>{children}
        </label>
    );

    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white px-6">
            <Head title="Daftar" />

            {/* Header */}
            <div className="flex items-center gap-3 pt-6 relative">
                <Link href="/login" className="text-gray-900 absolute left-0">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="w-full text-center text-lg font-semibold text-gray-900">Daftar</h1>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100">
                <div className="h-1.5 w-1/4 rounded-full bg-[#3B8F55]" />
            </div>

            {/* Logo Area */}
            <div className="mt-8 flex flex-col items-center">
                <div className="flex items-center gap-2">
                    <img 
                        src="/images/logo-titipsini.png" 
                        alt="Logo Titipsini" 
                        className="h-8 w-auto object-contain"
                    />
                    <span className="text-xl font-extrabold text-[#3B8F55] tracking-tight">
                        Titipsini<span className="text-yellow-400">●</span>Com
                    </span>
                </div>
                <p className="mt-1 text-center text-[10px] text-gray-400">
                    Tempat Yang Aman Untuk Barang Berharga Anda
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                    <Label>Email</Label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Email"
                        className="w-full rounded-lg border-none bg-slate-50 py-3 px-4 text-sm focus:ring-2 focus:ring-[#3B8F55]"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <Label>Kata Sandi</Label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Min. 8 Karakter"
                            className="w-full rounded-lg border-none bg-slate-50 py-3 px-4 text-sm focus:ring-2 focus:ring-[#3B8F55]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                <div>
                    <Label>Konfirmasi Kata Sandi</Label>
                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Min. 8 Karakter"
                            className="w-full rounded-lg border-none bg-slate-50 py-3 px-4 text-sm focus:ring-2 focus:ring-[#3B8F55]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-[#3B8F55] py-3 text-sm font-semibold text-white transition hover:bg-[#2d6d3f] disabled:opacity-60"
                >
                    {processing ? 'Memproses...' : 'Lanjutkan'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-semibold text-[#3B8F55]">
                    Masuk disini
                </Link>
            </p>
        </div>
    );
}