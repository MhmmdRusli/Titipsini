<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Penarikan;
use App\Models\RekeningBank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PenarikanController extends Controller
{
    /**
     * Halaman "Detail Saldo". Saldo & riwayat dibangun LANGSUNG dari tabel
     * `orders` (penghasilan) dan `penarikan` (penarikan) — bukan dari
     * `saldo_mutasi` — supaya selalu konsisten dengan User::saldoMitra()
     * yang dipakai Admin\PenarikanController::approve() untuk validasi.
     *
     * CATATAN: sempat ada versi duplikat method index() ini hasil merge
     * git yang membaca "penghasilan" dari tabel `saldo_mutasi`. Versi itu
     * SENGAJA dibuang karena `saldo_mutasi` cuma diisi untuk type
     * 'penarikan' (lihat Admin\PenarikanController::approve()), tidak
     * pernah untuk 'penghasilan' — kalau dipakai, sisi penghasilan akan
     * selalu tampil kosong walau saldo aslinya tidak kosong.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $tipe = $request->query('tipe', 'semua');
        $dari = $request->query('dari');
        $sampai = $request->query('sampai');

        $komisiPersen = (float) (\App\Models\PaymentSetting::current()->komisi_persen ?? 10);

        // Sisi "penghasilan": order milik mitra ini yang statusnya selesai
        $ordersQuery = Order::where('partner_id', $user->id)
            ->whereIn('status', ['selesai', 'completed', 'success']);

        if ($dari) {
            $ordersQuery->whereDate('created_at', '>=', $dari);
        }
        if ($sampai) {
            $ordersQuery->whereDate('created_at', '<=', $sampai);
        }

        $penghasilan = $ordersQuery->get()->map(fn ($order) => [
            'id' => 'order-'.$order->id,
            'type' => 'penghasilan',
            'jumlah' => (float) $order->total_price * (1 - $komisiPersen / 100),
            'deskripsi' => 'Pendapatan dari pesanan '.$order->order_code,
            'created_at' => $order->created_at,
        ]);

        // Sisi "penarikan": semua penarikan mitra ini yang belum ditolak
        $penarikanQuery = Penarikan::where('user_id', $user->id)
            ->whereNotIn('status', ['ditolak', 'rejected', 'failed', 'gagal']);

        if ($dari) {
            $penarikanQuery->whereDate('created_at', '>=', $dari);
        }
        if ($sampai) {
            $penarikanQuery->whereDate('created_at', '<=', $sampai);
        }

        $penarikan = $penarikanQuery->get()->map(fn ($p) => [
            'id' => 'penarikan-'.$p->id,
            'type' => 'penarikan',
            'jumlah' => (float) $p->jumlah,
            'deskripsi' => 'Penarikan ke '.$p->nama_bank.' •••• '.substr($p->nomor_rekening, -4)
                .($p->status === 'pending' ? ' (menunggu diproses)' : ''),
            'created_at' => $p->created_at,
        ]);

        $mutasi = $penghasilan->concat($penarikan);

        if (in_array($tipe, ['penghasilan', 'penarikan'], true)) {
            $mutasi = $mutasi->where('type', $tipe);
        }

        $mutasi = $mutasi
            ->sortByDesc('created_at')
            ->values()
            ->map(fn ($m) => [
                'id' => $m['id'],
                'type' => $m['type'],
                'jumlah' => $m['jumlah'],
                'deskripsi' => $m['deskripsi'],
                'tanggal' => $m['created_at']->translatedFormat('d M Y, H:i'),
            ]);

        return Inertia::render('Mitra/Penarikan/Index', [
            'saldo' => $user->saldoMitra(),
            'mutasi' => $mutasi,
            'filter' => ['tipe' => $tipe, 'dari' => $dari, 'sampai' => $sampai],
        ]);
    }

    public function create(): Response
    {
        $user = Auth::user();
        $rekening = RekeningBank::where('user_id', $user->id)->first();

        return Inertia::render('Mitra/Penarikan/Create', [
            'saldo' => $user->saldoMitra(),
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
        $saldoTersedia = $user->saldoMitra();

        $validated = $request->validate([
            'jumlah' => ['required', 'integer', 'min:100000', 'max:'.max($saldoTersedia, 100000)],
            'pin' => ['required', 'string'],
        ], [
            'jumlah.max' => 'Saldo kamu tidak mencukupi untuk jumlah penarikan ini.',
            'jumlah.min' => 'Minimal penarikan adalah Rp100.000.',
        ]);

        if (! $user->pin || ! Hash::check($validated['pin'], $user->pin)) {
            return back()->withErrors(['pin' => 'PIN yang kamu masukkan salah.']);
        }

        $rekening = RekeningBank::where('user_id', $user->id)->first();

        if (! $rekening) {
            return back()->withErrors(['jumlah' => 'Silakan tambahkan rekening bank terlebih dahulu.']);
        }

        // Saldo TIDAK dipotong di sini — cuma bikin pengajuan 'pending'.
        // Begitu status bukan 'ditolak' (termasuk masih 'pending'), saldo
        // yang dihitung saldoMitra() otomatis "berkurang" karena memang
        // dihitung ulang dari tabel `penarikan` tiap kali dipanggil.
        // Admin\PenarikanController::approve() cuma perlu ubah status,
        // tidak perlu (dan tidak boleh) potong kolom saldo manapun lagi.
        $penarikan = Penarikan::create([
            'user_id' => $user->id,
            'jumlah' => $validated['jumlah'],
            'nama_bank' => $rekening->nama_bank,
            'nomor_rekening' => $rekening->nomor_rekening,
            'nama_pemilik' => $rekening->nama_pemilik,
            'status' => 'pending',
        ]);

        return redirect()->route('mitra.penarikan.sukses', $penarikan->id);
    }

    public function sukses(Penarikan $penarikan): Response
    {
        abort_unless($penarikan->user_id === Auth::id(), 403);

        return Inertia::render('Mitra/Penarikan/Sukses', [
            'penarikan' => [
                'id' => $penarikan->id,
                'jumlah' => $penarikan->jumlah,
                'nama_bank' => $penarikan->nama_bank,
                'nomor_rekening' => $penarikan->nomor_rekening,
                'nama_pemilik' => $penarikan->nama_pemilik,
                'status' => $penarikan->status,
                'tanggal' => $penarikan->created_at->translatedFormat('d M Y, H:i'),
            ],
        ]);
    }
}