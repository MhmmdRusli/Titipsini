<?php

namespace Database\Seeders;

use App\Models\PaymentSetting;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Admin Utama
        User::create([
            'name' => 'Admin Titipsini',
            'email' => 'admin@titipsini.test',
            'password' => 'password1',
            'role' => 'admin',
        ]);

        // 2. Akun Pelanggan Utama
        User::create([
            'name' => 'Pelanggan Contoh',
            'email' => 'customer@titipsini.test',
            'password' => 'password',
            'role' => 'customer',
            'city' => 'Bandung',
        ]);

        // 3. Akun Mitra Utama (Aliea / Contoh)
        User::create([
            'name' => 'Mitra Contoh',
            'email' => 'partner@titipsini.test',
            'password' => 'password',
            'role' => 'partner',
            'city' => 'Bandung',
            'verification_status' => 'terverifikasi',
        ]);

        // 4. Default Setting Komisi & Pembayaran (Awal: Komisi 0%)
        PaymentSetting::firstOrCreate(
            ['id' => 1],
            [
                'komisi_persen' => 0, // Ubah ke 10 jika ingin komisi default 10%
                'qris_image' => null,
            ]
        );

        // NOTE:
        // Baris loop $cities (User::factory) dan Order::factory()->count(150) 
        // sudah DIHAPUS agar database kamu benar-benar bersih dari data dummy.
    }
}