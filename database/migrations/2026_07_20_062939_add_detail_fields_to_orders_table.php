// database/migrations/2026_07_20_100000_add_detail_fields_to_orders_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'order_number')) {
                $table->string('order_number')->nullable()->after('id');
            }
            if (!Schema::hasColumn('orders', 'cancel_reason')) {
                $table->string('cancel_reason')->nullable();
            }
            if (!Schema::hasColumn('orders', 'pickup_address')) {
                $table->text('pickup_address')->nullable();
            }
            if (!Schema::hasColumn('orders', 'dropoff_address')) {
                $table->text('dropoff_address')->nullable();
            }
            if (!Schema::hasColumn('orders', 'item_description')) {
                $table->text('item_description')->nullable();
            }
            if (!Schema::hasColumn('orders', 'duration')) {
                $table->string('duration')->nullable();
            }
            if (!Schema::hasColumn('orders', 'pickup_status')) {
                $table->string('pickup_status')->nullable();
            }
            if (!Schema::hasColumn('orders', 'subtotal')) {
                $table->decimal('subtotal', 12, 2)->default(0);
            }
            if (!Schema::hasColumn('orders', 'discount')) {
                $table->decimal('discount', 12, 2)->default(0);
            }
            if (!Schema::hasColumn('orders', 'pickup_fee')) {
                $table->decimal('pickup_fee', 12, 2)->default(0);
            }
            if (!Schema::hasColumn('orders', 'total')) {
                $table->decimal('total', 12, 2)->default(0);
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'order_number', 'cancel_reason', 'pickup_address', 'dropoff_address',
                'item_description', 'duration', 'pickup_status',
                'subtotal', 'discount', 'pickup_fee', 'total',
            ]);
        });
    }
};