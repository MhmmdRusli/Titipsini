<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifikasi', function (Blueprint $table) {
            $table->string('type', 50)->change();
        });
    }

    public function down(): void
    {
        Schema::table('notifikasi', function (Blueprint $table) {
            $table->enum('type', [
                'penitipan_berhasil',
                'pembayaran_diterima',
                'penitipan_hampir_berakhir',
                'penitipan_selesai',
                'transaksi_masuk',
                'jadwal_pickup',
                'verifikasi_ktp_disetujui',
            ])->change();
        });
    }
};