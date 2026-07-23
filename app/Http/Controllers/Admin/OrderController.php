<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $serviceType = $request->string('service_type')->toString();
        $status = $request->string('status')->toString();
        $city = $request->string('city')->toString();
        $isPickup = $request->boolean('is_pickup');

        $orders = Order::query()
            ->with(['customer:id,name', 'partner:id,name'])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('order_code', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($serviceType, fn ($q) => $q->where('service_type', $serviceType))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($city, fn ($q) => $q->where('city', $city))
            ->when($request->has('is_pickup'), fn ($q) => $q->where('is_pickup', $isPickup))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $cities = Order::query()
            ->whereNotNull('city')
            ->distinct()
            ->orderBy('city')
            ->pluck('city');

        return Inertia::render('Admin/Pesanan/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'service_type' => $serviceType,
                'status' => $status,
                'city' => $city,
            ],
            'cities' => $cities,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:baru,diproses,selesai,dibatalkan'],
            'cancel_reason' => ['nullable', 'string', 'required_if:status,dibatalkan'],
        ]);

        $order->update([
            'status' => $validated['status'],
            'cancel_reason' => $validated['status'] === 'dibatalkan'
                ? ($validated['cancel_reason'] ?? null)
                : null,
        ]);

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->back()->with('success', 'Pesanan berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:orders,id'],
        ]);

        Order::whereIn('id', $validated['ids'])->delete();

        return redirect()->back()->with('success', 'Pesanan terpilih berhasil dihapus.');
    }
}