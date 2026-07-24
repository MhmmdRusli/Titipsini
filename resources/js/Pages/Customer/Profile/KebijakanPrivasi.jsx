import { Head } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function KebijakanPrivasi() {
    return (
        <CustomerLayout title="Kebijakan Privasi" backHref="/app/profile/tentang">
            <Head title="Kebijakan Privasi" />

            <div className="px-4 py-5 text-xs text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                <div className="border-b border-gray-200 pb-3 dark:border-gray-800">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Terakhir diperbarui: Juli 2026</p>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1">Kebijakan Privasi Titipsini.Com</h2>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">1. Pendahuluan</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Kebijakan Privasi ini menjelaskan bagaimana <span className="font-semibold text-gray-800 dark:text-gray-200">Titipsini.Com</span> mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan aplikasi dan layanan kami (titip barang, kendaraan, bangunan, dan pindahan).
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">2. Informasi yang Kami Kumpulkan</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1.5">Kami dapat mengumpulkan data pribadi berikut dari Anda:</p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>Informasi identitas (Nama lengkap, alamat email, nomor telepon/WhatsApp).</li>
                        <li>Informasi akun dan profil pengguna atau mitra.</li>
                        <li>Data transaksi dan riwayat pemesanan layanan penitipan.</li>
                        <li>Informasi lokasi atau alamat penjemputan/penitipan barang.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">3. Penggunaan Informasi</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1.5">Informasi yang dikumpulkan digunakan untuk:</p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>Memproses pesanan dan memfasilitasi komunikasi antara Anda dan penyedia layanan (mitra).</li>
                        <li>Mengirimkan notifikasi status pesanan, pembaruan aplikasi, atau informasi penting lainnya.</li>
                        <li>Meningkatkan kualitas keamanan, performa, dan fitur layanan aplikasi.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">4. Keamanan Data</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Kami berkomitmen untuk melindungi keamanan data pribadi Anda dengan menerapkan langkah-langkah teknis dan administratif yang wajar untuk mencegah akses, pengungkapan, atau perubahan data yang tidak sah.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">5. Perubahan Kebijakan Privasi</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu sewaktu-waktu. Perubahan akan dipublikasikan pada halaman ini, dan Anda disarankan untuk memeriksanya secara berkala.
                    </p>
                </div>

                <div className="pt-2 pb-6 border-t border-gray-200 dark:border-gray-800 text-[11px] text-gray-400">
                    Jika Anda memiliki pertanyaan seputar Kebijakan Privasi ini, silakan hubungi tim dukungan Titipsini.Com.
                </div>
            </div>
        </CustomerLayout>
    );
}