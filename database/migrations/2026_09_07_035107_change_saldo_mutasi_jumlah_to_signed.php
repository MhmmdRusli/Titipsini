<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $currentType = \DB::select("SHOW COLUMNS FROM saldo_mutasi WHERE Field = 'jumlah'")[0]->Type ?? '';
        
        if (strpos($currentType, 'unsigned') !== false) {
            Schema::table('saldo_mutasi', function (Blueprint $table) {
                $table->bigInteger('jumlah')->change();
            });
        }
    }

    public function down(): void
    {
        Schema::table('saldo_mutasi', function (Blueprint $table) {
            $table->unsignedBigInteger('jumlah')->change();
        });
    }
};
