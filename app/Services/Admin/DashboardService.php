<?php

namespace App\Services\Admin;

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

        return [
            'summary' => [
                'totalOrders' => $this->orders->countByStatus($filters),
                'totalCustomers' => $this->users->countByRole('customer', $city),
                'totalVendors' => $this->users->countVerifiedPartners($city),
                'activeServices' => $this->orders->countByStatus($filters, ['baru', 'diproses']),
            ],
            'monthlyTrend' => $this->orders->monthlyTrend($filters),
            'serviceDistribution' => $this->orders->serviceTypeDistribution($filters),
            'vendorServiceCounts' => $this->orders->vendorServiceCounts($filters),
            'cities' => $this->orders->distinctCities(),
        ];
    }
}