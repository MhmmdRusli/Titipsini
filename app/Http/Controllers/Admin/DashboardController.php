<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // TODO: replace with real queries (OrderRepository, PartnerRepository, dsb)
        $stats = [
            'totalOrders' => 0,
            'activeOrders' => 0,
            'verifiedPartners' => 0,
            'monthlyRevenue' => 'Rp 0',
        ];

        return Inertia::render('Admin/Dashboard', compact('stats'));
    }
}
