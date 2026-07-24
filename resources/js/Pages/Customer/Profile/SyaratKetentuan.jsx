import { Head } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function SyaratKetentuan() {
    return (
        <CustomerLayout title="Syarat & Ketentuan" backHref="/app/profile/tentang">
            <Head title="Syarat & Ketentuan" />

            <div className="px-4 py-5 text-xs text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                <div className="border-b border-gray-200 pb-3 dark:border-gray-800">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Terakhir diperbarui: Juli 2026</p>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1">Syarat & Ketentuan Layanan Titipsini.Com</h2>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">1. Ketentuan Umum</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Selamat datang di <span className="font-semibold text-gray-800 dark:text-gray-200">Titipsini.Com</span>. Dengan mengakses dan menggunakan aplikasi kami, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan yang berlaku.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">2. Layanan Penitipan & Pindahan</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1.5">
                        Titipsini.Com menyediakan platform penghubung antara pengguna (customer) dengan penyedia tempat/mitra penitipan barang, kendaraan, bangunan, serta layanan pindahan. Kami berkomitmen menjaga keamanan, namun segala risiko operasional yang disepakati diatur melalui ketentuan mitra terkait.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">3. Barang yang Dilarang</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1.5">Pengguna dilarang keras menitipkan barang-barang berikut:</p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>Narkotika, psikotropika, dan zat terlarang lainnya.</li>
                        <li>Senjata api, bahan peledak, dan benda tajam berbahaya tanpa izin resmi.</li>
                        <li>Barang curian atau barang yang melanggar hukum yang berlaku di Republik Indonesia.</li>
                        <li>Bahan kimia berbahaya yang mudah terbakar atau beracun tanpa pengamanan khusus.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">4. Pembayaran & Pembatalan</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Semua transaksi pembayaran wajib dilakukan melalui saluran resmi yang disediakan di dalam aplikasi. Kebijakan pembatalan dan pengembalian dana (refund) mengikuti ketentuan pada masing-masing jenis layanan pesanan.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">5. Batasan Tanggung Jawab</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Titipsini.Com tidak bertanggung jawab atas kerugian akibat kelalaian pengguna dalam mematuhi aturan penitipan atau memberikan informasi data yang tidak akurat saat melakukan pemesanan.
                    </p>
                </div>

                <div className="pt-2 pb-6 border-t border-gray-200 dark:border-gray-800 text-[11px] text-gray-400">
                    Jika Anda memiliki pertanyaan lebih lanjut mengenai Syarat & Ketentuan ini, silakan hubungi layanan bantuan pelanggan kami.
                </div>
            </div>
        </CustomerLayout>
    );
}