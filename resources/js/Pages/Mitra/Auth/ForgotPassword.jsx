import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';

export default function ForgotPassword() {
    const { props } = usePage();
    const status = props.flash?.status;

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('mitra.password.email'));
    };

    return (
        <div className="min-h-dvh bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Lupa Kata Sandi" />

            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-y-auto bg-white px-6 py-8 sm:h-[850px] sm:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <KeyRound size={22} />
                </div>

                <h1 className="mt-6 text-xl font-bold text-gray-900">Lupa Kata Sandi?</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Masukkan email akun mitra kamu, nanti kami kirim tautan buat bikin kata sandi baru.
                </p>

                {status && (
                    <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{status}</p>
                )}

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@email.com"
                            className={`block w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors.email ? 'border-red-400' : 'border-gray-300'
                            }`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-full bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                    >
                        Kirim Tautan Pemulihan
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Sudah ingat kata sandinya?{' '}
                    <Link href={route('mitra.login')} className="font-semibold text-green-700 hover:underline">
                        Masuk
                    </Link>
                </p>
            </div>
        </div>
    );
}