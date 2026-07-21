<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Topup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TopupVerifikasiController extends Controller
{
    public function index(): Response
    {
        $topups = Topup::with('user')
            ->where('status', 'menunggu_verifikasi')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Topup/Index', [
            'topups' => $topups,
        ]);
    }

    public function show(Topup $topup): Response
    {
        $topup->load('user', 'verifier');

        return Inertia::render('Admin/Topup/Show', [
            'topup' => $topup,
        ]);
    }

    public function approve(Topup $topup): RedirectResponse
    {
        abort_unless($topup->status === 'menunggu_verifikasi', 422, 'Transaksi ini tidak bisa diverifikasi.');

        $topup->update([
            'status' => 'berhasil',
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        $topup->user->increment('saldo', $topup->nominal);

        return back()->with('success', 'Top up berhasil diverifikasi, saldo pelanggan sudah ditambahkan.');
    }

    public function reject(Request $request, Topup $topup): RedirectResponse
    {
        abort_unless($topup->status === 'menunggu_verifikasi', 422, 'Transaksi ini tidak bisa ditolak.');

        $validated = $request->validate([
            'catatan_admin' => ['required', 'string', 'max:255'],
        ], [
            'catatan_admin.required' => 'Cantumkan alasan penolakan.',
        ]);

        $topup->update([
            'status' => 'ditolak',
            'catatan_admin' => $validated['catatan_admin'],
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        return back()->with('success', 'Top up ditolak.');
    }
}