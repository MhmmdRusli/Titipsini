<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Penarikan;
use App\Models\RekeningBank;
use App\Models\SaldoMutasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PenarikanController extends Controller
{
    /**
     * Helper untuk menghitung saldo bersih mitra (dikurangi komisi 10% & penarikan)
     */
    private function getSaldoMitra($userId): int
    {
        // 1. Hitung total pesanan selesai
        $totalKotor = Order::where('partner_id', $userId)
            ->whereIn('status', ['selesai', 'completed', 'success'])
            ->sum('total_price');

        // 2. Potong komisi platform 10% (bersih 90%)
        $saldoBersih = $totalKotor * 0.9;

        // 3. Kurangi dengan total penarikan yang pernah/sedang dilakukan (selain yang ditolak)
        $totalPenarikan = Penarikan::where('user_id', $userId)
            ->whereNotIn('status', ['ditolak', 'rejected', 'failed', 'gagal'])
            ->sum('jumlah');

        return (int) max(0, $saldoBersih - $totalPenarikan);
    }

        public function index(Request $request): Response
    {
        $user = Auth::user();
        $tipe = $request->string('tipe')->toString() ?: 'semua';
        $dari = $request->string('dari')->toString();
        $sampai = $request->string('sampai')->toString();

        $penghasilan = collect();
        if ($tipe === 'semua' || $tipe === 'penghasilan') {
            $penghasilan = SaldoMutasi::where('user_id', $user->id)
                ->where('type', 'penghasilan')
                ->when($dari, fn ($q) => $q->whereDate('created_at', '>=', $dari))
                ->when($sampai, fn ($q) => $q->whereDate('created_at', '<=', $sampai))
                ->get()
                ->map(fn ($m) => [
                    'id' => 'penghasilan-'.$m->id,
                    'type' => 'penghasilan',
                    'deskripsi' => $m->deskripsi,
                    'jumlah' => (int) $m->jumlah,
                    'tanggal' => $m->created_at->translatedFormat('d M Y, H:i'),
                    'created_at' => $m->created_at,
                ]);
        }

        $penarikan = collect();
        if ($tipe === 'semua' || $tipe === 'penarikan') {
            $penarikan = Penarikan::where('user_id', $user->id)
                ->whereNotIn('status', ['ditolak', 'rejected', 'failed', 'gagal'])
                ->when($dari, fn ($q) => $q->whereDate('created_at', '>=', $dari))
                ->when($sampai, fn ($q) => $q->whereDate('created_at', '<=', $sampai))
                ->get()
                ->map(fn ($p) => [
                    'id' => 'penarikan-'.$p->id,
                    'type' => 'penarikan',
                    'deskripsi' => 'Penarikan ke '.$p->nama_bank.' - '.$p->nomor_rekening,
                    'jumlah' => (int) $p->jumlah,
                    'tanggal' => $p->created_at->translatedFormat('d M Y, H:i'),
                    'created_at' => $p->created_at,
                ]);
        }

        $mutasi = $penghasilan->concat($penarikan)
            ->sortByDesc('created_at')
            ->values()
            ->map(fn ($m) => collect($m)->except('created_at')->all());

        return Inertia::render('Mitra/Penarikan/Index', [
            'saldo' => $user->saldoMitra(),
            'mutasi' => $mutasi,
            'filter' => [
                'tipe' => $tipe,
                'dari' => $dari,
                'sampai' => $sampai,
            ],
        ]);
    }

    public function create(): Response
    {
        $user = Auth::user();
        $rekening = RekeningBank::where('user_id', $user->id)->first();

        // Ambil saldo aktual sesuai logika Dashboard
        $saldoAktif = $user->saldoMitra();

        return Inertia::render('Mitra/Penarikan/Create', [
            'saldo' => $saldoAktif,
            'rekening' => $rekening ? [
                'nama_bank' => $rekening->nama_bank,
                'nomor_rekening' => $rekening->nomor_rekening,
                'nama_pemilik' => $rekening->nama_pemilik,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $saldoUser = $user->saldoMitra();

        $validated = $request->validate([
            'jumlah' => ['required', 'integer', 'min:100000', 'max:' . $saldoUser],
            'pin'    => ['required', 'string'],
        ], [
            'jumlah.max' => 'Saldo kamu tidak mencukupi. Saldo tersedia: Rp ' . number_format($saldoUser, 0, ',', '.'),
            'jumlah.min' => 'Minimal penarikan adalah Rp100.000.',
        ]);

        if (! $user->pin || ! Hash::check($validated['pin'], $user->pin)) {
            return back()->withErrors(['pin' => 'PIN yang kamu masukkan salah.']);
        }

        $rekening = RekeningBank::where('user_id', $user->id)->first();

        if (! $rekening) {
            return back()->withErrors(['jumlah' => 'Silakan tambahkan rekening bank terlebih dahulu.']);
        }

        $penarikan = Penarikan::create([
            'user_id'        => $user->id,
            'jumlah'         => $validated['jumlah'],
            'nama_bank'      => $rekening->nama_bank,
            'nomor_rekening' => $rekening->nomor_rekening,
            'nama_pemilik'   => $rekening->nama_pemilik,
            'status'         => 'pending',
        ]);

        return redirect()->route('mitra.penarikan.sukses', $penarikan->id);
    }

    public function sukses(Penarikan $penarikan): Response
    {
        abort_unless($penarikan->user_id === Auth::id(), 403);

        return Inertia::render('Mitra/Penarikan/Sukses', [
            'penarikan' => [
                'id'             => $penarikan->id,
                'jumlah'         => $penarikan->jumlah,
                'nama_bank'      => $penarikan->nama_bank,
                'nomor_rekening' => $penarikan->nomor_rekening,
                'nama_pemilik'   => $penarikan->nama_pemilik,
                'status'         => $penarikan->status,
                'tanggal'        => $penarikan->created_at->translatedFormat('d M Y, H:i'),
            ],
        ]);
    }
}