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
        $allowedStatuses = ['semua', 'baru', 'diproses', 'selesai', 'dibatalkan'];

        if (! in_array($status, $allowedStatuses, true)) {
            $status = 'semua';
        }

        $transactions = Order::query()
            ->with(['customer:id,name', 'partner:id,name'])
            ->when($status !== 'semua', fn ($query) => $query->where('status', $status))
            ->latest()
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

        return Inertia::render('Finance/Dashboard', [
            'stats' => [
                'totalIncome' => (float) Order::where('status', 'selesai')->sum('total_price'),
                'todayIncome' => (float) Order::where('status', 'selesai')
                    ->whereDate('updated_at', today())
                    ->sum('total_price'),
                'pendingTransactions' => Order::whereIn('status', ['baru', 'diproses'])->count(),
            ],
            'transactions' => $transactions,
            'filters' => ['status' => $status],
        ]);
    }
}
