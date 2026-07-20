import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Keamanan() {
    return (
        <CustomerLayout title="Keamanan Akun" backHref="/app/profile">
            <Head title="Keamanan Akun" />

            <div className="flex flex-col gap-4 px-4 py-3">
                <PasswordSection />
                <PinSection />
            </div>
        </CustomerLayout>
    );
}

function PasswordSection() {
    const [show, setShow] = useState({ current: false, next: false, confirm: false });
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        put('/app/profile/keamanan/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Lock size={16} className="text-green-600" />
                Ganti Password
            </p>

            <form onSubmit={submit} className="mt-3 space-y-3">
                <PasswordField
                    label="Password Saat Ini"
                    value={data.current_password}
                    onChange={(v) => setData('current_password', v)}
                    error={errors.current_password}
                    show={show.current}
                    onToggleShow={() => setShow((s) => ({ ...s, current: !s.current }))}
                />
                <PasswordField
                    label="Password Baru"
                    value={data.password}
                    onChange={(v) => setData('password', v)}
                    error={errors.password}
                    show={show.next}
                    onToggleShow={() => setShow((s) => ({ ...s, next: !s.next }))}
                />
                <PasswordField
                    label="Konfirmasi Password Baru"
                    value={data.password_confirmation}
                    onChange={(v) => setData('password_confirmation', v)}
                    error={errors.password_confirmation}
                    show={show.confirm}
                    onToggleShow={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                />

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                    Simpan Password
                </button>
            </form>
        </div>
    );
}

function PinSection() {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_pin: '',
        pin: '',
        pin_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        put('/app/profile/keamanan/pin', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    function pinInput(field, label) {
        return (
            <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
                <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={data[field]}
                    onChange={(e) => setData(field, e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className={`w-full rounded-lg border px-3 py-2.5 text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-1 ${
                        errors[field]
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
                    }`}
                />
                {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <KeyRound size={16} className="text-green-600" />
                Ganti PIN
            </p>

            <form onSubmit={submit} className="mt-3 space-y-3">
                {pinInput('current_pin', 'PIN Saat Ini')}
                {pinInput('pin', 'PIN Baru')}
                {pinInput('pin_confirmation', 'Konfirmasi PIN Baru')}

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                    Simpan PIN
                </button>
            </form>
        </div>
    );
}

function PasswordField({ label, value, onChange, error, show, onToggleShow }) {
    return (
        <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 ${
                        error
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
                    }`}
                />
                <button
                    type="button"
                    onClick={onToggleShow}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}