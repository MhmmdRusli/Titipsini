<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Penarikan;
use App\Models\SaldoMutasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
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
            ->through(function (Penarikan $item) {
                $user = $item->user;
                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'user' => $user,
                    'jumlah' => (float) $item->jumlah,
                    'nama_bank' => $item->nama_bank,
                    'nomor_rekening' => $item->nomor_rekening,
                    'nama_pemilik' => $item->nama_pemilik,
                    'status' => $item->status,
                    'catatan' => $item->catatan,
                    'created_at' => $item->created_at?->format('d M Y H:i'),
                    'processed_at' => $item->processed_at?->format('d M Y H:i'),
                    'utang_refund' => $user ? $user->utangRefund() : 0,
                    'potensi_utang_refund' => $user ? $user->potensiUtangRefund() : 0,
                    'utang_refund_dipotong' => (int) ($item->utang_refund_dipotong ?? 0),
                    'jumlah_dikirim' => (int) ($item->jumlah_dikirim ?? 0),
                ];
            })
            ->withQueryString();

        return Inertia::render('Finance/Penarikan/Index', [
            'penarikan' => $penarikan,
            'filter' => ['status' => $status],
            'hasAnyRefundDebt' => (bool) \App\Models\Order::whereNotNull('refund_amount')->where('refund_amount', '>', 0)->exists(),
        ]);
    }

    public function approve(Penarikan $penarikan): RedirectResponse
    {
        abort_unless($penarikan->status === 'pending', 400, 'Penarikan ini sudah diproses sebelumnya.');

        DB::transaction(function () use ($penarikan) {
            $user = $penarikan->user;
            $user->refresh();

            $jumlahPenarikan = (int) preg_replace('/[^0-9]/', '', (string) $penarikan->jumlah);
            
            // Hitung utang refund mitra (aktual + potensi) - single query
            $utangDetails = $user->utangRefundDetails();
            $utangRefund = max($utangDetails['utang_refund'], $utangDetails['potensi_utang_refund']);

            // Jumlah yang akan dikirim ke rekening (dikurangi utang refund)
            $jumlahDikirim = $jumlahPenarikan - $utangRefund;
            
            if ($jumlahDikirim <= 0) {
                throw ValidationException::withMessages([
                    'approve' => "Jumlah penarikan (Rp " . number_format($jumlahPenarikan, 0, ',', '.') . ") lebih kecil atau sama dengan utang refund (Rp " . number_format($utangRefund, 0, ',', '.') . "). Tidak ada dana yang dikirim.",
                ]);
            }

            $saldoTersediaUntukPenarikanIni = $user->saldoMitra();

            if ($saldoTersediaUntukPenarikanIni < $jumlahPenarikan) {
                throw ValidationException::withMessages([
                    'approve' => "Saldo mitra tidak mencukupi lagi. (Saldo: Rp " . number_format($saldoTersediaUntukPenarikanIni, 0, ',', '.') . ", Penarikan: Rp " . number_format($jumlahPenarikan, 0, ',', '.') . ")",
                ]);
            }

            // Catat mutasi penarikan penuh (untuk tracking)
            SaldoMutasi::create([
                'user_id' => $user->id,
                'type' => 'penarikan',
                'jumlah' => $jumlahPenarikan,
                'deskripsi' => 'Penarikan ke '.$penarikan->nama_bank.' •••• '.substr($penarikan->nomor_rekening, -4)
                    .($utangRefund > 0 ? " (dipotong utang refund Rp " . number_format($utangRefund, 0, ',', '.') . ")" : ''),
                'reference_type' => Penarikan::class,
                'reference_id' => $penarikan->id,
            ]);

            // Jika ada utang refund, catat mutasi pengembalian utang
            if ($utangRefund > 0) {
                SaldoMutasi::create([
                    'user_id' => $user->id,
                    'type' => 'penarikan',
                    'jumlah' => -$utangRefund,
                    'deskripsi' => 'Potongan utang refund dari penarikan ke '.$penarikan->nama_bank,
                    'reference_type' => Penarikan::class,
                    'reference_id' => $penarikan->id,
                ]);
            }

            $penarikan->update([
                'status' => 'selesai',
                'processed_at' => now(),
                'utang_refund_dipotong' => $utangRefund,
                'jumlah_dikirim' => $jumlahDikirim,
                'catatan' => $utangRefund > 0 
                    ? ($penarikan->catatan ? $penarikan->catatan . "\n" : '') . "Dipotong utang refund: Rp " . number_format($utangRefund, 0, ',', '.') . ". Dikirim ke rekening: Rp " . number_format($jumlahDikirim, 0, ',', '.')
                    : $penarikan->catatan,
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
