import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Newspaper } from 'lucide-react';

function formatTanggal(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function Show({ berita, lainnya = [] }) {
    return (
        <CustomerLayout title="Detail Berita" backHref="/app/berita">
            <Head title={berita.judul} />

            <div className="px-4 py-4">
                {/* Gambar utama */}
                {berita.foto ? (
                    <img
                        src={berita.foto}
                        alt={berita.judul}
                        className="w-full rounded-xl object-cover shadow-sm"
                        style={{ aspectRatio: '16/9' }}
                    />
                ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/40 dark:to-emerald-900/30">
                        <Newspaper size={32} className="text-[#15803d] dark:text-[#4ade80]" />
                    </div>
                )}

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <span className="rounded bg-[#15803d] dark:bg-[#22c55e] px-1.5 py-0.5 font-medium text-white">Titipsini</span>
                    <span>{formatTanggal(berita.published_at)}</span>
                </div>

                <h1 className="mt-2 text-lg font-bold leading-snug text-gray-900 dark:text-gray-100">{berita.judul}</h1>

                <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {berita.konten || 'Tidak ada konten untuk berita ini.'}
                </div>

                {/* Berita lainnya */}
                {lainnya.length > 0 && (
                    <div className="mt-8">
                        <p className="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">Berita Lainnya</p>
                        <div className="space-y-3">
                            {lainnya.map((b) => (
                                <Link
                                    key={b.id}
                                    href={`/app/berita/${b.id}`}
                                    className="flex gap-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm transition hover:border-green-300 dark:hover:border-green-700"
                                >
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/40 dark:to-emerald-900/30">
                                        {b.foto ? (
                                            <img src={b.foto} alt={b.judul} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Newspaper size={18} className="text-[#15803d] dark:text-[#4ade80]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                                        <p className="line-clamp-2 text-xs font-semibold text-gray-800 dark:text-gray-200">{b.judul}</p>
                                        <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{formatTanggal(b.published_at)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}