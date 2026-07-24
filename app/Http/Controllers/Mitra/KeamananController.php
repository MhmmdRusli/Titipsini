<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class KeamananController extends Controller
{
    public function edit()
    {
        return Inertia::render('Mitra/Keamanan');
    }

    public function update(Request $request)
    {
        $partner = Auth::user();

        $validated = $request->validate([
            'password_lama' => ['required', 'string'],
            'password_baru' => ['required', 'string', 'min:8', 'confirmed'],
        ], [], [
            'password_lama' => 'kata sandi lama',
            'password_baru' => 'kata sandi baru',
        ]);

        if (! Hash::check($validated['password_lama'], $partner->password)) {
            return back()->withErrors([
                'password_lama' => 'Kata sandi lama tidak sesuai.',
            ]);
        }

        $partner->update([
            'password' => Hash::make($validated['password_baru']),
        ]);

        return redirect()
            ->route('mitra.keamanan.edit')
            ->with('success', 'Kata sandi berhasil diperbarui.');
    }

    /**
     * Ubah PIN untuk mitra yang MASIH INGAT PIN lamanya.
     * PUT /mitra/keamanan/pin
     */
    public function updatePin(Request $request)
    {
        $partner = Auth::user();

        $validated = $request->validate([
            'pin_lama' => ['required', 'digits:6'],
            'pin_baru' => ['required', 'digits:6', 'confirmed'],
        ], [], [
            'pin_lama' => 'PIN lama',
            'pin_baru' => 'PIN baru',
        ]);

        if (! $partner->pin || ! Hash::check($validated['pin_lama'], $partner->pin)) {
            return back()->withErrors([
                'pin_lama' => 'PIN lama tidak sesuai.',
            ])->withInput();
        }

        $partner->update([
            'pin' => Hash::make($validated['pin_baru']),
        ]);

        return redirect()
            ->route('mitra.keamanan.edit')
            ->with('success', 'PIN berhasil diperbarui.');
    }

    /**
     * Lupa PIN — verifikasi identitas pakai PASSWORD AKUN (bukan PIN lama),
     * lalu boleh set PIN baru.
     * PUT /mitra/keamanan/pin/lupa
     */
    public function lupaPin(Request $request)
    {
        $partner = Auth::user();

        $validated = $request->validate([
            'password' => ['required', 'string'],
            'pin_baru' => ['required', 'digits:6', 'confirmed'],
        ], [], [
            'password' => 'kata sandi',
            'pin_baru' => 'PIN baru',
        ]);

        if (! Hash::check($validated['password'], $partner->password)) {
            return back()->withErrors([
                'password' => 'Kata sandi tidak sesuai.',
            ])->withInput();
        }

        $partner->update([
            'pin' => Hash::make($validated['pin_baru']),
        ]);

        return redirect()
            ->route('mitra.keamanan.edit')
            ->with('success', 'PIN berhasil dibuat ulang.');
    }
}