import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Clock, CheckCheck } from 'lucide-react';
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
        <MitraLayout title="">
            <Head title="Notifikasi Mitra" />

            {hasUnread && (
                <div className="flex justify-end px-4 pt-3">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-1 text-xs font-bold text-gray-800 hover:underline dark:text-gray-200"
                    >
                        <CheckCheck size={13} />
                        Tandai sudah dibaca
                    </button>
                </div>
            )}

            <div className="px-4 py-3">
                {notifikasi.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 shadow-sm">
                        Belum ada notifikasi.
                    </div>
                ) : null}

                <div className="flex flex-col gap-2.5">
                    {notifikasi.map(function (n) {
                        const cardClass = n.is_read
                            ? 'w-full rounded-2xl border border-gray-100 bg-white p-3.5 text-left shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700/50'
                            : 'w-full rounded-2xl border border-green-100 bg-green-50/60 p-3.5 text-left shadow-sm transition hover:bg-green-50 dark:border-green-900/40 dark:bg-green-950/20 dark:hover:bg-green-950/40';

                        var title = n.judul ? n.judul : (TYPE_LABEL[n.type] ? TYPE_LABEL[n.type] : 'Notifikasi');

                        return (
                            <div key={n.id} className={cardClass}>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                    {title}
                                    {n.type === 'verifikasi_ktp_disetujui' ? (
                                        <span className="ml-1 font-normal text-green-600 dark:text-green-400">Berhasil</span>
                                    ) : null}
                                </p>

                                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                    {n.pesan}
                                    {n.order_code ? (
                                        <span>
                                            {' : '}
                                            <a href={'/mitra/pesanan/' + n.order_id} className="text-blue-500 hover:underline">
                                                {n.order_code}
                                            </a>
                                        </span>
                                    ) : null}
                                </p>

                                <div className="mt-2.5 flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                                        <Clock size={11} />
                                        {n.waktu}
                                    </span>

                                    {n.order_id ? (
                                        
                                         <a   href={'/mitra/pesanan/' + n.order_id}
                                            onClick={function () { if (!n.is_read) markAsRead(n.id); }}
                                            className="text-xs font-bold text-green-600 hover:underline dark:text-green-400"
                                        >
                                            Detail&nbsp;&nbsp;Pesanan
                                        </a>
                                    ) : (
                                        !n.is_read ? (
                                            <button onClick={function () { markAsRead(n.id); }} className="text-xs font-bold text-green-600 hover:underline dark:text-green-400">
                                                Tandai dibaca
                                            </button>
                                        ) : null
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </MitraLayout>
    );
}