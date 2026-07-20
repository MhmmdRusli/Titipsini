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

        return Inertia::render('Mitra/Dashboard', [
            'partner' => [
                'name' => $partner->name,
                'foto' => $partner->foto ? Storage::url($partner->foto) : null,
                'is_verified' => $partner->verification_status === 'verified',
            ],
            'saldo' => $partner->saldo ?? 0,
            'toko' => [
                'buka' => (bool) $partner->toko_buka,
                'jam_buka' => $partner->jam_buka ? substr($partner->jam_buka, 0, 5) : null,
                'jam_tutup' => $partner->jam_tutup ? substr($partner->jam_tutup, 0, 5) : null,
            ],
            'layanan' => $partner->layanan_kategori ?? [],
            'pesanan' => [
                'barang' => $pesananBarang,
                'kendaraan' => $pesananKendaraan,
            ],
        ]);
    }
}