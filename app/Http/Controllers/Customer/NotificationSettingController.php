<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationSettingController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Customer/Profile/Notifikasi', [
            'preferences' => $user->only(['notif_push', 'notif_email', 'notif_promo']),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'notif_push' => ['required', 'boolean'],
            'notif_email' => ['required', 'boolean'],
            'notif_promo' => ['required', 'boolean'],
        ]);

        $request->user()->update($validated);

        return redirect()->back();
    }
}