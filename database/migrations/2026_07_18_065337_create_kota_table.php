<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kota', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('provinsi');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // No foreign key needed: `users.city` is a plain string column and
        // is matched against `kota.nama` at query time (see Kota::vendors()).
    }

    public function down(): void
    {
        Schema::dropIfExists('kota');
    }
};