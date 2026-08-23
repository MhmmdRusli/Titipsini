import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { Plus, Pencil, Trash2, X, MapPin, AlertCircle } from 'lucide-react';

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

function labelFor(options, value) {
    return options.find((o) => o.value === value)?.label ?? value;
}

/**
 * Komponen dipakai bersama oleh 4 halaman kategori layanan (Barang, Kendaraan,
 * Bangunan, Pindahan/Pick Up).
 *
 * Alurnya 3 tahap:
 * 1. "kosong"  -> ilustrasi besar + tombol "Tambah Layanan" (kalau belum ada data SAMA SEKALI)
 * 2. "hub"     -> judul + subjudul + kotak berisi daftar item (kalau ada) + tombol "+ Tambah [label]"
 * 3. modal     -> form input (dipicu dari tombol di dalam kotak hub)
 *
 * Begitu sudah ada minimal 1 layanan tersimpan, tahap "kosong" dilewati dan
 * langsung tampil tahap "hub".
 */
export default function KategoriLayananView({
    kategori,
    title,
    ilustrasi,
    judulKosong,
    subjudulKosong,
    heading,
    subheading,
    labelBox,
    labelTambah,
    layanan = [],
    daftarKota = [],
    menungguVerifikasi = false,
}) {
    // Kalau sudah ada data, langsung ke tahap "hub". Kalau belum ada sama
    // sekali, mulai dari tahap "kosong" (ilustrasi besar).
    const [tahap, setTahap] = useState(layanan.length > 0 ? 'hub' : 'kosong');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

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

    function openCreateModal() {
        reset();
        clearErrors();
        setEditingItem(null);
        setFotoPreview(null);
        setModalOpen(true);
    }

    function handleFotoChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setFotoPreview(URL.createObjectURL(file));
        }
    }

    function openEditModal(item) {
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
        clearErrors();
        setModalOpen(true);
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

    return (
        <MitraLayout title={title} backHref="/mitra/dashboard">
            <div className="px-4 py-3">
                {tahap === 'kosong' && (
                    <TahapKosong
                        ilustrasi={ilustrasi}
                        judul={judulKosong}
                        subjudul={subjudulKosong}
                        menungguVerifikasi={menungguVerifikasi}
                        onTambah={() => setTahap('hub')}
                    />
                )}

                {tahap === 'hub' && (
                    <TahapHub
                        heading={heading}
                        subheading={subheading}
                        labelBox={labelBox}
                        labelTambah={labelTambah}
                        layanan={layanan}
                        menungguVerifikasi={menungguVerifikasi}
                        onTambah={openCreateModal}
                        onUbah={openEditModal}
                        onHapus={setDeleteTarget}
                    />
                )}
            </div>

            {/* Modal Tambah/Edit */}
            {modalOpen && (
                <div className="fixed inset-0 z-20 flex items-end bg-black/40">
                    <div className="max-h-[85%] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900">
                                {editingItem ? `Edit ${labelBox}` : labelTambah}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
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
                                                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                                    data.jenis_kendaraan === opt.value
                                                        ? 'border-green-600 bg-green-600 text-white'
                                                        : 'border-gray-200 text-gray-600'
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
                                                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                                                    data.jenis_bangunan === opt.value
                                                        ? 'border-green-600 bg-green-600 text-white'
                                                        : 'border-gray-200 text-gray-600'
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
                                    className="flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50"
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
                                    {daftarKota.length === 0 && (
                                        <p className="mt-1 text-xs text-amber-600">Belum ada kota aktif dari Admin. Hubungi Admin dulu.</p>
                                    )}
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
                                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                                        data.is_active ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                            data.is_active ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white disabled:opacity-50"
                            >
                                {editingItem ? 'Simpan Perubahan' : labelTambah}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Konfirmasi Hapus */}
            {deleteTarget && (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-6">
                    <div className="w-full max-w-xs rounded-xl bg-white p-5">
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

/* ---------------------------------------------------------------------- */
/* Tahap 1: kosong total - ilustrasi besar + tombol "Tambah Layanan"       */
/* ---------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------- */
/* Tahap 2: hub - judul + subjudul + kotak daftar item + tombol tambah     */
/* ---------------------------------------------------------------------- */

function TahapHub({ heading, subheading, labelBox, labelTambah, layanan, menungguVerifikasi, onTambah, onUbah, onHapus }) {
    return (
        <div className="pb-6 pt-4">
            <p className="text-center text-lg font-bold text-gray-900">{heading}</p>
            <p className="mt-1 text-center text-xs text-gray-400">{subheading}</p>

            {menungguVerifikasi && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-xs font-medium text-white">
                    <AlertCircle size={14} className="shrink-0" />
                    Tunggu verifikasi dalam waktu 3 hari kerja
                </div>
            )}

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/60">
                <p className="border-b border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-800">{labelBox}</p>

                {layanan.length > 0 && (
                    <div className="divide-y divide-gray-100">
                        {layanan.map((item) => (
                            <div key={item.id} className="flex items-start justify-between gap-2 bg-white px-4 py-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900">{item.nama}</p>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin size={11} />
                                        {item.kecamatan}, {item.kota}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-gray-700">{formatRupiah(item.harga)}</p>
                                    {!item.is_active && (
                                        <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                            Nonaktif
                                        </span>
                                    )}
                                </div>
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
                            </div>
                        ))}
                    </div>
                )}

                <div className="p-3">
                    <button
                        onClick={onTambah}
                        className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                            <Plus size={14} strokeWidth={3} />
                        </span>
                        {labelTambah}
                    </button>
                </div>
            </div>
        </div>
    );
}