<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class JamOperasionalController extends Controller
{
    public function edit(): Response
    {
        $user = Auth::user();

        return Inertia::render('Mitra/JamOperasional', [
            'jamOperasional' => [
                'toko_buka' => (bool) $user->toko_buka,
                'jam_buka' => $user->jam_buka,
                'jam_tutup' => $user->jam_tutup,
                'layanan_kategori' => $user->layanan_kategori ?? [],
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'toko_buka' => ['required', 'boolean'],
            'jam_buka' => ['required', 'date_format:H:i'],
            'jam_tutup' => ['required', 'date_format:H:i', 'after:jam_buka'],
            'layanan_kategori' => ['required', 'array', 'min:1'],
            'layanan_kategori.*' => ['string', 'in:barang,bangunan,kendaraan,pindahan'],
        ]);

        $user->update($validated);

        return back()->with('success', 'Jam operasional berhasil diperbarui.');
    }
}