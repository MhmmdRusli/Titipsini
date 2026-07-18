<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Catatan: kolom `role`, `phone`, dan `verification_status` TIDAK ditambahkan
 * di sini karena sudah dibuat oleh migration lain:
 * - `role`, `phone`  -> dari create_users_table (migration dasar)
 * - `verification_status` -> dari add_city_and_verification_to_users_table
 *   (nilai enum: pendaftar, verifikasi_akun, terverifikasi, ditolak, ditangguhkan)
 *
 * Migration ini hanya menambah kolom tambahan yang belum ada di manapun,
 * dan pakai hasColumn() supaya aman dijalankan ulang / tidak bentrok kalau
 * skema berubah lagi di kemudian hari.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'gender')) {
                $table->enum('gender', ['male', 'female'])->nullable()->after('phone');
            }

            if (! Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('gender');
            }

            // PIN keamanan tambahan saat registrasi (disimpan dalam bentuk hash)
            if (! Schema::hasColumn('users', 'pin')) {
                $table->string('pin', 255)->nullable()->after('address');
            }

            // Alasan penolakan, diisi hanya kalau verification_status = ditolak
            if (! Schema::hasColumn('users', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('verification_status');
            }

            if (! Schema::hasColumn('users', 'verified_at')) {
                $table->timestamp('verified_at')->nullable()->after('rejection_reason');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = ['gender', 'address', 'pin', 'rejection_reason', 'verified_at'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};