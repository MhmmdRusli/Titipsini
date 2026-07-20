<?php

namespace App\Http\Controllers\Mitra\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VerifyEmailController extends Controller
{
    /**
     * Menangani klik tautan aktivasi dari email.
     */
    public function verify(EmailVerificationRequest $request): RedirectResponse
    {
        if (! $request->user()->hasVerifiedEmail()) {
            $request->user()->markEmailAsVerified();
            event(new Verified($request->user()));
        }

        return redirect()->route('mitra.register.success');
    }

    /**
     * Halaman konfirmasi sukses setelah email terverifikasi.
     */
    public function success(Request $request): Response
    {
        return Inertia::render('Mitra/Auth/RegisterSuccess', [
            'name' => $request->user()?->name,
        ]);
    }
}