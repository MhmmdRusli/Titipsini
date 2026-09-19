<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Penarikan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PenarikanSaldoController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'semua');
        $search = trim((string) $request->query('search', ''));

        $query = Penarikan::query()
            ->with('user:id,name,email');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_rekening', 'like', "%{$search}%")
                  ->orWhere('nama_pemilik', 'like', "%{$search}%")
                  ->orWhere('nama_bank', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($userQuery) => $userQuery->where('name', 'like', "%{$search}%"));
            });
        }

        if ($status !== 'semua') {
            $query->where('status', $status);
        }

        $withdrawals = $query->latest()->paginate(15)->through(function (Penarikan $item) {
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
                'utang_refund_dipotong' => (int) ($item->utang_refund_dipotong ?? 0),
                'jumlah_dikirim' => (int) ($item->jumlah_dikirim ?? 0),
            ];
        })->withQueryString();

        $summary = [
            'pending' => Penarikan::where('status', 'pending')->count(),
            'selesai' => Penarikan::where('status', 'selesai')->count(),
            'ditolak' => Penarikan::where('status', 'ditolak')->count(),
            'total_pending_amount' => (int) Penarikan::where('status', 'pending')->sum('jumlah'),
        ];

        return Inertia::render('SuperAdmin/PenarikanSaldo/Index', [
            'withdrawals' => $withdrawals,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'summary' => $summary,
        ]);
    }
}
