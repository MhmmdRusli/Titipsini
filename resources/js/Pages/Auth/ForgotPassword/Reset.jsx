import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

export default function Reset() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const rules = [
        { label: 'Minimal 12 karakter', test: (v) => v.length >= 12 },
        { label: 'Mengandung huruf besar', test: (v) => /[A-Z]/.test(v) },
        { label: 'Mengandung huruf kecil', test: (v) => /[a-z]/.test(v) },
        { label: 'Mengandung angka', test: (v) => /\d/.test(v) },
    ];

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password/reset');
    };

    return (
        <div className="min-h-dvh bg-gray-100 sm:flex sm:items-center sm:justify-center sm:py-6">
            <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white sm:min-h-[850px] sm:shadow-xl">
                <Head title="Buat Kata Sandi Baru" />

                <div
                    className="flex items-center justify-between border-b border-gray-100 px-4 pb-4"
                    style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
                >
                    <Link
                        href="/forgot-password/verify"
                        className="text-gray-800 hover:opacity-70 flex items-center justify-center p-1 rounded-lg active:bg-gray-50"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </Link>
                    <h2 className="text-base font-bold text-gray-900">Kata Sandi Baru</h2>
                    <div className="w-6"></div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pt-10 pb-8">
                    <div className="mb-8 flex flex-col items-center justify-center text-center">
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
                        <p className="text-[13px] text-gray-500 font-medium mt-4 leading-relaxed">
                            Buat kata sandi baru yang kuat dan mudah kamu ingat.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="text-red-500 mr-0.5">*</span>Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 12 Karakter"
                                    autoComplete="new-password"
                                    name="f_pw_new"
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

                            <ul className="mt-2 space-y-1">
                                {rules.map((rule) => {
                                    const passed = rule.test(data.password);
                                    return (
                                        <li
                                            key={rule.label}
                                            className={`text-xs flex items-center gap-1.5 ${
                                                passed ? 'text-[#15803d]' : 'text-gray-400'
                                            }`}
                                        >
                                            <span>{passed ? '✓' : '•'}</span>
                                            {rule.label}
                                        </li>
                                    );
                                })}
                            </ul>

                            {errors.password && <p className="text-xs font-medium text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="text-red-500 mr-0.5">*</span>Konfirmasi Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Ulangi kata sandi baru"
                                    autoComplete="new-password"
                                    name="f_pw_confirm"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className={`w-full rounded-xl border-none bg-[#f4f7fc] px-4 py-3.5 text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 transition-all ${
                                        errors.password_confirmation ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-xs font-medium text-red-500 mt-1">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#166534] active:scale-[0.99] disabled:opacity-50 mt-2 shadow-sm"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}