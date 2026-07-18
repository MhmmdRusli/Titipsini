<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('foto')->nullable()->after('phone');
            $table->date('tanggal_lahir')->nullable()->after('foto');
            $table->string('provinsi')->nullable()->after('city');
            $table->string('kecamatan')->nullable()->after('provinsi');
            $table->string('wilayah')->nullable()->after('kecamatan');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'foto',
                'tanggal_lahir',
                'provinsi',
                'kecamatan',
                'wilayah',
            ]);
        });
    }
};