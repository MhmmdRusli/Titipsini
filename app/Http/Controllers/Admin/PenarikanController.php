<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penarikan;
use App\Models\SaldoMutasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PenarikanController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'pending');

        $penarikan = Penarikan::with('user:id,name,email')
            ->when($status !== 'semua', fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Penarikan/Index', [
            'penarikan' => $penarikan,
            'filter' => ['status' => $status],
        ]);
    }

    /**
     * Baru di sini saldo mitra benar-benar dipotong dan mutasi dicatat.
     *
     * PENTING: saldo mitra TIDAK disimpan di kolom `users.saldo` (kolom itu
     * dipakai untuk saldo top-up Customer). Saldo mitra selalu dihitung
     * dinamis lewat User::saldoMitra() — dari total pesanan selesai
     * dikurangi komisi platform, dikurangi total penarikan yang belum ditolak.
     * Jangan pernah balik ke `$user->saldo` untuk konteks mitra.
     */
    public function approve(Penarikan $penarikan): RedirectResponse
    {
        abort_unless($penarikan->status === 'pending', 400, 'Penarikan ini sudah diproses sebelumnya.');

        DB::transaction(function () use ($penarikan) {
            $user = $penarikan->user;
            $user->refresh();

            $jumlahPenarikan = (int) preg_replace('/[^0-9]/', '', (string) $penarikan->jumlah);

            // Hitung saldo mitra secara dinamis (sama persis dengan logika
            // yang dipakai di Mitra\PenarikanController & Mitra\DashboardController)
            $saldoUser = $user->saldoMitra();

            if ($saldoUser < $jumlahPenarikan) {
                abort(422, "Saldo mitra tidak mencukupi lagi. (Saldo: Rp " . number_format($saldoUser, 0, ',', '.') . ", Penarikan: Rp " . number_format($jumlahPenarikan, 0, ',', '.') . ")");
            }

            // TIDAK decrement kolom `saldo` di sini. Saldo dinamis otomatis
            // "berkurang" begitu status Penarikan bukan 'ditolak' — termasuk
            // saat masih 'pending', jadi begitu penarikan diajukan, saldo
            // yang tampil di Dashboard Mitra sudah otomatis terpotong.
            // Baris `decrement('saldo', ...)` LAMA sengaja dihapus.

            SaldoMutasi::create([
                'user_id' => $user->id,
                'type' => 'penarikan',
                'jumlah' => $jumlahPenarikan,
                'deskripsi' => 'Penarikan ke '.$penarikan->nama_bank.' •••• '.substr($penarikan->nomor_rekening, -4),
                'reference_type' => Penarikan::class,
                'reference_id' => $penarikan->id,
            ]);

            $penarikan->update([
                'status' => 'selesai',
                'processed_at' => now(),
            ]);
        });

        return back()->with('success', 'Penarikan berhasil disetujui, saldo mitra telah dipotong.');
    }

    public function reject(Request $request, Penarikan $penarikan): RedirectResponse
    {
        abort_unless($penarikan->status === 'pending', 400, 'Penarikan ini sudah diproses sebelumnya.');

        $validated = $request->validate([
            'catatan' => 'nullable|string|max:255',
        ]);

        // Saldo tidak pernah dipotong di awal, jadi di sini tidak perlu
        // dikembalikan - cukup ubah statusnya saja.
        $penarikan->update([
            'status' => 'ditolak',
            'catatan' => $validated['catatan'] ?? null,
            'processed_at' => now(),
        ]);

        return back()->with('success', 'Penarikan telah ditolak.');
    }
}