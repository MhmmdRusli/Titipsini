<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
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
            ->withQueryString();

        return Inertia::render('Admin/Pesanan/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'service_type' => $serviceType,
                'status' => $status,
                'city' => $city,
            ],
            'cities' => Order::query()->distinct()->orderBy('city')->pluck('city'),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['baru', 'diproses', 'selesai', 'dibatalkan'])],
            'cancel_reason' => ['required_if:status,dibatalkan', 'nullable', 'string', 'max:255'],
        ]);

        $order->update([
            'status' => $validated['status'],
            'cancel_reason' => $validated['status'] === 'dibatalkan' ? $validated['cancel_reason'] : null,
        ]);

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
    }
}