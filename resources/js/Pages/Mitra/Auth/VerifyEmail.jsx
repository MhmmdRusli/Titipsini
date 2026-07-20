import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';

export default function VerifyEmail({ email }) {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const resend = () => {
        setSending(true);
        router.post(
            route('mitra.verify-email.send'),
            {},
            {
                onFinish: () => setSending(false),
                onSuccess: () => setSent(true),
            }
        );
    };

    return (
        <div className="min-h-dvh bg-gray-200 sm:flex sm:items-center sm:justify-center sm:py-6">
            <Head title="Verifikasi Email" />

            <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col items-center justify-center bg-white px-8 text-center sm:h-[850px] sm:shadow-xl">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <MailCheck size={36} />
                </div>
                <h1 className="mt-6 text-xl font-bold text-gray-900">Cek Email Kamu</h1>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Kami sudah mengirim tautan aktivasi ke{' '}
                    <span className="font-medium text-gray-800">{email}</span>. Klik tautan itu untuk mengaktifkan akun mitra kamu.
                </p>

                {sent && (
                    <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                        Tautan verifikasi baru sudah dikirim.
                    </p>
                )}

                <button
                    type="button"
                    onClick={resend}
                    disabled={sending}
                    className="mt-6 w-full rounded-full bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                    {sending ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                </button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                    Keluar
                </Link>
            </div>
        </div>
    );
}