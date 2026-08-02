<?php

namespace App\Services;

use App\Models\Notifikasi;
use App\Models\Order;
use App\Models\PaymentSetting;
use App\Models\PendapatanPlatform;

/**
 * Sumber tunggal untuk label fase operasional (menunggu/berjalan/akhir) per
 * kategori layanan, dan logic "selesaikan pesanan" yang dipakai bersama oleh
 * Admin\OrderController (klik manual) dan Mitra\OrderController (otomatis saat
 * fase mencapai akhir & pembayaran sudah terverifikasi).
 */
class OrderFaseService
{
    public const FASE_LABELS = [
        'barang' => [
            'menunggu' => 'Menunggu Pickup',
            'berjalan' => 'Dititipkan',
            'akhir' => 'Diambil Kembali',
        ],
        'bangunan' => [
            'menunggu' => 'Menunggu Konfirmasi',
            'berjalan' => 'Sedang Disewa',
            'akhir' => 'Sewa Berakhir',
        ],
        'kendaraan' => [
            'menunggu' => 'Menunggu Serah Terima',
            'berjalan' => 'Sedang Dipakai',
            'akhir' => 'Dikembalikan',
        ],
        'pindahan' => [
            'menunggu' => 'Dijadwalkan',
            'berjalan' => 'Proses Pindahan',
            'akhir' => 'Selesai Pindahan',
        ],
    ];

    public const FASE_ACTION_LABELS = [
        'barang' => [
            'menunggu' => 'Tandai Sudah Dititip',
            'berjalan' => 'Tandai Sudah Diambil',
        ],
        'bangunan' => [
            'menunggu' => 'Mulai Masa Sewa',
            'berjalan' => 'Tandai Sewa Berakhir',
        ],
        'kendaraan' => [
            'menunggu' => 'Tandai Sudah Diserahkan',
            'berjalan' => 'Tandai Sudah Dikembalikan',
        ],
        'pindahan' => [
            'menunggu' => 'Mulai Proses Pindahan',
            'berjalan' => 'Tandai Pindahan Selesai',
        ],
    ];

    public const NEXT_FASE = [
        'menunggu' => 'berjalan',
        'berjalan' => 'akhir',
    ];

    public static function label(?string $serviceType, ?string $fase): ?string
    {
        if (! $serviceType || ! $fase) {
            return null;
        }

        return self::FASE_LABELS[$serviceType][$fase] ?? null;
    }

    public static function nextActionLabel(?string $serviceType, ?string $fase): ?string
    {
        if (! $serviceType || ! $fase) {
            return null;
        }

        return self::FASE_ACTION_LABELS[$serviceType][$fase] ?? null;
    }

    public static function nextFase(string $fase): ?string
    {
        return self::NEXT_FASE[$fase] ?? null;
    }

    /**
     * Selesaikan pesanan: set status 'selesai', catat pendapatan platform
     * (kalau belum pernah), lalu kirim notifikasi ke customer.
     * Aman dipanggil berkali-kali — kalau status sudah 'selesai', tidak
     * melakukan apa-apa (mencegah notifikasi/komisi dobel).
     */
    public static function completeOrder(Order $order): void
    {
        if ($order->status === 'selesai') {
            return;
        }

        $order->update(['status' => 'selesai']);

        $order->loadMissing('partner');
        self::catatPendapatanPlatform($order);

        if ($order->customer_id) {
            Notifikasi::create([
                'user_id' => $order->customer_id,
                'order_id' => $order->id,
                'type' => 'penitipan_selesai',
                'judul' => 'Penitipan Selesai',
                'pesan' => 'Pesanan '.$order->order_code.' telah selesai. Terima kasih telah menggunakan Titipsini.',
            ]);
        }
    }

    protected static function catatPendapatanPlatform(Order $order): void
    {
        if (! $order->partner_id) {
            return;
        }

        $sudahDicatat = PendapatanPlatform::where('order_id', $order->id)->exists();

        if ($sudahDicatat) {
            return;
        }

        $komisiPersen = (float) (PaymentSetting::current()->komisi_persen ?? 10);
        $totalPesanan = (float) $order->total_price;
        $komisi = round($totalPesanan * $komisiPersen / 100);

        PendapatanPlatform::create([
            'order_id' => $order->id,
            'partner_id' => $order->partner_id,
            'total_transaksi' => $totalPesanan,
            'komisi_persen' => $komisiPersen,
            'jumlah_komisi' => $komisi,
        ]);
    }
}