<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('name');
            $table->string('phone', 20);

            // Merujuk ke data wilayah yang dipakai WilayahController
            // (provinces / regencies / districts). Sesuaikan tipe kolom
            // ini (integer/string) dengan primary key tabel wilayah kamu.
            $table->unsignedBigInteger('province_id');
            $table->unsignedBigInteger('city_id'); // = regency_id
            $table->unsignedBigInteger('district_id');

            $table->text('address');
            $table->text('notes')->nullable();
            $table->boolean('is_primary')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};