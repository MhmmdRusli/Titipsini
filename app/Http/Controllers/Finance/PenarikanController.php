<?php

namespace App\Http\Controllers\Finance;

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

        return Inertia::render('Finance/Penarikan/Index', [
            'penarikan' => $penarikan,
            'filter' => ['status' => $status],
        ]);
    }

    public function approve(Penarikan $penarikan): RedirectResponse
    {
        abort_unless($penarikan->status === 'pending', 400, 'Penarikan ini sudah diproses sebelumnya.');

        DB::transaction(function () use ($penarikan) {
            $user = $penarikan->user;
            $user->refresh();

            $jumlahPenarikan = (int) preg_replace('/[^0-9]/', '', (string) $penarikan->jumlah);

            $saldoTersediaUntukPenarikanIni = $user->saldoMitra() + $jumlahPenarikan;

            if ($saldoTersediaUntukPenarikanIni < $jumlahPenarikan) {
                abort(422, "Saldo mitra tidak mencukupi lagi. (Saldo: Rp " . number_format($saldoTersediaUntukPenarikanIni, 0, ',', '.') . ", Penarikan: Rp " . number_format($jumlahPenarikan, 0, ',', '.') . ")");
            }

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

        $penarikan->update([
            'status' => 'ditolak',
            'catatan' => $validated['catatan'] ?? null,
            'processed_at' => now(),
        ]);

        return back()->with('success', 'Penarikan telah ditolak.');
    }
}
