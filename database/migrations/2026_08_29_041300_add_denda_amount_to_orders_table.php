<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Nominal denda yang BENAR-BENAR dibayar customer, disimpan saat
            // denda lunas (saldo langsung atau setelah diverifikasi mitra/
            // admin). Dipakai supaya nilai denda yang ditagih = nilai yang
            // dikredit ke saldo mitra, tidak di-recompute terus menerus.
            if (! Schema::hasColumn('orders', 'denda_amount')) {
                $table->decimal('denda_amount', 12, 2)->nullable()->after('denda_paid_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('denda_amount');
        });
    }
};
