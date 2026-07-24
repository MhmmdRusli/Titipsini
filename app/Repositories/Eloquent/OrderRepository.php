<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class OrderRepository implements OrderRepositoryInterface
{
    /**
     * Menghitung total pendapatan kotor dari pesanan
     */
    public function getTotalRevenue(array $filters = []): float
    {
        $query = $this->applyFilters(Order::query(), $filters);

        // ⚠️ PENTING: Filter status transaksi yang sah/selesai.
        // Sesuaikan string status di bawah sesuai enum/string di database kamu (misal: 'completed', 'selesai', 'paid', 'success')
        $query->whereIn('status', ['completed', 'selesai', 'success', 'paid']);

        // ⚠️ Sesuaikan nama 'total_price' dengan kolom harga di tabel 'orders' kamu
        return (float) $query->sum('total_price');
    }

    public function countByStatus(array $filters, array $statuses = []): int
    {
        $query = $this->applyFilters(Order::query(), $filters);

        if (! empty($statuses)) {
            $query->whereIn('status', $statuses);
        }

        return $query->count();
    }

    public function monthlyTrend(array $filters, int $months = 6): array
    {
        $start = Carbon::now()->subMonths($months - 1)->startOfMonth();

        $rows = $this->applyFilters(Order::query(), $filters)
            ->where('created_at', '>=', $start)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as ym, COUNT(*) as total')
            ->groupBy('ym')
            ->pluck('total', 'ym');

        $result = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $key = $date->format('Y-m');
            $result[] = [
                'month' => $date->translatedFormat('M Y'),
                'total' => (int) ($rows[$key] ?? 0),
            ];
        }

        return $result;
    }

    public function serviceTypeDistribution(array $filters): array
    {
        $rows = $this->applyFilters(Order::query(), $filters)
            ->selectRaw('service_type, COUNT(*) as total')
            ->groupBy('service_type')
            ->pluck('total', 'service_type');

        $grandTotal = max((int) $rows->sum(), 1);
        $labels = [
            'barang' => 'Barang',
            'kendaraan' => 'Kendaraan',
            'bangunan' => 'Bangunan',
            'pindahan' => 'Pindahan',
        ];

        $result = [];
        foreach ($labels as $key => $label) {
            $total = (int) ($rows[$key] ?? 0);
            $result[] = [
                'service_type' => $label,
                'total' => $total,
                'percentage' => round(($total / $grandTotal) * 100, 1),
            ];
        }

        return $result;
    }

    public function vendorServiceCounts(array $filters): array
    {
        $rows = $this->applyFilters(Order::query(), $filters)
            ->selectRaw('service_type, COUNT(*) as total')
            ->groupBy('service_type')
            ->pluck('total', 'service_type');

        $pickupTotal = $this->applyFilters(Order::query(), $filters)
            ->where('is_pickup', true)
            ->count();

        return [
            'barang' => (int) ($rows['barang'] ?? 0),
            'kendaraan' => (int) ($rows['kendaraan'] ?? 0),
            'bangunan' => (int) ($rows['bangunan'] ?? 0),
            'pickup' => $pickupTotal,
        ];
    }

    public function distinctCities(): array
    {
        return Order::query()
            ->distinct()
            ->orderBy('city')
            ->pluck('city')
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @param array{city?: string, period?: string} $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        if (! empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        match ($filters['period'] ?? 'all') {
            'month' => $query->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year),
            'quarter' => $query->where('created_at', '>=', now()->subMonths(3)),
            'year' => $query->whereYear('created_at', now()->year),
            default => null,
        };

        return $query;
    }
}