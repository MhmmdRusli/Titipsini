<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Tampilkan halaman pendaftaran.
     * Jika user sudah login, arahkan ke beranda alih-alih melempar error 403.
     */
    public function create(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('beranda'); // Atau ganti dengan route dashboard kamu
        }

        return Inertia::render('Auth/Daftar');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // Catatan: Jika pada model User kamu sudah menetapkan cast 'password' => 'hashed',
        // Hash::make() di sini bisa langsung diganti dengan $validated['password'] 
        // agar tidak terjadi double hashing.
        $user = User::create([
            'name' => Str::before($validated['email'], '@'),
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
            'verification_status' => 'pendaftar',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended('/lengkapi-data');
    }
}