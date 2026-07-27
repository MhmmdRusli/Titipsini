<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PaymentSetting;
use App\Models\Penarikan;
use App\Models\RekeningBank;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PenarikanController extends Controller
{
    /**
     * Halaman "Detail Saldo" & Riwayat Mutasi
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $tipe = $request->query('tipe', 'semua');
        $dari = $request->query('dari');
        $sampai = $request->query('sampai');

        $paymentSetting = PaymentSetting::current();
        $komisiPersen = (float) ($paymentSetting->komisi_persen ?? 10);

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
                'tanggal' => $m['created_at'] ? $m['created_at']->translatedFormat('d M Y, H:i') : '-',
            ]);

        return Inertia::render('Mitra/Penarikan/Index', [
            'saldo' => $user->saldoMitra(),
            'mutasi' => $mutasi,
            'filter' => ['tipe' => $tipe, 'dari' => $dari, 'sampai' => $sampai],
        ]);
    }

    /**
     * Halaman Kelola Rekening Bank Mitra
     */
    public function indexRekening(): Response
    {
        $user = Auth::user();
        $rekeningList = RekeningBank::where('user_id', $user->id)->get();

        return Inertia::render('Mitra/Rekening/Index', [
            'rekeningList' => $rekeningList,
        ]);
    }

    /**
     * Form Pengajuan Penarikan
     */
    public function create(): Response
    {
        $user = Auth::user();
        $rekeningList = RekeningBank::where('user_id', $user->id)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'nama_bank' => $r->nama_bank,
                'nomor_rekening' => $r->nomor_rekening,
                'nama_pemilik' => $r->nama_pemilik,
            ]);

        $firstRekening = $rekeningList->first();

        return Inertia::render('Mitra/Penarikan/Create', [
            'saldo' => $user->saldoMitra(),
            'initialRekeningList' => $rekeningList,
            'rekening' => $firstRekening,
        ]);
    }

    /**
     * Submit Form Penarikan
     */
    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();
        $saldoTersedia = $user->saldoMitra();

        $validated = $request->validate([
            'jumlah' => ['required', 'integer', 'min:100000', 'max:'.max($saldoTersedia, 100000)],
            'pin' => ['required', 'string'],
            // FIX: nama tabel yang benar adalah "rekening_bank" (singular),
            // bukan "rekening_banks" (default Laravel). Sebelumnya ini
            // menyebabkan 500 error karena query ke tabel yang tidak ada.
            'rekening_bank_id' => ['nullable', 'exists:rekening_bank,id'],
        ], [
            'jumlah.max' => 'Saldo kamu tidak mencukupi untuk jumlah penarikan ini.',
            'jumlah.min' => 'Minimal penarikan adalah Rp100.000.',
            'pin.required' => 'PIN wajib diisi.',
        ]);

        if (! $user->pin || ! Hash::check($validated['pin'], $user->pin)) {
            return back()->withErrors(['pin' => 'PIN yang kamu masukkan salah.']);
        }

        $rekening = null;
        if (! empty($validated['rekening_bank_id'])) {
            $rekening = RekeningBank::where('user_id', $user->id)
                ->where('id', $validated['rekening_bank_id'])
                ->first();
        }

        if (! $rekening) {
            $rekening = RekeningBank::where('user_id', $user->id)->first();
        }

        if (! $rekening) {
            return back()->withErrors(['jumlah' => 'Silakan tambahkan rekening bank terlebih dahulu.']);
        }

        $penarikan = Penarikan::create([
            'user_id' => $user->id,
            'jumlah' => $validated['jumlah'],
            'nama_bank' => $rekening->nama_bank,
            'nomor_rekening' => $rekening->nomor_rekening,
            'nama_pemilik' => $rekening->nama_pemilik,
            'status' => 'pending',
        ]);

        return redirect()->route('mitra.penarikan.sukses', ['penarikan' => $penarikan->id]);
    }

    /**
     * Halaman Penarikan Sukses / Detail Penarikan
     */
    public function sukses(Penarikan $penarikan): Response
    {
        abort_unless($penarikan->user_id === Auth::id(), 403);

        return Inertia::render('Mitra/Penarikan/Sukses', [
            'penarikan' => [
                'id' => $penarikan->id,
                'jumlah' => (float) $penarikan->jumlah,
                'nama_bank' => $penarikan->nama_bank,
                'nomor_rekening' => $penarikan->nomor_rekening,
                'nama_pemilik' => $penarikan->nama_pemilik,
                'status' => $penarikan->status,
                'tanggal' => $penarikan->created_at ? $penarikan->created_at->translatedFormat('d M Y, H:i') : '-',
            ],
        ]);
    }

    /**
     * Tambah Rekening Bank Baru Ke Database
     */
    public function storeRekening(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_bank' => ['required', 'string', 'max:100'],
            'nomor_rekening' => ['required', 'string', 'max:50'],
            'nama_pemilik' => ['required', 'string', 'max:255'],
        ]);

        RekeningBank::create([
            'user_id' => Auth::id(),
            'nama_bank' => $validated['nama_bank'],
            'nomor_rekening' => $validated['nomor_rekening'],
            'nama_pemilik' => $validated['nama_pemilik'],
        ]);

        return back()->with('success', 'Rekening berhasil ditambahkan.');
    }

    /**
     * Update Rekening Bank Di Database
     */
    public function updateRekening(Request $request, RekeningBank $rekening): RedirectResponse
    {
        abort_unless($rekening->user_id === Auth::id(), 403);

        $validated = $request->validate([
            'nama_bank' => ['required', 'string', 'max:100'],
            'nomor_rekening' => ['required', 'string', 'max:50'],
            'nama_pemilik' => ['required', 'string', 'max:255'],
        ]);

        $rekening->update($validated);

        return back()->with('success', 'Rekening berhasil diperbarui.');
    }

    /**
     * Hapus Rekening Bank Dari Database
     */
    public function destroyRekening(RekeningBank $rekening): RedirectResponse
    {
        abort_unless($rekening->user_id === Auth::id(), 403);

        $rekening->delete();

        return back()->with('success', 'Rekening berhasil dihapus.');
    }
}