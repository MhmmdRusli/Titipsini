<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\PaymentSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanQrisController extends Controller
{
    public function index(): Response
    {
        $setting = PaymentSetting::current();

        return Inertia::render('SuperAdmin/Pengaturan/Qris', [
            'qris_url' => $setting->qris_image ? Storage::url($setting->qris_image) : null,
            'merchant_name' => $setting->merchant_name,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'merchant_name' => ['nullable', 'string', 'max:255'],
            'qris_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

        $setting = PaymentSetting::current();

        if ($request->hasFile('qris_image')) {
            if ($setting->qris_image) {
                Storage::disk('public')->delete($setting->qris_image);
            }

            $path = $request->file('qris_image')->store('qris', 'public');
            $validated['qris_image'] = $path;
        }

        $setting->update($validated);

        return back()->with('success', 'Pengaturan QRIS berhasil diperbarui.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $setting = PaymentSetting::current();

        if ($setting->qris_image) {
            Storage::disk('public')->delete($setting->qris_image);
            $setting->update(['qris_image' => null]);
        }

        return back()->with('success', 'Gambar QRIS berhasil dihapus.');
    }
}
