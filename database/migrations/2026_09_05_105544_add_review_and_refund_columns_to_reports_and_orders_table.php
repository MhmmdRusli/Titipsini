<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (!Schema::hasColumn('reports', 'status')) {
                $table->string('status')->default('menunggu')->after('evidence_url');
            }
            if (!Schema::hasColumn('reports', 'reviewed_by')) {
                $table->foreignId('reviewed_by')->nullable()->after('status')
                    ->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('reports', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            }
            if (!Schema::hasColumn('reports', 'admin_note')) {
                $table->text('admin_note')->nullable()->after('reviewed_at');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'refund_percentage')) {
                $table->unsignedTinyInteger('refund_percentage')->nullable()->after('total_price');
            }
            if (!Schema::hasColumn('orders', 'refund_amount')) {
                $table->decimal('refund_amount', 12, 2)->nullable()->after('refund_percentage');
            }
            if (!Schema::hasColumn('orders', 'refund_reason')) {
                $table->text('refund_reason')->nullable()->after('refund_amount');
            }
            if (!Schema::hasColumn('orders', 'refunded_at')) {
                $table->timestamp('refunded_at')->nullable()->after('refund_reason');
            }
            if (!Schema::hasColumn('orders', 'refunded_by')) {
                $table->foreignId('refunded_by')->nullable()->after('refunded_at')
                    ->constrained('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['status', 'reviewed_at', 'admin_note']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('refunded_by');
            $table->dropColumn(['refund_percentage', 'refund_amount', 'refund_reason', 'refunded_at']);
        });
    }
};