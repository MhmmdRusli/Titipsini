<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanKeamananController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $remainingChanges = 2; // Default: users dapat 2x per 24 jam

        return Inertia::render('SuperAdmin/Pengaturan/Keamanan', [
            'remainingChanges' => $remainingChanges,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        // Validasi input
        $validated = $request->validate([
            'kata_sandi_lama' => ['required', 'current_password'],
            'kata_sandi_baru' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // Update password
        $user->update([
            'password' => Hash::make($validated['kata_sandi_baru']),
        ]);

        return redirect()->back()->with('success', 'Kata sandi berhasil diubah!');
    }
}
