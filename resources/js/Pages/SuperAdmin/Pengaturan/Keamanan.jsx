import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

export default function Keamanan({ remainingChanges = 2 }) {
    const { data, setData, put, processing, errors, recentlySuccessful, reset } = useForm({
        kata_sandi_lama: '',
        kata_sandi_baru: '',
        kata_sandi_baru_confirmation: '',
    });

    const [show, setShow] = useState({
        lama: false,
        baru: false,
        konfirmasi: false,
    });

    const toggle = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));

    const submit = (e) => {
        e.preventDefault();
        put(route('super-admin.pengaturan.keamanan.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const fields = [
        { key: 'lama', name: 'kata_sandi_lama', label: 'Kata sandi lama', autoComplete: 'current-password' },
        { key: 'baru', name: 'kata_sandi_baru', label: 'Kata sandi baru', autoComplete: 'new-password' },
        { key: 'konfirmasi', name: 'kata_sandi_baru_confirmation', label: 'Konfirmasi kata sandi baru', autoComplete: 'new-password' },
    ];

    const limitReached = remainingChanges <= 0;

    return (
        <SuperAdminLayout title="Keamanan">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* ============ FORM GANTI KATA SANDI ============ */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-gray-800 dark:bg-[#111827] lg:col-span-2 transition-colors">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800/50 dark:text-emerald-400">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-gray-100">Ganti kata sandi</h2>
                            <p className="text-xs text-slate-500 dark:text-gray-400">Gunakan kata sandi yang kuat dan tidak dipakai di tempat lain.</p>
                        </div>
                    </div>

                    {/* Notice batas ganti password */}
                    <div
                        className={`mb-5 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors ${
                            limitReached
                                ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                        }`}
                    >
                        <AlertTriangle size={14} className="shrink-0" />
                        {limitReached
                            ? 'Anda sudah mencapai batas maksimal 2 kali ganti kata sandi dalam 24 jam. Coba lagi nanti.'
                            : `Anda masih bisa mengganti kata sandi ${remainingChanges}x lagi dalam 24 jam ke depan.`}
                    </div>

                    {recentlySuccessful && (
                        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                            ✓ Kata sandi berhasil diubah!
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {fields.map(({ key, name, label, autoComplete }) => (
                            <div key={name}>
                                <label htmlFor={name} className="mb-1 block text-xs font-medium text-slate-700 dark:text-gray-300">
                                    {label}
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        id={name}
                                        type={show[key] ? 'text' : 'password'}
                                        autoComplete={autoComplete}
                                        value={data[name]}
                                        onChange={(e) => setData(name, e.target.value)}
                                        disabled={limitReached}
                                        className={`block w-full rounded-xl border px-3 py-2 pr-10 text-xs text-slate-800 bg-white dark:bg-[#1f293d] dark:text-gray-100 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:bg-slate-50 dark:disabled:bg-gray-800/50 disabled:text-slate-400 shadow-sm transition-colors ${
                                            errors[name] 
                                                ? 'border-red-400 dark:border-red-500' 
                                                : 'border-slate-200 dark:border-gray-800'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggle(key)}
                                        className="absolute right-0 flex items-center justify-center px-3 h-full text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 focus:outline-none"
                                        tabIndex={-1}
                                    >
                                        {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors[name] && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[name]}</p>
                                )}
                            </div>
                        ))}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="rounded-xl border border-slate-200 dark:border-gray-800 px-4 py-2 text-xs font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing || limitReached}
                                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 px-4 py-2 text-xs font-semibold text-white shadow-sm transition disabled:cursor-not-allowed"
                            >
                                {processing ? 'Memproses...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ============ INFO CARD ============ */}
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" size={20} />
                        <div>
                            <p className="font-semibold text-emerald-900 dark:text-emerald-200">Keamanan Akun</p>
                            <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                                Ubah kata sandi secara berkala untuk menjaga keamanan akun Super Admin Anda. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}

