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
            ->route('partner.keamanan.edit')
            ->with('success', 'Kata sandi berhasil diperbarui.');
    }
}