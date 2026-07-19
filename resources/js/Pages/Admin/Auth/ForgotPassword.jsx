import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/forgot-password');
    };

    return (
        <div
            className="flex min-h-screen w-full items-center justify-center bg-[#f0f4f8] px-4 relative overflow-hidden"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23dbeafe' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
        >
            <Head title="Lupa Kata Sandi Admin" />

            <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 z-10">
                <div className="mb-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-xl font-bold text-[#3B8F55]">
                        <img src="/images/logo-titipsini.png" alt="Logo" className="h-7 w-7 object-contain" />
                        <span className="tracking-tight font-extrabold text-[#3B8F55]">
                            Titipsini
                            <span className="text-yellow-400 mx-0.5">●</span>
                            Com
                        </span>
                    </div>
                </div>

                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Lupa Kata Sandi</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Masukkan email admin kamu, kami akan kirim link untuk atur ulang kata sandi.
                </p>

                {status && (
                    <div className="mt-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Email
                        </label>
                        <div className="relative mt-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                <Mail size={16} />
                            </span>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="admin@titipsini.test"
                                className={`w-full rounded-xl border-gray-200 bg-[#f4f7fa] pl-11 pr-4 py-3 text-sm text-gray-800 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-600 transition-all ${
                                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-xl bg-[#3B8F55] py-3 text-sm font-semibold text-white hover:bg-[#317646] active:bg-[#275e38] transition-colors shadow-md shadow-green-900/10 disabled:opacity-50"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Link Reset'}
                    </button>
                </form>

                <Link
                    href="/admin/login"
                    className="mt-6 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#3B8F55] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Kembali ke halaman login
                </Link>
            </div>
        </div>
    );
}