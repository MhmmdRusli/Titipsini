import { Head, useForm, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft, Camera, Pencil, User as UserIcon } from 'lucide-react';

export default function ProfileEdit({ partner }) {
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(partner.avatar);
    const [coverPreview, setCoverPreview] = useState(partner.cover_photo);

    const { data, setData, post, processing, errors } = useForm({
        name: partner.name ?? '',
        email: partner.email ?? '',
        phone: partner.phone ?? '',
        gender: partner.gender ?? '',
        birth_date: partner.birth_date ?? '',
        avatar: null,
        cover_photo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/mitra/profil/saya', { forceFormData: true });
    };

    const onAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const onCoverChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_photo', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    return (
        <MitraLayout>
            <Head title="Profil Saya" />

            <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
                <Link href="/mitra/profil" className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-base font-semibold text-gray-900">Profil Saya</h1>
            </div>

            {/* Cover + avatar */}
            <div className="relative h-36 bg-gray-200">
                {coverPreview ? (
                    <img src={coverPreview} alt="Cover" className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-green-600 to-green-800" />
                )}
                <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow"
                >
                    <Camera size={14} />
                </button>
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={onCoverChange} />

                <div className="absolute -bottom-8 left-4">
                    <div className="relative h-16 w-16">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="h-16 w-16 rounded-full border-4 border-white object-cover" />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-gray-400">
                                <UserIcon size={26} />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white shadow"
                        >
                            <Camera size={11} />
                        </button>
                        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4 px-4 pb-6 pt-12">
                <Field label="Nama Lengkap" value={data.name} onChange={(v) => setData('name', v)} error={errors.name} />
                <Field label="Email" type="email" value={data.email} onChange={(v) => setData('email', v)} error={errors.email} />

                <div>
                    <label className="block text-sm font-medium text-gray-700">ID Vendor</label>
                    <input
                        type="text"
                        value={partner.vendor_id ?? ''}
                        readOnly
                        className="mt-1 w-full rounded-lg border-gray-200 bg-gray-100 text-sm text-gray-500"
                    />
                </div>

                {/* Radio Button Gender Disesuaikan ke male & female */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                    <div className="mt-1 flex gap-4">
                        <label className="flex items-center gap-1.5 text-sm text-gray-700">
                            <input
                                type="radio"
                                name="gender"
                                checked={data.gender === 'male'}
                                onChange={() => setData('gender', 'male')}
                                className="text-green-600 focus:ring-green-500"
                            />
                            Pria
                        </label>
                        <label className="flex items-center gap-1.5 text-sm text-gray-700">
                            <input
                                type="radio"
                                name="gender"
                                checked={data.gender === 'female'}
                                onChange={() => setData('gender', 'female')}
                                className="text-green-600 focus:ring-green-500"
                            />
                            Wanita
                        </label>
                    </div>
                    {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
                </div>

                <Field label="Nomor Telepon" value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} />
                <Field label="Tanggal Lahir" type="date" value={data.birth_date} onChange={(v) => setData('birth_date', v)} error={errors.birth_date} />

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                >
                    Simpan
                </button>
            </form>
        </MitraLayout>
    );
}

function Field({ label, value, onChange, error, type = 'text' }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative mt-1">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full rounded-lg text-sm pr-8 ${error ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'}`}
                />
                <Pencil size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}