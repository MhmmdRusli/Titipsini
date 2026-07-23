import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

function formatTanggal(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function BeritaIndex({ berita }) {
    return (
        <CustomerLayout title="Berita" backHref="/app/dashboard">
            <Head title="Berita" />

            <div className="px-4 py-3">
                <div className="flex flex-col gap-3">
                    {berita.data.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-400 dark:text-gray-500">
                            Belum ada berita.
                        </div>
                    )}

                    {berita.data.map((b) => (
                        <Link
                            key={b.id}
                            href={`/app/berita/${b.id}`}
                            className="flex gap-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 shadow-sm transition hover:border-green-300 dark:hover:border-green-700"
                        >
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/40 dark:to-emerald-900/30">
                                {b.foto ? (
                                    <img src={b.foto} alt={b.judul} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-[#15803d] dark:text-[#4ade80]">
                                        Titipsini
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col justify-center py-1">
                                <p className="text-[11px] text-gray-400 dark:text-gray-500">{formatTanggal(b.published_at)}</p>
                                <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-gray-800 dark:text-gray-100">
                                    {b.judul}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {berita.links && berita.links.length > 3 && (
                    <div className="mt-4 flex items-center justify-center gap-1">
                        {berita.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded-md px-3 py-1.5 text-xs ${
                                    link.active
                                        ? 'bg-[#15803d] text-white dark:bg-[#22c55e]'
                                        : link.url
                                        ? 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                        : 'text-gray-300 dark:text-gray-700'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}