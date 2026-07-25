import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Camera, User, Phone, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
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
        post('/app/profile', { forceFormData: true });
    }

    const getInputClass = (hasError) => `
        w-full rounded-2xl border bg-white dark:bg-gray-800 px-4 py-3 pl-11 text-sm 
        text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
        transition-all duration-200 shadow-sm focus:outline-none focus:ring-4
        ${
            hasError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                : 'border-gray-200 dark:border-gray-700 focus:border-[#15803d] focus:ring-[#15803d]/10 dark:focus:border-[#4ade80]'
        }
    `;

    return (
        <CustomerLayout title="Edit Profil" backHref="/app/profile">
            <Head title="Edit Profil - Titipsini.com" />

            <div className="mx-auto max-w-lg px-4 py-6">
                <form onSubmit={submit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-900/5 dark:border-gray-800 dark:bg-gray-900 md:p-8">
                    
                    {/* Header Avatar Upload Section */}
                    <div className="flex flex-col items-center pb-8 border-b border-gray-100 dark:border-gray-800">
                        <div className="relative group">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ring-4 ring-emerald-50 dark:ring-emerald-950/40 transition duration-300 group-hover:opacity-95 focus:outline-none shadow-md"
                            >
                                {preview ? (
                                    <img src={preview} alt={data.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#15803d] to-emerald-600 text-3xl font-bold text-white">
                                        {data.name ? data.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                                
                                {/* Overlay hover effect */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                                    <Camera className="text-white" size={24} />
                                </div>
                            </button>

                            {/* Floating Badge Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#15803d] text-white shadow-lg ring-4 ring-white dark:ring-gray-900 hover:bg-emerald-700 hover:scale-105 transition"
                            >
                                <Camera size={16} />
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFotoChange}
                            className="hidden"
                        />
                        <p className="mt-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Ketuk foto untuk mengganti <span className="text-gray-400 dark:text-gray-500 font-normal">(Maks. 2MB)</span>
                        </p>
                        {errors.foto && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.foto}</p>}
                    </div>

                    {/* Input Fields Section */}
                    <div className="mt-6 space-y-5">
                        
                        {/* Nama Lengkap */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama lengkap"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={getInputClass(errors.name)}
                                />
                            </div>
                            {errors.name && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name}</p>}
                        </div>

                        {/* Jenis Kelamin (Custom Card Selector) */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                Jenis Kelamin
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'male', label: 'Laki-laki' },
                                    { value: 'female', label: 'Perempuan' },
                                ].map((option) => {
                                    const isSelected = data.gender === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setData('gender', option.value)}
                                            className={`relative flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all shadow-sm ${
                                                isSelected
                                                    ? 'border-[#15803d] bg-emerald-50/50 dark:bg-emerald-950/30 text-[#15803d] dark:text-[#4ade80] font-semibold ring-2 ring-[#15803d]/20'
                                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                        >
                                            <span className="text-sm">{option.label}</span>
                                            {isSelected && <CheckCircle2 size={18} className="text-[#15803d] dark:text-[#4ade80]" />}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.gender && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.gender}</p>}
                        </div>

                        {/* Nomor Telepon */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                Nomor Telepon / Whatsapp
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500">
                                    <Phone size={18} />
                                </span>
                                <input
                                    type="tel"
                                    placeholder="08xxxxxxxxxx"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className={getInputClass(errors.phone)}
                                />
                            </div>
                            {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.phone}</p>}
                        </div>

                        {/* Alamat */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                                Alamat Lengkap
                            </label>
                            <div className="relative">
                                <span className="absolute top-3.5 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500">
                                    <MapPin size= {18} />
                                </span>
                                <textarea
                                    rows={3}
                                    placeholder="Tuliskan alamat domisili lengkap..."
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className={`${getInputClass(errors.address)} resize-none`}
                                />
                            </div>
                            {errors.address && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.address}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#15803d] hover:bg-emerald-700 active:scale-[0.99] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition-all disabled:opacity-60"
                        >
                            {processing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <span>Simpan Perubahan</span>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </CustomerLayout>
    );
}