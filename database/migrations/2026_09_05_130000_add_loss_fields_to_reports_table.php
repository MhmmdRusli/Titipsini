<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (! Schema::hasColumn('reports', 'item_condition')) {
                $table->string('item_condition')->nullable()->after('description');
            }
            if (! Schema::hasColumn('reports', 'estimated_loss')) {
                $table->decimal('estimated_loss', 12, 2)->nullable()->after('item_condition');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn(['item_condition', 'estimated_loss']);
        });
    }
};
