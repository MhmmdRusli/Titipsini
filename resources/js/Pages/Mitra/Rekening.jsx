import { Head, useForm, Link } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft, Landmark, Pencil } from 'lucide-react';

export default function Rekening({ rekening }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_bank: rekening?.nama_bank ?? '',
        nomor_rekening: rekening?.nomor_rekening ?? '',
        nama_pemilik: rekening?.nama_pemilik ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/mitra/rekening');
    };

    return (
        <MitraLayout>
            <Head title="Rekening Bank" />

            <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
                <button type="button" onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-base font-semibold text-gray-900">Tarik Saldo</h1>
            </div>
            <div className="px-4 py-4">
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-3.5">
                    <Landmark size={18} className="shrink-0 text-green-700" />
                    <p className="text-xs text-green-800">
                        Rekening ini akan menjadi tujuan pencairan dana setiap kali kamu melakukan penarikan saldo.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <Field label="Nama Bank" placeholder="Contoh: BCA, Mandiri, BRI" value={data.nama_bank} onChange={(v) => setData('nama_bank', v)} error={errors.nama_bank} />
                    <Field label="Nomor Rekening" placeholder="Masukkan nomor rekening" value={data.nomor_rekening} onChange={(v) => setData('nomor_rekening', v.replace(/\D/g, ''))} error={errors.nomor_rekening} inputMode="numeric" />
                    <Field label="Nama Pemilik Rekening" placeholder="Sesuai buku tabungan" value={data.nama_pemilik} onChange={(v) => setData('nama_pemilik', v)} error={errors.nama_pemilik} />

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                    >
                        Simpan Rekening
                    </button>
                </form>
            </div>
        </MitraLayout>
    );
}

function Field({ label, value, onChange, error, placeholder, inputMode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative mt-1">
                <input
                    type="text"
                    inputMode={inputMode}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full rounded-lg text-sm pr-8 ${error ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        }`}
                />
                <Pencil size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}