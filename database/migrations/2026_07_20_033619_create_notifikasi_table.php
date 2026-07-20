php artisan make:migration create_rekening_bank_table<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('type', [
                'penitipan_berhasil',
                'pembayaran_diterima',
                'penitipan_hampir_berakhir',
                'penitipan_selesai',
            ]);
            $table->string('judul');
            $table->string('pesan');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifikasi');
    }
};