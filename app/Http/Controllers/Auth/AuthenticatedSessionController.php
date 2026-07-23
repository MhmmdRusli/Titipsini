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
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'Email atau password salah.',
            ])->onlyInput('email');
        }

        $user = $request->user();

        // Admin tidak boleh login lewat halaman ini, hanya lewat /admin/login
        if ($user->role === 'admin') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'email' => 'Akun admin harus login melalui halaman khusus admin.',
            ])->onlyInput('email');
        }

        // Cek jika akun partner sedang ditangguhkan
        if ($user->role === 'partner' && $user->suspended_at) {
            $request->session()->regenerate();
            return redirect()->route('partner.suspended.notice');
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