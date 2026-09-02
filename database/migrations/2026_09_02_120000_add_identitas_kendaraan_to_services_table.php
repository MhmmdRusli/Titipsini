<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('nomor_polisi')->nullable()->after('jenis_kendaraan');
            $table->string('nomor_kir')->nullable()->after('nomor_polisi');
            $table->string('merek_kendaraan')->nullable()->after('nomor_kir');
            $table->string('jenis_pickup')->nullable()->after('merek_kendaraan');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'nomor_polisi',
                'nomor_kir',
                'merek_kendaraan',
                'jenis_pickup',
            ]);
        });
    }
};
