import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, Building2 } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const BENEFITS = [
    'Keamanan terjaga',
    'Kontrol berkala setiap hari',
    'Bisa diambil kapan saja',
    'Konsultasi & Support',
];

function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID').format(value);
}

export default function Show({ service }) {
    const [tanggalMasuk, setTanggalMasuk] = useState('');
    const [tanggalKeluar, setTanggalKeluar] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!tanggalMasuk || !tanggalKeluar) {
            setError('Tanggal masuk dan keluar wajib diisi.');
            return;
        }
        setError('');
        setProcessing(true);
        router.post(
            `/app/services/${service.id}/pesan`,
            { tanggalMasuk, tanggalKeluar },
            { onFinish: () => setProcessing(false) }
        );
    }

    return (
        <CustomerLayout title="Detail Layanan" backHref="/app/dashboard">
            <Head title="Detail Layanan" />

            <div className="px-4 py-3">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-5 text-white shadow-md">
                    <div className="absolute right-4 top-4 rounded-xl bg-white/15 p-2">
                        <Building2 size={20} />
                    </div>

                    <p className="text-2xl font-extrabold leading-none">
                        {formatRupiah(service.harga)}
                        <span className="ml-1 text-sm font-semibold align-middle">(1 item)</span>
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/90">Layanan Terbaik Kami</p>

                    <ul className="mt-4 space-y-1.5">
                        {BENEFITS.map((b) => (
                            <li key={b} className="flex items-center gap-2 text-xs text-white/90">
                                <ShieldCheck size={14} className="shrink-0 text-white" />
                                {b}
                            </li>
                        ))}
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-900">
                            {service.kategori === 'kendaraan' ? 'Kendaraan' : 'Bangunan'}
                        </label>
                        <div className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                            {service.jenisLabel}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900">Tanggal masuk</label>
                        <input
                            type="date"
                            value={tanggalMasuk}
                            onChange={(e) => setTanggalMasuk(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900">Tanggal keluar</label>
                        <input
                            type="date"
                            value={tanggalKeluar}
                            onChange={(e) => setTanggalKeluar(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {error && <p className="text-xs text-red-600">{error}</p>}

                    <p className="text-[11px] text-red-500">
                        *Jika menitipkan {service.kategori === 'kendaraan' ? 'kendaraan' : 'bangunan'} melebihi batas
                        yang sudah ditentukan tanpa konfirmasi maka akan dikenakan denda sebesar Rp 10.000/hari.
                    </p>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}