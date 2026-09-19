<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('penarikan', function (Blueprint $table) {
            $table->unsignedBigInteger('utang_refund_dipotong')->default(0)->after('catatan');
            $table->unsignedBigInteger('jumlah_dikirim')->default(0)->after('utang_refund_dipotong');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penarikan', function (Blueprint $table) {
            $table->dropColumn(['utang_refund_dipotong', 'jumlah_dikirim']);
        });
    }
};
