import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { ArrowLeft, UserCog, Wallet, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const BASE_PATH = '/super-admin/user/tambah';

const ROLE_OPTIONS = [
    {
        value: 'finance',
        label: 'Finance',
        desc: 'Akses laporan keuangan & penarikan saldo',
        icon: Wallet,
    },
    {
        value: 'admin',
        label: 'Admin',
        desc: 'Akses verifikasi pengguna & operasional',
        icon: UserCog,
    },
];

export default function AccountCreate() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'finance',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post(BASE_PATH);
    }

    const inputClass = (hasError) => `
        w-full rounded-xl border bg-slate-50 dark:bg-gray-800 px-4 py-3 text-sm
        text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
        transition-all focus:outline-none focus:ring-2
        ${
            hasError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-transparent focus:border-green-700 focus:ring-green-700/20 dark:focus:border-green-500'
        }
    `;

    return (
        <SuperAdminLayout title="Tambah Akun">
            <Head title="Tambah Akun" />

            {/* Lebar dinaikkan ke max-w-3xl agar white space samping berkurang */}
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/super-admin/user/customer"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>

                <form
                    onSubmit={submit}
                    className="rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 sm:p-8 shadow-sm"
                >
                    <h2 className="text-base font-bold text-slate-900 dark:text-gray-100">Detail Akun Baru</h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                        Akun ini hanya untuk staf internal (Finance / Admin). Customer dan Vendor mendaftar sendiri lewat aplikasi.
                    </p>

                    <div className="mt-6 flex flex-col gap-5">
                        {/* Role Selector */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">
                                Role
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {ROLE_OPTIONS.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = data.role === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setData('role', option.value)}
                                            className={`relative flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all ${
                                                isSelected
                                                    ? 'border-green-700 bg-green-50/60 dark:bg-green-950/30 ring-2 ring-green-700/20'
                                                    : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-slate-300 dark:hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <Icon
                                                    size={20}
                                                    className={isSelected ? 'text-green-700 dark:text-green-400' : 'text-slate-400 dark:text-gray-500'}
                                                />
                                                {isSelected && <CheckCircle2 size={18} className="text-green-700 dark:text-green-400" />}
                                            </div>
                                            <span className={`text-sm font-semibold ${isSelected ? 'text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-gray-200'}`}>
                                                {option.label}
                                            </span>
                                            <span className="text-xs leading-relaxed text-slate-500 dark:text-gray-400">
                                                {option.desc}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.role && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.role}</p>}
                        </div>

                        {/* Layout 2 Kolom untuk Nama & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Nama Lengkap */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={inputClass(errors.name)}
                                />
                                {errors.name && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">
                                    Email
                                </label>
                                    <input
                                        type="email"
                                        placeholder="nama@titipsini.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`${inputClass(errors.email)} prevent-white-autofill`}
                                    />
                                {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Nomor Telepon */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">
                                Nomor Telepon <span className="normal-case font-normal text-slate-400">(opsional)</span>
                            </label>
                            <input
                                type="tel"
                                inputMode="numeric"
                                placeholder="08xxxxxxxxxx"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value.replace(/\D/g, ''))}
                                className={inputClass(errors.phone)}
                            />
                            {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.phone}</p>}
                        </div>

                        {/* Layout 2 Kolom untuk Password & Konfirmasi Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Password */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Minimal 8 karakter"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`${inputClass(errors.password)} pr-10 prevent-white-autofill`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password}</p>}
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400">
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="Ulangi password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={`${inputClass(errors.password_confirmation)} pr-10 prevent-white-autofill`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((s) => !s)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto rounded-xl bg-green-700 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 px-8 py-3 text-sm font-bold text-white shadow-sm transition-colors disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : `Buat Akun ${data.role === 'admin' ? 'Admin' : 'Finance'}`}
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}