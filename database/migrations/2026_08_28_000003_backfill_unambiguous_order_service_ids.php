<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Pesanan lama belum menyimpan jasa yang dipakai. Hubungkan hanya
        // bila mitra tersebut memiliki tepat satu jasa pada kategorinya;
        // pesanan yang ambigu sengaja dibiarkan kosong agar ulasan tidak
        // salah ditampilkan pada jasa lain.
        DB::table('services')
            ->select('user_id', 'kategori')
            ->selectRaw('MIN(id) as service_id')
            ->groupBy('user_id', 'kategori')
            ->havingRaw('COUNT(*) = 1')
            ->get()
            ->each(function ($service) {
                DB::table('orders')
                    ->whereNull('service_id')
                    ->where('partner_id', $service->user_id)
                    ->where('service_type', $service->kategori)
                    ->update(['service_id' => $service->service_id]);
            });
    }

    public function down(): void
    {
        // Tidak dikembalikan karena service_id juga dapat berasal dari
        // pesanan baru yang dibuat setelah migrasi dijalankan.
    }
};