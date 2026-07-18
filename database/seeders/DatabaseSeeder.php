<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $cities = ['Bandung', 'Jakarta', 'Surabaya', 'Semarang', 'Yogyakarta'];

        User::create([
            'name' => 'Admin Titipsini',
            'email' => 'admin@titipsini.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Pelanggan Contoh',
            'email' => 'customer@titipsini.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'city' => $cities[0],
        ]);

        User::create([
            'name' => 'Mitra Contoh',
            'email' => 'partner@titipsini.test',
            'password' => Hash::make('password'),
            'role' => 'partner',
            'city' => $cities[0],
            'verification_status' => 'terverifikasi',
        ]);

        foreach ($cities as $city) {
            User::factory()->count(4)->create([
                'role' => 'customer',
                'city' => $city,
                'password' => Hash::make('password'),
            ]);

            User::factory()->count(2)->create([
                'role' => 'partner',
                'city' => $city,
                'verification_status' => 'terverifikasi',
                'password' => Hash::make('password'),
            ]);
        }

        Order::factory()->count(150)->create();
    }
}