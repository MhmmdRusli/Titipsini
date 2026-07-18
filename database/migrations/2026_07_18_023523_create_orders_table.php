<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code')->unique();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('partner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('service_type', ['barang', 'kendaraan', 'bangunan', 'pindahan']);
            $table->boolean('is_pickup')->default(false);
            $table->string('city');
            $table->enum('status', ['baru', 'diproses', 'selesai', 'dibatalkan'])->default('baru');
            $table->string('cancel_reason')->nullable();
            $table->decimal('total_price', 12, 2)->default(0);
            $table->timestamps();

            $table->index(['status', 'service_type']);
            $table->index('city');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};