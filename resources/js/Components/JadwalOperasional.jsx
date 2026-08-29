import { Clock } from 'lucide-react';

const KEY_TO_WEEKDAY = {
    minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, sabtu: 6,
};

export default function JadwalOperasional({ jadwal = [] }) {
    if (!jadwal || jadwal.length === 0) {
        return (
            <div className="flex items-start gap-3 text-sm">
                <Clock size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                    Jam operasional belum diatur mitra.
                </p>
            </div>
        );
    }

    const hariIni = KEY_TO_WEEKDAY[['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'][new Date().getDay()]];

    return (
        <div className="flex items-start gap-3 text-sm">
            <Clock size={16} className="mt-0.5 shrink-0 text-gray-400" />
            <div className="flex-1">
                <p className="mb-1 text-xs text-gray-400 dark:text-gray-500">Jam Operasional</p>
                <div className="space-y-1">
                    {jadwal.map((h) => {
                        const buka = h.aktif && h.slots && h.slots.length > 0;
                        const jam = buka
                            ? h.slots.map((s) => `${s.jam_buka} - ${s.jam_tutup}`).join(', ')
                            : 'Tutup';
                        const isToday = KEY_TO_WEEKDAY[h.key] === hariIni;

                        return (
                            <div
                                key={h.key}
                                className={`flex items-center justify-between gap-2 ${
                                    isToday ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                <span>
                                    {h.hari}
                                    {isToday && (
                                        <span className="ml-1.5 rounded bg-[#15803d]/10 px-1 py-0.5 text-[9px] font-medium text-[#15803d] dark:bg-[#22c55e]/20 dark:text-[#4ade80]">
                                            Hari ini
                                        </span>
                                    )}
                                </span>
                                <span className={buka ? '' : 'text-red-500 dark:text-red-400'}>{jam}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
