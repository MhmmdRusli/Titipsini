<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('denda_settings', function (Blueprint $table) {
            $table->id();
            // barang | bangunan | kendaraan | pindahan - sama dengan enum
            // service_type di tabel orders.
            $table->string('service_type')->unique();
            // Persentase denda dari total_price, DIKALI jumlah hari terlambat.
            // Contoh: persen_per_hari = 5, total_price = 100.000, terlambat 2 hari
            // -> denda = 100.000 * 5% * 2 = 10.000
            $table->decimal('persen_per_hari', 5, 2)->default(2);
            // Batas atas denda (persentase dari total_price) supaya denda tidak
            // membengkak tanpa batas kalau keterlambatan sangat lama.
            // Default 100 artinya denda maksimal = total_price itu sendiri.
            $table->decimal('max_persen', 5, 2)->default(100);
            $table->timestamps();
        });

        // Nilai default awal per kategori - admin bisa ubah nanti lewat
        // halaman Pengaturan Denda (menyusul).
        DB::table('denda_settings')->insert([
            ['service_type' => 'barang', 'persen_per_hari' => 2, 'max_persen' => 100, 'created_at' => now(), 'updated_at' => now()],
            ['service_type' => 'bangunan', 'persen_per_hari' => 3, 'max_persen' => 100, 'created_at' => now(), 'updated_at' => now()],
            ['service_type' => 'kendaraan', 'persen_per_hari' => 5, 'max_persen' => 100, 'created_at' => now(), 'updated_at' => now()],
            ['service_type' => 'pindahan', 'persen_per_hari' => 2, 'max_persen' => 100, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('denda_settings');
    }
};