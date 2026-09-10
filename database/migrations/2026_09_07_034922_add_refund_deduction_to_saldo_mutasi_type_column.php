<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $currentType = \DB::select("SHOW COLUMNS FROM saldo_mutasi WHERE Field = 'type'")[0]->Type ?? '';
        
        if (strpos($currentType, 'refund_deduction') === false) {
            Schema::table('saldo_mutasi', function (Blueprint $table) {
                $table->enum('type', ['penghasilan', 'penarikan', 'refund_deduction'])->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('saldo_mutasi', function (Blueprint $table) {
            $table->enum('type', ['penghasilan', 'penarikan'])->change();
        });
    }
};
