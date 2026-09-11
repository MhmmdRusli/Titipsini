<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kondisi_awal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('mitra_id')->constrained('users')->cascadeOnDelete();
            $table->json('foto_urls')->comment('Array of photo URLs');
            $table->text('catatan')->nullable()->comment('Condition notes from Mitra');
            $table->timestamp('dokumentasi_at')->useCurrent()->comment('When documentation was created');
            $table->timestamps();

            $table->index(['order_id', 'mitra_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kondisi_awal');
    }
};