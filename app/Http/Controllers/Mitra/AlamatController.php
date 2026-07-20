<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Kota;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AlamatController extends Controller
{
    public function edit(): Response
    {
        $user = Auth::user();

        return Inertia::render('Mitra/Alamat', [
            'alamat' => [
                'address' => $user->address,
                'city' => $user->city,
                'provinsi' => $user->provinsi,
                'kecamatan' => $user->kecamatan,
                'wilayah' => $user->wilayah,
                'postal_code' => $user->postal_code,
            ],
            'kotaOptions' => Kota::where('is_active', true)->orderBy('nama')->pluck('nama'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'address' => ['required', 'string', 'max:1000'],
            'city' => ['required', 'string', 'max:255'],
            'provinsi' => ['required', 'string', 'max:255'],
            'kecamatan' => ['required', 'string', 'max:255'],
            'wilayah' => ['required', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:10'],
        ]);

        $user->update($validated);

        return back()->with('success', 'Alamat berhasil diperbarui.');
    }
}