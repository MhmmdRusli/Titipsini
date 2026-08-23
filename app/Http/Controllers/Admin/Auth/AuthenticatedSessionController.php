<?php

namespace App\Http\Controllers\Admin\Auth;

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
        return Inertia::render('Admin/Auth/Login');
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'Email belum terdaftar atau kata sandi salah.',
            ])->onlyInput('email');
        }

        if (! in_array(Auth::user()->role, ['admin', 'finance', 'super_admin'], true)) {
            Auth::logout();

            return back()->withErrors([
                'email' => 'Akun ini tidak memiliki akses ke portal internal.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(match (Auth::user()->role) {
            'finance' => '/finance/dashboard',
            'super_admin' => '/super-admin/dashboard',
            default => '/admin/dashboard',
        });
    }
}