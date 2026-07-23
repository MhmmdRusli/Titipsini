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

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    // 'direct_public' disk = file disimpan langsung di public/avatars,
                    // bukan lewat symlink storage (yang kena 403 di php artisan serve
                    // pada Windows).
                    'avatar' => (function () use ($user) {
                        $raw = $user->foto ?: $user->avatar;

                        if (! $raw) {
                            return null;
                        }

                        // Kalau nilainya sudah berupa path/URL lengkap (mis. '/storage/avatars/x.jpg',
                        // hasil upload dari halaman Edit Profil customer), pakai apa adanya.
                        if (str_starts_with($raw, '/') || str_starts_with($raw, 'http')) {
                            return $raw;
                        }

                        // Kalau nilainya path relatif polos (mis. 'avatars/x.jpg'), baru resolve
                        // lewat disk direct_public.
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