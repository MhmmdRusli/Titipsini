<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('topups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('kode_transaksi')->unique();
            $table->unsignedBigInteger('nominal');
            $table->unsignedBigInteger('biaya_admin')->default(5000);
            $table->unsignedBigInteger('total'); // nominal + biaya_admin
            $table->enum('metode_pembayaran', ['transfer_bank', 'e_wallet']);
            $table->string('channel')->nullable(); // contoh: "BRI", "OVO"
            $table->string('va_number')->nullable();
            $table->enum('status', ['pending', 'berhasil', 'gagal'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('topups');
    }
};