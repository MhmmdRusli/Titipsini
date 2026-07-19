import { Head, useForm, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

export default function Verify({ email }) {
    const { data, setData, post, processing, errors } = useForm({
        otp_code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password/verify');
    };

    return (
        <div className="min-h-dvh bg-gray-100 sm:flex sm:items-center sm:justify-center sm:py-6">
            <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white sm:min-h-[850px] sm:shadow-xl">
                <Head title="Verifikasi Kode" />

                <div
                    className="flex items-center justify-between border-b border-gray-100 px-4 pb-4"
                    style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
                >
                    <Link
                        href="/forgot-password"
                        className="text-gray-800 hover:opacity-70 flex items-center justify-center p-1 rounded-lg active:bg-gray-50"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </Link>
                    <h2 className="text-base font-bold text-gray-900">Verifikasi Kode</h2>
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
                            Kode verifikasi sudah dikirim ke{' '}
                            <span className="font-semibold text-gray-700">{email}</span>.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700 text-center">
                                Kode Verifikasi
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                autoComplete="off"
                                name="f_otp_reset"
                                placeholder="123456"
                                value={data.otp_code}
                                onChange={(e) => setData('otp_code', e.target.value.replace(/\D/g, ''))}
                                className={`w-full rounded-xl border-none bg-[#f4f7fc] px-4 py-3.5 text-center text-lg tracking-[0.5em] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#15803d]/30 transition-all ${
                                    errors.otp_code ? 'ring-2 ring-red-500' : ''
                                }`}
                            />
                            {errors.otp_code && (
                                <p className="text-xs font-medium text-red-500 mt-1 text-center">{errors.otp_code}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || data.otp_code.length !== 6}
                            className="w-full rounded-xl bg-[#15803d] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#166534] active:scale-[0.99] disabled:opacity-50 mt-2 shadow-sm"
                        >
                            {processing ? 'Memproses...' : 'Verifikasi'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}