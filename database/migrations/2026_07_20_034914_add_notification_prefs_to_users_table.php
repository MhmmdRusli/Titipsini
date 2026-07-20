<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('notif_push')->default(true)->after('postal_code');
            $table->boolean('notif_email')->default(true)->after('notif_push');
            $table->boolean('notif_promo')->default(true)->after('notif_email');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['notif_push', 'notif_email', 'notif_promo']);
        });
    }
};