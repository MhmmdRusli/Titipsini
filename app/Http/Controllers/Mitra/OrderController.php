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
                'order_number' => $order->order_code,
                'customer_name' => $order->customer->name ?? '-',
                'address' => $order->pickup_address ?? $order->city,
                'service_type' => $order->service_type,
                'duration' => $this->hitungDurasi($order),
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

        // Order lama (sebelum kolom subtotal/discount/pickup_fee diisi saat create)
        // kemungkinan subtotal-nya masih 0 (bukan null, karena default kolomnya 0),
        // jadi fallback berdasarkan nilai > 0, bukan pakai `??` yang tidak akan pernah kena.
        $subtotal = $order->subtotal > 0 ? $order->subtotal : $order->total_price;
        $discount = $order->discount ?? 0;
        $pickupFee = $order->pickup_fee ?? 0;

        return Inertia::render('Mitra/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_code,
                'status' => $order->status,
                'cancel_reason' => $order->cancel_reason,
                'service_type' => $order->service_type,
                'customer' => [
                    'name' => $order->customer->name ?? '-',
                    'phone' => $order->customer->phone ?? '-',
                ],
                'pickup_address' => $order->pickup_address,
                'dropoff_address' => $order->dropoff_address,
                'item_description' => $order->item_name,
                'duration' => $this->hitungDurasi($order),
                // Dikirim sebagai label string, bukan boolean mentah — supaya tidak
                // "hilang" saat dirender di React (JSX tidak menampilkan boolean false).
                'pickup_status' => $order->is_pickup ? 'Dijemput oleh mitra' : 'Diantar sendiri oleh customer',
                'subtotal' => (float) $subtotal,
                'discount' => (float) $discount,
                'pickup_fee' => (float) $pickupFee,
                'total' => (float) $order->total_price,
                'created_at' => optional($order->created_at)->format('d M Y, H:i'),
            ],
        ]);
    }

    /**
     * Hitung durasi penitipan dari start_date - end_date (dalam hari).
     */
    private function hitungDurasi(Order $order): ?string
    {
        if (! $order->start_date || ! $order->end_date) {
            return null;
        }

        $mulai = \Illuminate\Support\Carbon::parse($order->start_date);
        $selesai = \Illuminate\Support\Carbon::parse($order->end_date);
        $hari = $mulai->diffInDays($selesai) + 1;

        return $hari.' hari';
    }
}