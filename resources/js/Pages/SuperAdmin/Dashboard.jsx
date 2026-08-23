import { Head, Link, router, usePage } from '@inertiajs/react';
import { BarChart3, LogOut, ShieldCheck, Users, Wallet } from 'lucide-react';
import ProtectedRoute from '@/Components/ProtectedRoute';

export default function Dashboard({ user }) {
    const pageUser = usePage().props.auth?.user || user;

    return (
        <ProtectedRoute allowedRoles={['super_admin']}>
            <Head title="Dashboard Super Admin" />
            <div className="min-h-screen bg-slate-950 text-slate-100">
                <header className="border-b border-white/10 bg-slate-900/80 px-5 py-4 backdrop-blur lg:px-10">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                                <ShieldCheck size={21} />
                            </div>
                            <div>
                                <p className="font-bold">Titipsini</p>
                                <p className="text-xs text-slate-400">Super Admin Portal</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-200"
                        >
                            <LogOut size={15} />
                            Keluar
                        </button>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-5 py-10 lg:px-10">
                    <div className="mb-8">
                        <p className="text-sm font-semibold text-emerald-300">Akses sistem penuh</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Selamat datang, {pageUser?.name || 'Super Admin'}</h1>
                        <p className="mt-2 text-sm text-slate-400">Kelola area internal Titipsini dari satu pusat kontrol.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Link href="/admin/dashboard" className="rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-emerald-400/50 hover:bg-slate-800">
                            <BarChart3 className="text-emerald-300" size={22} />
                            <h2 className="mt-5 font-semibold text-white">Panel Admin</h2>
                            <p className="mt-2 text-sm text-slate-400">Kelola pengguna, pesanan, dan operasional.</p>
                        </Link>
                        <Link href="/finance/dashboard" className="rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-emerald-400/50 hover:bg-slate-800">
                            <Wallet className="text-amber-300" size={22} />
                            <h2 className="mt-5 font-semibold text-white">Panel Finance</h2>
                            <p className="mt-2 text-sm text-slate-400">Pantau transaksi dan proses payout.</p>
                        </Link>
                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                            <Users className="text-sky-300" size={22} />
                            <h2 className="mt-5 font-semibold text-white">Role aktif</h2>
                            <p className="mt-2 text-sm capitalize text-slate-400">{pageUser?.role?.replace('_', ' ') || 'super admin'}</p>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
