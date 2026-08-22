import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft, ChevronDown, Landmark, Pencil, Trash2, Plus, ShieldCheck } from 'lucide-react';

const BANK_OPTIONS = [
    'PT. Bank Central Asia Tbk (BCA)',
    'PT. Bank Rakyat Indonesia (BRI)',
    'PT. Bank Mandiri (Persero) Tbk',
    'PT. Bank Negara Indonesia (BNI)',
    'PT. Bank CIMB Niaga Tbk',
    'PT. Bank Danamon Indonesia Tbk',
    'PT. Bank Permata Tbk',
    'PT. Bank Syariah Indonesia (BSI)',
];

const emptyForm = { id: null, nama_bank: '', nomor_rekening: '', nama_pemilik: '', utama: false };

export default function Rekening({ rekening = [] }) {
    // view: 'list' -> tampilan utama (kosong atau daftar kartu)
    //       'form' -> alur tambah/ubah rekening (2 langkah)
    const [view, setView] = useState('list');
    const [step, setStep] = useState(1);
    const [hapusTarget, setHapusTarget] = useState(null);
    const [showKonfirmasi, setShowKonfirmasi] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm(emptyForm);

    const bukaTambah = () => {
        reset();
        clearErrors();
        setStep(1);
        setView('form');
    };

    const bukaUbah = (item) => {
        setData({
            id: item.id,
            nama_bank: item.nama_bank,
            nomor_rekening: item.nomor_rekening,
            nama_pemilik: item.nama_pemilik,
            utama: !!item.utama,
        });
        clearErrors();
        setStep(1);
        setView('form');
    };

    const batal = () => {
        reset();
        clearErrors();
        setShowKonfirmasi(false);
        setView('list');
    };

    const lanjutKeStep2 = (e) => {
        e.preventDefault();
        if (!data.nama_bank || !data.nomor_rekening) return;
        setStep(2);
    };

    // Simpan rekening baru (tidak perlu konfirmasi/verifikasi tambahan)
    const simpanBaru = () => {
        post('/mitra/rekening', {
            onSuccess: () => {
                reset();
                setView('list');
            },
        });
    };

    // Klik "Simpan" di Step 2. Untuk rekening baru -> langsung simpan.
    // Untuk ubah rekening -> tampilkan popup konfirmasi dulu.
    const klikSimpan = (e) => {
        e.preventDefault();
        if (data.id) {
            setShowKonfirmasi(true);
        } else {
            simpanBaru();
        }
    };

    // Dipanggil saat user menekan "Ya, Benar" di popup konfirmasi.
    // Mengarahkan ke halaman verifikasi (PIN) sebelum perubahan benar-benar disimpan.
    const konfirmasiUbah = () => {
        setShowKonfirmasi(false);
        router.visit(`/mitra/rekening/${data.id}/verifikasi`, {
            method: 'post',
            data: {
                nama_bank: data.nama_bank,
                nomor_rekening: data.nomor_rekening,
                nama_pemilik: data.nama_pemilik,
                utama: data.utama,
            },
        });
    };

    const konfirmasiHapus = () => {
        if (!hapusTarget) return;
        router.delete(`/mitra/rekening/${hapusTarget.id}`, {
            onFinish: () => setHapusTarget(null),
        });
    };

    return (
        <MitraLayout>
            <Head title="Rekening Bank" />

            <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
                <button
                    type="button"
                    onClick={() => (view === 'form' ? batal() : window.history.back())}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-base font-semibold text-gray-900">
                    {view === 'list' ? 'Rekening Bank' : data.id ? 'Ubah Rekening Bank' : 'Tambah Rekening Bank'}
                </h1>
            </div>

            {/* Progress bar hanya muncul di alur form */}
            {view === 'form' && (
                <div className="flex gap-1 px-4 pt-3">
                    <div className="h-1.5 flex-1 rounded-full bg-green-600" />
                    <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
                </div>
            )}

            <div className="px-4 py-4">
                {view === 'list' && (
                    <ListView rekening={rekening} onTambah={bukaTambah} onUbah={bukaUbah} onHapus={setHapusTarget} />
                )}

                {view === 'form' && step === 1 && (
                    <StepSatu data={data} setData={setData} errors={errors} onLanjut={lanjutKeStep2} />
                )}

                {view === 'form' && step === 2 && (
                    <StepDua data={data} setData={setData} errors={errors} processing={processing} onSimpan={klikSimpan} />
                )}
            </div>

            {hapusTarget && (
                <ModalHapus item={hapusTarget} onTidak={() => setHapusTarget(null)} onYa={konfirmasiHapus} />
            )}

            {showKonfirmasi && (
                <ModalKonfirmasiUbah
                    data={data}
                    onKembali={() => setShowKonfirmasi(false)}
                    onYaBenar={konfirmasiUbah}
                />
            )}
        </MitraLayout>
    );
}

/* ---------------------------------------------------------------------- */
/* Tampilan utama: kosong atau daftar kartu rekening                       */
/* ---------------------------------------------------------------------- */

function ListView({ rekening, onTambah, onUbah, onHapus }) {
    if (!rekening || rekening.length === 0) {
        return (
            <div className="flex flex-col items-center px-4 pb-4 pt-10 text-center">
                <div className="relative mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-green-50">
                    <div className="absolute inset-3 rounded-full border-2 border-dashed border-green-200" />
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Landmark size={28} className="text-green-600" />
                    </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">Rekening Bank Masih Kosong</p>
                <p className="mt-1 max-w-[260px] text-xs text-gray-500">
                    Tambah Rekening Bank-mu untuk mempermudah proses Tarik Saldo di Titipsini.com
                </p>

                <button
                    type="button"
                    onClick={onTambah}
                    className="mt-8 w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600"
                >
                    Tambah Rekening
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {rekening.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    {item.utama && (
                        <p className="border-b border-gray-100 bg-green-50 px-4 py-1.5 text-center text-[11px] font-semibold text-green-700">
                            Rekening Utama
                        </p>
                    )}

                    <div className="flex items-start gap-3 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                            <Landmark size={18} className="text-blue-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">{item.nama_bank}</p>
                            <p className="mt-0.5 text-sm text-gray-600">{item.nomor_rekening}</p>
                            <p className="text-xs text-gray-400">a.n {item.nama_pemilik}</p>
                        </div>
                    </div>

                    <div className="flex divide-x divide-gray-100 border-t border-gray-100 text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => onUbah(item)}
                            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-gray-600 hover:bg-gray-50"
                        >
                            <Pencil size={13} />
                            Ubah
                        </button>
                        <button
                            type="button"
                            onClick={() => onHapus(item)}
                            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-red-600 hover:bg-red-50"
                        >
                            <Trash2 size={13} />
                            Hapus
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={onTambah}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600"
            >
                <Plus size={16} />
                Tambah Rekening Lainnya
            </button>
        </div>
    );
}

/* ---------------------------------------------------------------------- */
/* Step 1: pilih bank + nomor rekening                                     */
/* ---------------------------------------------------------------------- */

function StepSatu({ data, setData, errors, onLanjut }) {
    return (
        <form onSubmit={onLanjut} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Pilih Nama Bank</label>
                <div className="relative mt-1">
                    <select
                        value={data.nama_bank}
                        onChange={(e) => setData('nama_bank', e.target.value)}
                        className={`w-full appearance-none rounded-lg bg-white pr-8 text-sm ${
                            errors.nama_bank ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                        }`}
                    >
                        <option value="">Nama Bank</option>
                        {BANK_OPTIONS.map((bank) => (
                            <option key={bank} value={bank}>
                                {bank}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.nama_bank && <p className="mt-1 text-xs text-red-600">{errors.nama_bank}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nomor Rekening</label>
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Contoh: 5058xxxxxx"
                    value={data.nomor_rekening}
                    onChange={(e) => setData('nomor_rekening', e.target.value.replace(/\D/g, ''))}
                    className={`mt-1 w-full rounded-lg text-sm ${
                        errors.nomor_rekening ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                />
                {errors.nomor_rekening && <p className="mt-1 text-xs text-red-600">{errors.nomor_rekening}</p>}
            </div>

            <button
                type="submit"
                disabled={!data.nama_bank || !data.nomor_rekening}
                className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50"
            >
                Periksa
            </button>
        </form>
    );
}

/* ---------------------------------------------------------------------- */
/* Step 2: nama pemilik rekening + tetapkan sebagai utama                  */
/* ---------------------------------------------------------------------- */

function StepDua({ data, setData, errors, processing, onSimpan }) {
    return (
        <form onSubmit={onSimpan} className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <Landmark size={18} className="shrink-0 text-gray-500" />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">{data.nama_bank}</p>
                    <p className="text-xs text-gray-500">{data.nomor_rekening}</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nama Pemilik Rekening</label>
                <input
                    type="text"
                    placeholder="Sesuai buku tabungan"
                    value={data.nama_pemilik}
                    onChange={(e) => setData('nama_pemilik', e.target.value)}
                    className={`mt-1 w-full rounded-lg text-sm ${
                        errors.nama_pemilik ? 'border-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                    }`}
                />
                {errors.nama_pemilik && <p className="mt-1 text-xs text-red-600">{errors.nama_pemilik}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                    type="checkbox"
                    checked={data.utama}
                    onChange={(e) => setData('utama', e.target.checked)}
                    className="rounded text-green-600 focus:ring-green-500"
                />
                Tetapkan sebagai <span className="font-semibold">Rekening Utama</span>
            </label>

            <button
                type="submit"
                disabled={processing || !data.nama_pemilik}
                className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50"
            >
                Simpan
            </button>

            <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-gray-400">
                <ShieldCheck size={13} className="mt-0.5 shrink-0 text-gray-300" />
                Dengan klik &quot;Simpan&quot;, kamu menyetujui{' '}
                <span className="font-medium text-green-700">Kebijakan Privasi</span> dan{' '}
                <span className="font-medium text-green-700">Syarat</span> Titipsini.
            </p>
        </form>
    );
}

/* ---------------------------------------------------------------------- */
/* Modal konfirmasi hapus                                                  */
/* ---------------------------------------------------------------------- */

function ModalHapus({ item, onTidak, onYa }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
                <p className="text-sm font-semibold text-gray-900">Hapus Rekening ini?</p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                    Anda akan menghapus rekening {item.nama_bank} {item.nomor_rekening} atas nama {item.nama_pemilik}.
                </p>

                <div className="mt-5 flex gap-2">
                    <button
                        type="button"
                        onClick={onTidak}
                        className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Tidak
                    </button>
                    <button
                        type="button"
                        onClick={onYa}
                        className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
                    >
                        Ya
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------------- */
/* Modal konfirmasi ubah rekening (sebelum diarahkan ke verifikasi PIN)    */
/* ---------------------------------------------------------------------- */

function ModalKonfirmasiUbah({ data, onKembali, onYaBenar }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <p className="text-lg font-bold text-gray-900">Apakah Rekening sudah Benar?</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Anda akan mengubah rekening menjadi rekening {data.nama_bank} {data.nomor_rekening} atas nama{' '}
                    {data.nama_pemilik}.
                </p>

                <div className="mt-6 flex items-center justify-end gap-6">
                    <button type="button" onClick={onKembali} className="text-sm font-semibold text-gray-500 hover:text-gray-700">
                        Kembali
                    </button>
                    <button type="button" onClick={onYaBenar} className="text-sm font-semibold text-green-700 hover:text-green-600">
                        Ya, Benar
                    </button>
                </div>
            </div>
        </div>
    );
}