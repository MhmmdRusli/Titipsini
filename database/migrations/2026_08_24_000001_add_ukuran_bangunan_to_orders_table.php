<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedInteger('ukuran_panjang')->nullable()->after('ukuran_barang');
            $table->unsignedInteger('ukuran_lebar')->nullable()->after('ukuran_panjang');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['ukuran_panjang', 'ukuran_lebar']);
        });
    }
};
