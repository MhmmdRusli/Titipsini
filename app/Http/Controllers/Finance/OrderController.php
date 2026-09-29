<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $orders = Order::with(['customer:id,name,phone', 'partner:id,name,phone'])
            ->where('status', 'menunggu_verifikasi_finance')
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('order_code', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn ($cq) => $cq->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
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
            'filters' => ['search' => $search],
        ]);
    }

    public function verifyPayment(Order $order): RedirectResponse
    {
        abort_unless($order->status === 'menunggu_verifikasi_finance', 400, 'Order ini tidak dalam status menunggu verifikasi finance.');

        $order->update([
            'status' => 'pembayaran_diterima',
            'payment_verified_at' => now(),
            'verified_by' => Auth::id(),
        ]);

        if ($order->customer_id) {
            \App\Models\Notifikasi::create([
                'user_id' => $order->customer_id,
                'order_id' => $order->id,
                'type' => 'pembayaran_diterima',
                'judul' => 'Pembayaran Diverifikasi',
                'pesan' => 'Pembayaran untuk pesanan '.$order->order_code.' telah diverifikasi oleh Finance.',
            ]);
        }

        if ($order->partner_id) {
            \App\Models\Notifikasi::create([
                'user_id' => $order->partner_id,
                'order_id' => $order->id,
                'type' => 'pembayaran_diterima',
                'judul' => 'Pesanan Baru Diterima',
                'pesan' => 'Pesanan '.$order->order_code.' telah diverifikasi pembayarannya dan siap diproses.',
            ]);
        }

        return back()->with('success', 'Pembayaran untuk pesanan '.$order->order_code.' berhasil diverifikasi.');
    }

    public function rejectPayment(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:500'],
        ]);

        abort_unless($order->status === 'menunggu_verifikasi_finance', 400, 'Order ini tidak dalam status menunggu verifikasi finance.');

        $order->update([
            'status' => 'dibatalkan',
            'cancel_reason' => $validated['rejection_reason'],
        ]);

        if ($order->customer_id) {
            \App\Models\Notifikasi::create([
                'user_id' => $order->customer_id,
                'order_id' => $order->id,
                'type' => 'penitipan_dibatalkan',
                'judul' => 'Pembayaran Ditolak',
                'pesan' => 'Pembayaran untuk pesanan '.$order->order_code.' ditolak oleh Finance. Alasan: '.$validated['rejection_reason'],
            ]);
        }

        return back()->with('success', 'Pembayaran untuk pesanan '.$order->order_code.' berhasil ditolak.');
    }
}
