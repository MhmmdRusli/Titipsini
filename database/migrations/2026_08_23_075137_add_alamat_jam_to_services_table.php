<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('alamat_lengkap')->nullable()->after('kecamatan');
            $table->time('jam_buka')->nullable()->after('alamat_lengkap');
            $table->time('jam_tutup')->nullable()->after('jam_buka');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['alamat_lengkap', 'jam_buka', 'jam_tutup']);
        });
    }
};