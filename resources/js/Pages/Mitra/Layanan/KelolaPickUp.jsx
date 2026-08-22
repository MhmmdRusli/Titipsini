import { Head } from '@inertiajs/react';
import KategoriLayananView from '@/Components/Layanan/KategoriLayananView';
import { Truck, CheckCircle2 } from 'lucide-react';

function IlustrasiPickUp() {
    return (
        <div className="relative flex h-full w-full items-center justify-center">
            <Truck size={110} strokeWidth={1.5} className="text-green-600" />
            <CheckCircle2
                size={40}
                strokeWidth={2}
                className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-green-600"
                fill="white"
            />
        </div>
    );
}

export default function KelolaPickUp({ layanan = [], daftarKota = [], menungguVerifikasi = false }) {
    return (
        <>
            <Head title="Kelola Pick Up" />
            <KategoriLayananView
                kategori="pindahan"
                title="Kelola Pick Up"
                ilustrasi={<IlustrasiPickUp />}
                judulKosong="Layanan Pick Up Masih Kosong"
                subjudulKosong="Daftarkan kendaraan anda sebagai layanan pick up"
                heading="Layanan Pick up"
                subheading="Daftar Kendaraan anda dan isi data kendaraan"
                labelBox="Kendaraan Pick Up"
                labelTambah="Tambah Pick Up"
                layanan={layanan}
                daftarKota={daftarKota}
                menungguVerifikasi={menungguVerifikasi}
            />
        </>
    );
}