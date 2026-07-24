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
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700">
                            <Percent size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Komisi Platform</h2>
                            <p className="text-xs text-gray-500">
                                Persentase yang dipotong dari tiap transaksi mitra sebelum masuk ke saldo mereka.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Persentase Komisi</label>
                            <div className="relative mt-1">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={data.komisi_persen}
                                    onChange={(e) => setData('komisi_persen', e.target.value)}
                                    className={`w-full rounded-lg pr-8 text-sm ${
                                        errors.komisi_persen ? 'border-red-500' : 'border-gray-300 focus:border-green-600 focus:ring-green-600'
                                    }`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
                            </div>
                            {errors.komisi_persen && <p className="mt-1 text-xs text-red-600">{errors.komisi_persen}</p>}
                            <p className="mt-1.5 text-xs text-gray-400">
                                Contoh: kalau diisi 10, dari transaksi Rp100.000 mitra menerima Rp90.000 dan Rp10.000 masuk sebagai pendapatan platform.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                        >
                            Simpan Perubahan
                        </button>
                    </form>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                    Perubahan ini cuma berlaku untuk transaksi yang diverifikasi setelah disimpan — tidak mengubah transaksi yang sudah selesai sebelumnya.
                </p>
            </div>
        </AdminLayout>
    );
}