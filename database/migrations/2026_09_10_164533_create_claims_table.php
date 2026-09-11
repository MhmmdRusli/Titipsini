<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mitra_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', [
                'klaim_diajukan',
                'menunggu_pemeriksaan_admin',
                'menunggu_klarifikasi_mitra',
                'disetujui',
                'diproses_finance',
                'refund_berhasil',
                'ditolak',
                'sengketa',
            ])->default('klaim_diajukan');
            $table->text('alasan')->comment('Customer claim reason');
            $table->json('foto_urls')->nullable()->comment('Customer evidence photos');
            $table->decimal('jumlah_klaim', 12, 2)->nullable()->comment('Claim amount requested');
            $table->decimal('persentase_refund')->nullable()->unsignedTinyInteger()->comment('Refund percentage if approved');
            $table->decimal('jumlah_refund', 12, 2)->nullable()->comment('Refund amount approved');
            
            // Admin validation
            $table->foreignId('admin_validator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('admin_validated_at')->nullable();
            $table->text('admin_catatan')->nullable()->comment('Admin validation notes');
            
            // Mitra clarification
            $table->text('mitra_klarifikasi')->nullable()->comment('Mitra clarification/evidence');
            $table->json('mitra_foto_urls')->nullable()->comment('Mitra evidence photos');
            $table->timestamp('mitra_responded_at')->nullable();
            
            // Finance processing
            $table->foreignId('finance_processor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('finance_processed_at')->nullable();
            $table->text('finance_catatan')->nullable();
            
            // SuperAdmin dispute resolution
            $table->foreignId('super_admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('super_admin_decided_at')->nullable();
            $table->text('super_admin_keputusan')->nullable()->comment('Final decision from SuperAdmin');
            
            $table->timestamps();
            $table->softDeletes();

            $table->index(['order_id', 'status']);
            $table->index(['customer_id', 'status']);
            $table->index(['mitra_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};