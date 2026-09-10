<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\OrderFaseService;
use Illuminate\Console\Command;

class AutoCompleteExpiredOrders extends Command
{
    protected $signature = 'orders:auto-complete';

    protected $description = 'Otomatis selesaikan pesanan (status dititip) yang sudah melewati batas waktu penitipan tanpa pengajuan pengembalian';

    public function handle(): int
    {
        $hariIni = now()->startOfDay();

        // Hanya order ALUR BARU yang disentuh (whereNull('fase') - order
        // lama peninggalan COD selalu punya fase terisi, tidak pernah
        // berstatus 'dititip', jadi query ini otomatis tidak menyentuh
        // mereka). whereNull('pickup_requested_at') memastikan order yang
        // sudah customer ajukan pengembalian (jadi 'pengambilan_diajukan')
        // tidak ikut - mereka memang sudah bukan status 'dititip' lagi jadi
        // sebenarnya sudah otomatis terfilter oleh where status di bawah,
        // tapi ditulis eksplisit untuk kejelasan niat.
        $orders = Order::where('status', 'dititip')
            ->whereNull('fase')
            ->whereNull('pickup_requested_at')
            ->get();

        $totalSelesai = 0;

        foreach ($orders as $order) {
            $batasWaktu = ($order->extend_end_date ?? $order->end_date)?->copy()->endOfDay();

            if (! $batasWaktu || $hariIni->lte($batasWaktu)) {
                continue;
            }

            if (! $order->tanggal_selesai_aktual) {
                $order->update(['tanggal_selesai_aktual' => now()]);
            }

            OrderFaseService::completeOrder($order);

            $totalSelesai++;
            $this->info("Pesanan {$order->order_code}: otomatis diselesaikan (batas waktu {$batasWaktu->toDateString()}).");
        }

        $this->info("Selesai. Total {$totalSelesai} pesanan otomatis diselesaikan.");

        return self::SUCCESS;
    }
}
