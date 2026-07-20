import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

export default function Keamanan() {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        password_lama: '',
        password_baru: '',
        password_baru_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/mitra/keamanan', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <MitraLayout title="Keamanan">
            <Head title="Keamanan" />

            <div className="px-4 py-3">
                <Link
                    href="/mitra/profil"
                    className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-gray-600"
                >
                    <ChevronLeft size={18} />
                    Kembali
                </Link>

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900">Ubah Kata Sandi</h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Pastikan kata sandi baru kamu berbeda dari sebelumnya.
                    </p>

                    <form onSubmit={submit} className="mt-4 space-y-4" autoComplete="off">
                        <Field label="Kata Sandi Lama" error={errors.password_lama}>
                            <PasswordInput
                                name="f_pw_old_mitra"
                                value={data.password_lama}
                                onChange={(v) => setData('password_lama', v)}
                                show={showOld}
                                onToggle={() => setShowOld((s) => !s)}
                            />
                        </Field>

                        <Field label="Kata Sandi Baru" error={errors.password_baru}>
                            <PasswordInput
                                name="f_pw_new_mitra"
                                value={data.password_baru}
                                onChange={(v) => setData('password_baru', v)}
                                show={showNew}
                                onToggle={() => setShowNew((s) => !s)}
                            />
                        </Field>

                        <Field
                            label="Konfirmasi Kata Sandi Baru"
                            error={errors.password_baru_confirmation}
                        >
                            <PasswordInput
                                name="f_pw_confirm_mitra"
                                value={data.password_baru_confirmation}
                                onChange={(v) => setData('password_baru_confirmation', v)}
                                show={showConfirm}
                                onToggle={() => setShowConfirm((s) => !s)}
                            />
                        </Field>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </form>
                </div>
            </div>
        </MitraLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}

function PasswordInput({ name, value, onChange, show, onToggle }) {
    return (
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                name={name}
                autoComplete="off"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border-none bg-[#f4f7fc] px-4 py-3 pr-11 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600/30 transition-all"
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
            >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
}