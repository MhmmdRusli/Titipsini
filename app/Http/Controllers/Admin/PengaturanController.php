<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PasswordHistory;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengaturanController extends Controller
{
    /**
     * GET /admin/pengaturan/keamanan
     */
    public function keamanan()
    {
        $admin = Auth::user();

        $changesLast24h = PasswordHistory::where('user_id', $admin->id)
            ->where('changed_at', '>=', now()->subDay())
            ->count();

        return Inertia::render('Admin/Pengaturan/Keamanan', [
            'remainingChanges' => max(0, 2 - $changesLast24h),
        ]);
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

        return Inertia::render('Admin/Pengaturan/Qris', [
            'qris_url' => $setting->qris_image ? Storage::url($setting->qris_image) : null,
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

        if ($setting->qris_image) {
            Storage::delete($setting->qris_image);
        }

        $setting->update([
            'qris_image' => $request->file('qris_image')->store('qris', 'public'),
        ]);

        return redirect()
            ->route('admin.pengaturan.qris')
            ->with('success', 'QRIS berhasil diperbarui.');
    }
}