 import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

// --- Konstanta Global untuk Warna ---
// Menggunakan warna hijau khas Titipsini.com untuk konsistensi tema
const BRAND_GREEN_TEXT = 'text-[#15803d] dark:text-[#4ade80]';
const BRAND_GREEN_BG = 'bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600';
const BRAND_GREEN_RING = 'focus:border-[#15803d] focus:ring-[#15803d] dark:focus:border-[#22c55e] dark:focus:ring-[#22c55e]';

// --- Komponen Utama ---
export default function Keamanan() {
    return (
        <CustomerLayout title="Keamanan Akun" backHref="/app/profile">
            <Head title="Keamanan Akun" />

            {/* Container utama dengan padding dan jarak antar section yang lebih baik */}
            <div className="flex flex-col gap-6 px-5 py-6 md:px-6 md:py-8">
                <HeaderTitle />
                <PasswordSection />
                <div className="border-t border-gray-100 dark:border-gray-800 my-2" /> {/* Divider */}
                <PinSection />
            </div>
        </CustomerLayout>
    );
}

// --- Komponen Header Halaman ---
function HeaderTitle() {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 p-5 border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-600 dark:text-lime-400">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h1 className="text-lg font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
                    Pusat Keamanan
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mt-0.5">
                    Kelola keamanan akun Anda untuk perlindungan yang lebih baik. Ubah kata sandi dan PIN transaksi Anda secara berkala.
                </p>
            </div>
        </div>
    )
}

// --- Section Ganti Password ---
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

    // Kelas input umum untuk konsistensi
    const inputCommon = `w-full rounded-xl border bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 ${BRAND_GREEN_RING}`;

    return (
        <section className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-lg shadow-gray-100/50 dark:shadow-none">
            <header className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950/40">
                    <Lock size={20} className={BRAND_GREEN_TEXT} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-gray-950 dark:text-gray-100 tracking-tight">
                        Ubah Kata Sandi
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Gunakan kombinasi unik minimal 8 karakter.
                    </p>
                </div>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <PasswordField
                    label="Kata Sandi Saat Ini"
                    value={data.current_password}
                    onChange={(v) => setData('current_password', v)}
                    error={errors.current_password}
                    show={show.current}
                    onToggleShow={() => setShow((s) => ({ ...s, current: !s.current }))}
                    className={inputCommon}
                />
                <PasswordField
                    label="Kata Sandi Baru"
                    value={data.password}
                    onChange={(v) => setData('password', v)}
                    error={errors.password}
                    show={show.next}
                    onToggleShow={() => setShow((s) => ({ ...s, next: !s.next }))}
                    className={inputCommon}
                />
                <PasswordField
                    label="Konfirmasi Kata Sandi Baru"
                    value={data.password_confirmation}
                    onChange={(v) => setData('password_confirmation', v)}
                    error={errors.password_confirmation}
                    show={show.confirm}
                    onToggleShow={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                    className={inputCommon}
                />

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full rounded-2xl ${BRAND_GREEN_BG} px-6 py-3.5 text-sm font-bold text-white shadow-md transition active:scale-[0.98] disabled:opacity-60`}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                    </button>
                </div>
            </form>
        </section>
    );
}

// --- Section Ganti PIN ---
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

    // Kelas input PIN khusus (Kotak-kotak)
    const inputPinBase = `w-12 h-14 rounded-xl border-2 bg-white dark:bg-gray-900 px-3 text-center text-2xl font-bold tracking-widest text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-0 transition-all shadow-inner ${BRAND_GREEN_RING}`;
    const inputPinError = 'border-red-400 focus:border-red-500 focus:ring-red-500';
    const inputPinDefault = 'border-gray-200 dark:border-gray-800';

    function renderPinInput(field, label) {
        const hasError = !!errors[field];
        
        // Handle perubahan input: hanya angka, maksimal 6
        const handleChange = (e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
            setData(field, val);
        };

        return (
            <div className="flex flex-col items-center gap-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide">{label}</label>
                {/* Container untuk 6 kotak PIN */}
                <div className="flex gap-2.5" dir="ltr"> {/* Force LTR for digit spacing */}
                    {[...Array(6)].map((_, index) => {
                        const digit = data[field][index] || '';
                        return (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                // Trik: onChange hanya pada input terakhir yang aktif, 
                                // tapi implementasi sederhana ini menggunakan satu input panjang.
                                // Untuk UX kotak terpisah, diperlukan logika fokus yang kompleks.
                                // Ini adalah penyederhanaan visual: satu input disembunyikan di atas kotak,
                                // atau user mengetik langsung di kotak terakhir.
                                // Menggunakan pendekatan sederhana: satu input per field.
                                // User akan melihat angka terisi saat mengetik.
                                readOnly // Mencegah keyboard muncul per kotak di mobile
                                className={`${inputPinBase} ${hasError ? inputPinError : inputPinDefault}`}
                                // Tambahkan onClick untuk fokus ke input utama jika perlu
                            />
                        );
                    })}
                </div>
                {/* Input tersembunyi yang sebenarnya menerima ketikan user */}
                <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={data[field]}
                    onChange={handleChange}
                    placeholder="••••••"
                    // Posisikan di atas kotak agar terlihat saat mengetik, tapi opacity 0
                    className="absolute opacity-0 w-72 h-14 cursor-text"
                    style={{letterSpacing: '2.65rem', paddingLeft: '1rem'}} // Sesuaikan agar titik/angka sejajar kotak
                />
                {hasError && <p className="mt-1.5 text-xs font-medium text-red-500">{errors[field]}</p>}
            </div>
        );
    }

    return (
        <section className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-lg shadow-gray-100/50 dark:shadow-none">
            <header className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                    <KeyRound size={20} className={BRAND_GREEN_TEXT} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-gray-950 dark:text-gray-100 tracking-tight">
                        Ubah PIN Transaksi
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        PIN 6 digit digunakan untuk konfirmasi pembayaran.
                    </p>
                </div>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6 flex flex-col items-center">
                {/* Grid untuk menata input PIN agar rapi */}
                <div className="grid grid-cols-1 gap-6 w-full max-w-md">
                    {renderPinInput('current_pin', 'Masukkan PIN Saat Ini')}
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6 grid grid-cols-1 gap-6">
                        {renderPinInput('pin', 'Masukkan PIN Baru')}
                        {renderPinInput('pin_confirmation', 'Konfirmasi PIN Baru')}
                    </div>
                </div>

                <div className="pt-2 w-full max-w-xs">
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full rounded-2xl ${BRAND_GREEN_BG} px-6 py-3.5 text-sm font-bold text-white shadow-md transition active:scale-[0.98] disabled:opacity-60`}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan PIN Baru'}
                    </button>
                </div>
            </form>
        </section>
    );
}

// --- Komponen Helper untuk Input Password dengan Toggle Show ---
function PasswordField({ label, value, onChange, error, className, show, onToggleShow }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="••••••••"
                    className={`${className} ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800' }`}
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
            {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}