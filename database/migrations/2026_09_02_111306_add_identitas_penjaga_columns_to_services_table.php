<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('nama_penjaga')->nullable()->after('jenis_bangunan');
            $table->string('nomor_telepon')->nullable()->after('nama_penjaga');
            $table->string('tanggal_lahir')->nullable()->after('nomor_telepon');
            $table->string('status_kepemilikan')->nullable()->after('tanggal_lahir');
            $table->string('upload_berkas')->nullable()->after('status_kepemilikan');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'nama_penjaga',
                'nomor_telepon',
                'tanggal_lahir',
                'status_kepemilikan',
                'upload_berkas',
            ]);
        });
    }
};