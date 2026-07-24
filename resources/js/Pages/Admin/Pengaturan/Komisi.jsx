import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Percent, Calculator, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Komisi({ commission_rate }) {
    const { flash } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        commission_rate: commission_rate ?? 10,
    });

    const [successMessage, setSuccessMessage] = useState(null);
    const [simulasiNominal, setSimulasiNominal] = useState(100000);

    const komisiNominal = (simulasiNominal * (Number(data.commission_rate) || 0)) / 100;
    const pendapatanMitra = simulasiNominal - komisiNominal;

    function submit(e) {
        e.preventDefault();
        put('/admin/pengaturan/komisi', {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Pengaturan komisi platform berhasil disimpan!');
                setTimeout(() => setSuccessMessage(null), 4000);
            },
        });
    }

    return (
        <AdminLayout title="Komisi Platform">
            <Head title="Pengaturan Komisi" />

            <div className="max-w-5xl mx-auto space-y-6">
                {(flash?.success || successMessage) && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-3 text-green-900 shadow-sm transition-all">
                        <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                        <div className="text-xs font-medium">
                            {flash?.success || successMessage}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                    <Percent size={20} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-gray-900">Komisi Platform</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Persentase yang dipotong dari tiap transaksi mitra sebelum masuk ke saldo mereka.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                                        Persentase Komisi
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            value={data.commission_rate}
                                            onChange={(e) => setData('commission_rate', e.target.value)}
                                            className={`w-full rounded-xl border px-3 py-2.5 pr-8 text-sm text-gray-900 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 ${
                                                errors.commission_rate ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">%</span>
                                    </div>
                                    {errors.commission_rate && <p className="mt-1 text-xs text-red-600">{errors.commission_rate}</p>}
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-xl bg-green-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center gap-2"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 flex gap-3 text-amber-900">
                            <Info size={20} className="shrink-0 text-amber-600 mt-0.5" />
                            <div className="text-xs leading-relaxed">
                                <span className="font-semibold block mb-0.5">Kebijakan Sistem Komisi</span>
                                Perubahan persentase ini hanya berlaku untuk transaksi baru yang diverifikasi setelah pengaturan disimpan. Transaksi yang sudah selesai tidak akan terpengaruh.
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2.5 text-gray-900">
                                <Calculator size={18} className="text-green-700" />
                                <h3 className="text-sm font-bold">Simulasi Pendapatan</h3>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">
                                Uji coba perhitungan pembagian hasil berdasarkan persentase komisi saat ini.
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Contoh Nominal Transaksi (Rp)</label>
                                    <input
                                        type="number"
                                        value={simulasiNominal}
                                        onChange={(e) => setSimulasiNominal(Number(e.target.value))}
                                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 bg-gray-50/50"
                                    />
                                </div>

                                <div className="rounded-xl bg-gray-50 p-3 space-y-2 border border-gray-100">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Potongan Komisi ({data.commission_rate}%):</span>
                                        <span className="font-bold text-red-600">Rp {komisiNominal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
                                        <span className="text-gray-700 font-medium">Diterima Mitra:</span>
                                        <span className="font-bold text-green-700">Rp {pendapatanMitra.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
                                <ShieldCheck size={18} />
                            </div>
                            <div className="text-xs">
                                <span className="font-bold text-gray-900 block">Aman & Otomatis</span>
                                <span className="text-gray-500">Sistem memotong saldo secara otomatis saat transaksi selesai.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}