import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { Plus, Pencil, Trash2, X, MapPin, Car, Package, Building2, Truck } from 'lucide-react';

const KATEGORI_OPTIONS = [
    { value: 'barang', label: 'Barang', icon: Package },
    { value: 'bangunan', label: 'Bangunan', icon: Building2 },
    { value: 'kendaraan', label: 'Kendaraan', icon: Car },
    { value: 'pindahan', label: 'Pindahan', icon: Truck },
];

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
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
        value
    );
}

function labelFor(options, value) {
    return options.find((o) => o.value === value)?.label ?? value;
}

export default function LayananIndex({ layanan, daftarKota = [] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        kategori: 'kendaraan',
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
            kategori: item.kategori,
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
                onSuccess: closeModal,
            });
        } else {
            post('/mitra/layanan', { forceFormData: true, onSuccess: closeModal });
        }
    }

    function handleDelete() {
        router.delete(`/mitra/layanan/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <MitraLayout title="Kelola Layanan">
            <div className="px-4 py-3">
                <button
                    onClick={openCreateModal}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                    <Plus size={16} />
                    Tambah Layanan
                </button>

                <div className="mt-4 space-y-3">
                    {layanan.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
                            Belum ada layanan yang kamu daftarkan.
                        </div>
                    )}

                    {layanan.map((item) => {
                        const kategoriInfo = KATEGORI_OPTIONS.find((k) => k.value === item.kategori);
                        const Icon = kategoriInfo?.icon ?? Package;
                        const subLabel = item.jenis_kendaraan
                            ? labelFor(JENIS_KENDARAAN_OPTIONS, item.jenis_kendaraan)
                            : item.jenis_bangunan
                                ? labelFor(JENIS_BANGUNAN_OPTIONS, item.jenis_bangunan)
                                : null;

                        return (
                            <div key={item.id} className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{item.nama}</p>
                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                                <MapPin size={11} />
                                                {item.kecamatan}, {item.kota}
                                            </p>
                                            {subLabel && (
                                                <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                                                    {subLabel}
                                                </span>
                                            )}
                                            <p className="mt-1 text-xs font-medium text-gray-700">
                                                {formatRupiah(item.harga)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-green-700"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(item)}
                                            className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {!item.is_active && (
                                    <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                        Nonaktif
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            {modalOpen && (
                <div className="absolute inset-0 z-20 flex items-end bg-black/40">
                    <div className="max-h-[85%] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900">
                                {editingItem ? 'Edit Layanan' : 'Tambah Layanan'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-600">Kategori</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {KATEGORI_OPTIONS.map(({ value, label, icon: Icon }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setData('kategori', value)}
                                            className={`flex flex-col items-center gap-1 rounded-lg border py-2 text-[10px] font-medium ${data.kategori === value
                                                ? 'border-green-600 bg-green-50 text-green-700'
                                                : 'border-gray-200 text-gray-500'
                                                }`}
                                        >
                                            <Icon size={16} />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                {errors.kategori && <p className="mt-1 text-xs text-red-500">{errors.kategori}</p>}
                            </div>

                            {data.kategori === 'kendaraan' && (
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                        Jenis Kendaraan
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {JENIS_KENDARAAN_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setData('jenis_kendaraan', opt.value)}
                                                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${data.jenis_kendaraan === opt.value
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.jenis_kendaraan && (
                                        <p className="mt-1 text-xs text-red-500">{errors.jenis_kendaraan}</p>
                                    )}
                                </div>
                            )}

                            {data.kategori === 'bangunan' && (
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                                        Jenis Bangunan
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {JENIS_BANGUNAN_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setData('jenis_bangunan', opt.value)}
                                                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${data.jenis_bangunan === opt.value
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.jenis_bangunan && (
                                        <p className="mt-1 text-xs text-red-500">{errors.jenis_bangunan}</p>
                                    )}
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
                                    <input
                                        id="foto-layanan"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFotoChange}
                                    />
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
                                    {errors.kecamatan && (
                                        <p className="mt-1 text-xs text-red-500">{errors.kecamatan}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">
                                    Harga (per hari)
                                </label>
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
                                    className={`relative h-6 w-11 rounded-full transition-colors ${data.is_active ? 'bg-green-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${data.is_active ? 'translate-x-5' : 'translate-x-0.5'
                                            }`}
                                    />
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white disabled:opacity-50"
                            >
                                {editingItem ? 'Simpan Perubahan' : 'Tambah Layanan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Konfirmasi Hapus */}
            {deleteTarget && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 px-6">
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