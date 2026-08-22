import { Head } from '@inertiajs/react';
import KategoriLayananView from '@/Components/Layanan/KategoriLayananView';
import { Home, Plus } from 'lucide-react';

function IlustrasiBangunan() {
    return (
        <div className="relative flex h-full w-full items-center justify-center">
            <Home size={110} strokeWidth={1.5} className="text-green-600" />
            <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white">
                <Plus size={18} strokeWidth={3} />
            </div>
        </div>
    );
}

export default function KelolaBangunan({ layanan = [], daftarKota = [], menungguVerifikasi = false }) {
    return (
        <>
            <Head title="Kelola Bangunan" />
            <KategoriLayananView
                kategori="bangunan"
                title="Kelola Bangunan"
                ilustrasi={<IlustrasiBangunan />}
                judulKosong="Layanan Bangunan Masih Kosong"
                subjudulKosong="Daftarkan diri anda atau pegawai dengan mengisi data diri"
                heading="Layanan Bangunan"
                subheading="Daftar Bangunan anda dan isi data bangunan"
                labelBox="Bangunan Titipan"
                labelTambah="Tambah Bangunan"
                layanan={layanan}
                daftarKota={daftarKota}
                menungguVerifikasi={menungguVerifikasi}
            />
        </>
    );
}