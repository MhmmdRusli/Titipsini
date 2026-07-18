<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class PenggunaController extends Controller
{
     

 
public function show(User $pengguna)
{
    $pengguna->load(['ordersAsCustomer' => function ($query) {
        $query->latest()->limit(10);
    }]);
 
    return Inertia::render('Admin/Pengguna/Show', [
        'user' => [
            ...$pengguna->only([
                'id', 'name', 'email', 'phone', 'gender', 'tanggal_lahir',
                'foto', 'address', 'provinsi', 'kecamatan', 'wilayah', 'city',
                'verification_status', 'rejection_reason', 'created_at',
            ]),
            'orders_as_customer' => $pengguna->ordersAsCustomer->map(fn ($order) => $order->only([
                'id', 'order_code', 'service_type', 'status', 'total_price', 'created_at',
            ])),
        ],
    ]);
}
}
