<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'bukti_denda')) {
                $table->string('bukti_denda')->nullable()->after('denda_payment_receipt');
            }
            if (! Schema::hasColumn('orders', 'status_denda')) {
                $table->string('status_denda')->nullable()->after('bukti_denda');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['bukti_denda', 'status_denda']);
        });
    }
};