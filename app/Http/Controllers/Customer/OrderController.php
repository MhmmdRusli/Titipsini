<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $orders = $request->user()
            ->ordersAsCustomer()
            ->with('partner:id,name')
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    public function show(Request $request, \App\Models\Order $order)
    {
        abort_unless($order->customer_id === $request->user()->id, 403);
    
        $order->load('partner:id,name,phone');
    
        return Inertia::render('Customer/Orders/Show', [
            'order' => $order,
        ]);
    }
}