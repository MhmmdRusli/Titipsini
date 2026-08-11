<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Diisi begitu customer benar-benar membayar denda keterlambatan
            // (lihat Customer\OrderController::bayarDenda()). Selama kosong,
            // denda dianggap "belum ditagih" — TIDAK dihitung sebagai hak
            // mitra di User::saldoMitra(), dan Admin tidak bisa menyelesaikan
            // pesanan (lihat guard baru di Admin\OrderController::updateStatus()).
            $table->timestamp('denda_paid_at')->nullable()->after('tanggal_selesai_aktual');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('denda_paid_at');
        });
    }
};