import { Head, useForm, Link } from '@inertiajs/react';
import { Mail } from 'lucide-react';

export default function Email() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="min-h-dvh bg-gray-100 sm:flex sm:items-center sm:justify-center sm:py-6">
            <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white sm:min-h-[850px] sm:shadow-xl">
                <Head title="Lupa Kata Sandi" />

                <div
                    className="flex items-center justify-between border-b border-gray-100 px-4 pb-4"
                    style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
                >
                    <Link
                        href="/login"
                        className="text-gray-800 hover:opacity-70 flex items-center justify-center p-1 rounded-lg active:bg-gray-50"
                    >
                        <span className="text-xl">‹</span>
                    </Link>
                    <h2 className="text-base font-bold text-gray-900">Lupa Kata Sandi</h2>
                    <div className="w-6"></div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pt-8 pb-8">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <img
                                src="/images/logo-titipsini.png"
                                alt="Logo Icon"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="text-xl font-bold tracking-tight text-[#15803d]">
                                Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                            </div>
                        </div>

                        <img
                            src="/images/laptop-kuning.png"
                            alt="Lupa Kata Sandi"
                            className="w-64 h-52 object-contain"
                        />

                        <h1 className="text-lg font-bold text-gray-900 mt-4">Lupa Kata Sandi</h1>
                        <p className="text-[13px] text-gray-500 font-medium mt-2 leading-relaxed px-2">
                            Masukkan email yang kamu gunakan pada saat mendaftar dan kami
                            akan mengirimkan kode verifikasi ke email kamu.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Email</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <Mail size={16} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    name="f_em_reset"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full rounded-xl border-none bg-[#f4f7fc] pl-11 pr-4 py-3.5 text-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 transition-all ${
                                        errors.email ? 'ring-2 ring-red-500' : ''
                                    }`}
                                />
                            </div>
                            {errors.email && <p className="text-xs font-medium text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#166534] active:scale-[0.99] disabled:opacity-50 mt-2 shadow-sm"
                        >
                            {processing ? 'Mengirim...' : 'Kirim'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-gray-400 font-medium">
                        Kembali ke halaman{' '}
                        <Link href="/login" className="font-bold text-[#15803d] hover:underline">
                            Masuk
                        </Link>{' '}
                        atau{' '}
                        <Link href="/register" className="font-bold text-[#15803d] hover:underline">
                            Daftar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}