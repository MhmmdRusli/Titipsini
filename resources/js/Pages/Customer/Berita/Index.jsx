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
                        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
                            Belum ada berita.
                        </div>
                    )}

                    {berita.data.map((b) => (
                        <Link
                            key={b.id}
                            href={`/app/berita/${b.id}`}
                            className="flex gap-3 rounded-xl border border-gray-100 bg-white p-2 shadow-sm"
                        >
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-emerald-100">
                                {b.foto ? (
                                    <img src={b.foto} alt={b.judul} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-green-600">
                                        Titipsini
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col justify-center py-1">
                                <p className="text-[11px] text-gray-400">{formatTanggal(b.published_at)}</p>
                                <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-gray-800">
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
                                        ? 'bg-brand-teal-700 text-white'
                                        : link.url
                                        ? 'text-gray-500 hover:bg-gray-100'
                                        : 'text-gray-300'
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