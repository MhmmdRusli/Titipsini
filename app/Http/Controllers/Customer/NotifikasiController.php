<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotifikasiController extends Controller
{
    public function index(Request $request): Response
    {
        $notifikasi = $request->user()
            ->notifikasi() // relasi hasMany, lihat catatan di User.php
            ->latest()
            ->get();

        return Inertia::render('Customer/Notifikasi/Index', [
            'notifikasi' => $notifikasi,
        ]);
    }

    public function markAsRead(Request $request, Notifikasi $notifikasi)
    {
        abort_unless($notifikasi->user_id === $request->user()->id, 403);

        if (! $notifikasi->read_at) {
            $notifikasi->update(['read_at' => now()]);
        }

        return redirect()->back();
    }
}