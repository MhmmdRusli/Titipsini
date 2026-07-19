import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        // Menggunakan background dasar abu-biru terang dengan pola roda gigi (diwakili via CSS/SVG inline)
        <div className="flex min-h-screen w-full items-center justify-center bg-[#f0f4f8] px-4 relative overflow-hidden" 
             style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23dbeafe' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/svg%3E")`
             }}>
            
            <Head title="Login Admin" />

            {/* Container Utama untuk menyeimbangkan Ilustrasi & Card Login */}
            <div className="flex w-full max-w-5xl items-center justify-between gap-10 z-10">
                
                {/* SISI KIRI: Ilustrasi Kurir & Logo Titipsini.com (Sesuai Gambar) */}
                <div className="hidden flex-1 flex-col items-center justify-center lg:flex select-none">
                    {/* Brand Logo */}
                    <div className="mb-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-[#1e3a1e]">
                            <span className="text-[#22c55e]">🛒</span> Titipsini<span className="text-[#22c55e] font-medium">.Com</span>
                        </div>
                        <p className="text-xs text-gray-500 tracking-wide mt-1">Titip barang aman tanpa ribet & terpercaya</p>
                    </div>

                    {/* Ilustrasi Grafik Kurir Motor Bebek Biru */}
                    <div className="relative w-full max-w-md">
                        {/* Lingkaran Hijau Transparan di Background Ilustrasi */}
                        <div className="absolute inset-0 m-auto w-72 height-72 bg-green-100 rounded-full filter blur-xl opacity-70 -z-10"></div>
                        
                        <img 
                            src="/images/courier-illustration.png" // Pastikan asset gambar kurir & motor ditaruh di sini
                            alt="Courier Delivery" 
                            className="w-full object-contain"
                        />
                    </div>
                </div>

                {/* SISI KANAN: Card Login Putih Bersih dengan Bayangan Tegas */}
                <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 mx-auto lg:mx-0">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Login Admin</h1>

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        {/* Input Email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Masukkan email atau username"
                                className={`mt-2 w-full rounded-xl border-gray-200 bg-[#f4f7fa] px-4 py-3 text-sm text-gray-800 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-600 transition-all ${
                                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        {/* Input Kata Sandi */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Kata Sandi</label>
                            <div className="relative mt-2">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan Password Anda"
                                    className={`w-full rounded-xl border-gray-200 bg-[#f4f7fa] pl-4 pr-11 py-3 text-sm text-gray-800 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-600 transition-all ${
                                        errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                        </div>

                        {/* Link Lupa Kata Sandi */}
                        <div className="text-right">
                            <Link href="/admin/forgot-password" className="text-xs text-gray-400 hover:text-green-600 transition-colors">
                                Lupa kata sandi?
                            </Link>
                        </div>

                        {/* Tombol Masuk Hijau Pekat */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-[#007a33] py-3 text-sm font-semibold text-white hover:bg-[#006428] active:bg-[#004d1f] transition-colors shadow-md shadow-green-900/10 disabled:opacity-50"
                        >
                            Masuk
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}