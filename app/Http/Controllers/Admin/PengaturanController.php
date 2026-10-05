<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DendaSetting;
use App\Models\PaymentSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanController extends Controller
{
    /**
     * Menampilkan halaman Pengaturan Komisi Platform.
     */
    public function komisi(): Response
    {
        // Nilai persentase komisi default / dari DB/Setting
        $commissionRate = 10; 

        return Inertia::render('Admin/Pengaturan/Komisi', [
            'commission_rate' => $commissionRate,
        ]);
    }
    
    public function updateKomisi(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'commission_rate' => 'required|numeric|min:0|max:100',
        ]);

        return back()->with('success', 'Pengaturan komisi platform berhasil disimpan!');
    }

    /**
     * Menampilkan halaman Pengaturan QRIS / Pembayaran.
     */
    public function qris(): Response
{
    $setting = PaymentSetting::current();

    return Inertia::render('Admin/Pengaturan/Qris', [
        'qris_url' => $setting->qris_image ? Storage::url($setting->qris_image) : null,
    ]);
}

    public function updateQris(Request $request): RedirectResponse
{
    $request->validate([
        'qris_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    $setting = PaymentSetting::current();

    if ($setting->qris_image) {
        Storage::disk('public')->delete($setting->qris_image);
    }

    $path = $request->file('qris_image')->store('qris', 'public');
    $setting->update(['qris_image' => $path]);

    return back()->with('success', 'Pengaturan QRIS berhasil diperbarui.');
}

    /**
     * Menampilkan halaman keamanan pengaturan admin.
     */
    public function keamanan(): Response
    {
        $loginHistory = [];
        if (config('session.driver') === 'database') {
            $loginHistory = DB::table(config('session.table', 'sessions'))
                ->where('user_id', auth()->id())
                ->orderByDesc('last_activity')
                ->limit(20)
                ->get(['id', 'ip_address', 'user_agent', 'last_activity'])
                ->map(fn ($session) => [
                    'id' => $session->id,
                    'device' => $session->user_agent ?: 'Perangkat tidak dikenal',
                    'device_type' => str_contains(strtolower((string) $session->user_agent), 'mobile') ? 'mobile' : 'desktop',
                    'location' => $session->ip_address,
                    'last_activity' => $session->last_activity,
                    'current' => $session->id === session()->getId(),
                ])
                ->all();
        }

        return Inertia::render('Admin/Pengaturan/Keamanan', [
            'loginHistory' => $loginHistory,
        ]);
    }

    /**
     * Mengubah password/keamanan admin.
     */
    public function updateKeamanan(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|confirmed|min:8',
        ]);

        $request->user()->update([
            'password' => bcrypt($request->password),
        ]);

        return back()->with('success', 'Password keamanan berhasil diperbarui.');
    }

    public function destroySession(string $sessionId): RedirectResponse
    {
        DB::table(config('session.table', 'sessions'))
            ->where('id', $sessionId)
            ->where('user_id', auth()->id())
            ->delete();

        return back()->with('success', 'Sesi berhasil dikeluarkan.');
    }

    public function destroyOtherSessions(): RedirectResponse
    {
        DB::table(config('session.table', 'sessions'))
            ->where('user_id', auth()->id())
            ->where('id', '!=', session()->getId())
            ->delete();

        return back()->with('success', 'Semua sesi lain berhasil dikeluarkan.');
    }

    public function denda()
{
    $kategori = ['barang', 'bangunan', 'kendaraan', 'pindahan'];

    $settings = collect($kategori)->map(function ($tipe) {
        $setting = DendaSetting::current($tipe);

        return [
            'service_type' => $tipe,
            'persen_per_hari' => (float) $setting->persen_per_hari,
            'max_persen' => (float) $setting->max_persen,
        ];
    });

    return Inertia::render('Admin/Pengaturan/Denda', [
        'settings' => $settings,
    ]);
}

/**
 * PUT /admin/pengaturan/denda
 */
public function updateDenda(Request $request)
{
    $validated = $request->validate([
        'settings' => ['required', 'array', 'size:4'],
        'settings.*.service_type' => ['required', 'string', 'in:barang,bangunan,kendaraan,pindahan'],
        'settings.*.persen_per_hari' => ['required', 'numeric', 'min:0', 'max:100'],
        'settings.*.max_persen' => ['required', 'numeric', 'min:0', 'max:100'],
    ]);

    foreach ($validated['settings'] as $item) {
        DendaSetting::current($item['service_type'])->update([
            'persen_per_hari' => $item['persen_per_hari'],
            'max_persen' => $item['max_persen'],
        ]);
    }

    return redirect()
        ->route('admin.pengaturan.denda')
        ->with('success', 'Pengaturan denda berhasil diperbarui.');
}

}
