import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeft, ChevronDown, MessageCircle, Mail } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const faqs = [
    {
        q: 'Bagaimana cara menarik pendapatan saya?',
        a: 'Buka menu Profil > Penarikan, masukkan nominal yang ingin ditarik, lalu pilih rekening tujuan yang sudah terdaftar.',
    },
    {
        q: 'Kenapa akun saya belum terverifikasi?',
        a: 'Proses verifikasi biasanya memakan waktu 1x24 jam setelah kamu melengkapi seluruh data dan dokumen yang diminta.',
    },
    {
        q: 'Bagaimana cara mengubah jam operasional?',
        a: 'Buka menu Profil > Jam Operasional, atur jam buka dan tutup untuk setiap hari sesuai kebutuhan kamu.',
    },
    {
        q: 'Saya lupa kata sandi, apa yang harus dilakukan?',
        a: 'Klik "Lupa kata sandi?" di halaman login, lalu ikuti instruksi yang dikirimkan ke email kamu.',
    },
];

export default function Bantuan() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <MitraLayout title="Pusat Bantuan">
            <Head title="Pusat Bantuan" />

            <div className="max-w-xl mx-auto px-4 py-5 space-y-4">
                {/* Tombol Kembali Saja (Judul di sampingnya dihapus) */}
                <div>
                    <Link
                        href="/mitra/profil"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        <ChevronLeft size={18} />
                        Kembali
                    </Link>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                            FAQ (Pertanyaan Umum)
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-100 px-4">
                        {faqs.map((faq, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <div key={faq.q} className="py-3.5">
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        className="flex w-full items-center justify-between text-left group"
                                    >
                                        <span className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors pr-3">
                                            {faq.q}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                                                isOpen ? 'rotate-180 text-emerald-600' : ''
                                            }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <p className="mt-2.5 text-sm text-gray-600 leading-relaxed bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                                            {faq.a}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Hubungi Kami Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                            Layanan Dukungan
                        </h2>
                    </div>

                    <div className="p-4 space-y-2.5">
                        <a
                            href="https://wa.me/6285643333061"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white hover:bg-gray-50 px-4 py-3 transition-colors shadow-2xs"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                    <MessageCircle size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">WhatsApp Support</p>
                                    <p className="text-xs text-gray-500">0856-4333-3061</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                                Chat
                            </span>
                        </a>

                        <a
                            href="mailto:support@titipsini.com"
                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white hover:bg-gray-50 px-4 py-3 transition-colors shadow-2xs"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">Email Resmi</p>
                                    <p className="text-xs text-gray-500">support@titipsini.com</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                                Kirim Email
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </MitraLayout>
    );
}