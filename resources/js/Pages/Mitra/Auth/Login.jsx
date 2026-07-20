import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Handshake } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        identifier: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const isFilled = data.identifier.trim().length > 0 && data.password.trim().length > 0;

    const submit = (e) => {
        e.preventDefault();
        post(route('mitra.login.store'));
    };

    return (
        <div className="min-h-dvh bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Masuk Mitra" />

            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-y-auto bg-white px-6 py-8 sm:h-[850px] sm:shadow-xl">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        <Handshake size={20} />
                    </div>
                    <span className="font-mono text-xs tracking-widest text-green-600">TITIPSINI &middot; MITRA</span>
                </div>

                <h1 className="mt-6 text-xl font-bold text-gray-900">Masuk ke Akun Mitra</h1>
                <p className="mt-1 text-sm text-gray-500">Kelola bisnis penitipanmu dari sini.</p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="identifier" className="mb-1 block text-sm font-medium text-gray-700">
                            Email atau Nomor Telepon
                        </label>
                        <input
                            id="identifier"
                            type="text"
                            autoComplete="username"
                            value={data.identifier}
                            onChange={(e) => setData('identifier', e.target.value)}
                            placeholder="nama@email.com atau 08xxxxxxxxxx"
                            className={`block w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.identifier ? 'border-red-400' : 'border-gray-300'
                            }`}
                        />
                        {errors.identifier && <p className="mt-1 text-xs text-red-600">{errors.identifier}</p>}
                    </div>

                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Kata Sandi
                            </label>
                            <Link href={route('mitra.password.request')} className="text-xs font-medium text-green-700 hover:underline">
                                Lupa Kata Sandi?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan kata sandi"
                                className={`block w-full rounded-lg border px-3 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    errors.password ? 'border-red-400' : 'border-gray-300'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full rounded-full py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                            isFilled ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-300'
                        }`}
                    >
                        Masuk
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Belum punya akun mitra?{' '}
                    <Link href={route('mitra.register')} className="font-semibold text-green-700 hover:underline">
                        Daftar
                    </Link>
                </p>
            </div>
        </div>
    );
}