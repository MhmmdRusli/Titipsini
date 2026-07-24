import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Package, Bell, User, CheckCircle2, XCircle, X } from 'lucide-react';

const navItems = [
    { label: 'Beranda', href: '/mitra/dashboard', icon: LayoutGrid },
    { label: 'Pesanan', href: '/mitra/pesanan', icon: Package },
    { label: 'Notifikasi', href: '/mitra/notifikasi', icon: Bell },
    { label: 'Profil', href: '/mitra/profil', icon: User },
];

function Toast({ type, message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <div
            className={`flex items-start gap-2 rounded-xl border px-3.5 py-3 shadow-lg ${
                isSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
        >
            {isSuccess ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
            ) : (
                <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
            )}
            <p className={`flex-1 text-sm ${isSuccess ? 'text-green-800' : 'text-red-700'}`}>{message}</p>
            <button onClick={onClose} className={isSuccess ? 'text-green-500' : 'text-red-400'}>
                <X size={15} />
            </button>
        </div>
    );
}

export default function MitraLayout({ children, title }) {
    const { url, props } = usePage();
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (props.flash?.success) {
            setToast({ type: 'success', message: props.flash.success });
        } else if (props.flash?.error) {
            setToast({ type: 'error', message: props.flash.error });
        }
    }, [props.flash?.success, props.flash?.error]);

    return (
        <div className="min-h-dvh bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-6">
            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-gray-50 sm:h-[850px] sm:shadow-xl">
                <header className="z-10 shrink-0 border-b border-gray-200 bg-white">
                    <div
                        className="flex items-center px-4 pb-3"
                        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
                    >
                        <Link href="/mitra/dashboard" className="flex items-center gap-1.5">
                            <img
                                src="/images/logo-titipsini.png"
                                alt="Logo"
                                className="h-6 w-auto object-contain"
                            />
                            <span className="text-base font-bold tracking-tight text-[#15803d]">
                                Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                            </span>
                        </Link>
                    </div>
                </header>

                {toast && (
                    <div className="absolute inset-x-0 top-3 z-30 px-4">
                        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
                    </div>
                )}

                <main className="flex-1 overflow-y-auto pb-20">
                    {title && (
                        <div className="px-4 pt-4">
                            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                        </div>
                    )}
                    {children}
                </main>

                <nav
                    className="absolute inset-x-0 bottom-0 z-10 flex justify-around border-t border-gray-200 bg-white py-2"
                    style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
                >
                    {navItems.map(({ label, href, icon: Icon }) => {
                        // Memperbaiki logika active agar tidak bentrok dengan rute lain (seperti /mitra/profil)
                        const active = href === '/mitra/dashboard' 
                            ? url === '/mitra/dashboard' 
                            : url === href || url.startsWith(href + '/');

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-0.5 px-2 text-[11px] ${
                                    active ? 'text-green-600' : 'text-gray-500'
                                }`}
                            >
                                <Icon size={20} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}