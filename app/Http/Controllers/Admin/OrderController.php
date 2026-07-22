<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $serviceType = $request->string('service_type')->toString();
        $status = $request->string('status')->toString();
        $city = $request->string('city')->toString();

        $orders = Order::with(['customer:id,name,phone', 'partner:id,name,phone'])
            ->when($search, function ($query, $search) {
                $query->where('order_code', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($serviceType, fn ($query, $value) => $query->where('service_type', $value))
            ->when($status, fn ($query, $value) => $query->where('status', $value))
            ->when($city, fn ($query, $value) => $query->where('city', $value))
            ->latest()
            ->paginate(10)
            ->through(function ($order) {
                return [
                    'id'              => $order->id,
                    'order_code'      => $order->order_code,
                    'service_type'    => $order->service_type,
                    'is_pickup'       => $order->is_pickup,
                    'city'            => $order->city,
                    'status'          => $order->status,
                    'cancel_reason'   => $order->cancel_reason,
                    'total_price'     => $order->total_price,
                    'payment_method'  => $order->payment_method,
                    'payment_receipt' => $order->payment_receipt ? Storage::disk('public')->url($order->payment_receipt) : null,
                    'created_at'      => $order->created_at ? $order->created_at->format('d M Y H:i') : null,
                    'customer'        => $order->customer,
                    'partner'         => $order->partner,
                ];
            })
            ->withQueryString();

        return Inertia::render('Admin/Pesanan/Index', [
            'orders'  => $orders,
            'filters' => [
                'search'       => $search,
                'service_type' => $serviceType,
                'status'       => $status,
                'city'         => $city,
            ],
            'cities'  => Order::query()->whereNotNull('city')->distinct()->orderBy('city')->pluck('city'),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status'        => ['required', Rule::in(['baru', 'diproses', 'selesai', 'dibatalkan'])],
            'cancel_reason' => ['required_if:status,dibatalkan', 'nullable', 'string', 'max:255'],
        ]);

        $order->update([
            'status'        => $validated['status'],
            'cancel_reason' => $validated['status'] === 'dibatalkan' ? $validated['cancel_reason'] : null,
        ]);

        return back()->with('success', 'Status pesanan berhasil diperbarui.');
    }

    public function destroy(Order $order)
    {
        // Hapus file bukti pembayaran fisik jika ada
        if ($order->payment_receipt) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $order->payment_receipt));
        }

        $order->delete();

        return back()->with('success', 'Pesanan berhasil dihapus.');
    }
}