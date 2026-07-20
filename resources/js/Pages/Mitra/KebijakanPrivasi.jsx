import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

export default function KebijakanPrivasi({ content, updated_at }) {
    return (
        <MitraLayout title="Kebijakan Privasi">
            <Head title="Kebijakan Privasi" />

            <div className="px-4 py-3">
                <Link
                    href="/mitra/profil"
                    className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-gray-600"
                >
                    <ChevronLeft size={18} />
                    Kembali
                </Link>

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900">Kebijakan Privasi</h2>
                    {updated_at && (
                        <p className="mt-1 text-xs text-gray-400">Terakhir diperbarui: {updated_at}</p>
                    )}

                    {content ? (
                        <div
                            className="prose prose-sm mt-4 max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    ) : (
                        <p className="mt-4 text-sm text-gray-400">
                            Kebijakan privasi belum tersedia.
                        </p>
                    )}
                </div>
            </div>
        </MitraLayout>
    );
}   