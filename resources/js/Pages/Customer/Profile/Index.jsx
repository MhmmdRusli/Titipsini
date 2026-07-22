import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Bell, ShieldCheck, HelpCircle, Info, ChevronRight, LogOut, Sun, Moon } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

function formatBergabung(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
}

const GENDER_LABEL = { male: 'Laki-laki', female: 'Perempuan' };

export default function ProfileIndex({ user }) {
    const [darkMode, setDarkMode] = useState(
        () => typeof window !== 'undefined' && localStorage.getItem('titipsini_theme') === 'dark'
    );
    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    function toggleDarkMode() {
        setDarkMode((prev) => {
            const next = !prev;
            localStorage.setItem('titipsini_theme', next ? 'dark' : 'light');
            return next;
        });
    }

    function handleLogout() {
        router.post('/logout');
    }

    return (
        <CustomerLayout title="Profil" backHref="/app/dashboard">
            <Head title="Profil" />

            <div className="px-4 py-3">
                {/* Kartu profil hijau */}
                <div className="relative overflow-hidden rounded-xl bg-green-600 dark:bg-green-700 p-4 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-semibold">
                            {user.foto ? (
                                <img src={user.foto} alt={user.name} className="h-14 w-14 rounded-full object-cover" />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold">{user.name}</p>
                            <p className="text-xs text-green-100">Bergabung sejak {formatBergabung(user.created_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Data diri */}
                <div className="relative mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <Link
                        href="/app/profile/edit"
                        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                        <Pencil size={13} />
                    </Link>

                    <Field label="Nama Lengkap" value={user.name} />
                    <Field label="Jenis Kelamin" value={GENDER_LABEL[user.gender] ?? '-'} />
                    <Field label="Email" value={user.email} />
                    <Field label="Nomor Telepon" value={user.phone ?? '-'} />
                    <Field label="Alamat" value={user.address ?? '-'} last />

                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                            Mode {darkMode ? 'Gelap' : 'Terang'}
                        </span>
                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            className={`relative h-6 w-11 rounded-full transition-colors ${
                                darkMode ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                    darkMode ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Akun */}
                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">Akun</p>
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <MenuLink href="/app/profile/notifikasi" icon={Bell} label="Notifikasi" />
                    <MenuLink href="/app/profile/keamanan" icon={ShieldCheck} label="Keamanan Akun" last />
                </div>

                {/* Lainnya */}
                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">Lainnya</p>
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <MenuLink href="/app/profile/bantuan" icon={HelpCircle} label="Pusat Bantuan" />
                    <MenuLink href="/app/profile/tentang" icon={Info} label="Tentang Aplikasi" last />
                </div>

                {/* Tombol keluar */}
                <button
                    type="button"
                    onClick={() => setConfirmLogoutOpen(true)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400"
                >
                    <LogOut size={16} />
                    Keluar
                </button>
            </div>

            {/* Dialog konfirmasi keluar */}
            {confirmLogoutOpen && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 px-8">
                    <div className="w-full rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-gray-800">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
                            <LogOut size={20} />
                        </div>
                        <h2 className="mt-4 text-base font-bold text-gray-900 dark:text-gray-100">Konfirmasi Keluar</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Apakah Anda yakin ingin keluar?</p>

                        <div className="mt-5 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full rounded-xl border border-green-600 py-2.5 text-sm font-semibold text-green-600 dark:text-green-400"
                            >
                                Ya
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmLogoutOpen(false)}
                                className="w-full rounded-xl border border-red-300 py-2.5 text-sm font-semibold text-red-500 dark:border-red-800 dark:text-red-400"
                            >
                                Tidak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}

function Field({ label, value, last }) {
    return (
        <div className={`py-2 ${!last ? 'border-b border-gray-50 dark:border-gray-700' : ''}`}>
            <p className="text-[10px] uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-0.5 text-sm text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    );
}

function MenuLink({ href, icon: Icon, label, last }) {
    return (
        <Link
            href={href}
            className={`flex items-center justify-between px-4 py-3 ${!last ? 'border-b border-gray-50 dark:border-gray-700' : ''}`}
        >
            <span className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                <Icon size={17} className="text-gray-500 dark:text-gray-400" />
                {label}
            </span>
            <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
        </Link>
    );
}