<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    public function create(Request $request): Response
    {
        return Inertia::render('Admin/Auth/ResetPassword', [
            'email' => $request->query('email', ''),
            'token' => $request->route('token'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => [
                'required',
                'confirmed',
                PasswordRule::min(12)->mixedCase()->numbers(),
            ],
        ], [
            'password.min' => 'Kata sandi minimal 12 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak sama.',
        ]);

        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                // Catatan: TIDAK pakai Hash::make() di sini karena model User
                // sudah punya cast 'password' => 'hashed', yang otomatis
                // meng-hash setiap kali kolom password di-set. Kalau di-hash
                // manual juga di sini, hasilnya di-hash dua kali dan login
                // pakai password baru akan selalu gagal.
                $user->forceFill([
                    'password' => $request->password,
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return redirect()->route('admin.login')->with('status', 'Kata sandi berhasil diubah, silakan masuk kembali.');
    }
}