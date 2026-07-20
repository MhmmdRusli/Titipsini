<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            $email = $notifiable->getEmailForPasswordReset();

            $routeName = match ($notifiable->role ?? null) {
                'admin' => 'admin.password.reset',
                'partner' => 'mitra.password.reset',
                default => 'password.reset.form', // customer (flow OTP terpisah, ini cuma fallback)
            };

            return url(route($routeName, [
                'token' => $token,
                'email' => $email,
            ], false));
        });
    }
}