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
use Illuminate\Validation\Rules;
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
        $role = $request->input('role', 'customer');

        if ($role === 'partner') {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
                'phone' => ['required', 'string', 'max:20', 'unique:' . User::class . ',phone'],
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ], [
                'email.unique' => 'Email ini sudah terdaftar. Coba masuk atau gunakan email lain.',
                'phone.unique' => 'Nomor telepon ini sudah terdaftar. Coba masuk atau gunakan nomor lain.',
                'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => Hash::make($validated['password']),
                'role' => 'partner',
            ]);
        } else {
            $validated = $request->validate([
                'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $user = User::create([
                'name' => Str::before($validated['email'], '@'),
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'customer',
                'verification_status' => 'pendaftar',
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        if ($user->role === 'partner') {
            return redirect()->route('mitra.verify-email.notice');
        }

        return redirect()->intended('/lengkapi-data');
    }
}