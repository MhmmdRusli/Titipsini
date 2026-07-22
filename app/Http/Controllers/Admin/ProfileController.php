<?php

namespace App\Http\Controllers\Admin;

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
        $admin = Auth::user();

        return Inertia::render('Admin/Profile', [
            'admin' => [
                'id_admin'       => $admin->id,
                'name'           => $admin->name,
                'email'          => $admin->email,
                'phone'          => $admin->phone,
                'tanggal_lahir'  => optional($admin->tanggal_lahir)->format('Y-m-d'),
                'gender'         => $admin->gender,
                'provinsi'       => $admin->provinsi,
                'city'           => $admin->city,
                'kecamatan'      => $admin->kecamatan,
                'address'        => $admin->address,
                'peran'          => ucfirst($admin->role),
                'wilayah'        => $admin->wilayah,
                // 'direct_public' disk = disimpan langsung di public/avatars,
                // supaya php artisan serve bisa nyajiin filenya tanpa lewat
                // symlink storage (yang kena 403 di Windows sebelumnya).
                'foto_url'       => $admin->foto ? Storage::disk('direct_public')->url($admin->foto) : null,
            ],
        ]);
    }

    /**
     * Simpan perubahan profil admin.
     */
    public function update(Request $request)
    {
        $admin = Auth::user();

        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'max:255', 'unique:users,email,' . $admin->id],
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
            if ($admin->foto) {
                Storage::disk('direct_public')->delete($admin->foto);
            }
            $validated['foto'] = $request->file('foto')->store('avatars', 'direct_public');
        }

        $admin->update($validated);

        return redirect()
            ->route('admin.profil.edit')
            ->with('success', 'Profil berhasil diperbarui.');
    }
}