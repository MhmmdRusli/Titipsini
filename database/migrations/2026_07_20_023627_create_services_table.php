<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // vendor/partner pemilik
            $table->enum('kategori', ['barang', 'bangunan', 'kendaraan', 'pindahan']);
            // Hanya diisi kalau kategori = kendaraan
            $table->enum('jenis_kendaraan', [
                'motor', 'mobil', 'truk', 'becak', 'sepeda', 'bus', 'mobil_pick_up',
            ])->nullable();
            $table->string('nama');
            $table->string('foto')->nullable();
            $table->string('kota');
            $table->string('kecamatan');
            $table->decimal('harga', 12, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['kategori', 'jenis_kendaraan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};