<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SecurityController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Customer/Profile/Keamanan');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'Password saat ini tidak sesuai.',
            ]);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return redirect()->back()->with('success', 'Password berhasil diubah.');
    }

    public function updatePin(Request $request)
    {
        $validated = $request->validate([
            'current_pin' => ['required', 'digits:6'],
            'pin' => ['required', 'digits:6', 'confirmed'],
        ]);

        $user = $request->user();

        if (! $user->pin || ! Hash::check($validated['current_pin'], $user->pin)) {
            throw ValidationException::withMessages([
                'current_pin' => 'PIN saat ini tidak sesuai.',
            ]);
        }

        $user->update(['pin' => Hash::make($validated['pin'])]);

        return redirect()->back()->with('success', 'PIN berhasil diubah.');
    }
}