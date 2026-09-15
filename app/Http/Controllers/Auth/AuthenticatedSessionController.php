<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'identifier' => ['required', 'string'],
            'password' => ['required'],
        ]);

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

        $user = $request->user();

        if ($user->role === 'admin') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'identifier' => 'Akun admin harus login melalui halaman khusus admin.',
            ])->onlyInput('identifier');
        }

        // Halaman ini dipakai bersama oleh Customer dan Mitra. Untuk akun Mitra
        // (role partner) tetap perlu cek status ditangguhkan & verifikasi email
        // sebelum diarahkan ke /mitra/dashboard.
        if ($user->role === 'partner') {
            if ($user->suspended_at) {
                $request->session()->regenerate();
                return redirect()->route('mitra.suspended.notice');
            }

            if (! $user->hasVerifiedEmail()) {
                $request->session()->regenerate();
                return redirect()->route('mitra.verify-email.notice');
            }
        }

        $request->session()->regenerate();

        return $this->redirectByRole($request);
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

    protected function redirectByRole(Request $request): RedirectResponse
    {
        return match ($request->user()->role) {
            'partner' => redirect()->intended('/mitra/dashboard'),
            default => redirect()->intended('/app/dashboard'),
        };
    }
}
