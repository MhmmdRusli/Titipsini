<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'denda_paid_at')) {
                $table->timestamp('denda_paid_at')->nullable()->after('tanggal_selesai_aktual');
            }
            if (! Schema::hasColumn('orders', 'denda_payment_receipt')) {
                $table->string('denda_payment_receipt')->nullable()->after('denda_paid_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['denda_paid_at', 'denda_payment_receipt']);
        });
    }
};