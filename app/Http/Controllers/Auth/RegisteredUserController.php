<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Daftar');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // `name` isn't collected until the "Data Diri" step, but the column
        // is likely NOT NULL — using the email's local part as a placeholder
        // until the user fills in their real name next.
        $user = User::create([
            'name' => Str::before($validated['email'], '@'),
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
            'verification_status' => 'pendaftar',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('customer.lengkapi-data.intro');
    }
}