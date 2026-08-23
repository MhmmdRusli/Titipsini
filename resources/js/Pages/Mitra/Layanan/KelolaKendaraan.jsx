import { Head } from '@inertiajs/react';
import KategoriLayananView from '@/Components/Layanan/KategoriLayananView';
import FormAlamatLahanParkir from '@/Components/Layanan/FormAlamatLahanParkir';
import { Car, ParkingSquare } from 'lucide-react';

function IlustrasiKendaraan() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <p className="text-center text-sm font-extrabold leading-tight tracking-wide text-green-600">
                PARKING
                <br />
                ZONE
            </p>
            <div className="flex items-end gap-1">
                <ParkingSquare size={26} className="text-green-600" strokeWidth={2} />
                <Car size={30} className="text-green-600" strokeWidth={2} />
                <Car size={30} className="text-green-600" strokeWidth={2} />
                <Car size={30} className="text-green-600" strokeWidth={2} />
            </div>
            <div className="h-0.5 w-32 bg-green-600" />
        </div>
    );
}

export default function KelolaKendaraan({ layanan = [], daftarKota = [], menungguVerifikasi = false }) {
    return (
        <>
            <Head title="Kelola Kendaraan" />
            <KategoriLayananView
                kategori="kendaraan"
                title="Kelola Kendaraan"
                ilustrasi={<IlustrasiKendaraan />}
                judulKosong="Layanan Kendaraan Masih Kosong"
                subjudulKosong="Daftarkan Tempat anda sebagai penitipan kendaraan"
                heading="Layanan Kendaraan"
                subheading="Daftar Tempat anda dan isi data penitipan"
                labelBox="Tempat Penitipan Kendaraan"
                labelTambah="Tambah Tempat"
                layanan={layanan}
                daftarKota={daftarKota}
                menungguVerifikasi={menungguVerifikasi}
                FormKustom={FormAlamatLahanParkir}
            />
        </>
    );
}   