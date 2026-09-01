import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import MitraLayout from '@/Layouts/MitraLayout';

export default function KebijakanPrivasi() {
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

                <div className="space-y-5 text-sm leading-relaxed text-gray-700">
                    <div>
                        <h2 className="mb-2 text-base font-bold text-gray-900">
                            Kebijakan Privasi Titipsini.com
                        </h2>
                        <p className="mb-3">
                            Kebijakan privasi ini merupakan komitmen dari Rukun (PT. Titipsini.com) untuk
                            menghargai dan melindungi terhadap data dan atau informasi pribadi maupun
                            wilayah sebagai pengguna aplikasi Titipsini.com.fa
                        </p>
                        <p>
                            Kebijakan Privasi ini menjelaskan bagaimana Titipsini mengumpulkan,
                            menyimpan, menggunakan, mengolah, menguasai, mentransfer, mengungkapkan dan
                            melindungi informasi Wilayah dan Pribadi Anda. Kebijakan Privasi ini berlaku
                            bagi seluruh pengguna aplikasi titipsini, baik melalui proses registrasi di
                            mobile-apps maupun melalui website www.titipsini.comsecara langsung maupun
                            melalui pihak ketiga.
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    <div>
                        <h2 className="mb-2 text-base font-bold text-gray-900">
                            Syarat dan ketentuan Titipsini.com
                        </h2>
                        <ol className="list-decimal space-y-3 pl-5">
                            <li>
                                Seluruh Pengguna harus menggunakan Layanan sesuai dengan Syarat dan
                                Ketentuan ini. Para Pengguna tidak dapat menggunakan Layanan kecuali jika
                                mereka menyetujui Syarat dan Ketentuan ini.
                            </li>
                            <li>
                                Para Pengguna di bawah umur hanya dapat menggunakan Layanan dengan
                                memperoleh persetujuan terlebih dahulu dari orang tua atau wali yang sah
                                mereka. Selanjutnya, jika Para Pengguna akan menggunakan Layanan atas
                                nama, atau untuk kepentingan, suatu perusahaan, maka perusahaan tersebut
                                juga harus dianggap telah menyetujui Syarat dan Ketentuan ini sebelum
                                menggunakan Layanan.
                            </li>
                            <li>
                                Jika terdapat Syarat dan Ketentuan yang Terpisah yang berlaku untuk
                                Layanan, Para Pengguna juga harus mematuhi Syarat dan Ketentuan yang
                                Terpisah tersebut dan Syarat dan Ketentuan ini dalam menggunakan Layanan.
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </MitraLayout>
    );
}