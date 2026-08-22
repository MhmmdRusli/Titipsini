<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Tanggal keluar baru yang diajukan customer saat perpanjang.
            // end_date ASLI baru berubah setelah pembayaran perpanjangan lunas
            // (saldo langsung, atau transfer setelah diverifikasi mitra).
            $table->date('extend_end_date')->nullable()->after('end_date');

            // Biaya tambahan hasil hitungan (harga/hari lama x jumlah hari tambahan).
            $table->decimal('extend_price', 12, 2)->nullable()->after('extend_end_date');

            $table->timestamp('extend_requested_at')->nullable()->after('extend_price');
            $table->timestamp('extend_paid_at')->nullable()->after('extend_requested_at');
            $table->string('extend_payment_method')->nullable()->after('extend_paid_at');
            $table->string('extend_payment_receipt')->nullable()->after('extend_payment_method');

            // Status alur perpanjangan, terpisah dari status order utama:
            // null                  -> belum pernah mengajukan perpanjangan
            // menunggu_pembayaran   -> sudah isi form, belum bayar
            // menunggu_verifikasi   -> sudah upload bukti transfer, menunggu mitra
            // terverifikasi         -> lunas (saldo langsung, atau transfer sudah diverifikasi)
            $table->string('status_perpanjangan')->nullable()->after('extend_payment_receipt');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'extend_end_date',
                'extend_price',
                'extend_requested_at',
                'extend_paid_at',
                'extend_payment_method',
                'extend_payment_receipt',
                'status_perpanjangan',
            ]);
        });
    }
};