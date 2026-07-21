<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Customer/Profile/Index', [
            'user' => $user->only([
                'id', 'name', 'email', 'phone', 'gender', 'address', 'foto', 'created_at',
            ]),
        ]);
    }
    public function edit(Request $request): Response
{
    $user = $request->user();

    return Inertia::render('Customer/Profile/Edit', [
        'user' => $user->only(['name', 'gender', 'phone', 'address', 'foto']),
    ]);
}

public function update(Request $request)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'gender' => ['required', 'in:male,female'],
        'phone' => ['required', 'string', 'max:20'],
        'address' => ['required', 'string', 'max:500'],
        'foto' => ['nullable', 'image', 'max:2048'], // 2MB
    ]);

    $user = $request->user();

    if ($request->hasFile('foto')) {
        $path = $request->file('foto')->store('avatars', 'public');
        $validated['foto'] = '/storage/' . $path;
    } else {
        unset($validated['foto']);
    }

    $user->update($validated);

    return redirect()->route('customer.profile.index')->with('success', 'Profil berhasil diperbarui.');
}
}