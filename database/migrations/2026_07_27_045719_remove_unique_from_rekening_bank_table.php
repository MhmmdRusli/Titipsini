<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rekening_bank', function (Blueprint $table) {
            // 1. Hapus foreign key dulu
            $table->dropForeign(['user_id']);
            
            // 2. Hapus index unique
            $table->dropUnique('rekening_bank_user_id_unique');
            
            // 3. Pasang lagi foreign key-nya (tanpa aturan unique)
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('rekening_bank', function (Blueprint $table) {
            $table->unique('user_id');
        });
    }
};