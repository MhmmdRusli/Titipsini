<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom is_active ke tabel users, dipakai untuk
     * mengaktifkan/menonaktifkan akun staf internal (finance/admin)
     * lewat SuperAdmin\UserController@toggleActive.
     *
     * Default true supaya akun yang sudah ada sekarang (termasuk
     * customer & vendor lama) tetap dianggap aktif setelah migration
     * ini jalan — tidak ada yang otomatis terkunci.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};