import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function CourierIllustration() {
    return (
        <svg viewBox="0 0 400 400" className="w-full max-w-sm mx-auto">
            {/* decorative dot grid */}
            <defs>
                <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="#ffffff" opacity="0.35" />
                </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#dots)" />

            {/* soft circles */}
            <circle cx="80" cy="90" r="46" fill="#ffffff" opacity="0.12" />
            <circle cx="330" cy="300" r="60" fill="#ffffff" opacity="0.1" />

            {/* scooter */}
            <g transform="translate(150,230)">
                <ellipse cx="60" cy="105" rx="110" ry="10" fill="#0b3b36" opacity="0.25" />
                <circle cx="10" cy="95" r="24" fill="#0f172a" />
                <circle cx="10" cy="95" r="10" fill="#e5e7eb" />
                <circle cx="120" cy="95" r="24" fill="#0f172a" />
                <circle cx="120" cy="95" r="10" fill="#e5e7eb" />
                <rect x="0" y="55" width="130" height="30" rx="12" fill="#0d9488" />
                <rect x="95" y="20" width="14" height="45" rx="6" fill="#0f172a" />
                <rect x="80" y="12" width="44" height="12" rx="6" fill="#0f172a" />
                <rect x="20" y="35" width="46" height="26" rx="8" fill="#f59e0b" />
            </g>

            {/* courier person */}
            <g transform="translate(70,110)">
                <circle cx="45" cy="20" r="18" fill="#fcd9b8" />
                <rect x="30" y="6" width="30" height="14" rx="7" fill="#0f766e" />
                <rect x="18" y="40" width="54" height="70" rx="16" fill="#0d9488" />
                <rect x="10" y="45" width="16" height="50" rx="8" fill="#0d9488" />
                <rect x="74" y="45" width="16" height="50" rx="8" fill="#0d9488" />
                <rect x="24" y="105" width="18" height="45" rx="8" fill="#1f2937" />
                <rect x="48" y="105" width="18" height="45" rx="8" fill="#1f2937" />
                {/* box being carried */}
                <rect x="4" y="60" width="34" height="34" rx="4" fill="#f59e0b" />
                <line x1="4" y1="77" x2="38" y2="77" stroke="#b45309" strokeWidth="2" />
                <line x1="21" y1="60" x2="21" y2="94" stroke="#b45309" strokeWidth="2" />
            </g>
        </svg>
    );
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const isValid = data.email.length > 3 && data.password.length > 0;

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="flex min-h-screen">
            <Head title="Login Admin" />

            {/* Left panel */}
            <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-teal-700 to-brand-teal-900 p-10 lg:flex overflow-hidden relative">
                <div className="flex items-center gap-2 text-white">
                    <span className="font-mono text-xs tracking-widest">🔒 TITIPSINI.COM</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <CourierIllustration />
                </div>
                <p className="text-white/70 text-xs">Panel Admin &mdash; Titipsini.com</p>
            </div>

            {/* Right panel */}
            <div className="flex w-full items-center justify-center bg-gray-50 px-6 lg:w-1/2">
                <div className="w-full max-w-sm">
                    <h1 className="text-xl font-semibold text-gray-900">Login Admin</h1>
                    <p className="mt-1 text-sm text-gray-500">Masuk untuk mengelola platform Titipsini.</p>

                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Masukkan email admin"
                                className={`mt-1 w-full rounded-lg text-sm ${
                                    errors.email
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-brand-teal-500 focus:ring-brand-teal-500'
                                }`}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan kata sandi"
                                    className={`w-full rounded-lg text-sm pr-10 ${
                                        errors.password
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-brand-teal-500 focus:ring-brand-teal-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                        </div>

                        <div className="text-right">
                            <Link href="/admin/forgot-password" className="text-xs font-medium text-brand-teal-700 hover:underline">
                                Lupa kata sandi?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
                                isValid ? 'bg-brand-teal-700 hover:bg-brand-teal-600' : 'bg-gray-300'
                            }`}
                        >
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}