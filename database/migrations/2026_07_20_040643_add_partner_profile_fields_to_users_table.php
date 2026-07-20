<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('toko_buka')->default(true)->after('saldo');
            $table->time('jam_buka')->nullable()->after('toko_buka');
            $table->time('jam_tutup')->nullable()->after('jam_buka');
            $table->json('layanan_kategori')->nullable()->after('jam_tutup'); // ex: ["barang","kendaraan"]
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['toko_buka', 'jam_buka', 'jam_tutup', 'layanan_kategori']);
        });
    }
};