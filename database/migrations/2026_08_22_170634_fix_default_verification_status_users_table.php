<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE users 
            MODIFY verification_status ENUM('pendaftar', 'verifikasi_akun', 'terverifikasi', 'ditolak', 'ditangguhkan') 
            NOT NULL DEFAULT 'pendaftar'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE users 
            MODIFY verification_status ENUM('pendaftar', 'verifikasi_akun', 'terverifikasi', 'ditolak', 'ditangguhkan') 
            NOT NULL DEFAULT 'terverifikasi'
        ");
    }
};