import { Head } from '@inertiajs/react';
import KategoriLayananView from '@/Components/Layanan/KategoriLayananView';
import FormIdentitasGudang from '@/Components/Layanan/FormIdentitasGudang';
import { BookMarked, Plus } from 'lucide-react';

function IlustrasiBarang() {
    return (
        <div className="relative flex h-full w-full items-center justify-center">
            <BookMarked size={110} strokeWidth={1.5} className="text-green-600" />
            <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white">
                <Plus size={18} strokeWidth={3} />
            </div>
        </div>
    );
}

export default function KelolaBarang({ layanan = [], daftarKota = [], menungguVerifikasi = false }) {
    return (
        <>
            <Head title="Kelola Gudang" />
                <KategoriLayananView
                kategori="barang"
                title="Kelola Barang"
                ilustrasi={<IlustrasiBarang />}
                judulKosong="Layanan Barang Masih Kosong"
                subjudulKosong="Daftarkan Gudang anda dengan mengisi data Alamat Gudang"
                judulHub="Tambah Layanan Gudang"
                subheading="Daftarkan tempat parkir dengan mengisi data dibawah ini"
                labelBox="Alamat gudang"
                labelTambah="Tambah Alamat Lahan Gudang"
                layanan={layanan}
                daftarKota={daftarKota}
                menungguVerifikasi={menungguVerifikasi}
                FormKustom={FormIdentitasGudang}
            />
        </>
    );
}