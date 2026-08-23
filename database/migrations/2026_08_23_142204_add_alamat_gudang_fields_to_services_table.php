<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            if (!Schema::hasColumn('services', 'nama_usaha')) {
                $table->string('nama_usaha')->nullable()->after('nama');
            }
            if (!Schema::hasColumn('services', 'provinsi')) {
                $table->string('provinsi')->nullable()->after('kota');
            }
            if (!Schema::hasColumn('services', 'kabupaten_kota')) {
                $table->string('kabupaten_kota')->nullable()->after('provinsi');
            }
            if (!Schema::hasColumn('services', 'alamat_lengkap')) {
                $table->text('alamat_lengkap')->nullable()->after('kecamatan');
            }
            if (!Schema::hasColumn('services', 'catatan_alamat')) {
                $table->text('catatan_alamat')->nullable()->after('alamat_lengkap');
            }
            if (!Schema::hasColumn('services', 'foto_lahan')) {
                $table->text('foto_lahan')->nullable()->after('catatan_alamat');
            }
            if (!Schema::hasColumn('services', 'panjang')) {
                $table->unsignedInteger('panjang')->nullable()->after('foto_lahan');
            }
            if (!Schema::hasColumn('services', 'lebar')) {
                $table->unsignedInteger('lebar')->nullable()->after('panjang');
            }
        });

        // Mengubah kolom lama menjadi nullable (jika kolom ada)
        Schema::table('services', function (Blueprint $table) {
            if (Schema::hasColumn('services', 'kota')) {
                $table->string('kota')->nullable()->change();
            }
            if (Schema::hasColumn('services', 'harga')) {
                $table->integer('harga')->nullable()->change();
            }
            if (Schema::hasColumn('services', 'foto')) {
                $table->string('foto')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $columnsToDrop = [];

            $targetColumns = [
                'nama_usaha',
                'provinsi',
                'kabupaten_kota',
                'alamat_lengkap',
                'catatan_alamat',
                'foto_lahan',
                'panjang',
                'lebar',
            ];

            foreach ($targetColumns as $column) {
                if (Schema::hasColumn('services', $column)) {
                    $columnsToDrop[] = $column;
                }
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};