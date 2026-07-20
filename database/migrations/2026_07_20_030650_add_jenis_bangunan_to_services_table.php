<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Hanya diisi kalau kategori = bangunan (sama seperti jenis_kendaraan
            // yang hanya diisi kalau kategori = kendaraan)
            $table->enum('jenis_bangunan', [
                'rumah', 'apartemen', 'kosan', 'gudang', 'kamar',
            ])->nullable()->after('jenis_kendaraan');

            $table->index(['kategori', 'jenis_bangunan']);
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex(['kategori', 'jenis_bangunan']);
            $table->dropColumn('jenis_bangunan');
        });
    }
};