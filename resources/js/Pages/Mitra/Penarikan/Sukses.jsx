import { Head, Link } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { CheckCircle2, Clock3 } from 'lucide-react';

function formatRupiah(angka) {
    return 'Rp' + Number(angka).toLocaleString('id-ID');
}

export default function PenarikanSukses({ penarikan }) {
    const sedangDiproses = penarikan.status === 'pending' || penarikan.status === 'diproses';

    return (
        <MitraLayout>
            <Head title="Penarikan Diajukan" />

            <div className="flex flex-col items-center px-6 py-10 text-center">
                {sedangDiproses ? (
                    <Clock3 size={56} className="text-amber-500" />
                ) : (
                    <CheckCircle2 size={56} className="text-green-600" />
                )}

                <h1 className="mt-4 text-lg font-semibold text-gray-900">
                    {sedangDiproses ? 'Penarikan Sedang Diproses' : 'Penarikan Berhasil'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {sedangDiproses
                        ? 'Dana akan masuk ke rekening kamu dalam waktu 1x24 jam.'
                        : 'Dana sudah masuk ke rekening tujuan.'}
                </p>

                <div className="mt-6 w-full space-y-3 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm">
                    <Row label="Nomor Referensi" value={'PNR-' + String(penarikan.id).padStart(6, '0')} />
                    <Row label="Jumlah" value={formatRupiah(penarikan.jumlah)} bold />
                    <Row label="Bank Tujuan" value={penarikan.nama_bank} />
                    <Row label="Nomor Rekening" value={penarikan.nomor_rekening} />
                    <Row label="Nama Pemilik" value={penarikan.nama_pemilik} />
                    <Row label="Tanggal" value={penarikan.tanggal} />
                    <Row
                        label="Status"
                        value={
                            sedangDiproses ? 'Diproses' : penarikan.status === 'selesai' ? 'Selesai' : 'Ditolak'
                        }
                        badge={sedangDiproses ? 'amber' : penarikan.status === 'selesai' ? 'green' : 'red'}
                    />
                </div>

                <Link
                    href="/mitra/pendapatan/penarikan"
                    className="mt-6 w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600"
                >
                    Kembali ke Detail Saldo
                </Link>
            </div>
        </MitraLayout>
    );
}

function Row({ label, value, bold, badge }) {
    const badgeClass = {
        amber: 'bg-amber-100 text-amber-700',
        green: 'bg-green-100 text-green-700',
        red: 'bg-red-100 text-red-600',
    }[badge];

    return (
        <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-2 last:border-0 last:pb-0">
            <span className="text-xs text-gray-500">{label}</span>
            {badge ? (
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeClass}`}>{value}</span>
            ) : (
                <span className={`text-sm ${bold ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{value}</span>
            )}
        </div>
    );
}