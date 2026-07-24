import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Percent } from 'lucide-react';

export default function Komisi({ komisi_persen }) {
    const { data, setData, put, processing, errors } = useForm({
        komisi_persen: komisi_persen ?? 10,
    });

    function submit(e) {
        e.preventDefault();
        put('/admin/pengaturan/komisi');
    }

    return (
        <AdminLayout title="Komisi Platform">
            <Head title="Pengaturan Komisi" />

            <div className="max-w-lg">
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
                                    value={data.komisi_persen}
                                    onChange={(e) => setData('komisi_persen', e.target.value)}
                                    className={`w-full rounded-xl border px-3 py-2.5 pr-8 text-sm text-gray-900 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 ${
                                        errors.komisi_persen ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">%</span>
                            </div>
                            {errors.komisi_persen && <p className="mt-1 text-xs text-red-600">{errors.komisi_persen}</p>}
                            <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                                Contoh: kalau diisi 10, dari transaksi Rp100.000 mitra menerima Rp90.000 dan Rp10.000 masuk sebagai pendapatan platform.
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-green-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-green-800 transition-colors disabled:opacity-60"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                    Perubahan ini cuma berlaku untuk transaksi yang diverifikasi setelah disimpan — tidak mengubah transaksi yang sudah selesai sebelumnya.
                </p>
            </div>
        </AdminLayout>
    );
}