<?php

namespace App\Http\Controllers\Mitra\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Mitra/Auth/Login');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        // Boleh login pakai email atau nomor telepon
        $field = filter_var($request->identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        $credentials = [
            $field => $request->identifier,
            'password' => $request->password,
        ];

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'identifier' => 'Email/nomor telepon belum terdaftar atau kata sandi salah.',
            ])->onlyInput('identifier');
        }

        if (Auth::user()->role !== 'partner') {
            Auth::logout();

            return back()->withErrors([
                'identifier' => 'Akun ini tidak memiliki akses ke halaman mitra.',
            ])->onlyInput('identifier');
        }

        $request->session()->regenerate();

        if (! Auth::user()->hasVerifiedEmail()) {
            return redirect()->route('mitra.verify-email.notice');
        }

        return redirect()->intended('/mitra/dashboard');
    }
}