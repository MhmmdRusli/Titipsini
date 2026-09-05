<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            // Status approval khusus untuk laporan kerugian - gate agar finance
            // tidak bisa proses refund sebelum admin memverifikasi data + foto.
            if (! Schema::hasColumn('reports', 'admin_approval')) {
                $table->enum('admin_approval', ['pending', 'approved', 'rejected'])
                    ->default('pending')
                    ->after('status');
            }
            if (! Schema::hasColumn('reports', 'admin_approval_by')) {
                $table->foreignId('admin_approval_by')->nullable()->after('admin_approval')
                    ->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('reports', 'admin_approval_at')) {
                $table->timestamp('admin_approval_at')->nullable()->after('admin_approval_by');
            }
            if (! Schema::hasColumn('reports', 'admin_approval_note')) {
                $table->text('admin_approval_note')->nullable()->after('admin_approval_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropConstrainedForeignId('admin_approval_by');
            $table->dropColumn(['admin_approval', 'admin_approval_at', 'admin_approval_note']);
        });
    }
};
