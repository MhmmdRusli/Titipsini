<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Tampilkan halaman "Ubah Profil".
     */
    public function edit()
    {
        $finance = Auth::user();

        return Inertia::render('Finance/Profile', [
            'finance' => [
                'id_finance'     => $finance->id,
                'name'           => $finance->name,
                'email'          => $finance->email,
                'phone'          => $finance->phone,
                'tanggal_lahir'  => optional($finance->tanggal_lahir)->format('Y-m-d'),
                'gender'         => $finance->gender,
                'provinsi'       => $finance->provinsi,
                'city'           => $finance->city,
                'kecamatan'      => $finance->kecamatan,
                'address'        => $finance->address,
                'peran'          => ucfirst($finance->role),
                'wilayah'        => $finance->wilayah,
                'foto_url'       => $finance->foto ? Storage::disk('direct_public')->url($finance->foto) : null,
            ],
        ]);
    }

    /**
     * Simpan perubahan profil finance.
     */
    public function update(Request $request)
    {
        $finance = Auth::user();

        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'max:255', 'unique:users,email,' . $finance->id],
            'phone'          => ['nullable', 'string', 'max:20'],
            'tanggal_lahir'  => ['nullable', 'date'],
            'gender'         => ['nullable', 'in:male,female'],
            'provinsi'       => ['nullable', 'string', 'max:255'],
            'city'           => ['nullable', 'string', 'max:255'],
            'kecamatan'      => ['nullable', 'string', 'max:255'],
            'address'        => ['nullable', 'string'],
            'foto'           => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('foto')) {
            if ($finance->foto) {
                Storage::disk('direct_public')->delete($finance->foto);
            }
            $validated['foto'] = $request->file('foto')->store('avatars', 'direct_public');
        }

        $finance->update($validated);

        return redirect()
            ->route('finance.profil.edit')
            ->with('success', 'Profil berhasil diperbarui.');
    }
}