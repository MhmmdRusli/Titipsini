import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        // Menggunakan min-h-dvh agar full mengikuti layar HP
        // (Warna background layar luar dibuat sedikit abu-abu agar frame terlihat)
        <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 p-6">
            <Head title="Masuk" />
            
            {/* Wrapper utama dengan Frame (Border + Shadow + Background Putih) */}
            <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                
                <div className="mb-8">
                    <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-brand-teal-700">TITIPSINI</span>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900">Selamat datang</h1>
                    <p className="mt-1 text-sm text-gray-500">Silakan masuk ke akun Anda</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-900">Email</label>
                        <input
                            type="email"
                            placeholder="nama@email.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 py-3.5 text-base focus:border-brand-teal-500 focus:bg-white focus:ring-brand-teal-500"
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <label className="block text-sm font-semibold text-gray-900">Password</label>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 py-3.5 text-base focus:border-brand-teal-500 focus:bg-white focus:ring-brand-teal-500"
                        />
                        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-2 w-full rounded-xl bg-brand-teal-700 py-4 text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Masuk Sekarang'}
                    </button>
                </form>

                <p className="mt-8 text-center text-[11px] leading-relaxed text-gray-400">
                    Sistem akan mengarahkan Anda ke dashboard <br /> berdasarkan role akun Anda.
                </p>
            </div>
        </div>
    );
}