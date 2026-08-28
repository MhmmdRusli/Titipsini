import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

// Warna aksen utama — solid, tanpa gradient, konsisten di seluruh halaman
const BRAND = '#008736';

// --- Sub-Components ---

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                <MapPin
                    size={56}
                    strokeWidth={1.25}
                    className="text-[#008736] dark:text-emerald-400"
                />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Kamu belum punya alamat.
            </p>

            <Link
                href="/app/profile/alamat/tambah"
                className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#008736] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800 active:scale-[0.99]"
            >
                Tambah Alamat Baru
                <Plus size={16} />
            </Link>
        </div>
    );
}

function DetailRow({ label, value, last }) {
    if (!value) return null;
    return (
        <div
            className={`flex items-start justify-between gap-4 py-2 text-sm ${
                !last ? 'border-b border-gray-50 dark:border-gray-700/60' : ''
            }`}
        >
            <span className="shrink-0 text-gray-400 dark:text-gray-500">{label}</span>
            <span className="text-right font-medium text-gray-700 dark:text-gray-200">
                {value}
            </span>
        </div>
    );
}

function AddressCard({ address }) {
    const [deleting, setDeleting] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    function handleDelete() {
        setDeleting(true);
        router.delete(`/app/profile/alamat/${address.id}`, {
            onFinish: () => setDeleting(false),
            onSuccess: () => setDeleteOpen(false),
        });
    }

    return (
        <div className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700/80 dark:bg-gray-800">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {address.name}
                    </p>
                    {address.is_primary && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#008736] dark:bg-emerald-950/40 dark:text-emerald-400">
                            Utama
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <Link
                        href={`/app/profile/alamat/${address.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-[#008736] transition hover:scale-105 dark:bg-emerald-950/50 dark:text-emerald-400"
                        title="Edit Alamat"
                    >
                        <Pencil size={14} />
                    </Link>
                    <button
                        type="button"
                        onClick={() => setDeleteOpen(true)}
                        disabled={deleting}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:scale-105 disabled:opacity-50 dark:bg-red-950/40 dark:text-red-400"
                        title="Hapus Alamat"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <div className="mt-3 border-t border-gray-100 pt-1 dark:border-gray-700">
                <DetailRow label="Nomor Telepon" value={address.phone} />
                <DetailRow label="Provinsi" value={address.province_name} />
                <DetailRow label="Kota/Kabupaten" value={address.city_name} />
                <DetailRow label="Kecamatan" value={address.district_name} />
                <DetailRow label="Alamat Lengkap" value={address.address} />
                <DetailRow label="Catatan" value={address.notes} last />
            </div>

            {deleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                                <Trash2 size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Hapus Alamat?</h2>
                                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                    Alamat ini akan dihapus dari daftar alamat kamu.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-700 dark:bg-red-950/30 dark:text-red-300">
                            Tindakan ini tidak dapat dibatalkan.
                        </div>
                        <div className="mt-5 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteOpen(false)}
                                disabled={deleting}
                                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/60"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Main Component ---
export default function AddressIndex({ addresses = [] }) {
    const hasAddresses = addresses.length > 0;

    return (
        <CustomerLayout title="Alamat Saya" backHref="/app/profile">
            <Head title="Alamat Saya - Titipsini.com" />

            <div className="mx-auto max-w-lg px-4 py-6">
                {hasAddresses ? (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <AddressCard key={address.id} address={address} />
                        ))}

                        <Link
                            href="/app/profile/alamat/tambah"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#008736] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800 active:scale-[0.99]"
                        >
                            Tambah Alamat Baru
                            <Plus size={16} />
                        </Link>
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </CustomerLayout>
    );
}