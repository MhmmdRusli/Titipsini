import { Head, useForm, Link } from '@inertiajs/react';
import { ChevronLeft, Mail } from 'lucide-react';

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
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </Link>
                    <h2 className="text-base font-bold text-gray-900">Lupa Kata Sandi</h2>
                    <div className="w-6"></div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pt-10 pb-8">
                    <div className="mb-10 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center justify-center gap-3">
                            <img
                                src="/images/logo-titipsini.png"
                                alt="Logo Icon"
                                className="h-10 w-auto object-contain"
                            />
                            <div className="text-2xl font-bold tracking-tight text-[#15803d]">
                                Titipsini<span className="text-[#fbbf24] mx-0.5">•</span>Com
                            </div>
                        </div>
                        <p className="text-[13px] text-gray-500 font-medium mt-4 leading-relaxed">
                            Masukkan email akun kamu. Kami akan mengirimkan kode verifikasi
                            untuk mereset kata sandi.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">
                                <span className="text-red-500 mr-0.5">*</span>Email
                            </label>
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
                            {processing ? 'Mengirim...' : 'Kirim Kode Verifikasi'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}