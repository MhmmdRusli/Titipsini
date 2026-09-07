<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\DendaSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanDendaController extends Controller
{
    public function index(): Response
    {
        $kategori = ['barang', 'bangunan', 'kendaraan', 'pindahan'];

        $settings = collect($kategori)->map(function ($tipe) {
            $setting = DendaSetting::current($tipe);

            return [
                'service_type' => $tipe,
                'persen_per_hari' => (float) $setting->persen_per_hari,
                'max_persen' => (float) $setting->max_persen,
            ];
        });

        return Inertia::render('SuperAdmin/Pengaturan/Denda', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array', 'size:4'],
            'settings.*.service_type' => ['required', 'string', 'in:barang,bangunan,kendaraan,pindahan'],
            'settings.*.persen_per_hari' => ['required', 'numeric', 'min:0', 'max:100'],
            'settings.*.max_persen' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        foreach ($validated['settings'] as $item) {
            DendaSetting::current($item['service_type'])->update([
                'persen_per_hari' => $item['persen_per_hari'],
                'max_persen' => $item['max_persen'],
            ]);
        }

        return redirect()
            ->route('super-admin.pengaturan.denda')
            ->with('success', 'Pengaturan denda berhasil diperbarui.');
    }
}
