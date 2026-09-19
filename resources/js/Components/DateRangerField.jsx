import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const NAMA_BULAN = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const NAMA_HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function toISODate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function parseISODate(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
}

export function formatShort(iso) {
    const date = parseISODate(iso);
    if (!date) return null;
    return `${date.getDate()} ${NAMA_BULAN[date.getMonth()]}`;
}

function getCalendarCells(viewDate) {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Senin = index 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
}

function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBetween(date, start, end) {
    if (!start || !end) return false;
    return date > start && date < end;
}

/** Date-range picker custom: 1 field, buka kalender, klik 2 tanggal (masuk & keluar). */
export default function DateRangeField({ tanggalMasuk, tanggalKeluar, onChange, error }) {
    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => parseISODate(tanggalMasuk) || new Date());

    const startDate = parseISODate(tanggalMasuk);
    const endDate = parseISODate(tanggalKeluar);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function handlePick(date) {
        if (date < today) return;

        if (!tanggalMasuk || (tanggalMasuk && tanggalKeluar)) {
            onChange(toISODate(date), '');
            return;
        }

        if (date < startDate) {
            onChange(toISODate(date), '');
        } else {
            onChange(tanggalMasuk, toISODate(date));
            setOpen(false);
        }
    }

    const label = tanggalMasuk && tanggalKeluar
        ? `${formatShort(tanggalMasuk)} / ${formatShort(tanggalKeluar)}`
        : tanggalMasuk
            ? `${formatShort(tanggalMasuk)} / Pilih tanggal keluar`
            : null;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`flex w-full items-center gap-2.5 rounded-xl border bg-white px-4 py-3 text-left text-sm shadow-sm transition dark:bg-gray-800 ${
                    error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                }`}
            >
                <Calendar size={16} className="shrink-0 text-gray-400 dark:text-gray-500" />
                <span className={label ? 'text-gray-700 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                    {label ?? 'Tentukan tanggal pesanan'}
                </span>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 right-0 z-50 mt-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {NAMA_BULAN[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </p>
                            <button
                                type="button"
                                onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
                            {NAMA_HARI.map((h) => (
                                <span key={h} className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">
                                    {h}
                                </span>
                            ))}

                            {getCalendarCells(viewDate).map((date, i) => {
                                if (!date) return <span key={`empty-${i}`} />;

                                const disabled = date < today;
                                const isStart = isSameDay(date, startDate);
                                const isEnd = isSameDay(date, endDate);
                                const inRange = isBetween(date, startDate, endDate);

                                return (
                                    <button
                                        key={date.toISOString()}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => handlePick(date)}
                                        className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition ${
                                            disabled
                                                ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                                                : isStart || isEnd
                                                    ? 'bg-green-700 font-bold text-white dark:bg-green-500'
                                                    : inRange
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
}