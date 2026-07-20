<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifikasi', function (Blueprint $table) {
            $table->foreignId('order_id')->nullable()->after('user_id')
                ->constrained('orders')->nullOnDelete();
        });

        DB::statement("ALTER TABLE notifikasi MODIFY COLUMN type ENUM(
            'penitipan_berhasil',
            'pembayaran_diterima',
            'penitipan_hampir_berakhir',
            'penitipan_selesai',
            'transaksi_masuk',
            'jadwal_pickup',
            'verifikasi_ktp_disetujui'
        ) NOT NULL");
    }

    public function down(): void
    {
        Schema::table('notifikasi', function (Blueprint $table) {
            $table->dropConstrainedForeignId('order_id');
        });

        DB::statement("ALTER TABLE notifikasi MODIFY COLUMN type ENUM(
            'penitipan_berhasil',
            'pembayaran_diterima',
            'penitipan_hampir_berakhir',
            'penitipan_selesai'
        ) NOT NULL");
    }
};