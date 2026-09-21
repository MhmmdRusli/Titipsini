<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\PaymentSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanKomisiController extends Controller
{
    public function index(): Response
    {
        // Baca komisi yang tersimpan di database (bukan hardcode 10)
        $commissionRate = (float) PaymentSetting::current()->komisi_persen;

        return Inertia::render('SuperAdmin/Pengaturan/Komisi', [
            'commission_rate' => $commissionRate,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'commission_rate' => 'required|numeric|min:0|max:100',
        ]);

        // SIMPAN nilai komisi ke payment_settings (ini yang sebelumnya hilang)
        PaymentSetting::current()->update([
            'komisi_persen' => $validated['commission_rate'],
        ]);

        return back()->with('success', 'Pengaturan komisi platform berhasil disimpan!');
    }
}
