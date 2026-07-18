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
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Head title="Masuk" />
            <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6">
                <span className="font-mono text-xs tracking-widest text-brand-teal-700">TITIPSINI</span>
                <h1 className="mt-1 text-lg font-semibold text-gray-900">Masuk ke akun kamu</h1>

                <form onSubmit={submit} className="mt-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 w-full rounded-lg border-gray-300 focus:border-brand-teal-500 focus:ring-brand-teal-500"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 w-full rounded-lg border-gray-300 focus:border-brand-teal-500 focus:ring-brand-teal-500"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-brand-teal-700 py-2 text-sm font-medium text-white hover:bg-brand-teal-600 disabled:opacity-50"
                    >
                        Masuk
                    </button>
                </form>
                <p className="mt-4 text-xs text-gray-500">
                    Admin dan Mitra login lewat form yang sama — sistem akan mengarahkan
                    ke dashboard sesuai role setelah login.
                </p>
            </div>
        </div>
    );
}
