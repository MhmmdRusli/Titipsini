import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { ArrowLeft, Power, AlertCircle, X } from 'lucide-react';

// Sama seperti di AdminIndex.jsx — sesuaikan kalau berpindah ke route()/Ziggy.
const BASE_PATH = '/super-admin/user/admin';

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

export default function AdminShow({ user }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [processing, setProcessing] = useState(false);

    function handleToggleActive() {
        setProcessing(true);
        router.patch(`/super-admin/user/${user.id}/toggle-active`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowConfirm(false);
            },
        });
    }

    return (
        <SuperAdminLayout title="Detail Admin">
            <Head title={`Detail - ${user.name}`} />

            <Link
                href={BASE_PATH}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
            >
                <ArrowLeft size={16} />
                Kembali ke daftar admin
            </Link>

            <div className="max-w-lg">
                <div className="rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm transition-colors">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/50 text-2xl font-semibold text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/40 overflow-hidden">
                            {user.foto ? (
                                <img src={user.foto} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
                            ) : (
                                user.name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <h2 className="mt-3 text-base font-semibold text-slate-800 dark:text-gray-100">{user.name}</h2>
                        <span className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-gray-500">
                            Admin
                        </span>
                        <span
                            className={`mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                user.is_active
                                    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/60 dark:text-green-400 dark:border-green-800/50'
                                    : 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                            }`}
                        >
                            {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                    </div>

                    <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-gray-400">Email</dt>
                            <dd className="text-slate-800 dark:text-gray-200 font-medium">{user.email}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-gray-400">No. Telepon</dt>
                            <dd className="text-slate-800 dark:text-gray-200 font-medium">{user.phone ?? '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-gray-400">Dibuat Sejak</dt>
                            <dd className="text-slate-800 dark:text-gray-200 font-medium">{formatDate(user.created_at)}</dd>
                        </div>
                    </dl>

                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm transition-colors ${
                            user.is_active
                                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/50 dark:hover:bg-red-950/60'
                                : 'bg-green-700 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500'
                        }`}
                    >
                        <Power size={15} />
                        {user.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                    </button>
                </div>
            </div>

            {/* Modal konfirmasi toggle aktif/nonaktif */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-2xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${
                                    user.is_active
                                        ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                                        : 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400'
                                }`}>
                                    <AlertCircle size={22} />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                    {user.is_active ? 'Nonaktifkan Akun?' : 'Aktifkan Akun?'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                            {user.is_active
                                ? `${user.name} tidak akan bisa masuk ke sistem sampai diaktifkan kembali.`
                                : `${user.name} akan bisa masuk kembali ke sistem.`}
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => setShowConfirm(false)}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={handleToggleActive}
                                className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-60 ${
                                    user.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-700 hover:bg-green-700'
                                }`}
                            >
                                {processing ? 'Memproses...' : 'Ya, Lanjutkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}