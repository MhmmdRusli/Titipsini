<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Menambahkan kolom yang dibutuhkan untuk fitur:
 * - Registrasi customer/vendor/admin (role)
 * - Halaman Manajemen Pelanggan admin (verification_status, phone)
 * - Halaman Profile Customer (gender, address)
 * - Keamanan tambahan saat registrasi (pin)
 *
 * Diasumsikan migration dasar `create_users_table` (id, name, email,
 * password, timestamps) sudah ada dari kerjaan sebelumnya.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['customer', 'vendor', 'admin'])
                ->default('customer')
                ->after('email');

            $table->string('phone', 20)->nullable()->after('role');

            $table->enum('gender', ['male', 'female'])->nullable()->after('phone');

            $table->text('address')->nullable()->after('gender');

            // PIN keamanan tambahan saat registrasi (disimpan dalam bentuk hash)
            $table->string('pin', 255)->nullable()->after('address');

            // Status untuk tab filter di halaman Manajemen Pelanggan admin
            $table->enum('verification_status', [
                'pendaftar',
                'verifikasi_akun',
                'terverifikasi',
                'ditolak',
            ])->default('pendaftar')->after('pin');

            // Alasan penolakan, diisi hanya kalau status = ditolak
            $table->text('rejection_reason')->nullable()->after('verification_status');

            $table->timestamp('verified_at')->nullable()->after('rejection_reason');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'phone',
                'gender',
                'address',
                'pin',
                'verification_status',
                'rejection_reason',
                'verified_at',
            ]);
        });
    }
};