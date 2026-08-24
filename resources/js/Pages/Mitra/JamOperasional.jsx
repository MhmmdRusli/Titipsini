import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MitraLayout from '@/Layouts/MitraLayout';
import { ChevronLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';

const HARI_LIST = [
    { key: 'senin', label: 'Senin' },
    { key: 'selasa', label: 'Selasa' },
    { key: 'rabu', label: 'Rabu' },
    { key: 'kamis', label: 'Kamis' },
    { key: 'jumat', label: 'Jumat' },
    { key: 'sabtu', label: 'Sabtu' },
    { key: 'minggu', label: 'Minggu' },
];

const makeSlot = () => ({
    id: crypto.randomUUID(),
    jam_buka: '',
    jam_tutup: '',
    aktif: true,
});

const buildDefaultJadwal = (jamOperasional) => {
    const result = {};
    HARI_LIST.forEach(({ key }) => {
        const existing = jamOperasional?.[key];
        result[key] = {
            aktif: existing?.aktif ?? false,
            slots:
                existing?.slots?.length > 0
                    ? existing.slots.map((s) => ({ id: crypto.randomUUID(), ...s }))
                    : [makeSlot()],
        };
    });
    return result;
};

export default function JamOperasional({ jamOperasional }) {
    const { data, setData, put, processing, errors } = useForm({
        jadwal: buildDefaultJadwal(jamOperasional),
    });

    const submit = (e) => {
        e.preventDefault();
        put('/mitra/layanan/jam-operasional');
    };

    const toggleHari = (hari) => {
        setData('jadwal', {
            ...data.jadwal,
            [hari]: { ...data.jadwal[hari], aktif: !data.jadwal[hari].aktif },
        });
    };

    const toggleSlot = (hari, slotId) => {
        setData('jadwal', {
            ...data.jadwal,
            [hari]: {
                ...data.jadwal[hari],
                slots: data.jadwal[hari].slots.map((s) =>
                    s.id === slotId ? { ...s, aktif: !s.aktif } : s
                ),
            },
        });
    };

    const updateSlot = (hari, slotId, field, value) => {
        setData('jadwal', {
            ...data.jadwal,
            [hari]: {
                ...data.jadwal[hari],
                slots: data.jadwal[hari].slots.map((s) =>
                    s.id === slotId ? { ...s, [field]: value } : s
                ),
            },
        });
    };

    const addSlot = (hari) => {
        setData('jadwal', {
            ...data.jadwal,
            [hari]: {
                ...data.jadwal[hari],
                slots: [...data.jadwal[hari].slots, makeSlot()],
            },
        });
    };

    const removeSlot = (hari, slotId) => {
        setData('jadwal', {
            ...data.jadwal,
            [hari]: {
                ...data.jadwal[hari],
                slots: data.jadwal[hari].slots.filter((s) => s.id !== slotId),
            },
        });
    };

    const errorFor = (hari, slotIndex, field) => errors?.[`jadwal.${hari}.slots.${slotIndex}.${field}`];

    return (
        <MitraLayout>
            <Head title="Jam Operasional" />

            <div className="flex flex-col min-h-screen bg-gray-50">
                {/* Form Body - pb-44 memberikan ruang agar kartu Minggu bisa di-scroll sepenuhnya di atas tombol Simpan & Navbar */}
                <form onSubmit={submit} className="flex-1 space-y-4 px-4 py-4 pb-44">
                    {HARI_LIST.map(({ key, label }) => {
                        const hari = data.jadwal[key];
                        return (
                            <div key={key} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                {/* Header hari + toggle aktif hari */}
                                <div className="flex items-center justify-between border-b border-gray-100 bg-green-50/60 px-4 py-3">
                                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                                    <button
                                        type="button"
                                        onClick={() => toggleHari(key)}
                                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                                            hari.aktif ? 'bg-green-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                                hari.aktif ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Slot-slot jam untuk hari ini */}
                                {hari.aktif && (
                                    <div className="divide-y divide-gray-100">
                                        {hari.slots.map((slot, index) => (
                                            <div
                                                key={slot.id}
                                                className={`flex items-end gap-2 p-3 ${
                                                    slot.aktif ? 'bg-white' : 'bg-gray-50 opacity-60'
                                                }`}
                                            >
                                                <div className="grid flex-1 grid-cols-2 gap-1.5 min-w-0">
                                                    <div>
                                                        <label className="mb-1 block text-[11px] text-gray-400">Buka</label>
                                                        <input
                                                            type="time"
                                                            value={slot.jam_buka}
                                                            disabled={!slot.aktif}
                                                            onChange={(e) => updateSlot(key, slot.id, 'jam_buka', e.target.value)}
                                                            className={`w-full rounded-lg px-2 py-1.5 text-xs ${
                                                                errorFor(key, index, 'jam_buka')
                                                                    ? 'border-red-500'
                                                                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                                            }`}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1 block text-[11px] text-gray-400">Tutup</label>
                                                        <input
                                                            type="time"
                                                            value={slot.jam_tutup}
                                                            disabled={!slot.aktif}
                                                            onChange={(e) => updateSlot(key, slot.id, 'jam_tutup', e.target.value)}
                                                            className={`w-full rounded-lg px-2 py-1.5 text-xs ${
                                                                errorFor(key, index, 'jam_tutup')
                                                                    ? 'border-red-500'
                                                                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                                                            }`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Toggle & Hapus per slot */}
                                                <div className="flex items-center gap-1.5 pb-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSlot(key, slot.id)}
                                                        title={slot.aktif ? 'Nonaktifkan jam ini' : 'Aktifkan jam ini'}
                                                        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                                                            slot.aktif ? 'bg-green-600' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                                                slot.aktif ? 'translate-x-4' : 'translate-x-0'
                                                            }`}
                                                        />
                                                    </button>

                                                    {hari.slots.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSlot(key, slot.id)}
                                                            className="p-1 shrink-0 text-gray-400 hover:text-red-500"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Tambah slot jam baru */}
                                        <button
                                            type="button"
                                            onClick={() => addSlot(key)}
                                            className="flex w-full items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-green-700 hover:bg-green-50"
                                        >
                                            <Plus size={14} />
                                            Tambah Jam Lain
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Floating Save Button - Menggunakan bottom-16 agar posisinya persis di atas bottom navigation bar */}
                    <div className="fixed inset-x-0 bottom-16 z-20 border-t border-gray-100 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="mx-auto max-w-md">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white shadow-md hover:bg-green-600 active:scale-[0.99] transition-all disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </MitraLayout>
    );
}