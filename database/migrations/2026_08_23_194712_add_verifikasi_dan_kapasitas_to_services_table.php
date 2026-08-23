<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->unsignedInteger('jumlah_tampung')->nullable()->after('lebar');
            $table->enum('verification_status', ['pending', 'terverifikasi', 'ditolak'])
                ->default('pending')
                ->after('is_active');
            $table->text('rejection_reason')->nullable()->after('verification_status');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['jumlah_tampung', 'verification_status', 'rejection_reason']);
        });
    }
};