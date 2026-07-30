<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // 3 kode generik yang berlaku untuk SEMUA kategori layanan
            // (barang, bangunan, kendaraan, pindahan). Label yang ditampilkan
            // ke user beda-beda tergantung service_type - lihat FASE_LABELS
            // di Mitra\OrderController - supaya tidak perlu banyak kolom enum
            // berbeda per kategori.
            //
            // menunggu -> berjalan -> akhir
            //
            // Kolom ini terpisah dari `status` yang sudah ada (baru/diproses/
            // selesai/dibatalkan). `status` tetap jadi status administratif
            // utama (soal pembayaran & keputusan admin), sedangkan `fase`
            // menceritakan sedang di titik operasional mana SELAGI status
            // masih 'diproses' - jadi tidak menggantikan atau mengubah alur
            // status yang sudah ada, termasuk logic catatPendapatanPlatform()
            // di Admin\OrderController yang tetap jalan seperti semula.
            $table->enum('fase', ['menunggu', 'berjalan', 'akhir'])
                ->default('menunggu')
                ->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('fase');
        });
    }
};