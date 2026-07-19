<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\PasswordResetOtp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ForgotPasswordController extends Controller
{
    /**
     * Step 1: form input email.
     */
    public function showEmailForm()
    {
        return Inertia::render('Auth/ForgotPassword/Email');
    }

    public function sendOtp(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated['email'])
            ->where('role', 'customer')
            ->first();

        if ($user) {
            $otpCode = (string) random_int(100000, 999999);

            PasswordResetOtp::where('email', $validated['email'])->delete();

            PasswordResetOtp::create([
                'email'      => $validated['email'],
                'otp_code'   => Hash::make($otpCode),
                'verified'   => false,
                'expires_at' => now()->addMinutes(10),
            ]);

            Mail::to($validated['email'])->send(new OtpMail($otpCode));
        }

        $request->session()->put('password_reset_email', $validated['email']);

        return redirect()->route('password.verify.form');
    }

    /**
     * Step 2: form input kode OTP.
     */
    public function showVerifyForm(Request $request)
    {
        if (! $request->session()->has('password_reset_email')) {
            return redirect()->route('password.email.form');
        }

        return Inertia::render('Auth/ForgotPassword/Verify', [
            'email' => $request->session()->get('password_reset_email'),
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $validated = $request->validate([
            'otp_code' => ['required', 'string', 'size:6'],
        ]);

        $email = $request->session()->get('password_reset_email');

        $record = PasswordResetOtp::where('email', $email)
            ->where('expires_at', '>=', now())
            ->latest()
            ->first();

        if (! $record || ! Hash::check($validated['otp_code'], $record->otp_code)) {
            return back()->withErrors([
                'otp_code' => 'Kode verifikasi salah atau sudah kedaluwarsa.',
            ]);
        }

        $record->update(['verified' => true]);
        $request->session()->put('password_reset_verified', true);

        return redirect()->route('password.reset.form');
    }

    /**
     * Step 3: form buat password baru.
     */
    public function showResetForm(Request $request)
    {
        if (! $request->session()->get('password_reset_verified')) {
            return redirect()->route('password.email.form');
        }

        return Inertia::render('Auth/ForgotPassword/Reset');
    }

    public function resetPassword(Request $request)
    {
        if (! $request->session()->get('password_reset_verified')) {
            return redirect()->route('password.email.form');
        }

        $validated = $request->validate([
            'password' => [
                'required',
                'string',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/',
            ],
        ], [
            'password.regex' => 'Kata sandi minimal 12 karakter dan harus mengandung huruf besar, huruf kecil, dan angka.',
        ]);

        $email = $request->session()->get('password_reset_email');

        $user = User::where('email', $email)->where('role', 'customer')->first();

        if (! $user) {
            return redirect()->route('password.email.form')
                ->withErrors(['email' => 'Akun tidak ditemukan.']);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        PasswordResetOtp::where('email', $email)->delete();
        $request->session()->forget(['password_reset_email', 'password_reset_verified']);

        return redirect()->route('login')->with('success', 'Kata sandi berhasil diperbarui, silakan login.');
    }
}