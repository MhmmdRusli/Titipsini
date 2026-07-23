import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Wallet, BellRing, CheckSquare } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const TYPE_CONFIG = {
    penitipan_berhasil: { icon: CheckCircle2, bg: 'bg-green-50 dark:bg-green-950/40', color: 'text-green-600 dark:text-green-400' },
    pembayaran_diterima: { icon: Wallet, bg: 'bg-green-50 dark:bg-green-950/40', color: 'text-green-600 dark:text-green-400' },
    penitipan_hampir_berakhir: { icon: BellRing, bg: 'bg-red-50 dark:bg-red-950/40', color: 'text-red-500 dark:text-red-400' },
    penitipan_selesai: { icon: CheckSquare, bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-500 dark:text-gray-400' },
};

function relativeTime(value) {
    const date = new Date(value);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    return null; 
}

function groupLabel(value) {
    const date = new Date(value);
    const now = new Date();
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);

    if (diffDays === 0) return null; 
    if (diffDays === 1) return 'KEMARIN';

    return date
        .toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        .toUpperCase();
}

export default function NotifikasiIndex({ notifikasi }) {
    let lastGroup = undefined;

    function handleClick(item) {
        if (!item.read_at) {
            router.patch(`/app/notifikasi/${item.id}/read`, {}, { preserveScroll: true, preserveState: true });
        }
    }

    return (
        <CustomerLayout title="Notifikasi" backHref="/app/dashboard">
            <Head title="Notifikasi" />

            <div className="px-4 py-3">
                {notifikasi.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 shadow-sm">
                        Belum ada notifikasi.
                    </div>
                )}

                <div className="flex flex-col gap-2.5">
                    {notifikasi.map((item) => {
                        const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.penitipan_selesai;
                        const Icon = config.icon;
                        const label = groupLabel(item.created_at);
                        const showDivider = label !== lastGroup;
                        lastGroup = label;

                        const rel = relativeTime(item.created_at);
                        const timestamp = rel ?? (label ?? '');

                        return (
                            <div key={item.id}>
                                {showDivider && label && (
                                    <div className="my-3 flex justify-center">
                                        <span className="rounded-full bg-gray-200 dark:bg-gray-800 px-3 py-1 text-[10px] font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                                            {label}
                                        </span>
                                    </div>
                                )}
                                
                                <button
                                    type="button"
                                    onClick={() => handleClick(item)}
                                    className="flex w-full items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 text-left shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                                >
                                    {/* Kotak ikon diubah menjadi rounded-2xl agar sesuai dengan gaya card di bawahnya */}
                                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.bg}`}>
                                        <Icon size={20} className={config.color} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.judul}</p>
                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.pesan}</p>
                                        <p className="mt-1.5 text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                            {timestamp}
                                        </p>
                                    </div>
                                    {!item.read_at && (
                                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-500" />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </CustomerLayout>
    );
}