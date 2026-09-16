<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('reports', 'category')) {
            return;
        }

        DB::table('reports')
            ->whereNull('category')
            ->update(['category' => 'complain']);
    }

    public function down(): void
    {
        //
    }
};
