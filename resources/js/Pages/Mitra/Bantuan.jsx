import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

const FEEDBACK_KEY_PREFIX = 'bantuan_feedback_';

export default function Bantuan({ faqs = [] }) {
    const [selected, setSelected] = useState(null);
    const [feedback, setFeedback] = useState(null);

    function openFaq(faq) {
        setSelected(faq);
        try {
            setFeedback(localStorage.getItem(`${FEEDBACK_KEY_PREFIX}${faq.id}`));
        } catch {
            setFeedback(null);
        }
    }

    function submitFeedback(value) {
        setFeedback(value);
        try {
            localStorage.setItem(`${FEEDBACK_KEY_PREFIX}${selected.id}`, value);
        } catch {
            // localStorage tidak tersedia
        }
    }

    function handleBack() {
        if (selected) {
            setSelected(null);
            setFeedback(null);
        } else {
            window.history.back();
        }
    }

    return (
        <MitraLayout title="Pusat Bantuan">
            <Head title="Pusat Bantuan" />

            <div className="mx-auto max-w-xl px-4 py-4">
                {selected && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mb-4 inline-flex items-center gap-1 text-gray-800"
                    >
                        <ChevronLeft size={22} />
                        <span className="text-lg font-semibold">Pusat Bantuan</span>
                    </button>
                )}

                {!selected ? (
                    <div className="space-y-3">
                        {faqs.length === 0 && (
                            <p className="py-8 text-center text-sm text-gray-400">
                                Belum ada pertanyaan yang tersedia.
                            </p>
                        )}
                        {faqs.map((faq) => (
                            <button
                                key={faq.id}
                                type="button"
                                onClick={() => openFaq(faq)}
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5 text-left text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                {faq.pertanyaan}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                            {selected.jawaban.split('\n').filter(Boolean).map((paragraf, i) => (
                                <p key={i}>{paragraf}</p>
                            ))}
                        </div>

                        <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                            <p className="mb-3 text-sm font-semibold text-gray-900">Apakah ini membantu?</p>
                            {feedback ? (
                                <p className="rounded-lg bg-white px-4 py-2.5 text-center text-sm font-medium text-emerald-700">
                                    Terima kasih atas tanggapanmu!
                                </p>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => submitFeedback('ya')}
                                        className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        YA
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => submitFeedback('tidak')}
                                        className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        TIDAK
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </MitraLayout>
    );
}