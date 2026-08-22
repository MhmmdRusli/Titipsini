import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

// --- Konstanta Global untuk Warna ---
const BRAND_GREEN_BG = 'bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600';
const BRAND_GREEN_BG_MUTED = 'bg-[#86efac] dark:bg-emerald-900/60';

export default function Password() {
    const [success, setSuccess] = useState(false);
    const [show, setShow] = useState({ current: false, next: false, confirm: false });
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Tombol aktif (hijau tua) hanya kalau semua field terisi dan
    // password baru minimal 8 karakter serta konfirmasi cocok.
    const isValid =
        data.current_password.length > 0 &&
        data.password.length >= 8 &&
        data.password === data.password_confirmation;

    function submit(e) {
        e.preventDefault();
        put('/app/profile/keamanan/password', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSuccess(true);
            },
        });
    }

    if (success) {
        return <SuccessScreen onBack={() => setSuccess(false)} />;
    }

    return (
        <CustomerLayout title="Ubah Kata Sandi" backHref="/app/profile/keamanan">
            <Head title="Ubah Kata Sandi" />

            <div className="px-5 py-6 md:px-6 md:py-8">
                <form onSubmit={submit} className="flex flex-col gap-5">
                    <PasswordField
                        label="Kata Sandi Lama"
                        placeholder="Kata Sandi Lama"
                        value={data.current_password}
                        onChange={(v) => setData('current_password', v)}
                        error={errors.current_password}
                        show={show.current}
                        onToggleShow={() => setShow((s) => ({ ...s, current: !s.current }))}
                    />
                    <PasswordField
                        label="Kata Sandi Baru"
                        placeholder="Kata Sandi Baru"
                        value={data.password}
                        onChange={(v) => setData('password', v)}
                        error={errors.password}
                        show={show.next}
                        onToggleShow={() => setShow((s) => ({ ...s, next: !s.next }))}
                    />
                    <PasswordField
                        label="Konfirmasi Kata Sandi Baru"
                        placeholder="Konfirmasi Kata Sandi Baru"
                        value={data.password_confirmation}
                        onChange={(v) => setData('password_confirmation', v)}
                        error={errors.password_confirmation}
                        show={show.confirm}
                        onToggleShow={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                    />

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing || !isValid}
                            className={`w-full rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] ${
                                isValid ? BRAND_GREEN_BG : `${BRAND_GREEN_BG_MUTED} cursor-not-allowed`
                            }`}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </CustomerLayout>
    );
}

// --- Komponen Input Password (label di atas, input polos abu-abu muda) ---
function PasswordField({ label, placeholder, value, onChange, error, show, onToggleShow }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border px-4 py-3.5 pr-11 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 transition ${
                        error
                            ? 'border-red-400 bg-white dark:bg-gray-900 focus:border-red-500 focus:ring-red-200'
                            : 'border-transparent bg-gray-100 dark:bg-gray-800 focus:border-[#15803d] focus:ring-[#15803d]/20 dark:focus:border-[#22c55e]'
                    }`}
                />
                <button
                    type="button"
                    onClick={onToggleShow}
                    aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}

// --- Layar Sukses setelah password berhasil diubah ---
function SuccessScreen() {
    return (
        <CustomerLayout title="Ubah Kata Sandi" backHref="/app/profile/keamanan" hideHeader>
            <Head title="Berhasil" />

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-8 py-10 text-center bg-white dark:bg-gray-950">
                <div className="flex items-center gap-2 mb-10">
                    <ShieldCheck size={24} className="text-[#15803d] dark:text-[#4ade80]" />
                    <span className="text-lg font-extrabold text-gray-900 dark:text-gray-50">
                        Titipsini<span className="text-[#15803d] dark:text-[#4ade80]">.Com</span>
                    </span>
                </div>

                <SuccessIllustration />

                <h1 className="mt-8 text-base font-bold text-gray-900 dark:text-gray-50">
                    Ubah kata sandi baru Berhasil
                </h1>
                <p className="mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                    Terima kasih telah membuat kata sandi baru. Kata sandi ini digunakan untuk keamanan transaksi Anda.
                </p>
            </div>
        </CustomerLayout>
    );
}

// --- Ilustrasi titik-titik sederhana (pengganti animasi confetti) ---
function SuccessIllustration() {
    const dots = [
        { x: 20, y: 10, r: 4 }, { x: 70, y: 5, r: 3 }, { x: 110, y: 25, r: 5 },
        { x: 10, y: 55, r: 3 }, { x: 55, y: 40, r: 4 }, { x: 100, y: 60, r: 3 },
        { x: 30, y: 90, r: 3 }, { x: 85, y: 95, r: 4 }, { x: 120, y: 75, r: 3 },
        { x: 5, y: 100, r: 3 },
    ];
    return (
        <svg viewBox="0 0 130 110" className="w-40 h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {dots.map((d, i) => (
                <circle
                    key={i}
                    cx={d.x}
                    cy={d.y}
                    r={d.r}
                    className={i % 3 === 0 ? 'fill-[#15803d]' : 'fill-emerald-200 dark:fill-emerald-900'}
                    opacity={i % 2 === 0 ? 0.8 : 0.5}
                />
            ))}
            <circle cx={65} cy={55} r={2.5} className="fill-gray-900 dark:fill-gray-100" />
        </svg>
    );
}