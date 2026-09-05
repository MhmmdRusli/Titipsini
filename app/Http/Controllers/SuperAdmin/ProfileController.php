<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman "Profil" Super Admin: edit nama/email, ganti foto profil, dan
 * riwayat login/sesi aktif.
 *
 * Riwayat login diambil langsung dari tabel `sessions` bawaan Laravel
 * (project ini pakai SESSION_DRIVER=database), BUKAN tabel baru — supaya
 * datanya selalu sama dengan sesi yang benar-benar dipakai browser/device.
 */
class ProfileController extends Controller
{
    /**
     * GET /super-admin/profil
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $currentSessionId = $request->session()->getId();

        $sessions = DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderByDesc('last_activity')
            ->get()
            ->map(function ($session) use ($currentSessionId) {
                $agent = $this->parseUserAgent($session->user_agent);

                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'browser' => $agent['browser'],
                    'platform' => $agent['platform'],
                    'is_current_device' => $session->id === $currentSessionId,
                    'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
                ];
            })
            ->values();

        return Inertia::render('SuperAdmin/Profile/Edit', [
            'user' => $user->only(['id', 'name', 'email', 'phone', 'avatar']),
            'sessions' => $sessions,
        ]);
    }

    /**
     * PUT /super-admin/profil
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user->update($validated);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * POST /super-admin/profil/avatar
     * Endpoint terpisah dari update() supaya upload file tidak perlu
     * method-spoofing PUT+multipart yang rawan bermasalah di beberapa
     * browser/proxy.
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();

        // Hapus file avatar lama supaya storage tidak menumpuk file yatim.
        if ($user->avatar) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => Storage::url($path)]);

        return back()->with('success', 'Foto profil berhasil diperbarui.');
    }

    /**
     * DELETE /super-admin/profil/sesi/{sessionId}
     * Akhiri satu sesi login aktif (logout paksa dari perangkat lain).
     * Sengaja diblokir kalau target-nya sesi yang sedang dipakai sendiri,
     * supaya Super Admin tidak tidak sengaja logout dirinya sendiri lewat
     * daftar ini.
     */
    public function destroySession(Request $request, string $sessionId): RedirectResponse
    {
        $user = $request->user();

        abort_if(
            $sessionId === $request->session()->getId(),
            422,
            'Tidak dapat mengakhiri sesi yang sedang aktif Anda gunakan sekarang.'
        );

        DB::table('sessions')
            ->where('id', $sessionId)
            ->where('user_id', $user->id) // pastikan hanya sesi milik user ini yang bisa dihapus
            ->delete();

        return back()->with('success', 'Sesi berhasil diakhiri.');
    }

    /**
     * Parsing user agent sederhana tanpa dependency tambahan — cukup untuk
     * menampilkan "Chrome di Windows", dsb. Bukan detektor yang presisi
     * 100%, tapi cukup untuk keperluan tampilan riwayat login.
     */
    private function parseUserAgent(?string $userAgent): array
    {
        $userAgent = $userAgent ?? '';

        $platform = 'Tidak diketahui';
        if (str_contains($userAgent, 'Windows')) {
            $platform = 'Windows';
        } elseif (str_contains($userAgent, 'Macintosh') || str_contains($userAgent, 'Mac OS')) {
            $platform = 'macOS';
        } elseif (str_contains($userAgent, 'Android')) {
            $platform = 'Android';
        } elseif (str_contains($userAgent, 'iPhone') || str_contains($userAgent, 'iPad')) {
            $platform = 'iOS';
        } elseif (str_contains($userAgent, 'Linux')) {
            $platform = 'Linux';
        }

        $browser = 'Browser tidak diketahui';
        if (str_contains($userAgent, 'Edg/')) {
            $browser = 'Microsoft Edge';
        } elseif (str_contains($userAgent, 'Chrome/') && ! str_contains($userAgent, 'Edg/')) {
            $browser = 'Google Chrome';
        } elseif (str_contains($userAgent, 'Firefox/')) {
            $browser = 'Mozilla Firefox';
        } elseif (str_contains($userAgent, 'Safari/') && ! str_contains($userAgent, 'Chrome/')) {
            $browser = 'Safari';
        }

        return ['platform' => $platform, 'browser' => $browser];
    }
}