<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('service_id')
                ->nullable()
                ->after('partner_id')
                ->constrained('services')
                ->nullOnDelete();

            $table->index(['service_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['service_id', 'status']);
            $table->dropConstrainedForeignId('service_id');
        });
    }
};