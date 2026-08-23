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

class PayoutController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'pending');
        $allowedStatuses = ['pending', 'selesai', 'ditolak', 'semua'];

        if (! in_array($status, $allowedStatuses, true)) {
            $status = 'pending';
        }

        $payouts = Penarikan::with('user:id,name,email')
            ->when($status !== 'semua', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Finance/Payouts/Index', [
            'payouts' => $payouts,
            'filter' => ['status' => $status],
        ]);
    }

    public function approve(Penarikan $payout): RedirectResponse
    {
        DB::transaction(function () use ($payout) {
            $payout = Penarikan::query()->lockForUpdate()->findOrFail($payout->id);
            abort_unless($payout->status === 'pending', 400, 'Penarikan ini sudah diproses sebelumnya.');

            $user = $payout->user()->lockForUpdate()->firstOrFail();
            $amount = (int) $payout->jumlah;
            $availableBeforePayout = $user->saldoMitra() + $amount;

            if ($availableBeforePayout < $amount) {
                abort(422, 'Saldo mitra tidak mencukupi untuk payout ini.');
            }

            SaldoMutasi::create([
                'user_id' => $user->id,
                'type' => 'penarikan',
                'jumlah' => $amount,
                'deskripsi' => 'Payout ke '.$payout->nama_bank.' •••• '.substr($payout->nomor_rekening, -4),
                'reference_type' => Penarikan::class,
                'reference_id' => $payout->id,
            ]);

            $payout->update([
                'status' => 'selesai',
                'processed_at' => now(),
            ]);
        });

        return back()->with('success', 'Payout berhasil disetujui dan dicatat pada saldo mutasi.');
    }

    public function reject(Request $request, Penarikan $payout): RedirectResponse
    {
        $validated = $request->validate([
            'catatan' => ['nullable', 'string', 'max:255'],
        ]);

        $updated = Penarikan::query()
            ->whereKey($payout->id)
            ->where('status', 'pending')
            ->update([
                'status' => 'ditolak',
                'catatan' => $validated['catatan'] ?? null,
                'processed_at' => now(),
            ]);

        abort_unless($updated, 400, 'Penarikan ini sudah diproses sebelumnya.');

        return back()->with('success', 'Payout telah ditolak. Saldo mutasi tidak dibuat.');
    }
}
