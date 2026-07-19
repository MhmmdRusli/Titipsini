import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

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

    function fieldClass(hasError) {
        return `w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-1 ${
            hasError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-brand-teal-500 focus:ring-brand-teal-500'
        }`;
    }

    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white px-6">
            <Head title="Daftar" />

            <div className="flex items-center gap-3 pt-6">
                <Link href="/" className="text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-base font-semibold text-gray-900">Daftar</h1>
            </div>

            <div className="mt-2 h-1 w-full rounded-full bg-gray-100">
                <div className="h-1 w-1/2 rounded-full bg-brand-teal-600" />
            </div>

            <div className="mt-8 flex flex-col items-center">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-brand-teal-600" />
                    <span className="text-base font-semibold text-gray-900">
                        Titipsini<span className="text-brand-teal-600">•</span>Com
                    </span>
                </div>
                <p className="mt-1 text-center text-xs text-gray-400">
                    Tempat Yang Aman Untuk Barang Berharga Anda
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex-1 space-y-4">
                <div>
                    <label className="mb-1 block text-sm text-gray-700">Email</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email"
                            className={fieldClass(errors.email)}
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-700">Kata Sandi</label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Min. 8 Karakter"
                            className={fieldClass(errors.password)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-700">Konfirmasi Kata Sandi</label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Min. 8 Karakter"
                            className={fieldClass(errors.password_confirmation)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-brand-teal-700 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                    Lanjutkan
                </button>
            </form>

            <p className="pb-8 text-center text-sm text-gray-500">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-medium text-brand-teal-700">
                    Masuk disini
                </Link>
            </p>
        </div>
    );
}   