// database/migrations/2026_07_21_090000_add_verifikasi_fields_to_topups_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('topups', function (Blueprint $table) {
            $table->string('bukti_transfer')->nullable()->after('va_number');
            $table->text('catatan_admin')->nullable()->after('status');
            $table->foreignId('verified_by')->nullable()->after('paid_at')->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable()->after('verified_by');
        });

        // Tambah pilihan status baru: menunggu_verifikasi & ditolak
        DB::statement("ALTER TABLE topups MODIFY status ENUM('pending','menunggu_verifikasi','berhasil','ditolak','gagal') DEFAULT 'pending'");
    }

    public function down(): void
    {
        Schema::table('topups', function (Blueprint $table) {
            $table->dropConstrainedForeignId('verified_by');
            $table->dropColumn(['bukti_transfer', 'catatan_admin', 'verified_at']);
        });

        DB::statement("ALTER TABLE topups MODIFY status ENUM('pending','berhasil','gagal') DEFAULT 'pending'");
    }
};