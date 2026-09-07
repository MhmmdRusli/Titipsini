<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanKomisiController extends Controller
{
    public function index(): Response
    {
        $commissionRate = 10;

        return Inertia::render('SuperAdmin/Pengaturan/Komisi', [
            'commission_rate' => $commissionRate,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'commission_rate' => 'required|numeric|min:0|max:100',
        ]);

        return back()->with('success', 'Pengaturan komisi platform berhasil disimpan!');
    }
}
