import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Eye, EyeOff, User, Shield, Check } from 'lucide-react';

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

export default function Daftar() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [role, setRole] = useState('customer'); // 'customer' or 'partner'
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

    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'customer',
    });

    transform((formData) => ({
        ...formData,
        phone: formData.phone ? `${country.code}${formData.phone}` : '',
        role: role,
    }));

    function handleSubmit(e) {
        e.preventDefault();
        post('/register');
    }

    const onPhoneChange = (e) => {
        setData('phone', e.target.value.replace(/\D/g, '').slice(0, 13));
    };

    const inputBase =
        'w-full rounded-lg border-none bg-slate-50 py-3 px-4 text-sm focus:ring-2 focus:ring-[#3B8F55]';

    const inputClass = (field) =>
        `${inputBase} ${errors[field] ? 'ring-2 ring-red-500 bg-red-50' : ''}`;

    const roleOptionClass = (selected) =>
        `flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
            selected
                ? 'border-[#3B8F55] bg-green-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`;

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

            {/* Role Selection */}
            <div className="mt-8 space-y-3">
                <p className="text-sm font-medium text-gray-700">Daftar sebagai:</p>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setRole('customer')}
                        className={roleOptionClass(role === 'customer')}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                role === 'customer' ? 'bg-[#3B8F55]' : 'bg-gray-100'
                            }`}>
                                <User size={20} className={role === 'customer' ? 'text-white' : 'text-gray-500'} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Customer</p>
                                <p className="text-xs text-gray-500">Menitipkan barang</p>
                            </div>
                        </div>
                        {role === 'customer' && <Check className="ml-auto text-[#3B8F55]" size={20} />}
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('partner')}
                        className={roleOptionClass(role === 'partner')}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                role === 'partner' ? 'bg-[#3B8F55]' : 'bg-gray-100'
                            }`}>
                                <Shield size={20} className={role === 'partner' ? 'text-white' : 'text-gray-500'} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Mitra</p>
                                <p className="text-xs text-gray-500">Menyediakan tempat titipan</p>
                            </div>
                        </div>
                        {role === 'partner' && <Check className="ml-auto text-[#3B8F55]" size={20} />}
                    </button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Name field - only for Mitra */}
                {role === 'partner' && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">
                            <span className="text-red-500">*</span>Nama Lengkap
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama Lengkap (sesuai KTP)"
                            className={inputClass('name')}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                        <span className="text-red-500">*</span>Email
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Email"
                        className={inputClass('email')}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Phone field - only for Mitra */}
                {role === 'partner' && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">
                            <span className="text-red-500">*</span>Nomor Telepon
                        </label>
                        <div
                            className={`flex items-center rounded-lg border bg-slate-50 focus-within:ring-2 focus-within:ring-[#3B8F55] transition ${
                                errors.phone ? 'ring-2 ring-red-500 bg-red-50' : ''
                            }`}
                        >
                            <div className="relative" ref={countryRef}>
                                <button
                                    type="button"
                                    onClick={() => setCountryOpen((v) => !v)}
                                    className="flex items-center gap-1.5 border-r border-gray-200 px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-l-lg"
                                >
                                    <span className="leading-none">{country.flag}</span>
                                    <span className="font-medium">+{country.code}</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </button>

                                {countryOpen && (
                                    <div className="absolute left-0 top-full z-20 mt-1 max-h-64 w-56 overflow-y-auto rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
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
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel"
                                value={data.phone}
                                onChange={onPhoneChange}
                                placeholder="8123456789"
                                className="w-full bg-transparent px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            />
                        </div>
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                        <span className="text-red-500">*</span>Kata Sandi
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Min. 8 Karakter"
                            className={`${inputClass('password')} pr-10`}
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
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                        <span className="text-red-500">*</span>Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Min. 8 Karakter"
                            className={`${inputClass('password_confirmation')} pr-10`}
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
                    className="w-full rounded-lg bg-[#3B8F55] py-3 text-sm font-semibold text-white transition hover:bg-[#2d6d3f] disabled:opacity-60 mt-2"
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