<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'item_name')) {
                $table->string('item_name')->nullable()->after('service_type');
            }
            if (!Schema::hasColumn('orders', 'start_date')) {
                $table->date('start_date')->nullable()->after('item_name');
            }
            if (!Schema::hasColumn('orders', 'end_date')) {
                $table->date('end_date')->nullable()->after('start_date');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['item_name', 'start_date', 'end_date']);
        });
    }
};