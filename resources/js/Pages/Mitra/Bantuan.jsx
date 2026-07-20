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

            <div className="px-4 py-3 space-y-3">
                <Link
                    href="/mitra/profil"
                    className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-gray-600"
                >
                    <ChevronLeft size={18} />
                    Kembali
                </Link>

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">
                        Pertanyaan yang Sering Diajukan
                    </h2>

                    <div className="divide-y divide-gray-100">
                        {faqs.map((faq, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <div key={faq.q} className="py-3">
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        className="flex w-full items-center justify-between text-left"
                                    >
                                        <span className="text-sm font-medium text-gray-800 pr-3">
                                            {faq.q}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`shrink-0 text-gray-400 transition-transform ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Hubungi Kami</h2>
                    <div className="space-y-2">
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#f4f7fc] px-4 py-3"
                        >
                            <MessageCircle size={18} className="text-green-600" />
                            <span className="text-sm font-medium text-gray-800">
                                Chat via WhatsApp
                            </span>
                        </a>
                        <a
                            href="mailto:support@titipsini.com"
                            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#f4f7fc] px-4 py-3"
                        >
                            <Mail size={18} className="text-green-600" />
                            <span className="text-sm font-medium text-gray-800">
                                support@titipsini.com
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </MitraLayout>
    );
}