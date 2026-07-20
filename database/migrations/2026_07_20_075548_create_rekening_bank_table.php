<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rekening_bank', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('nama_bank');
            $table->string('nomor_rekening');
            $table->string('nama_pemilik');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rekening_bank');
    }
};