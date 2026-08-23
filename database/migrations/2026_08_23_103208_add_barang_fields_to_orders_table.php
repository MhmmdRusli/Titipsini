<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedInteger('jumlah_barang')->default(1)->after('item_description');
            $table->string('ukuran_barang')->nullable()->after('jumlah_barang');

            // Snapshot harga per hari pada saat order dibuat - supaya kalau
            // tarif ukuran_barang diubah admin di kemudian hari, invoice
            // pesanan LAMA tidak ikut berubah retroaktif.
            $table->decimal('harga_per_hari', 12, 2)->nullable()->after('ukuran_barang');

            $table->string('jam_pickup', 5)->nullable()->after('pickup_status');
            $table->string('foto_barang_url')->nullable()->after('jam_pickup');

            // Biaya layanan (10% dari total harga) - disimpan terpisah dari
            // total_price supaya breakdown-nya bisa ditampilkan lagi di
            // invoice tanpa perlu dihitung ulang.
            $table->decimal('biaya_layanan', 12, 2)->default(0)->after('pickup_fee');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'jumlah_barang',
                'ukuran_barang',
                'harga_per_hari',
                'jam_pickup',
                'foto_barang_url',
                'biaya_layanan',
            ]);
        });
    }
};