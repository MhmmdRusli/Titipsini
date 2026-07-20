import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Wallet, BellRing, CheckSquare } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

const TYPE_CONFIG = {
    penitipan_berhasil: { icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-600' },
    pembayaran_diterima: { icon: Wallet, bg: 'bg-green-50', color: 'text-green-600' },
    penitipan_hampir_berakhir: { icon: BellRing, bg: 'bg-red-50', color: 'text-red-500' },
    penitipan_selesai: { icon: CheckSquare, bg: 'bg-gray-100', color: 'text-gray-500' },
};

function relativeTime(value) {
    const date = new Date(value);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    return null; // di luar hari ini -> dikelompokkan lewat groupLabel, bukan relative time
}

function groupLabel(value) {
    const date = new Date(value);
    const now = new Date();
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);

    if (diffDays === 0) return null; // hari ini -> tidak ada divider, sesuai mockup
    if (diffDays === 1) return 'KEMARIN';

    return date
        .toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        .toUpperCase();
}

export default function NotifikasiIndex({ notifikasi }) {
    let lastGroup = undefined; // beda dari null supaya grup "hari ini" pertama tetap dicek

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
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
                        Belum ada notifikasi.
                    </div>
                )}

                <div className="flex flex-col gap-1">
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
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold tracking-wide text-gray-400">
                                            {label}
                                        </span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleClick(item)}
                                    className="flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left"
                                >
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                                        <Icon size={18} className={config.color} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">{item.judul}</p>
                                        <p className="mt-0.5 text-xs text-gray-500">{item.pesan}</p>
                                        <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">
                                            {timestamp}
                                        </p>
                                    </div>
                                    {!item.read_at && (
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-600" />
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