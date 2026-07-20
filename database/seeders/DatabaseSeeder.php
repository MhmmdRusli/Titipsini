<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $cities = ['Bandung', 'Jakarta', 'Surabaya', 'Semarang', 'Yogyakarta'];

        // Catatan: TIDAK pakai Hash::make() di sini karena model User sudah
        // punya cast 'password' => 'hashed', yang otomatis meng-hash setiap
        // kali kolom password di-set. Kalau di-hash manual juga di sini,
        // hasilnya di-hash dua kali dan login jadi selalu gagal.

        User::create([
            'name' => 'Admin Titipsini',
            'email' => 'admin@titipsini.test',
            'password' => 'password1',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Pelanggan Contoh',
            'email' => 'customer@titipsini.test',
            'password' => 'password',
            'role' => 'customer',
            'city' => $cities[0],
        ]);

        User::create([
            'name' => 'Mitra Contoh',
            'email' => 'partner@titipsini.test',
            'password' => 'password',
            'role' => 'partner',
            'city' => $cities[0],
            'verification_status' => 'terverifikasi',
        ]);

        foreach ($cities as $city) {
            User::factory()->count(4)->create([
                'role' => 'customer',
                'city' => $city,
                'password' => 'password',
            ]);

            User::factory()->count(2)->create([
                'role' => 'partner',
                'city' => $city,
                'verification_status' => 'terverifikasi',
                'password' => 'password',
            ]);
        }

        Order::factory()->count(150)->create();
    }
}