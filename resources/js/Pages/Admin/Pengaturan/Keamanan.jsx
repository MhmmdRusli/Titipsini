import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Eye, EyeOff, ShieldCheck, Monitor, Smartphone, MapPin, Clock, LogOut, AlertTriangle } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Keamanan({ remainingChanges = 2, loginHistory = [] }) {
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
        put(route('admin.pengaturan.keamanan.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const revokeSession = (sessionId) => {
        router.delete(route('admin.pengaturan.keamanan.sessions.destroy', sessionId), {
            preserveScroll: true,
        });
    };

    const fields = [
        { key: 'lama', name: 'kata_sandi_lama', label: 'Kata sandi lama', autoComplete: 'current-password' },
        { key: 'baru', name: 'kata_sandi_baru', label: 'Kata sandi baru', autoComplete: 'new-password' },
        { key: 'konfirmasi', name: 'kata_sandi_baru_confirmation', label: 'Konfirmasi kata sandi baru', autoComplete: 'new-password' },
    ];

    const limitReached = remainingChanges <= 0;

    return (
        <AdminLayout title="Keamanan">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* ============ FORM GANTI KATA SANDI ============ */}
                <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-300 text-brand-green-700">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Ganti kata sandi</h2>
                            <p className="text-sm text-gray-500">Gunakan kata sandi yang kuat dan tidak dipakai di tempat lain.</p>
                        </div>
                    </div>

                    {/* Notice batas ganti password 2x/24 jam */}
                    <div
                        className={`mb-5 flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs font-medium ${
                            limitReached
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                    >
                        <AlertTriangle size={14} className="shrink-0" />
                        {limitReached
                            ? 'Anda sudah mencapai batas maksimal 2 kali ganti kata sandi dalam 24 jam. Coba lagi nanti.'
                            : `Anda masih bisa mengganti kata sandi ${remainingChanges}x lagi dalam 24 jam ke depan.`}
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {fields.map(({ key, name, label, autoComplete }) => (
                            <div key={name}>
                                <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
                                    {label}
                                </label>
                                <div className="relative">
                                    <input
                                        id={name}
                                        type={show[key] ? 'text' : 'password'}
                                        autoComplete={autoComplete}
                                        value={data[name]}
                                        onChange={(e) => setData(name, e.target.value)}
                                        disabled={limitReached}
                                        className={`block w-full rounded-lg border px-3 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-400 ${
                                            errors[name] ? 'border-red-400' : 'border-gray-300'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggle(key)}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                                        tabIndex={-1}
                                    >
                                        {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors[name] && (
                                    <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
                                )}
                            </div>
                        ))}

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing || limitReached}
                                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-green-800 disabled:opacity-50"
                            >
                                Simpan kata sandi
                            </button>
                            {recentlySuccessful && (
                                <span className="text-sm text-brand-green-700">Kata sandi berhasil diperbarui</span>
                            )}
                        </div>
                    </form>
                </div>

                {/* ============ RIWAYAT LOGIN ============ */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green-100 text-brand-green-700">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Riwayat Login</h2>
                            <p className="text-sm text-gray-500">Aktivitas login terakhir di akun Anda.</p>
                        </div>
                    </div>

                    {loginHistory.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-gray-400">Belum ada riwayat login tercatat.</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {loginHistory.map((session, idx) => (
                                <li
                                    key={session.id ?? idx}
                                    className={`rounded-lg border p-3 ${
                                        session.current ? 'border-green-200 bg-green-50/50' : 'border-gray-100'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-2.5">
                                            <div className="mt-0.5 text-gray-400">
                                                {session.device_type === 'mobile' ? <Smartphone size={16} /> : <Monitor size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {session.device ?? 'Perangkat tidak dikenal'}
                                                    {session.current && (
                                                        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                                            Sesi ini
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin size={11} />
                                                    {session.location ?? 'Lokasi tidak diketahui'}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-400">{session.time}</p>
                                            </div>
                                        </div>

                                        {!session.current && (
                                            <button
                                                type="button"
                                                onClick={() => revokeSession(session.id)}
                                                className="text-gray-400 hover:text-red-500 transition"
                                                title="Keluar dari perangkat ini"
                                            >
                                                <LogOut size={15} />
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}