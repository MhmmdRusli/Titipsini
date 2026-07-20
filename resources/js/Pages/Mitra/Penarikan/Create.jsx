import { Head, useForm, Link } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft, Landmark, Lock, AlertCircle } from 'lucide-react';

const NOMINAL_INSTAN = [100000, 250000, 500000, 1000000];

function formatRupiah(angka) {
    if (!angka) return '';
    return Number(angka).toLocaleString('id-ID');
}

export default function PenarikanCreate({ saldo, rekening }) {
    const { data, setData, post, processing, errors } = useForm({
        jumlah: '',
        pin: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/mitra/pendapatan/penarikan');
    };

    const pilihNominal = (nilai) => {
        setData('jumlah', String(nilai));
    };

    const onManualChange = (v) => {
        const angka = v.replace(/\D/g, '');
        setData('jumlah', angka);
    };

    if (!rekening) {
        return (
            <MitraLayout>
                <Head title="Tarik Saldo" />
                <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
                    <Link href="/mitra/pendapatan/penarikan" className="text-gray-500 hover:text-gray-700">
                        <ChevronLeft size={20} />
                    </Link>
                    <h1 className="text-base font-semibold text-gray-900">Tarik Saldo</h1>
                </div>
                <div className="mx-4 mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />
                    <div>
                        <p className="text-sm font-medium text-amber-800">Rekening bank belum ditambahkan</p>
                        <p className="mt-1 text-xs text-amber-700">Tambahkan rekening bank tujuan terlebih dahulu sebelum menarik saldo.</p>
                        <Link href="/mitra/rekening" className="mt-2 inline-block text-xs font-semibold text-amber-800 underline">
                            Tambah Rekening
                        </Link>
                    </div>
                </div>
            </MitraLayout>
        );
    }

    return (
        <MitraLayout>
            <Head title="Tarik Saldo" />

            <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
                <Link href="/mitra/pendapatan/penarikan" className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-base font-semibold text-gray-900">Tarik Saldo</h1>
            </div>

            <form onSubmit={submit} className="space-y-5 px-4 py-4">
                <div className="rounded-xl border border-gray-100 bg-white p-3.5 text-center shadow-sm">
                    <p className="text-xs text-gray-500">Saldo Tersedia</p>
                    <p className="text-lg font-bold text-gray-900">Rp{formatRupiah(saldo)}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Pilih Nominal</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {NOMINAL_INSTAN.map((n) => (
                            <button
                                type="button"
                                key={n}
                                onClick={() => pilihNominal(n)}
                                disabled={n > saldo}
                                className={`rounded-lg border py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
                                    Number(data.jumlah) === n ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-700'
                                }`}
                            >
                                Rp{formatRupiah(n)}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Atau Masukkan Jumlah Manual</label>
                    <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Rp</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatRupiah(data.jumlah)}
                            onChange={(e) => onManualChange(e.target.value)}
                            placeholder="0"
                            className={`w-full rounded-lg pl-9 text-sm ${
                                errors.jumlah ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                            }`}
                        />
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400">Minimal penarikan Rp100.000</p>
                    {errors.jumlah && <p className="mt-1 text-xs text-red-600">{errors.jumlah}</p>}
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
                    <Landmark size={18} className="shrink-0 text-green-600" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">{rekening.nama_bank}</p>
                        <p className="text-xs text-gray-500">{rekening.nomor_rekening} • {rekening.nama_pemilik}</p>
                    </div>
                    <Link href="/mitra/rekening" className="shrink-0 text-xs font-medium text-green-700 hover:underline">
                        Ganti
                    </Link>
                </div>

                <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Lock size={13} />
                        Verifikasi PIN
                    </label>
                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={data.pin}
                        onChange={(e) => setData('pin', e.target.value.replace(/\D/g, ''))}
                        placeholder="Masukkan PIN kamu"
                        className={`mt-1 w-full rounded-lg text-sm tracking-widest ${
                            errors.pin ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        }`}
                    />
                    {errors.pin && <p className="mt-1 text-xs text-red-600">{errors.pin}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing || !data.jumlah || !data.pin}
                    className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                >
                    Konfirmasi Penarikan
                </button>
            </form>
        </MitraLayout>
    );
}