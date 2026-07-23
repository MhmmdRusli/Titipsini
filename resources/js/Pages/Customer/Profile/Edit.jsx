import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function ProfileEdit({ user }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(user.foto);

    const { data, setData, post, processing, errors } = useForm({
        name: user.name ?? '',
        gender: user.gender ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        foto: null,
        _method: 'put',
    });

    function handleFotoChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('foto', file);
        setPreview(URL.createObjectURL(file));
    }

    function submit(e) {
        e.preventDefault();
        // Pakai POST + _method spoofing (bukan put() langsung) karena upload
        // file lewat multipart/form-data tidak didukung method PUT asli di
        // banyak setup server PHP.
        post('/app/profile', { forceFormData: true });
    }

    function inputClass(hasError) {
        return `w-full rounded-lg border bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 ${
            hasError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 dark:border-gray-700 focus:border-[#15803d] focus:ring-[#15803d] dark:focus:border-[#22c55e] dark:focus:ring-[#22c55e]'
        }`;
    }

    return (
        <CustomerLayout title="Edit Profil" backHref="/app/profile">
            <Head title="Edit Profil" />

            <form onSubmit={submit} className="px-4 py-3">
                <div className="flex flex-col items-center">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/50 text-xl font-semibold text-[#15803d] dark:text-[#4ade80]"
                    >
                        {preview ? (
                            <img src={preview} alt={data.name} className="h-20 w-20 rounded-full object-cover" />
                        ) : (
                            data.name.charAt(0).toUpperCase()
                        )}
                        <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#15803d] dark:bg-[#22c55e] text-white ring-2 ring-white dark:ring-gray-800">
                            <Camera size={13} />
                        </span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFotoChange}
                        className="hidden"
                    />
                    {errors.foto && <p className="mt-1 text-xs text-red-500">{errors.foto}</p>}
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Nama Lengkap</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputClass(errors.name)}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Jenis Kelamin</label>
                        <div className="flex gap-6 pt-1">
                            {[
                                { value: 'male', label: 'Laki-laki' },
                                { value: 'female', label: 'Perempuan' },
                            ].map((option) => (
                                <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={data.gender === option.value}
                                        onChange={() => setData('gender', option.value)}
                                        className="accent-[#15803d] dark:accent-[#22c55e]"
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                        {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Nomor Telepon</label>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className={inputClass(errors.phone)}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Alamat</label>
                        <textarea
                            rows={3}
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className={inputClass(errors.address)}
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-6 w-full rounded-xl bg-[#15803d] hover:bg-green-700 dark:bg-[#22c55e] dark:hover:bg-green-600 py-3 text-sm font-semibold text-white transition disabled:opacity-60 shadow-sm"
                >
                    Simpan Perubahan
                </button>
            </form>
        </CustomerLayout>
    );
}