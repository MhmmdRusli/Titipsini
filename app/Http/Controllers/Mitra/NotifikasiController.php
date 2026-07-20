<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotifikasiController extends Controller
{
    public function index(): Response
    {
        $notifikasi = Notifikasi::with('order')
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'type' => $n->type,
                'judul' => $n->judul,
                'pesan' => $n->pesan,
                'order_id' => $n->order_id,
                'order_code' => $n->order?->order_code,
                'is_read' => ! is_null($n->read_at),
                'waktu' => $n->created_at->translatedFormat('d-m-Y H:i'),
            ]);

        return Inertia::render('Mitra/Notifikasi', [
            'notifikasi' => $notifikasi,
        ]);
    }

    public function markAsRead(Notifikasi $notifikasi): RedirectResponse
    {
        abort_unless($notifikasi->user_id === Auth::id(), 403);

        if (! $notifikasi->read_at) {
            $notifikasi->update(['read_at' => now()]);
        }

        return back();
    }

    public function markAllAsRead(): RedirectResponse
    {
        Notifikasi::where('user_id', Auth::id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back()->with('success', 'Semua notifikasi ditandai sudah dibaca.');
    }
}