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
        return `w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${
            hasError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
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
                        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-xl font-semibold text-green-700"
                    >
                        {preview ? (
                            <img src={preview} alt={data.name} className="h-20 w-20 rounded-full object-cover" />
                        ) : (
                            data.name.charAt(0).toUpperCase()
                        )}
                        <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-white ring-2 ring-white">
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
                        <label className="mb-1 block text-xs font-medium text-gray-600">Nama Lengkap</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputClass(errors.name)}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Jenis Kelamin</label>
                        <div className="flex gap-6 pt-1">
                            {[
                                { value: 'male', label: 'Laki-laki' },
                                { value: 'female', label: 'Perempuan' },
                            ].map((option) => (
                                <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={data.gender === option.value}
                                        onChange={() => setData('gender', option.value)}
                                        className="accent-green-600"
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                        {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Nomor Telepon</label>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className={inputClass(errors.phone)}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Alamat</label>
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
                    className="mt-6 w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                    Simpan Perubahan
                </button>
            </form>
        </CustomerLayout>
    );
}