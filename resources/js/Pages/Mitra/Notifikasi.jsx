import { Head, router } from '@inertiajs/react';
import { Bell, Clock, CheckCheck } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const TYPE_LABEL = {
    penitipan_berhasil: 'Penitipan Kendaraan',
    pembayaran_diterima: 'Penitipan Kendaraan',
    penitipan_hampir_berakhir: 'Penitipan Hampir Berakhir',
    penitipan_selesai: 'Penitipan Selesai',
    transaksi_masuk: 'Transaksi Masuk',
    jadwal_pickup: 'Penitipan Barang',
    verifikasi_ktp_disetujui: 'Verifikasi Anda',
};

export default function Notifikasi({ notifikasi = [] }) {
    const hasUnread = notifikasi.some(function (n) { return !n.is_read; });

    function markAllAsRead() {
        router.patch('/mitra/notifikasi/tandai-semua', {}, { preserveScroll: true });
    }

    function markAsRead(id) {
        router.patch('/mitra/notifikasi/' + id + '/read', {}, { preserveScroll: true });
    }

    return (
        <MitraLayout title="Notifikasi">
            <Head title="Notifikasi Mitra" />

            <div className="bg-green-600 px-4 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="flex items-center gap-1.5 text-lg font-semibold text-white">
                        Notifikasi <Bell size={16} />
                    </h1>
                    {hasUnread ? (
                        <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs font-medium text-white/90 hover:text-white">
                            <CheckCheck size={14} />
                            Tandai sudah dibaca
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="space-y-2 px-4 py-3">
                {notifikasi.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
                        Belum ada notifikasi.
                    </div>
                ) : null}

                {notifikasi.map(function (n) {
                    var cardClass = n.is_read
                        ? 'rounded-xl border border-gray-100 bg-white p-3.5'
                        : 'rounded-xl border border-green-100 bg-green-50 p-3.5';

                    var title = n.judul ? n.judul : (TYPE_LABEL[n.type] ? TYPE_LABEL[n.type] : 'Notifikasi');

                    return (
                        <div key={n.id} className={cardClass}>
                            <p className="text-sm font-semibold text-gray-900">
                                {title}
                                {n.type === 'verifikasi_ktp_disetujui' ? (
                                    <span className="ml-1 font-normal text-green-600">Berhasil</span>
                                ) : null}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-600">
                                {n.pesan}
                                {n.order_code ? (
                                    <span>
                                        {' : '}
                                        <a href={'/mitra/pesanan/' + n.order_id} className="font-medium text-blue-600 hover:underline">
                                            {n.order_code}
                                        </a>
                                    </span>
                                ) : null}
                            </p>

                            <div className="mt-2 flex items-center justify-between">
                                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                    <Clock size={11} />
                                    {n.waktu}
                                </span>

                                {n.order_id ? (
                                    
                                        <a href={'/mitra/pesanan/' + n.order_id}
                                        onClick={function () { if (!n.is_read) markAsRead(n.id); }}
                                        className="text-xs font-medium text-green-700 hover:underline"
                                    >
                                        Detail Pesanan
                                    </a>
                                ) : (
                                    !n.is_read ? (
                                        <button onClick={function () { markAsRead(n.id); }} className="text-xs font-medium text-green-700 hover:underline">
                                            Tandai dibaca
                                        </button>
                                    ) : null
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </MitraLayout>
    );
}