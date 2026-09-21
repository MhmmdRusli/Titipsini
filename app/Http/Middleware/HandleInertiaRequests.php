<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        // Cek apakah user terverifikasi (statusnya 'terverifikasi' atau 'verified')
        $isVerified = $user ? in_array(strtolower((string) $user->verification_status), ['terverifikasi', 'verified'], true) : false;

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'verification_status' => $user->verification_status,
                    'is_verified' => $isVerified,
                    'avatar' => (function () use ($user) {
                        $raw = $user->foto ?: $user->avatar;

                        if (! $raw) {
                            return null;
                        }

                        if (str_starts_with($raw, '/') || str_starts_with($raw, 'http')) {
                            return $raw;
                        }

                        return Storage::disk('direct_public')->url($raw);
                    })(),
                ] : null,
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
            ],
        ]);
    }
}