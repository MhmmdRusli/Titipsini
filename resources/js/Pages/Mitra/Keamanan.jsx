import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

export default function Keamanan() {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Ganti password (form yang sudah ada, tidak diubah)
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

    // Ganti PIN — 2 mode: 'ubah' (masih ingat PIN lama) atau 'lupa' (verifikasi pakai password)
    const [pinMode, setPinMode] = useState('ubah');

    const pinForm = useForm({
        pin_lama: '',
        pin_baru: '',
        pin_baru_confirmation: '',
    });

    const lupaPinForm = useForm({
        password: '',
        pin_baru: '',
        pin_baru_confirmation: '',
    });

    const submitUbahPin = (e) => {
        e.preventDefault();
        pinForm.put('/mitra/keamanan/pin', {
            preserveScroll: true,
            onSuccess: () => pinForm.reset(),
        });
    };

    const submitLupaPin = (e) => {
        e.preventDefault();
        lupaPinForm.put('/mitra/keamanan/pin/lupa', {
            preserveScroll: true,
            onSuccess: () => {
                lupaPinForm.reset();
                setPinMode('ubah');
            },
        });
    };

    const onlyDigits = (setter) => (v) => setter(v.replace(/\D/g, '').slice(0, 6));

    return (
        <MitraLayout title="Keamanan">
            <Head title="Keamanan" />

            <div className="px-4 py-3 space-y-4">
                <Link
                    href="/mitra/profil"
                    className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-gray-600"
                >
                    <ChevronLeft size={18} />
                    Kembali
                </Link>

                {/* Ganti Kata Sandi — tidak diubah */}
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

                {/* PIN Keamanan — baru */}
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                                <Lock size={14} className="text-green-600" />
                                PIN Keamanan
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                PIN dipakai untuk verifikasi setiap kali kamu menarik saldo.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPinMode((m) => (m === 'ubah' ? 'lupa' : 'ubah'))}
                            className="shrink-0 text-xs font-semibold text-green-700 hover:underline"
                        >
                            {pinMode === 'ubah' ? 'Lupa PIN?' : 'Batal'}
                        </button>
                    </div>

                    {pinMode === 'ubah' ? (
                        <form onSubmit={submitUbahPin} className="mt-4 space-y-4" autoComplete="off">
                            <Field label="PIN Lama" error={pinForm.errors.pin_lama}>
                                <PinInput
                                    value={pinForm.data.pin_lama}
                                    onChange={onlyDigits((v) => pinForm.setData('pin_lama', v))}
                                />
                            </Field>
                            <Field label="PIN Baru" error={pinForm.errors.pin_baru}>
                                <PinInput
                                    value={pinForm.data.pin_baru}
                                    onChange={onlyDigits((v) => pinForm.setData('pin_baru', v))}
                                />
                            </Field>
                            <Field label="Konfirmasi PIN Baru" error={pinForm.errors.pin_baru_confirmation}>
                                <PinInput
                                    value={pinForm.data.pin_baru_confirmation}
                                    onChange={onlyDigits((v) => pinForm.setData('pin_baru_confirmation', v))}
                                />
                            </Field>

                            <button
                                type="submit"
                                disabled={pinForm.processing}
                                className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                            >
                                {pinForm.processing ? 'Menyimpan...' : 'Simpan PIN Baru'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={submitLupaPin} className="mt-4 space-y-4" autoComplete="off">
                            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                                <KeyRound size={14} className="mt-0.5 shrink-0" />
                                <p>Masukkan kata sandi akun kamu untuk verifikasi, lalu buat PIN baru.</p>
                            </div>

                            <Field label="Kata Sandi Akun" error={lupaPinForm.errors.password}>
                                <PasswordInput
                                    name="f_pw_verify_pin"
                                    value={lupaPinForm.data.password}
                                    onChange={(v) => lupaPinForm.setData('password', v)}
                                    show={false}
                                    onToggle={() => {}}
                                    hideToggle
                                />
                            </Field>
                            <Field label="PIN Baru" error={lupaPinForm.errors.pin_baru}>
                                <PinInput
                                    value={lupaPinForm.data.pin_baru}
                                    onChange={onlyDigits((v) => lupaPinForm.setData('pin_baru', v))}
                                />
                            </Field>
                            <Field label="Konfirmasi PIN Baru" error={lupaPinForm.errors.pin_baru_confirmation}>
                                <PinInput
                                    value={lupaPinForm.data.pin_baru_confirmation}
                                    onChange={onlyDigits((v) => lupaPinForm.setData('pin_baru_confirmation', v))}
                                />
                            </Field>

                            <button
                                type="submit"
                                disabled={lupaPinForm.processing}
                                className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                            >
                                {lupaPinForm.processing ? 'Memverifikasi...' : 'Buat PIN Baru'}
                            </button>
                        </form>
                    )}
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

function PasswordInput({ name, value, onChange, show, onToggle, hideToggle }) {
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
            {!hideToggle && (
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            )}
        </div>
    );
}

function PinInput({ value, onChange }) {
    return (
        <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            autoComplete="off"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
            className="w-full rounded-xl border-none bg-[#f4f7fc] px-4 py-3 text-center text-lg tracking-[0.5em] text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600/30 transition-all"
        />
    );
}