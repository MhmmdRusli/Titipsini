<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PaymentSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class QrisController extends Controller
{
    public function index(): Response
    {
        $setting = PaymentSetting::current();

        return Inertia::render('Finance/Qris', [
            'qris_url' => $setting->qris_image ? Storage::url($setting->qris_image) : null,
            'merchant_name' => $setting->merchant_name,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'merchant_name' => ['nullable', 'string', 'max:255'],
            'qris_image' => ['required', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

        $setting = PaymentSetting::current();

        if ($setting->qris_image) {
            Storage::disk('public')->delete($setting->qris_image);
        }

        $path = $request->file('qris_image')->store('qris', 'public');
        $setting->update(array_merge($validated, ['qris_image' => $path]));

        return back()->with('success', 'QRIS berhasil diperbarui.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $setting = PaymentSetting::current();

        if ($setting->qris_image) {
            Storage::disk('public')->delete($setting->qris_image);
            $setting->update(['qris_image' => null]);
        }

        return back()->with('success', 'QRIS berhasil dihapus.');
    }
}
