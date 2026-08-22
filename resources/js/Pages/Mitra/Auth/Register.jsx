import { useEffect, useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, Eye, EyeOff, Shield } from 'lucide-react';

const COUNTRIES = [
    { code: '62', name: 'Indonesia', flag: '🇮🇩' },
    { code: '60', name: 'Malaysia', flag: '🇲🇾' },
    { code: '65', name: 'Singapura', flag: '🇸🇬' },
    { code: '63', name: 'Filipina', flag: '🇵🇭' },
    { code: '66', name: 'Thailand', flag: '🇹🇭' },
    { code: '84', name: 'Vietnam', flag: '🇻🇳' },
    { code: '1', name: 'Amerika Serikat', flag: '🇺🇸' },
    { code: '44', name: 'Inggris', flag: '🇬🇧' },
    { code: '61', name: 'Australia', flag: '🇦🇺' },
];

export default function Register() {
    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [country, setCountry] = useState(COUNTRIES[0]);
    const [countryOpen, setCountryOpen] = useState(false);
    const countryRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (countryRef.current && !countryRef.current.contains(e.target)) {
                setCountryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    transform((formData) => ({
        ...formData,
        phone: formData.phone ? `${country.code}${formData.phone}` : '',
    }));

    const submit = (e) => {
        e.preventDefault();
        post(route('mitra.register.store'));
    };

    const onPhoneChange = (e) => {
        setData('phone', e.target.value.replace(/\D/g, '').slice(0, 13));
    };

    const inputBase =
        'block w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition';

    const inputClass = (field) =>
        `${inputBase} ${errors[field] ? 'border-red-400 bg-red-50 focus:ring-red-400' : 'border-transparent'}`;

    return (
        <div className="min-h-dvh bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Daftar" />

            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-y-auto bg-white sm:h-[850px] sm:shadow-xl">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 pt-4">
                    <Link
                        href={route('mitra.login')}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
                    >
                        <ChevronLeft size={22} />
                    </Link>
                    <h1 className="text-base font-semibold text-gray-900">Daftar</h1>
                </div>

                {/* Progress bar */}
                <div className="mt-3 flex gap-1 px-4">
                    <div className="h-1.5 flex-1 rounded-full bg-green-600" />
                    <div className="h-1.5 flex-1 rounded-full bg-blue-200" />
                </div>

                {/* Logo */}
                <div className="mt-6 flex flex-col items-center px-6 text-center">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                            <Shield size={18} />
                        </div>
                        <span className="text-2xl font-extrabold text-green-600">
                            Titipsini
                            <span className="text-yellow-400">&middot;</span>
                            Com
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">Tempat Yang Aman Untuk Barang Berharga Anda</p>
                </div>

                <form id="register-form" onSubmit={submit} className="mt-6 flex-1 space-y-4 px-6">
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-semibold text-gray-800">
                            Nama Lengkap
                        </label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama Lengkap"
                            className={inputClass('name')}
                        />
                        {errors.name ? (
                            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                        ) : (
                            <p className="mt-1 text-xs text-gray-400">Nama Lengkap harap sesuai KTP</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-semibold text-gray-800">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email"
                            className={inputClass('email')}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-semibold text-gray-800">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Min.8 Karakter"
                                className={`${inputClass('password')} pr-10`}
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

                    <div>
                        <label htmlFor="password_confirmation" className="mb-1 block text-sm font-semibold text-gray-800">
                            Konfirmasi Kata Sandi
                        </label>
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                type={showConfirm ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Min.8 Karakter"
                                className={`${inputClass('password_confirmation')} pr-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="mt-1 text-xs text-red-600">{errors.password_confirmation}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-gray-800">
                            Nomor Telepon
                        </label>
                        <div
                            className={`flex items-center rounded-xl border bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500 transition ${
                                errors.phone ? 'border-red-400 bg-red-50 focus-within:ring-red-400' : 'border-transparent'
                            }`}
                        >
                            <div className="relative" ref={countryRef}>
                                <button
                                    type="button"
                                    onClick={() => setCountryOpen((v) => !v)}
                                    className="flex items-center gap-1.5 border-r border-gray-200 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-l-xl"
                                >
                                    <span className="leading-none">{country.flag}</span>
                                    <span className="font-medium">+{country.code}</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </button>

                                {countryOpen && (
                                    <div className="absolute left-0 top-full z-20 mt-1 max-h-64 w-56 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                                        {COUNTRIES.map((c) => (
                                            <button
                                                key={c.code}
                                                type="button"
                                                onClick={() => {
                                                    setCountry(c);
                                                    setCountryOpen(false);
                                                }}
                                                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                                                    c.code === country.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
                                                }`}
                                            >
                                                <span>{c.flag}</span>
                                                <span className="flex-1">{c.name}</span>
                                                <span className="text-gray-400">+{c.code}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                id="phone"
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel"
                                value={data.phone}
                                onChange={onPhoneChange}
                                placeholder="8123456789"
                                className="block w-full bg-transparent px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            />
                        </div>
                        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                    </div>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <Link href={route('mitra.login')} className="font-semibold text-green-700 hover:underline">
                        Masuk disini
                    </Link>
                </p>

                <div className="sticky bottom-0 bg-white px-6 pb-6 pt-3">
                    <button
                        type="submit"
                        form="register-form"
                        disabled={processing}
                        className="w-full rounded-full bg-green-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Daftar'}
                    </button>
                </div>
            </div>
        </div>
    );
}