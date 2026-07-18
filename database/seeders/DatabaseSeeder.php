<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
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
        ]);

        User::create([
            'name' => 'Mitra Contoh',
            'email' => 'partner@titipsini.test',
            'password' => Hash::make('password'),
            'role' => 'partner',
        ]);
    }
}
