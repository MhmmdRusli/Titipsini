import { useEffect, useRef, useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { Plus, Pencil, Trash2, X, MapPin, AlertCircle, Home, Info, CheckCircle2 } from 'lucide-react';
const JENIS_KENDARAAN_OPTIONS = [
    { value: 'motor', label: 'Motor' },
    { value: 'mobil', label: 'Mobil' },
    { value: 'truk', label: 'Truk' },
    { value: 'becak', label: 'Becak' },
    { value: 'sepeda', label: 'Sepeda' },
    { value: 'bus', label: 'Bus' },
    { value: 'mobil_pick_up', label: 'Mobil pick up' },
];

const JENIS_BANGUNAN_OPTIONS = [
    { value: 'rumah', label: 'Rumah' },
    { value: 'apartemen', label: 'Apartemen' },
    { value: 'kosan', label: 'Kosan' },
    { value: 'gudang', label: 'Gudang' },
    { value: 'kamar', label: 'Kamar' },
];

function formatRupiah(value) {
    if (!value) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function KategoriLayananView({
    kategori,
    title,
    ilustrasi,
    judulKosong,
    subjudulKosong,
    subheading,
    judulHub = null,
    labelBox,
    labelTambah,
    layanan = [],
    daftarKota = [],
    menungguVerifikasi = false,
    fiturPenuhAktif = false,
    FormKustom = null,
    edit = null,
}) {
    const [tahap, setTahap] = useState(layanan.length > 0 ? 'hub' : 'kosong');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    // Buka otomatis modal edit bila halaman dibuka dengan ?edit=<id>
    // (dipakai tombol pensil di halaman Detail & link "Verikasi Ulang").
    const editOpened = useRef(false);
    useEffect(() => {
        if (editOpened.current || !edit || !layanan.length) return;
        const item = layanan.find((l) => String(l.id) === String(edit));
        if (item) {
            editOpened.current = true;
            openTambah(item);
        }
    }, [edit, layanan]);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        kategori,
        jenis_kendaraan: '',
        jenis_bangunan: '',
        nama: '',
        kota: '',
        kecamatan: '',
        harga: '',
        is_active: true,
        foto: null,
    });

    function openTambah(item = null) {
        if (FormKustom) {
            setEditingItem(item);
            setTahap('form-kustom');
            return;
        }

        if (item) {
            setEditingItem(item);
            setData({
                kategori,
                jenis_kendaraan: item.jenis_kendaraan ?? '',
                jenis_bangunan: item.jenis_bangunan ?? '',
                nama: item.nama,
                kota: item.kota,
                kecamatan: item.kecamatan,
                harga: item.harga ?? '',
                is_active: item.is_active,
                foto: null,
            });
            setFotoPreview(item.foto_url ?? null);
        } else {
            reset();
            setEditingItem(null);
            setFotoPreview(null);
        }
        clearErrors();
        setModalOpen(true);
    }

    function handleFotoChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setFotoPreview(URL.createObjectURL(file));
        }
    }

    function closeModal() {
        setModalOpen(false);
        setEditingItem(null);
        setFotoPreview(null);
        reset();
        clearErrors();
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (editingItem) {
            router.post(`/mitra/layanan/${editingItem.id}`, { ...data, _method: 'put' }, {
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    setTahap('hub');
                },
            });
        } else {
            post('/mitra/layanan', {
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    setTahap('hub');
                },
            });
        }
    }

    function handleDelete() {
        router.delete(`/mitra/layanan/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    const tampilkanJenisKendaraan = kategori === 'kendaraan';
    const tampilkanJenisBangunan = kategori === 'bangunan';

    if (tahap === 'sukses') {
        return (
            <MitraLayout title="">
                <TahapSukses labelBox={labelBox} onKembali={() => setTahap('hub')} />
            </MitraLayout>
        );
    }

    if (tahap === 'form-kustom' && FormKustom) {
        return (
            <MitraLayout title="">
                <FormKustom
                    kategori={kategori}
                    editingItem={editingItem}
                    daftarKota={daftarKota}
                    onBatal={() => {
                        setEditingItem(null);
                        setTahap(layanan.length > 0 ? 'hub' : 'kosong');
                    }}
                    onSukses={() => {
                        setEditingItem(null);
                        setTahap('sukses');
                    }}
                />
            </MitraLayout>
        );
    }

    return (
        <MitraLayout title="">
            <div className="px-4 py-3">
                {tahap === 'kosong' && (
                    <TahapKosong
                        ilustrasi={ilustrasi}
                        judul={judulKosong}
                        subjudul={subjudulKosong}
                        menungguVerifikasi={menungguVerifikasi}
                        onTambah={() => openTambah()}
                    />
                )}

                {tahap === 'hub' && (
                    <TahapHub
                        kategori={kategori}
                        judulHub={judulHub}
                        subheading={subheading}
                        labelBox={labelBox}
                        labelTambah={labelTambah}
                        layanan={layanan}
                        menungguVerifikasi={menungguVerifikasi}
                        fiturPenuhAktif={fiturPenuhAktif}
                        modeDetail={!!FormKustom}
                        onTambah={() => openTambah()}
                        onUbah={(item) => openTambah(item)}
                        onHapus={setDeleteTarget}
                    />
                )}
            </div>

            {/* Modal Bottom-Sheet dengan Penyesuaian Wrapper Mobile */}
            {modalOpen && !FormKustom && (
                <div className="absolute inset-0 z-50 flex items-end bg-black/50 backdrop-blur-xs">
                    <div className="max-h-[90%] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                            <h2 className="text-base font-bold text-gray-900">
                                {editingItem ? `Edit ${labelBox}` : labelTambah}
                            </h2>
                            <button onClick={closeModal} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {tampilkanJenisKendaraan && (
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Jenis Kendaraan</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {JENIS_KENDARAAN_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setData('jenis_kendaraan', opt.value)}
                                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${data.jenis_kendaraan === opt.value
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.jenis_kendaraan && <p className="mt-1 text-xs text-red-500">{errors.jenis_kendaraan}</p>}
                                </div>
                            )}

                            {tampilkanJenisBangunan && (
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-gray-600">Jenis Bangunan</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {JENIS_BANGUNAN_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setData('jenis_bangunan', opt.value)}
                                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${data.jenis_bangunan === opt.value
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.jenis_bangunan && <p className="mt-1 text-xs text-red-500">{errors.jenis_bangunan}</p>}
                                </div>
                            )}

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-600">Foto Layanan</label>
                                <label
                                    htmlFor="foto-layanan"
                                    className="flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                                >
                                    {fotoPreview ? (
                                        <img src={fotoPreview} alt="Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-xs text-gray-400">Klik untuk pilih foto</span>
                                    )}
                                    <input id="foto-layanan" type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                                </label>
                                {errors.foto && <p className="mt-1 text-xs text-red-500">{errors.foto}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Nama Layanan</label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="Contoh: Titip Motor Harian"
                                />
                                {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Kota</label>
                                    <select
                                        value={data.kota}
                                        onChange={(e) => setData('kota', e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    >
                                        <option value="">Pilih kota</option>
                                        {daftarKota.map((kota) => (
                                            <option key={kota} value={kota}>{kota}</option>
                                        ))}
                                    </select>
                                    {errors.kota && <p className="mt-1 text-xs text-red-500">{errors.kota}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Kecamatan</label>
                                    <input
                                        type="text"
                                        value={data.kecamatan}
                                        onChange={(e) => setData('kecamatan', e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        placeholder="Gondokusuman"
                                    />
                                    {errors.kecamatan && <p className="mt-1 text-xs text-red-500">{errors.kecamatan}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Harga (per hari)</label>
                                <input
                                    type="number"
                                    value={data.harga}
                                    onChange={(e) => setData('harga', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    placeholder="15000"
                                />
                                {errors.harga && <p className="mt-1 text-xs text-red-500">{errors.harga}</p>}
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5">
                                <span className="text-sm text-gray-600">Aktifkan Layanan</span>
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${data.is_active ? 'bg-green-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${data.is_active ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                    />
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {editingItem ? 'Simpan Perubahan' : labelTambah}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Konfirmasi Hapus */}
            {deleteTarget && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-xs">
                    <div className="w-full max-w-xs rounded-xl bg-white p-5 shadow-2xl">
                        <h2 className="text-sm font-bold text-gray-900">Hapus Layanan?</h2>
                        <p className="mt-2 text-xs text-gray-500">
                            "{deleteTarget.nama}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MitraLayout>
    );
}

function TahapKosong({ ilustrasi, judul, subjudul, menungguVerifikasi, onTambah }) {
    return (
        <div className="flex flex-col items-center px-2 pb-4 pt-10 text-center">
            <div className="mb-6 flex h-40 w-40 items-center justify-center">{ilustrasi}</div>
            <p className="text-base font-bold text-gray-900">{judul}</p>
            <p className="mt-1.5 max-w-[260px] text-sm font-medium text-green-600">{subjudul}</p>
            <div className="mt-10 w-full space-y-3">
                {menungguVerifikasi && (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-xs font-medium text-white">
                        <AlertCircle size={14} className="shrink-0" />
                        Tunggu verifikasi dalam waktu 3 hari Kerja
                    </div>
                )}
                <button
                    onClick={onTambah}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-600"
                >
                    <Plus size={16} />
                    Tambah Layanan
                </button>
            </div>
        </div>
    );
}

function TahapSukses({ labelBox, onKembali }) {
    return (
        <div className="flex h-full flex-col items-center justify-center px-8 py-10 text-center">
            <div className="relative flex h-28 w-28 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-75" />
                <span className="absolute inset-2 rounded-full bg-green-100" />
                <CheckCircle2 size={44} className="relative text-green-600" strokeWidth={2.2} />
            </div>

            <p className="mt-8 text-sm leading-relaxed text-gray-500">
                Terimakasih telah mengisi kelola layanan, Silahkan Tunggu Verifikasi selanjutnya
            </p>

            <button
                type="button"
                onClick={onKembali}
                className="mt-10 w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700"
            >
                Kembali ke {labelBox ?? 'Kelola Layanan'}
            </button>
        </div>
    );
}

function TahapHub({ kategori, judulHub, subheading, labelBox, labelTambah, layanan, menungguVerifikasi, fiturPenuhAktif, modeDetail, onTambah, onUbah, onHapus }) {
    const [fiturPenuh, setFiturPenuh] = useState(fiturPenuhAktif);
    const [showPerhatian, setShowPerhatian] = useState(false);
    const [savingFitur, setSavingFitur] = useState(false);

    function toggleFiturPenuh() {
        const next = !fiturPenuh;
        setFiturPenuh(next);
        if (next) setShowPerhatian(true);

        setSavingFitur(true);
        router.patch(`/mitra/layanan/${kategori}/fitur-penuh`, { aktif: next }, {
            preserveScroll: true,
            preserveState: true,
            onError: () => setFiturPenuh(!next), // rollback tampilan kalau gagal disimpan
            onFinish: () => setSavingFitur(false),
        });
    }

    return (
        <div className="relative pb-6 pt-4">
            {judulHub && <p className="text-base font-bold text-gray-900">{judulHub}</p>}
            <p className="mt-1 text-xs text-gray-400">{subheading}</p>

            {menungguVerifikasi && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-xs font-medium text-white">
                    <AlertCircle size={14} className="shrink-0" />
                    Tunggu verifikasi dalam waktu 3 hari kerja
                </div>
            )}

            {/* Toggle Fitur Penuh */}
            <div className="mt-4 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                    Mengaktifkan Fitur Penuh
                    <button type="button" onClick={() => setShowPerhatian(true)} className="text-gray-400">
                        <Info size={14} />
                    </button>
                </p>
            </div>
            <button
                type="button"
                onClick={toggleFiturPenuh}
                disabled={savingFitur}
                className={`mt-2 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${fiturPenuh
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 bg-gray-100 text-gray-500'
                    }`}
            >
                <span
                    className={`h-4 w-7 shrink-0 rounded-full transition-colors ${fiturPenuh ? 'bg-white/30' : 'bg-gray-300'}`}
                >
                    <span
                        className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${fiturPenuh ? 'translate-x-3' : 'translate-x-0'
                            }`}
                    />
                </span>
                {fiturPenuh ? 'Aktifkan' : 'Nonaktifkan'}
            </button>

            {/* Box Alamat/List */}
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <p className="border-b border-gray-100 px-4 py-2.5 text-sm font-bold text-gray-800">{labelBox}</p>

                {layanan.length > 0 && (
                    <div className="divide-y divide-gray-100">
                        {layanan.map((item) => (
                            <div key={item.id} className="flex items-start justify-between gap-2 px-4 py-3">
                                <div className="flex min-w-0 items-start gap-2.5">
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                                        <Home size={16} />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-gray-900">{item.nama}</p>
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                            <MapPin size={11} />
                                            {item.kecamatan}, {item.kota}
                                        </p>
                                        {!item.is_active && (
                                            <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                                Nonaktif
                                            </span>
                                        )}
                                    </div>
                                </div>

                                    {modeDetail ? (
                                    <Link
                                        href={`/mitra/layanan/${item.id}`}
                                        className="shrink-0 text-xs font-semibold text-green-600 hover:underline"
                                    >
                                        Detail
                                    </Link>
                                ) : (
                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            onClick={() => onUbah(item)}
                                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-green-700"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => onHapus(item)}
                                            className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="p-3">
                    <button
                        onClick={onTambah}
                        className="flex items-center gap-2 text-sm font-medium text-green-700 hover:underline"
                    >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white">
                            <Plus size={12} strokeWidth={3} />
                        </span>
                        {labelTambah}
                    </button>
                </div>
            </div>

            {/* Popup Perhatian */}
            {showPerhatian && (
                <div className="absolute left-0 right-0 top-24 z-30 rounded-xl border border-green-200 bg-green-50 p-4 shadow-lg">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                            <Info size={16} className="mt-0.5 shrink-0 text-green-700" />
                            <div>
                                <p className="text-xs font-bold text-gray-900">Perhatian</p>
                                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                                    Saat aktif, fitur ini berguna untuk menutup layanan secara otomatis apabila
                                    jumlah tampung sudah terpenuhi, Dan berlaku hanya untuk layanan yang diaktifkan
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setShowPerhatian(false)} className="shrink-0 text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}