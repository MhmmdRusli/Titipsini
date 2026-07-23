import { Head, router } from '@inertiajs/react';
import { Bell, Clock, CheckCheck, CheckCircle2, Wallet, BellRing, CheckSquare, ShieldCheck } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const TYPE_CONFIG = {
    penitipan_berhasil: { icon: CheckCircle2, bg: 'bg-green-50 dark:bg-green-950/40', color: 'text-green-600 dark:text-green-400' },
    pembayaran_diterima: { icon: Wallet, bg: 'bg-green-50 dark:bg-green-950/40', color: 'text-green-600 dark:text-green-400' },
    penitipan_hampir_berakhir: { icon: BellRing, bg: 'bg-red-50 dark:bg-red-950/40', color: 'text-red-500 dark:text-red-400' },
    penitipan_selesai: { icon: CheckSquare, bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-500 dark:text-gray-400' },
    transaksi_masuk: { icon: Wallet, bg: 'bg-green-50 dark:bg-green-950/40', color: 'text-green-600 dark:text-green-400' },
    jadwal_pickup: { icon: CheckSquare, bg: 'bg-green-50 dark:bg-green-950/40', color: 'text-green-600 dark:text-green-400' },
    verifikasi_ktp_disetujui: { icon: ShieldCheck, bg: 'bg-green-50 dark:bg-green-950/40', color: 'text-green-600 dark:text-green-400' },
};

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
        /* Mengosongkan title di MitraLayout agar teks "Notifikasi" ganda di atas header hijau hilang */
        <MitraLayout title="">
            <Head title="Notifikasi Mitra" />

            {/* Header hijau dengan lengkungan bawah, hanya menampilkan judul dan tombol aksi */}
            <div className="bg-[#15803d] dark:bg-green-700 px-4 pt-3 pb-6 rounded-b-[32px] shadow-sm">
                <div className="flex items-center justify-between">
                    <h1 className="flex items-center gap-1.5 text-base font-bold text-white">
                        Notifikasi <Bell size={16} />
                    </h1>
                    {hasUnread ? (
                        <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs font-medium text-white/90 hover:text-white transition">
                            <CheckCheck size={14} />
                            Tandai sudah dibaca
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="px-4 py-3">
                {notifikasi.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 shadow-sm">
                        Belum ada notifikasi.
                    </div>
                ) : null}

                <div className="flex flex-col gap-2.5">
                    {notifikasi.map(function (n) {
                        const config = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.penitipan_selesai;
                        const Icon = config.icon;

                        const cardClass = n.is_read
                            ? 'flex w-full items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 text-left shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700/50'
                            : 'flex w-full items-start gap-3 rounded-2xl border border-green-100 bg-green-50/60 p-3.5 text-left shadow-sm transition hover:bg-green-50 dark:border-green-900/40 dark:bg-green-950/20 dark:hover:bg-green-950/40';

                        var title = n.judul ? n.judul : (TYPE_LABEL[n.type] ? TYPE_LABEL[n.type] : 'Notifikasi');

                        return (
                            <div key={n.id} className={cardClass}>
                                {/* Kotak Ikon di Kiri */}
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.bg}`}>
                                    <Icon size={20} className={config.color} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {title}
                                        {n.type === 'verifikasi_ktp_disetujui' ? (
                                            <span className="ml-1 font-normal text-green-600 dark:text-green-400">Berhasil</span>
                                        ) : null}
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                                        {n.pesan}
                                        {n.order_code ? (
                                            <span>
                                                {' : '}
                                                <a href={'/mitra/pesanan/' + n.order_id} className="font-medium text-[#15803d] hover:underline dark:text-[#4ade80]">
                                                    {n.order_code}
                                                </a>
                                            </span>
                                        ) : null}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50 pt-2">
                                        <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                                            <Clock size={11} />
                                            {n.waktu}
                                        </span>

                                        {n.order_id ? (
                                            <a
                                                href={'/mitra/pesanan/' + n.order_id}
                                                onClick={function () { if (!n.is_read) markAsRead(n.id); }}
                                                className="text-xs font-bold text-[#15803d] hover:underline dark:text-[#4ade80]"
                                            >
                                                Detail Pesanan &gt;
                                            </a>
                                        ) : (
                                            !n.is_read ? (
                                                <button onClick={function () { markAsRead(n.id); }} className="text-xs font-bold text-[#15803d] hover:underline dark:text-[#4ade80]">
                                                    Tandai dibaca
                                                </button>
                                            ) : null
                                        )}
                                    </div>
                                </div>

                                {!n.is_read && (
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#15803d] dark:bg-[#4ade80]" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </MitraLayout>
    );
}