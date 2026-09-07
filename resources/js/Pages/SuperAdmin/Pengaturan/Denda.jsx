import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { AlertTriangle, Package, Building2, Car, Truck, Info } from 'lucide-react';

const KATEGORI_META = {
    barang: { label: 'Barang', icon: Package },
    bangunan: { label: 'Bangunan', icon: Building2 },
    kendaraan: { label: 'Kendaraan', icon: Car },
    pindahan: { label: 'Pindahan', icon: Truck },
};

export default function Denda({ settings }) {
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        settings: settings,
    });

    function updateField(index, field, value) {
        const next = [...data.settings];
        next[index] = { ...next[index], [field]: value };
        setData('settings', next);
    }

    function handleSubmit(e) {
        e.preventDefault();
        put(route('super-admin.pengaturan.denda.update'), { preserveScroll: true });
    }

    return (
        <SuperAdminLayout title="Denda Keterlambatan">
            {flash?.success && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                    {flash.success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px] items-start">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
                        <div className="mb-5 flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                <AlertTriangle size={18} />
                            </span>
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Denda Keterlambatan</h2>
                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                    Persentase yang dikenakan per hari keterlambatan, dihitung dari total harga pesanan. Berlaku berbeda tiap kategori layanan.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {data.settings.map((item, index) => {
                                const meta = KATEGORI_META[item.service_type] ?? { label: item.service_type, icon: Package };
                                const Icon = meta.icon;

                                return (
                                    <div
                                        key={item.service_type}
                                        className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-slate-800/40"
                                    >
                                        <div className="mb-3 flex items-center gap-2">
                                            <Icon size={15} className="text-gray-500 dark:text-gray-400" />
                                            <span className="text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-200">
                                                {meta.label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-gray-400">
                                                    Denda per Hari (%)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                        value={item.persen_per_hari}
                                                        onChange={(e) => updateField(index, 'persen_per_hari', e.target.value)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-800 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-200"
                                                    />
                                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">%</span>
                                                </div>
                                                {errors?.[`settings.${index}.persen_per_hari`] && (
                                                    <p className="mt-1 text-[11px] text-red-500">{errors[`settings.${index}.persen_per_hari`]}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-gray-400">
                                                    Denda Maksimal (%)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                        value={item.max_persen}
                                                        onChange={(e) => updateField(index, 'max_persen', e.target.value)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-800 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-200"
                                                    />
                                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">%</span>
                                                </div>
                                                {errors?.[`settings.${index}.max_persen`] && (
                                                    <p className="mt-1 text-[11px] text-red-500">{errors[`settings.${index}.max_persen`]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-5 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                            <div className="flex items-start gap-2">
                                <Info size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                                <div>
                                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Kebijakan Denda</p>
                                    <p className="mt-1 text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-300/80">
                                        Denda dihitung otomatis dari selisih tanggal seharusnya selesai (end_date) dengan tanggal pesanan benar-benar ditandai selesai oleh mitra. Denda 100% masuk ke saldo mitra, tidak dipotong komisi platform.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-slate-900">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">Contoh Perhitungan</p>
                            <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                                Pesanan barang Rp100.000, terlambat 2 hari, tarif 2%/hari:
                                <br />
                                <span className="font-mono">100.000 × 2% × 2 = Rp4.000</span>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </SuperAdminLayout>
    );
}
