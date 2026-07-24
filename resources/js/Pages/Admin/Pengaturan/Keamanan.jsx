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
                <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
                    <div className="mb-6 flex items-center gap-3">
                        {/* Perubahan visual yang jelas ada di sini: menggunakan bg-emerald-50 dan text-green-700 */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-green-700">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Ganti kata sandi</h2>
                            <p className="text-sm text-gray-500">Gunakan kata sandi yang kuat dan tidak dipakai di tempat lain.</p>
                        </div>
                    </div>

                    {/* Notice batas ganti password 2x/24 jam */}
                    <div
                        className={`mb-5 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-medium ${
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
                                <div className="relative flex items-center">
                                    <input
                                        id={name}
                                        type={show[key] ? 'text' : 'password'}
                                        autoComplete={autoComplete}
                                        value={data[name]}
                                        onChange={(e) => setData(name, e.target.value)}
                                        disabled={limitReached}
                                        className={`block w-full rounded-xl border px-3 py-2 pr-10 text-sm text-gray-800 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 disabled:bg-gray-50 disabled:text-gray-400 shadow-sm ${
                                            errors[name] ? 'border-red-400' : 'border-gray-200'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggle(key)}
                                        className="absolute right-0 flex items-center justify-center px-3 h-full text-gray-400 hover:text-gray-600 focus:outline-none"
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
                                className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-50 shadow-sm transition-all select-none"
                            >
                                Simpan kata sandi
                            </button>
                            {recentlySuccessful && (
                                <span className="text-xs font-semibold text-green-700">Kata sandi berhasil diperbarui</span>
                            )}
                        </div>
                    </form>
                </div>

                {/* ============ RIWAYAT LOGIN ============ */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-green-700">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">Riwayat Login</h2>
                                <p className="text-sm text-gray-500">Aktivitas login terakhir di akun Anda.</p>
                            </div>
                        </div>

                        {loginHistory.some((s) => !s.current) && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Apakah Anda yakin ingin mengeluarkan semua sesi lain?')) {
                                        router.delete(route('admin.pengaturan.keamanan.sessions.destroy-all'), {
                                            preserveScroll: true,
                                        });
                                    }
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition shadow-sm select-none"
                            >
                                <LogOut size={13} />
                                Keluar Semua
                            </button>
                        )}
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
                                    className={`rounded-xl border p-3.5 ${
                                        session.current ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200'
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
                                                        <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
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