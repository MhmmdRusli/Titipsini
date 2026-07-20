<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $partner = Auth::user();

        $tab = $request->query('tab', 'baru'); // baru | selesai | dibatalkan
        $kategori = $request->query('kategori'); // barang | kendaraan | bangunan | null

        $statusMap = [
            'baru' => 'diproses',
            'selesai' => 'selesai',
            'dibatalkan' => 'dibatalkan',
        ];

        $query = Order::with('customer')
            ->where('partner_id', $partner->id)
            ->where('status', $statusMap[$tab] ?? $statusMap['baru']);

        if ($kategori) {
            $query->where('service_type', $kategori);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number ?? ('TS-' . str_pad($order->id, 5, '0', STR_PAD_LEFT)),
                'customer_name' => $order->customer->name ?? '-',
                'address' => $order->pickup_address,
                'service_type' => $order->service_type,
                'duration' => $order->duration,
                'status' => $order->status,
            ];
        });

        $counts = [
            'baru' => Order::where('partner_id', $partner->id)->where('status', 'diproses')->count(),
            'selesai' => Order::where('partner_id', $partner->id)->where('status', 'selesai')->count(),
            'dibatalkan' => Order::where('partner_id', $partner->id)->where('status', 'dibatalkan')->count(),
        ];

        return Inertia::render('Mitra/Orders/Index', [
            'orders' => $orders,
            'counts' => $counts,
            'filters' => [
                'tab' => $tab,
                'kategori' => $kategori,
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        abort_unless($order->partner_id === Auth::id(), 403);

        $order->load('customer');

        return Inertia::render('Mitra/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number ?? ('TS-' . str_pad($order->id, 5, '0', STR_PAD_LEFT)),
                'status' => $order->status,
                'cancel_reason' => $order->cancel_reason,
                'service_type' => $order->service_type,
                'customer' => [
                    'name' => $order->customer->name ?? '-',
                    'phone' => $order->customer->phone ?? '-',
                ],
                'pickup_address' => $order->pickup_address,
                'dropoff_address' => $order->dropoff_address,
                'item_description' => $order->item_description,
                'duration' => $order->duration,
                'pickup_status' => $order->pickup_status,
                'subtotal' => (float) $order->subtotal,
                'discount' => (float) $order->discount,
                'pickup_fee' => (float) $order->pickup_fee,
                'total' => (float) $order->total,
                'created_at' => optional($order->created_at)->format('d M Y, H:i'),
            ],
        ]);
    }
}