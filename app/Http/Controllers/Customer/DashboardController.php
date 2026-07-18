<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // TODO: ambil pesanan aktif milik user login dari OrderRepository
        $activeOrder = null;

        return Inertia::render('Customer/Dashboard', compact('activeOrder'));
    }
}
