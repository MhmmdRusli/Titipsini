import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

export default function KebijakanPrivasi() {
    const updated_at = "28 Juli 2026";

    const contentHtml = `
        <h3 style="font-weight: bold; font-size: 14px; margin-top: 12px; margin-bottom: 4px; color: #111827;">1. Ketentuan Umum</h3>
        <p style="margin-bottom: 12px;">Selamat datang di Titipsini.com. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, memproses, dan melindungi informasi serta data pribadi Anda saat menggunakan aplikasi Customer maupun Mitra (Vendor). Dengan menggunakan layanan kami, Anda dianggap telah membaca dan menyetujui seluruh ketentuan dalam kebijakan privasi ini.</p>

        <h3 style="font-weight: bold; font-size: 14px; margin-top: 12px; margin-bottom: 4px; color: #111827;">2. Pengumpulan Informasi Pribadi</h3>
        <p style="margin-bottom: 6px;">Kami mengumpulkan informasi yang Anda berikan secara langsung saat melakukan pendaftaran akun, memperbarui profil, atau bertransaksi di platform kami. Data tersebut meliputi:</p>
        <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 12px;">
            <li>Nama lengkap</li>
            <li>Alamat email dan nomor telepon yang aktif</li>
            <li>Alamat tempat tinggal atau lokasi operasional</li>
            <li>Data pendukung verifikasi akun (seperti foto identitas bagi mitra)</li>
        </ul>

        <h3 style="font-weight: bold; font-size: 14px; margin-top: 12px; margin-bottom: 4px; color: #111827;">3. Penggunaan Informasi</h3>
        <p style="margin-bottom: 6px;">Semua data dan informasi yang dikumpulkan dari Anda akan digunakan secara profesional untuk keperluan operasional sistem, di antaranya:</p>
        <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 12px;">
            <li>Memproses pesanan dan manajemen layanan barang, kendaraan, maupun bangunan</li>
            <li>Menghubungkan antara Customer dengan Mitra secara akurat</li>
            <li>Mengirimkan informasi penting terkait pembaruan status transaksi atau notifikasi sistem</li>
            <li>Meningkatkan kualitas keamanan dan kenyamanan layanan aplikasi</li>
        </ul>

        <h3 style="font-weight: bold; font-size: 14px; margin-top: 12px; margin-bottom: 4px; color: #111827;">4. Keamanan Data</h3>
        <p style="margin-bottom: 12px;">Kami berkomitmen untuk menjaga keamanan data pribadi Anda dengan menerapkan sistem keamanan berlapis guna mencegah akses, pengubahan, atau pengungkapan data yang tidak sah. Data Anda tidak akan diperjualbelikan kepada pihak ketiga tanpa izin Anda, kecuali diwajibkan oleh ketentuan hukum yang berlaku di Indonesia.</p>

        <h3 style="font-weight: bold; font-size: 14px; margin-top: 12px; margin-bottom: 4px; color: #111827;">5. Perubahan Kebijakan Privasi</h3>
        <p style="margin-bottom: 4px;">Kebijakan Privasi ini dapat diperbarui sewaktu-waktu demi menyesuaikan dengan perkembangan layanan maupun regulasi yang berlaku. Setiap perubahan akan diumumkan langsung melalui aplikasi resmi Titipsini.com.</p>
    `;

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

                    <div
                        className="prose prose-sm mt-4 max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>
            </div>
        </MitraLayout>
    );
}