<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'semua');
        $city = $request->query('city', '');
        $period = $request->query('period', 'all');

        $allowedStatuses = ['semua', 'baru', 'diproses', 'selesai', 'dibatalkan'];
        if (! in_array($status, $allowedStatuses, true)) {
            $status = 'semua';
        }

        $allowedPeriods = ['all', 'month', 'quarter', 'year'];
        if (! in_array($period, $allowedPeriods, true)) {
            $period = 'all';
        }

        $query = Order::query()
            ->with(['customer:id,name', 'partner:id,name'])
            ->when($status !== 'semua', fn ($q) => $q->where('status', $status))
            ->when($city, fn ($q) => $q->where('city', $city))
            ->when($period === 'month', fn ($q) => $q->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year))
            ->when($period === 'quarter', fn ($q) => $q->where('created_at', '>=', now()->subMonths(3)))
            ->when($period === 'year', fn ($q) => $q->whereYear('created_at', now()->year))
            ->latest();

        $transactions = (clone $query)
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'customer' => $order->customer?->name ?? 'Customer tidak tersedia',
                'partner' => $order->partner?->name ?? 'Belum ditetapkan',
                'service_type' => ucfirst($order->service_type),
                'amount' => (float) $order->total_price,
                'status' => $order->status,
                'created_at' => $order->created_at?->format('d M Y, H:i'),
            ]);

        $baseQuery = Order::query()
            ->when($city, fn ($q) => $q->where('city', $city))
            ->when($period === 'month', fn ($q) => $q->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year))
            ->when($period === 'quarter', fn ($q) => $q->where('created_at', '>=', now()->subMonths(3)))
            ->when($period === 'year', fn ($q) => $q->whereYear('created_at', now()->year));

        $cities = Order::query()
            ->select('city')
            ->distinct()
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->orderBy('city')
            ->pluck('city')
            ->toArray();

        return Inertia::render('Finance/Dashboard', [
            'stats' => [
                'totalIncome' => (float) (clone $baseQuery)->where('status', 'selesai')->sum('total_price'),
                'todayIncome' => (float) (clone $baseQuery)->where('status', 'selesai')->whereDate('updated_at', today())->sum('total_price'),
                'pendingTransactions' => (clone $baseQuery)->whereIn('status', ['baru', 'diproses'])->count(),
            ],
            'transactions' => $transactions,
            'cities' => $cities,
            'filters' => [
                'status' => $status,
                'city' => $city,
                'period' => $period,
            ],
        ]);
    }
}
