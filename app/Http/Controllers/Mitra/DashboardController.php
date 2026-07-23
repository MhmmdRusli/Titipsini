<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $partner = Auth::user();

        // 1. Ambil pesanan aktif milik mitra ini
        // Mengakomodasi variasi status pesanan di database
        $pesananAktifQuery = Order::where('partner_id', $partner->id)
            ->whereNotIn('status', ['selesai', 'completed', 'dibatalkan', 'cancelled']);

        // Menyesuaikan pencarian service_type agar toleran terhadap variasi penulisan
        $pesananBarang = (clone $pesananAktifQuery)
            ->where(function($q) {
                $q->where('service_type', 'barang')
                  ->orWhere('service_type', 'titip_barang');
            })->count();

        $pesananKendaraan = (clone $pesananAktifQuery)
            ->where(function($q) {
                $q->where('service_type', 'kendaraan')
                  ->orWhere('service_type', 'titip_kendaraan');
            })->count();

        // 2. Hitung Saldo Real-time jika kolom saldo di tabel users/partners masih 0
        // (Mengakumulasi total harga dari pesanan yang sudah selesai)
        $totalPendapatan = Order::where('partner_id', $partner->id)
            ->whereIn('status', ['selesai', 'completed', 'success'])
            ->sum('total_price'); // Sesuaikan nama kolom harga di tabel orders kamu (misal: total_harga / gross_amount)

        $saldoTampil = $partner->saldo > 0 ? $partner->saldo : $totalPendapatan;

        // 3. Ambil Kategori Layanan Aktif
        $layananKategori = $partner->services()
            ->where('is_active', true)
            ->distinct()
            ->pluck('kategori')
            ->map(fn($item) => strtolower($item)) // Memastikan lowercase
            ->values()
            ->all();

        return Inertia::render('Mitra/Dashboard', [
            'partner' => [
                'name' => $partner->name,
                'foto' => $partner->foto ? Storage::url($partner->foto) : null,
                'is_verified' => in_array($partner->verification_status, ['terverifikasi', 'verified']),
            ],
            'saldo' => $saldoTampil,
            'toko' => [
                'buka' => (bool) $partner->toko_buka,
                'jam_buka' => $partner->jam_buka ? substr($partner->jam_buka, 0, 5) : null,
                'jam_tutup' => $partner->jam_tutup ? substr($partner->jam_tutup, 0, 5) : null,
            ],
            'layanan' => $layananKategori,
            'pesanan' => [
                'barang' => $pesananBarang,
                'kendaraan' => $pesananKendaraan,
            ],
        ]);
    }
}