import { Head, Link, router, useForm } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ArrowLeft } from 'lucide-react';

const money = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value ?? 0);

export default function Show({ claim }) {
    const { data, setData, post, processing, errors } = useForm({ klarifikasi: '', foto: [] });
    const photos = Array.isArray(claim.foto_urls) ? claim.foto_urls : [];
    const partnerPhotos = Array.isArray(claim.mitra_foto_urls) ? claim.mitra_foto_urls : [];
    const canClarify = claim.status === 'menunggu_klarifikasi_mitra';

    function submit(e) {
        e.preventDefault();
        post(`/mitra/klaim/${claim.id}/klarifikasi`, { forceFormData: true, preserveScroll: true });
    }

    return (
        <MitraLayout title="Detail Klaim">
            <Head title={`Klaim ${claim.order_code ?? ''}`} />
            <main className="mx-auto max-w-3xl space-y-4 p-4">
                <Link href="/mitra/klaim" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700"><ArrowLeft size={16} />Kembali ke klaim</Link>
                <section className="rounded-2xl border bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-xs text-gray-500">Klaim #{claim.id} · {claim.created_at}</p>
                    <h1 className="mt-1 text-xl font-bold">Order {claim.order_code}</h1>
                    <p className="mt-1 text-sm text-gray-500">{claim.customer_name} · {claim.status_label}</p>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-gray-500">Barang / layanan</dt><dd>{claim.order?.item_name ?? claim.item_name ?? '-'}</dd></div><div><dt className="text-gray-500">Nilai pesanan</dt><dd>{money(claim.order?.total_price ?? claim.total_price)}</dd></div></dl>
                    <h2 className="mt-5 font-semibold">Alasan klaim</h2><p className="mt-1 whitespace-pre-wrap text-sm">{claim.alasan}</p>
                </section>
                {photos.length > 0 && <section className="rounded-2xl border bg-white p-5 dark:border-gray-700 dark:bg-gray-800"><h2 className="mb-3 font-semibold">Bukti dari pelanggan</h2><div className="flex flex-wrap gap-3">{photos.map((url, i) => <a key={i} href={url} target="_blank" rel="noreferrer"><img src={url} alt={`Bukti ${i + 1}`} className="h-24 w-24 rounded-lg object-cover" /></a>)}</div></section>}
                {claim.kondisi_awal && <section className="rounded-2xl border bg-white p-5 dark:border-gray-700 dark:bg-gray-800"><h2 className="font-semibold">Kondisi saat diterima</h2><p className="mt-2 text-sm">{claim.kondisi_awal.catatan ?? 'Tidak ada catatan.'}</p><div className="mt-3 flex flex-wrap gap-3">{(claim.kondisi_awal.foto_urls ?? []).map((url, i) => <a key={i} href={url} target="_blank" rel="noreferrer"><img src={url} alt={`Kondisi awal ${i + 1}`} className="h-24 w-24 rounded-lg object-cover" /></a>)}</div></section>}
                {claim.mitra_klarifikasi && <section className="rounded-2xl border bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/30"><h2 className="font-semibold">Klarifikasi Anda</h2><p className="mt-2 whitespace-pre-wrap text-sm">{claim.mitra_klarifikasi}</p><div className="mt-3 flex flex-wrap gap-3">{partnerPhotos.map((url, i) => <a key={i} href={url} target="_blank" rel="noreferrer"><img src={url} alt={`Bukti klarifikasi ${i + 1}`} className="h-24 w-24 rounded-lg object-cover" /></a>)}</div></section>}
                {claim.admin_catatan && <section className="rounded-2xl border bg-white p-5 dark:border-gray-700 dark:bg-gray-800"><h2 className="font-semibold">Catatan pemeriksaan admin</h2><p className="mt-2 whitespace-pre-wrap text-sm">{claim.admin_catatan}</p></section>}
                {canClarify && <form onSubmit={submit} className="rounded-2xl border bg-white p-5 dark:border-gray-700 dark:bg-gray-800"><h2 className="font-semibold">Kirim klarifikasi</h2><label htmlFor="klarifikasi" className="mt-3 block text-sm">Jelaskan kondisi barang atau layanan</label><textarea id="klarifikasi" required maxLength={1000} rows={5} value={data.klarifikasi} onChange={(e) => setData('klarifikasi', e.target.value)} className="mt-2 w-full rounded-lg border p-3 text-sm dark:border-gray-600 dark:bg-gray-900" />{errors.klarifikasi && <p className="mt-1 text-sm text-red-600">{errors.klarifikasi}</p>}<label htmlFor="foto" className="mt-4 block text-sm">Foto pendukung (maksimal 5)</label><input id="foto" type="file" accept="image/jpeg,image/png" multiple onChange={(e) => setData('foto', Array.from(e.target.files ?? []).slice(0, 5))} className="mt-2 block w-full text-sm" />{errors.foto && <p className="mt-1 text-sm text-red-600">{errors.foto}</p>}<button disabled={processing} className="mt-4 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{processing ? 'Mengirim…' : 'Kirim klarifikasi'}</button></form>}
            </main>
        </MitraLayout>
    );
}
