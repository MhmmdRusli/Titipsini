<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('topups', function (Blueprint $table) {
            if (! Schema::hasColumn('topups', 'bukti_transfer')) {
                $table->string('bukti_transfer')->nullable()->after('va_number');
            }
            if (! Schema::hasColumn('topups', 'catatan_admin')) {
                $table->text('catatan_admin')->nullable()->after('status');
            }
            if (! Schema::hasColumn('topups', 'verified_by')) {
                $table->foreignId('verified_by')->nullable()->after('paid_at')
                    ->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('topups', 'verified_at')) {
                $table->timestamp('verified_at')->nullable()->after('verified_by');
            }
        });

        // Tambah 'menunggu_verifikasi' & 'ditolak' ke enum status yang sudah
        // ada (pending/berhasil/gagal tetap dipertahankan supaya data lama
        // yang mungkin sudah pakai status itu tidak rusak).
        DB::statement("ALTER TABLE topups MODIFY status ENUM('pending', 'menunggu_verifikasi', 'berhasil', 'ditolak', 'gagal') DEFAULT 'pending'");
    }

    public function down(): void
    {
        Schema::table('topups', function (Blueprint $table) {
            if (Schema::hasColumn('topups', 'verified_by')) {
                $table->dropConstrainedForeignId('verified_by');
            }
            $table->dropColumn(['bukti_transfer', 'catatan_admin', 'verified_at']);
        });

        DB::statement("ALTER TABLE topups MODIFY status ENUM('pending', 'berhasil', 'gagal') DEFAULT 'pending'");
    }
};