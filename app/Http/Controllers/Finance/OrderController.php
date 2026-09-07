<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::with(['customer:id,name,phone', 'partner:id,name,phone'])
            ->whereNotNull('payment_receipt')
            ->whereNull('payment_verified_at')
            ->latest()
            ->paginate(10)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'service_type' => $order->service_type,
                    'status' => $order->status,
                    'payment_method' => $order->payment_method,
                    'payment_receipt' => $order->payment_receipt ? \Storage::disk('public')->url($order->payment_receipt) : null,
                    'payment_verified_at' => $order->payment_verified_at?->format('d M Y H:i'),
                    'total_price' => $order->total_price,
                    'customer' => $order->customer,
                    'partner' => $order->partner,
                    'created_at' => $order->created_at?->format('d M Y H:i'),
                ];
            });

        return Inertia::render('Finance/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function verifyPayment(Order $order)
    {
        abort_if($order->payment_verified_at, 400, 'Pembayaran untuk pesanan ini sudah diverifikasi sebelumnya.');

        $isTransfer = in_array($order->payment_method, ['transfer', 'qris', 'pending'], true);
        $isCash = $order->payment_method === 'cod';

        abort_unless($isTransfer || $isCash, 400, 'Order ini tidak memiliki bukti pembayaran yang bisa diverifikasi.');
        abort_unless($order->payment_receipt || $isCash, 422, 'Belum ada bukti pembayaran yang diunggah untuk pesanan ini.');

        $order->update([
            'payment_verified_at' => now(),
            'status' => $order->status === 'baru' ? 'diproses' : $order->status,
        ]);

        if ($order->customer_id) {
            \App\Models\Notifikasi::create([
                'user_id' => $order->customer_id,
                'order_id' => $order->id,
                'type' => 'pembayaran_diterima',
                'judul' => 'Pembayaran Diverifikasi',
                'pesan' => 'Pembayaran untuk pesanan '.$order->order_code.' telah diverifikasi.',
            ]);
        }

        if ($order->partner_id) {
            \App\Models\Notifikasi::create([
                'user_id' => $order->partner_id,
                'order_id' => $order->id,
                'type' => 'pembayaran_diterima',
                'judul' => 'Pembayaran Diverifikasi',
                'pesan' => 'Pembayaran untuk pesanan '.$order->order_code.' telah diverifikasi.',
            ]);
        }

        return back()->with('success', 'Pembayaran untuk pesanan '.$order->order_code.' berhasil diverifikasi.');
    }
}
