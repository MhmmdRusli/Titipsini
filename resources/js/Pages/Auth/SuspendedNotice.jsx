import { Head, Link, useForm } from '@inertiajs/react';

export default function SuspendedNotice({ reason, alreadyRequested }) {
    const { post, processing, recentlySuccessful } = useForm();

    const handleRestore = (e) => {
        e.preventDefault();
        post(typeof route !== 'undefined' ? route('mitra.request.restoration') : '/mitra/ajukan-pemulihan');
    };

    return (
        <div className="min-h-dvh bg-gray-200 dark:bg-gray-950 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Akun Ditangguhkan - Titipsini" />

            <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 sm:h-[850px] sm:shadow-xl border-x border-slate-200/80 dark:border-gray-800">
                {/* Header Navbar persis seperti CustomerLayout */}
                <header className="sticky top-0 z-20 shrink-0 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
                    <div
                        className="flex items-center gap-3 px-4 pb-3"
                        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
                    >
                        <div className="flex flex-1 items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <img
                                    src="/images/logo-titipsini.png"
                                    alt="Logo"
                                    className="h-6 w-auto object-contain"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                <span className="text-base font-bold tracking-tight text-[#15803d] dark:text-[#4ade80]">
                                    Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                                </span>
                            </div>

                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
                                ⚠️
                            </div>
                        </div>
                    </div>
                </header>

                {/* Konten Halaman */}
                <main className="flex-1 p-6 flex flex-col justify-between text-center">
                    <div>
                        <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4 shadow-sm border border-amber-100/50">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>

                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Akun Ditangguhkan</h1>
                        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                            Mohon maaf, akun mitra Anda ditangguhkan karena terdeteksi melakukan pelanggaran ketentuan layanan <span className="font-semibold text-gray-700 dark:text-gray-300">TitipSini</span>.
                        </p>
                        
                        <div className="mt-5 rounded-xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 text-left">
                            <p className="text-[11px] font-bold tracking-wider text-red-700 dark:text-red-400 uppercase">Catatan / Alasan Pelanggaran:</p>
                            <p className="mt-1.5 text-xs text-red-900 dark:text-red-300 font-medium leading-relaxed">{reason ?? 'Tidak ada catatan khusus dari admin.'}</p>
                        </div>

                        {recentlySuccessful && (
                            <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2 font-medium">
                                <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Permintaan pemulihan berhasil dikirim! Silakan tunggu konfirmasi admin.</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pb-6 flex flex-col gap-2.5">
                        {alreadyRequested ? (
                            <div className="w-full rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
                                Permintaan sudah terkirim, menunggu konfirmasi admin.
                            </div>
                        ) : (
                            <form onSubmit={handleRestore}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-3 text-xs font-semibold text-white shadow-sm active:scale-[0.98] transition disabled:opacity-50"
                                >
                                    {processing ? 'Mengirim...' : 'Ajukan Pemulihan Akun'}
                                </button>
                            </form>
                        )}

                        <Link
                            href="/register"
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] transition text-center inline-block"
                        >
                            Buat Akun Baru
                        </Link>

                        <div className="pt-2 text-center">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-[11px] font-medium text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                            >
                                Keluar (Logout)
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}