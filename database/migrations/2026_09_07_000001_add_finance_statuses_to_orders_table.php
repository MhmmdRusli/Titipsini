<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', [
                'baru',
                'diproses',
                'selesai',
                'dibatalkan',
                'menunggu_verifikasi_finance',
                'pembayaran_diterima',
            ])->default('baru')->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', [
                'baru',
                'diproses',
                'selesai',
                'dibatalkan',
            ])->default('baru')->change();
        });
    }
};
