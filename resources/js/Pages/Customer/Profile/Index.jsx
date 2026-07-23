import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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

            {/* Menggunakan pb-8 agar tombol Keluar bisa discroll secara alami melewati navbar */}
            <div className="pb-8">
                {/* Kartu profil hijau melengkung dengan aksen pola dekoratif */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#16a34a] via-[#15803d] to-[#14532d] dark:from-green-800 dark:via-green-700 dark:to-green-950 px-6 pt-6 pb-12 text-white rounded-b-[36px] shadow-md">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
                    <div className="absolute right-20 -bottom-10 h-32 w-32 rounded-full bg-black/10 blur-lg pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="relative">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold overflow-hidden border-2 border-white/40 shadow-inner">
                                {user.foto ? (
                                    <img src={user.foto} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#15803d] bg-emerald-400" />
                        </div>
                        <div>
                            <p className="text-lg font-extrabold tracking-tight">{user.name}</p>
                            <p className="text-xs text-green-100/90 mt-0.5 font-medium">
                                Bergabung sejak {formatBergabung(user.created_at)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-4 -mt-6 relative z-20">
                    {/* Data diri */}
                    <div className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-lg shadow-gray-100/50 dark:border-gray-700/80 dark:bg-gray-800 dark:shadow-none">
                        <Link
                            href="/app/profile/edit"
                            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-[#15803d] dark:bg-green-950/50 dark:text-[#4ade80] transition hover:scale-105"
                            title="Edit Profil"
                        >
                            <Pencil size={14} />
                        </Link>

                        <Field label="Nama Lengkap" value={user.name} />
                        <Field label="Jenis Kelamin" value={GENDER_LABEL[user.gender] ?? '-'} />
                        <Field label="Email" value={user.email} />
                        <Field label="Nomor Telepon" value={user.phone ?? '-'} />
                        <Field label="Alamat" value={user.address ?? '-'} last />

                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3.5 dark:border-gray-700">
                            <span className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    {darkMode ? <Moon size={15} /> : <Sun size={15} />}
                                </div>
                                Mode {darkMode ? 'Gelap' : 'Terang'}
                            </span>
                            <button
                                type="button"
                                onClick={toggleDarkMode}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                                    darkMode ? 'bg-[#15803d] dark:bg-[#22c55e]' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                                        darkMode ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Akun */}
                    <p className="mb-2.5 mt-6 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Akun</p>
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700/80 dark:bg-gray-800">
                        <MenuLink href="/app/profile/notifikasi" icon={Bell} label="Notifikasi" />
                        <MenuLink href="/app/profile/keamanan" icon={ShieldCheck} label="Keamanan Akun" last />
                    </div>

                    {/* Lainnya */}
                    <p className="mb-2.5 mt-6 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Lainnya</p>
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700/80 dark:bg-gray-800">
                        <MenuLink href="/app/profile/bantuan" icon={HelpCircle} label="Pusat Bantuan" />
                        <MenuLink href="/app/profile/tentang" icon={Info} label="Tentang Aplikasi" last />
                    </div>

                    {/* Tombol keluar (akan berada di paling bawah dan tertutup navbar saat discroll mentok) */}
                    <button
                        type="button"
                        onClick={() => setConfirmLogoutOpen(true)}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-sm font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400 transition hover:bg-red-100 shadow-sm"
                    >
                        <LogOut size={16} />
                        Keluar
                    </button>
                </div>
            </div>

            {/* Dialog konfirmasi keluar */}
            {confirmLogoutOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
                    <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl dark:bg-gray-800 animate-in fade-in zoom-in-95 duration-150">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400 shadow-inner">
                            <LogOut size={22} />
                        </div>
                        <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-gray-100">Konfirmasi Keluar</h2>
                        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Apakah Anda yakin ingin keluar dari akun ini?</p>

                        <div className="mt-6 flex flex-col gap-2.5">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/20 hover:bg-red-700 transition"
                            >
                                Ya, Keluar
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmLogoutOpen(false)}
                                className="w-full rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                            >
                                Batal
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
        <div className={`py-2.5 ${!last ? 'border-b border-gray-50 dark:border-gray-700/60' : ''}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    );
}

function MenuLink({ href, icon: Icon, label, last }) {
    return (
        <Link
            href={href}
            className={`group flex items-center justify-between px-4 py-3.5 transition hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                !last ? 'border-b border-gray-50 dark:border-gray-700/60' : ''
            }`}
        >
            <span className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-[#15803d] dark:bg-green-950/40 dark:text-[#4ade80] transition group-hover:scale-110">
                    <Icon size={17} />
                </div>
                {label}
            </span>
            <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 transition group-hover:translate-x-0.5" />
        </Link>
    );
}