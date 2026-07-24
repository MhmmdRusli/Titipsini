<?php

namespace App\Services\Admin;

use App\Models\Pengaturan;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;

class DashboardService
{
    public function __construct(
        protected OrderRepositoryInterface $orders,
        protected UserRepositoryInterface $users,
    ) {}

    /**
     * @param array{city?: string, period?: string} $filters
     */
    public function getDashboardData(array $filters): array
    {
        $city = $filters['city'] ?? null;

        // 1. Ambil persentase komisi dari database (default 10%)
        $persenKomisi = (float) (Pengaturan::where('key', 'komisi_platform')->value('value') ?? 10);

        // 2. Ambil total pendapatan kotor dari pesanan yang selesai/lunas
        // Pastikan metode getTotalRevenue() ada di OrderRepository, atau sesuaikan nama kodenya
        $totalPendapatanKotor = method_exists($this->orders, 'getTotalRevenue') 
            ? $this->orders->getTotalRevenue($filters) 
            : 0;

        // 3. Hitung komisi platform milik admin
        $totalKomisiAdmin = $totalPendapatanKotor * ($persenKomisi / 100);

        return [
            'summary' => [
                'totalOrders' => $this->orders->countByStatus($filters),
                'totalCustomers' => $this->users->countByRole('customer', $city),
                'totalVendors' => $this->users->countVerifiedPartners($city),
                'activeServices' => $this->orders->countByStatus($filters, ['baru', 'diproses']),
                
                // --- Data Komisi Platform Baru ---
                'totalKomisiAdmin' => $totalKomisiAdmin,
                'persenKomisi' => $persenKomisi,
            ],
            'monthlyTrend' => $this->orders->monthlyTrend($filters),
            'serviceDistribution' => $this->orders->serviceTypeDistribution($filters),
            'vendorServiceCounts' => $this->orders->vendorServiceCounts($filters),
            'cities' => $this->orders->distinctCities(),
        ];
    }
}