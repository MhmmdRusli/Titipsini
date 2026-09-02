<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PengembalianDanaController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'semua');
        $search = trim((string) $request->query('search', ''));

        $query = Order::query()
            ->with(['customer:id,name,email', 'partner:id,name,email'])
            ->where(function ($q) {
                $q->whereNotNull('bukti_denda')
                  ->orWhereNotNull('denda_payment_receipt');
            })
            ->where(function ($q) {
                $q->where('status', '!=', 'dibatalkan')
                  ->orWhereNotNull('cancel_reason');
            });

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('order_code', 'like', "%{$search}%")
                  ->orWhereHas('customer', fn ($customerQuery) => $customerQuery->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('partner', fn ($partnerQuery) => $partnerQuery->where('name', 'like', "%{$search}%"));
            });
        }

        if ($status !== 'semua') {
            if ($status === 'menunggu') {
                $query->where(function ($q) {
                    $q->whereNull('denda_paid_at')
                      ->where(function ($sub) {
                          $sub->whereNotNull('bukti_denda')->orWhereNotNull('denda_payment_receipt');
                      });
                });
            } elseif ($status === 'terverifikasi') {
                $query->whereNotNull('denda_paid_at');
            }
        }

        $orders = $query->latest()->paginate(10)->through(function (Order $order) {
            return [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'status' => $order->status,
                'customer' => $order->customer,
                'partner' => $order->partner,
                'denda' => (float) $order->hitungDenda(),
                'denda_amount' => (float) ($order->denda_amount ?? $order->hitungDenda()),
                'denda_paid_at' => $order->denda_paid_at?->format('d M Y H:i'),
                'bukti_denda' => $order->bukti_denda
                    ? Storage::disk('public')->url($order->bukti_denda)
                    : ($order->denda_payment_receipt
                        ? Storage::disk('public')->url($order->denda_payment_receipt)
                        : null),
                'tanggal_selesai_aktual' => $order->tanggal_selesai_aktual?->format('d M Y H:i'),
                'created_at' => $order->created_at?->format('d M Y H:i'),
                'payment_method' => $order->payment_method,
                'service_type' => $order->service_type,
                'city' => $order->city,
            ];
        })->withQueryString();

        return Inertia::render('SuperAdmin/PengembalianDana/Index', [
            'refunds' => $orders,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'summary' => [
                'menunggu' => Order::query()->whereNull('denda_paid_at')->where(function ($q) {
                    $q->whereNotNull('bukti_denda')->orWhereNotNull('denda_payment_receipt');
                })->count(),
                'terverifikasi' => Order::query()->whereNotNull('denda_paid_at')->count(),
                'total' => Order::query()->where(function ($q) {
                    $q->whereNotNull('bukti_denda')->orWhereNotNull('denda_payment_receipt');
                })->count(),
            ],
        ]);
    }
}
