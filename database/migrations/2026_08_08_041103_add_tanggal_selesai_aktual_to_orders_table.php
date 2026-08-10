<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Diisi otomatis saat fase order mencapai 'akhir' (lihat
            // Mitra\OrderController::updateFase()) - dipakai sebagai
            // "tanggal selesai sebenarnya" untuk menghitung denda
            // keterlambatan, supaya nilainya TERKUNCI dan tidak terus
            // bertambah setelah order benar-benar selesai secara operasional.
            // Selama masih null (order masih berjalan), denda dihitung
            // sebagai estimasi live dibandingkan ke waktu sekarang.
            $table->timestamp('tanggal_selesai_aktual')->nullable()->after('fase');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('tanggal_selesai_aktual');
        });
    }
};