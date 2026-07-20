<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Menu utama Profil (daftar link + badge verifikasi)
     */
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render('Mitra/Profile/Index', [
            'partner' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                'is_verified' => $user->verification_status === 'terverifikasi',
            ],
        ]);
    }

    /**
     * Submenu "Profil Saya" - form edit data diri
     */
    public function edit(): Response
    {
        $user = Auth::user();

        return Inertia::render('Mitra/Profile/Edit', [
            'partner' => [
                'name' => $user->name,
                'email' => $user->email,
                'vendor_id' => $user->vendor_id,
                'phone' => $user->phone,
                'gender' => $user->gender,
                'birth_date' => $user->birth_date?->format('Y-m-d'),
                'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                'cover_photo' => $user->cover_photo ? Storage::url($user->cover_photo) : null,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'phone' => ['required', 'string', 'max:20', 'unique:users,phone,'.$user->id],
            'gender' => ['required', 'in:L,P'],
            'birth_date' => ['required', 'date'],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'cover_photo' => ['nullable', 'image', 'max:4096'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::delete($user->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        if ($request->hasFile('cover_photo')) {
            if ($user->cover_photo) {
                Storage::delete($user->cover_photo);
            }
            $validated['cover_photo'] = $request->file('cover_photo')->store('covers', 'public');
        }

        $user->update($validated);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }
}