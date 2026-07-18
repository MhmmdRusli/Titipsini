import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Keamanan() {
    const { data, setData, put, processing, errors, recentlySuccessful, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [show, setShow] = useState({
        current: false,
        password: false,
        confirmation: false,
    });

    const toggle = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.pengaturan.keamanan.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const fields = [
        { key: 'current_password', name: 'current_password', label: 'Kata sandi lama', autoComplete: 'current-password' },
        { key: 'password', name: 'password', label: 'Kata sandi baru', autoComplete: 'new-password' },
        { key: 'confirmation', name: 'password_confirmation', label: 'Konfirmasi kata sandi baru', autoComplete: 'new-password' },
    ];

    return (
        <AdminLayout title="Keamanan">
            <div className="max-w-lg">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal-100 text-brand-teal-700">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Ganti kata sandi</h2>
                            <p className="text-sm text-gray-500">Gunakan kata sandi yang kuat dan tidak dipakai di tempat lain.</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {fields.map(({ key, name, label, autoComplete }) => (
                            <div key={name}>
                                <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
                                    {label}
                                </label>
                                <div className="relative">
                                    <input
                                        id={name}
                                        type={show[key] ? 'text' : 'password'}
                                        autoComplete={autoComplete}
                                        value={data[name]}
                                        onChange={(e) => setData(name, e.target.value)}
                                        className={`block w-full rounded-lg border px-3 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 ${
                                            errors[name] ? 'border-red-400' : 'border-gray-300'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggle(key)}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                                        tabIndex={-1}
                                    >
                                        {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors[name] && (
                                    <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
                                )}
                            </div>
                        ))}

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-brand-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-teal-800 disabled:opacity-50"
                            >
                                Simpan kata sandi
                            </button>
                            {recentlySuccessful && (
                                <span className="text-sm text-brand-teal-700">Kata sandi berhasil diperbarui</span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}