<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PasswordHistory;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengaturanController extends Controller
{
    /**
     * GET /admin/pengaturan/keamanan
     */
    public function keamanan(Request $request)
    {
        $admin = Auth::user();

        $changesLast24h = PasswordHistory::where('user_id', $admin->id)
            ->where('changed_at', '>=', now()->subDay())
            ->count();

        return Inertia::render('Admin/Pengaturan/Keamanan', [
            'remainingChanges' => max(0, 2 - $changesLast24h),
            'loginHistory' => $this->ambilRiwayatLogin($admin->id, $request->session()->getId()),
        ]);
    }

    /**
     * Ambil daftar sesi login admin dari tabel `sessions` (butuh SESSION_DRIVER=database di .env).
     * Kalau driver session bukan 'database', tabel ini nggak dipakai Laravel sama sekali,
     * jadi hasilnya bakal selalu kosong - itu bukan bug, tapi konfigurasi.
     */
    private function ambilRiwayatLogin(int $userId, string $currentSessionId): array
    {
        if (config('session.driver') !== 'database') {
            return [];
        }

        return DB::table('sessions')
            ->where('user_id', $userId)
            ->orderByDesc('last_activity')
            ->get()
            ->map(function ($session) use ($currentSessionId) {
                [$device, $deviceType] = $this->parseUserAgent($session->user_agent);

                return [
                    'id' => $session->id,
                    'device' => $device,
                    'device_type' => $deviceType,
                    'location' => $session->ip_address,
                    'time' => \Illuminate\Support\Carbon::createFromTimestamp($session->last_activity)
                        ->diffForHumans(),
                    'current' => $session->id === $currentSessionId,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * Parsing user agent sederhana (browser + OS), tanpa dependency tambahan.
     * Kalau butuh deteksi yang lebih akurat, bisa ganti pakai package
     * seperti jenssegers/agent nanti.
     */
    private function parseUserAgent(?string $userAgent): array
    {
        $userAgent = $userAgent ?? '';

        $isMobile = (bool) preg_match('/Mobile|Android|iPhone|iPad/i', $userAgent);

        $browser = match (true) {
            str_contains($userAgent, 'Edg/') => 'Edge',
            str_contains($userAgent, 'Chrome/') => 'Chrome',
            str_contains($userAgent, 'Firefox/') => 'Firefox',
            str_contains($userAgent, 'Safari/') && ! str_contains($userAgent, 'Chrome') => 'Safari',
            default => 'Browser',
        };

        $os = match (true) {
            str_contains($userAgent, 'Windows') => 'Windows',
            str_contains($userAgent, 'Mac OS') => 'macOS',
            str_contains($userAgent, 'Android') => 'Android',
            str_contains($userAgent, 'iPhone'), str_contains($userAgent, 'iPad') => 'iOS',
            str_contains($userAgent, 'Linux') => 'Linux',
            default => null,
        };

        $device = $os ? "{$browser} di {$os}" : $browser;

        return [$device, $isMobile ? 'mobile' : 'desktop'];
    }

    /**
     * DELETE /admin/pengaturan/keamanan/sessions/{sessionId}
     * Paksa keluar dari satu sesi login (device lain).
     */
    public function destroySession(Request $request, string $sessionId)
    {
        DB::table('sessions')
            ->where('user_id', Auth::id())
            ->where('id', $sessionId)
            ->where('id', '!=', $request->session()->getId()) // jaga-jaga: gak boleh hapus sesi sendiri lewat sini
            ->delete();

        return back()->with('success', 'Sesi berhasil dikeluarkan.');
    }

    /**
     * PUT /admin/pengaturan/keamanan
     */
    public function updateKeamanan(Request $request)
    {
        $admin = Auth::user();

        $changesLast24h = PasswordHistory::where('user_id', $admin->id)
            ->where('changed_at', '>=', now()->subDay())
            ->count();

        if ($changesLast24h >= 2) {
            return back()->withErrors([
                'kata_sandi_lama' => 'Anda hanya dapat mengubah kata sandi maksimal 2 kali dalam 24 jam.',
            ]);
        }

        $validated = $request->validate([
            'kata_sandi_lama' => ['required', 'string'],
            'kata_sandi_baru' => ['required', 'string', 'min:8', 'confirmed'],
        ], [], [
            'kata_sandi_lama' => 'kata sandi lama',
            'kata_sandi_baru' => 'kata sandi baru',
        ]);

        if (! Hash::check($validated['kata_sandi_lama'], $admin->password)) {
            return back()->withErrors([
                'kata_sandi_lama' => 'Kata sandi lama tidak sesuai.',
            ]);
        }

        $admin->update([
            'password' => Hash::make($validated['kata_sandi_baru']),
        ]);

        PasswordHistory::create([
            'user_id'    => $admin->id,
            'changed_at' => now(),
        ]);

        return redirect()
            ->route('admin.pengaturan.keamanan')
            ->with('success', 'Kata sandi berhasil diperbarui.');
    }

    /**
     * GET /admin/pengaturan/qris
     */
    public function qris()
    {
        $setting = PaymentSetting::current();

        $qrisUrl = ($setting && $setting->qris_image) 
            ? Storage::url($setting->qris_image) . '?v=' . time() 
            : null;

        return Inertia::render('Admin/Pengaturan/Qris', [
            'qris_url' => $qrisUrl,
        ]);
    }

    /**
     * POST /admin/pengaturan/qris
     */
    public function updateQris(Request $request)
    {
        $request->validate([
            'qris_image' => ['required', 'image', 'max:4096'],
        ]);

        $setting = PaymentSetting::current();

        if ($setting && $setting->qris_image) {
            Storage::delete($setting->qris_image);
        }

        $setting->update([
            'qris_image' => $request->file('qris_image')->store('qris', 'public'),
        ]);

        return redirect()
            ->route('admin.pengaturan.qris')
            ->with('success', 'QRIS berhasil diperbarui.');
    }

    /**
     * DELETE /admin/pengaturan/qris
     */
    public function destroyQris()
    {
        $setting = PaymentSetting::current();

        if ($setting && $setting->qris_image) {
            Storage::disk('public')->delete($setting->qris_image);
            $setting->update([
                'qris_image' => null,
            ]);
        }

        return redirect()
            ->route('admin.pengaturan.qris')
            ->with('success', 'QRIS berhasil dihapus.');
    }

    /**
     * GET /admin/pengaturan/komisi
     */
    public function komisi()
    {
        $setting = PaymentSetting::current();

        return Inertia::render('Admin/Pengaturan/Komisi', [
            'commission_rate' => $setting ? $setting->commission_rate : 0,
            'app_fee'         => $setting ? $setting->app_fee : 0,
        ]);
    }

    /**
     * POST /admin/pengaturan/komisi
     */
    public function updateKomisi(Request $request)
    {
        $validated = $request->validate([
            'commission_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'app_fee'         => ['required', 'numeric', 'min:0'],
        ], [], [
            'commission_rate' => 'persentase komisi',
            'app_fee'         => 'biaya aplikasi',
        ]);

        $setting = PaymentSetting::current();

        $setting->update([
            'commission_rate' => $validated['commission_rate'],
            'app_fee'         => $validated['app_fee'],
        ]);

        return redirect()
            ->route('admin.pengaturan.komisi')
            ->with('success', 'Pengaturan komisi berhasil diperbarui.');
    }
}