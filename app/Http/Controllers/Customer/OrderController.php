<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    protected function statusesForTab(string $tab): array
    {
        return match ($tab) {
            'selesai' => ['selesai'],
            'dibatalkan' => ['dibatalkan'],
            default => ['baru', 'diproses'],
        };
    }

    public function index(Request $request): Response
    {
        $tab = $request->string('tab')->toString() ?: 'berjalan';

        $orders = $request->user()
            ->ordersAsCustomer()
            ->with('partner:id,name')
            ->whereIn('status', $this->statusesForTab($tab))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'tab' => $tab,
            ],
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        $order->load('partner:id,name,phone');

        return Inertia::render('Customer/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function success(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        return Inertia::render('Customer/Orders/Success', [
            'orderId' => $order->id,
        ]);
    }

    /**
     * Halaman instruksi / pemrosesan pembayaran oleh customer
     */
    public function pembayaran(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        return Inertia::render('Customer/Orders/Pembayaran', [
            'order' => $order->only([
                'id', 
                'order_code', 
                'item_name', 
                'service_type',
                'payment_method', 
                'total_price', 
                'status',
                'created_at',
            ]),
        ]);
    }

    public function buktiPembayaran(Request $request, Order $order): Response
    {
        abort_unless($order->customer_id === $request->user()->id, 403);

        return Inertia::render('Customer/Orders/BuktiPembayaran', [
            'order' => $order->only([
                'id', 
                'order_code', 
                'item_name', 
                'service_type',
                'payment_method', 
                'total_price', 
                'created_at',
            ]),
        ]);
    }
    public function uploadBukti(Request $request, Order $order)
    {
        // 1. Validasi file gambar
        $request->validate([
            'payment_receipt' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // 2. Simpan file gambar ke storage public
        if ($request->hasFile('payment_receipt')) {
            $path = $request->file('payment_receipt')->store('payment_proofs', 'public');

            // 3. Update status pesanan & simpan path foto bukti ke database
            $order->update([
                'payment_receipt' => $path,
                'status'          => 'diproses', // Sesuaikan dengan enum status pesananmu
            ]);
        }

        // 4. Kembali ke halaman detail pesanan dengan pesan sukses
        return redirect()->route('customer.orders.show', $order->id)
            ->with('success', 'Bukti pembayaran berhasil diunggah! Menunggu verifikasi.');
    }
}