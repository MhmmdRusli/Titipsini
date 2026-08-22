<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class LegalitasController extends Controller
{
    public function edit(): Response
    {
        $partner = Auth::user();

        return Inertia::render('Mitra/Legalitas/Index', [
            'partner' => [
                'name' => $partner->name,
                'gender' => $partner->gender,
                'birth_date' => $partner->birth_date?->format('Y-m-d'),
                'nik' => $partner->nik,
                'link_verifikasi_ktp' => $partner->link_verifikasi_ktp,
                'verification_status' => $partner->verification_status,
                'has_pin' => ! empty($partner->pin),
            ],
        ]);
    }

    public function storeKtp(Request $request): RedirectResponse
    {
        $partner = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:male,female'],
            'birth_date' => ['required', 'date'],
            'nik' => ['required', 'digits:16', 'unique:users,nik,'.$partner->id],
            'link_verifikasi_ktp' => ['required', 'url'],
        ], [
            'nik.digits' => 'NIK harus 16 digit.',
            'nik.unique' => 'NIK ini sudah terdaftar di akun lain.',
            'link_verifikasi_ktp.url' => 'Link harus berupa URL yang valid (link Google Drive).',
        ]);

        $partner->update([
            ...$validated,
            'verification_status' => 'verifikasi_akun',
        ]);

        return back()->with('success', 'Data KTP berhasil dikirim.');
    }

        public function storePin(Request $request): RedirectResponse
    {
        $partner = Auth::user();

        $validated = $request->validate([
            'pin' => ['required', 'digits:6'],
        ]);

        $partner->update([
            'pin' => Hash::make($validated['pin']),
        ]);

        return back()->with('success', 'PIN berhasil dibuat.');
    }
}