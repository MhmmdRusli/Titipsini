import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { ChevronDown, MessageCircle, Mail, Phone, ArrowRight } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Bantuan({ faq, kontak }) {
    const [openId, setOpenId] = useState(null);

    const waLink = `https://wa.me/${kontak.whatsapp}`;

    return (
        <CustomerLayout title="Pusat Bantuan" backHref="/app/profile">
            <Head title="Pusat Bantuan" />

            <div className="px-4 py-3">
                <h2 className="text-lg font-bold text-green-700">Ada yang bisa kami bantu?</h2>
                <p className="mt-1 text-xs text-gray-500">
                    Cari jawaban untuk pertanyaan Anda atau hubungi tim dukungan kami.
                </p>

                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Pertanyaan Umum
                </p>

                {faq.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center text-xs text-gray-400">
                        Belum ada FAQ.
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {faq.map((item) => {
                        const isOpen = openId === item.id;
                        return (
                            <div key={item.id} className="rounded-xl border border-gray-100 bg-white shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => setOpenId(isOpen ? null : item.id)}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                                >
                                    <span className="text-sm font-medium text-gray-800">{item.pertanyaan}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`shrink-0 text-gray-400 transition-transform ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <p className="border-t border-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-500">
                                        {item.jawaban}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-gray-400">Hubungi Kami</p>

                <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl bg-green-600 px-4 py-3 text-white shadow-sm"
                >
                    <span className="flex items-center gap-2 text-sm font-semibold">
                        <MessageCircle size={18} />
                        Chat WhatsApp
                    </span>
                    <ArrowRight size={16} />
                </a>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                        <Mail size={16} className="text-gray-500" />
                        <p className="mt-2 text-xs font-semibold text-gray-800">Email Support</p>
                        <p className="mt-0.5 break-all text-[11px] text-gray-500">{kontak.email}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                        <Phone size={16} className="text-gray-500" />
                        <p className="mt-2 text-xs font-semibold text-gray-800">Call Center</p>
                        <p className="mt-0.5 text-[11px] text-gray-500">{kontak.call_center}</p>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}