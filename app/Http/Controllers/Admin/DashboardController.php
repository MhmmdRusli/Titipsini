<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $dashboardService) {}

    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'city' => ['nullable', 'string'],
            'period' => ['nullable', 'in:all,month,quarter,year'],
        ]);

        // $data otomatis memuat 'totalKomisiAdmin' dan 'persenKomisi' dari Service
        $data = $this->dashboardService->getDashboardData($filters);

        return Inertia::render('Admin/Dashboard', [
            ...$data,
            'filters' => [
                'city' => $filters['city'] ?? '',
                'period' => $filters['period'] ?? 'all',
            ],
        ]);
    }
}