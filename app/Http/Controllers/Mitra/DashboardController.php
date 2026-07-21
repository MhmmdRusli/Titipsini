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

        $pesananAktifQuery = Order::where('partner_id', $partner->id)
            ->whereNotIn('status', ['selesai', 'dibatalkan']);

        $pesananBarang = (clone $pesananAktifQuery)->where('service_type', 'barang')->count();
        $pesananKendaraan = (clone $pesananAktifQuery)->where('service_type', 'kendaraan')->count();

        // Ambil kategori layanan unik dari layanan aktif yang partner ini
        // sudah tambahkan lewat "Kelola Layanan" (tabel services) - bukan
        // dari kolom users.layanan_kategori yang gak pernah diisi.
        $layananKategori = $partner->services()
            ->where('is_active', true)
            ->distinct()
            ->pluck('kategori')
            ->values()
            ->all();

        return Inertia::render('Mitra/Dashboard', [
            'partner' => [
                'name' => $partner->name,
                'foto' => $partner->foto ? Storage::url($partner->foto) : null,
                // Nilai enum verification_status di project ini pakai Bahasa
                // Indonesia ('terverifikasi'), bukan 'verified'. Sebelumnya
                // salah bandingkan jadi banner verifikasi selalu muncul.
                'is_verified' => $partner->verification_status === 'terverifikasi',
            ],
            'saldo' => $partner->saldo ?? 0,
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