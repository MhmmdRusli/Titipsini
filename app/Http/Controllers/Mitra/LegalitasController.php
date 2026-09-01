<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LegalitasController extends Controller
{
    public function edit(): Response
    {
        /** @var \App\Models\User $partner */
        $partner = Auth::user();

        return Inertia::render('Mitra/Legalitas/Index', [
            'partner' => [
                'name' => $partner->name,
                'gender' => $partner->gender,
                'birth_date' => $partner->birth_date?->format('Y-m-d'),
                'nik' => $partner->nik,
                'foto_ktp' => $partner->foto_ktp ? Storage::url($partner->foto_ktp) : null,
                'verification_status' => $partner->verification_status,
                'has_pin' => ! empty($partner->pin),
            ],
        ]);
    }

    public function storeKtp(Request $request): RedirectResponse
    {
        /** @var \App\Models\User $partner */
        $partner = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:male,female'],
            'birth_date' => ['required', 'date'],
            'nik' => ['required', 'digits:16', 'unique:users,nik,' . $partner->id],
            'foto_ktp' => ['nullable', 'image', 'max:2048'],
        ], [
            'nik.digits' => 'NIK harus 16 digit.',
            'nik.unique' => 'NIK ini sudah terdaftar di akun lain.',
            'foto_ktp.image' => 'File harus berupa gambar.',
            'foto_ktp.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto_ktp')) {
            if ($partner->foto_ktp) {
                Storage::delete($partner->foto_ktp);
            }
            $validated['foto_ktp'] = $request->file('foto_ktp')->store('ktp', 'public');
        }

        $updateData = [
            'name' => $validated['name'],
            'gender' => $validated['gender'],
            'birth_date' => $validated['birth_date'],
            'nik' => $validated['nik'],
            'verification_status' => 'verifikasi_akun',
        ];

        if (isset($validated['foto_ktp'])) {
            $updateData['foto_ktp'] = $validated['foto_ktp'];
        }

        $partner->update($updateData);

        return back()->with('success', 'Data KTP berhasil dikirim.');
    }

    public function storePin(Request $request): RedirectResponse
    {
        /** @var \App\Models\User $partner */
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