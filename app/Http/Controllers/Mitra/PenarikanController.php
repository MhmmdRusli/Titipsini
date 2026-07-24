<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Penarikan;
use App\Models\RekeningBank;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PenarikanController extends Controller
{
    private function getSaldoPartner($partner)
    {
        // RUMUS INI DISAMAKAN PERSIS DENGAN DASHBOARD CONTROLLER
        $persenKomisi = 10;
        
        $totalPendapatanKotor = Order::where('partner_id', $partner->id)
            ->whereIn('status', ['selesai', 'completed', 'success'])
            ->sum('total_price');

        $grossBalance = $partner->saldo > 0 ? $partner->saldo : $totalPendapatanKotor;

        // Jika di dashboard kamu pakai potongan komisi 10%, gunakan rumus bawah:
        return $grossBalance * ((100 - $persenKomisi) / 100);
        
        // (Catatan: Kalau di dashboard kamu ternyata tidak pakai potongan komisi, 
        // cukup ubah baris di atas jadi: return $grossBalance;)
    }

    public function index(Request $request): Response
    {
        $partner = Auth::user();
        $tipe = $request->query('tipe', 'semua');
        $dari = $request->query('dari');
        $sampai = $request->query('sampai');

        $saldoUtuh = $this->getSaldoPartner($partner);

        $query = \App\Models\SaldoMutasi::where('user_id', $partner->id)->orderByDesc('created_at');

        if (in_array($tipe, ['penghasilan', 'penarikan'], true)) {
            $query->where('type', $tipe);
        }
        if ($dari) {
            $query->whereDate('created_at', '>=', $dari);
        }
        if ($sampai) {
            $query->whereDate('created_at', '<=', $sampai);
        }

        $mutasi = $query->get()->map(fn ($m) => [
            'id' => $m->id,
            'type' => $m->type,
            'jumlah' => $m->jumlah,
            'deskripsi' => $m->deskripsi,
            'tanggal' => $m->created_at->translatedFormat('d M Y, H:i'),
        ]);

        return Inertia::render('Mitra/Penarikan/Index', [
            'saldo' => $saldoUtuh,
            'mutasi' => $mutasi,
            'filter' => ['tipe' => $tipe, 'dari' => $dari, 'sampai' => $sampai],
        ]);
    }

    public function create(): Response
    {
        $partner = Auth::user();
        
        // Cari rekening berdasarkan user_id (atau ganti partner_id jika kolom di databasemu partner_id)
        $rekening = RekeningBank::where('user_id', $partner->id)->first();

        // Jika tidak ketemu dengan user_id, coba cari dengan partner_id (jaga-jaga)
        if (!$rekening && \Schema::hasColumn('rekening_banks', 'partner_id')) {
            $rekening = RekeningBank::where('partner_id', $partner->id)->first();
        }

        $saldoUtuh = $this->getSaldoPartner($partner);

        return Inertia::render('Mitra/Penarikan/Create', [
            'saldo' => $saldoUtuh,
            'rekening' => $rekening ? [
                'id' => $rekening->id,
                'nama_bank' => $rekening->nama_bank,
                'nomor_rekening' => $rekening->nomor_rekening,
                'nama_pemilik' => $rekening->nama_pemilik,
            ] : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $partner = Auth::user();
        $saldoUtuh = $this->getSaldoPartner($partner);

        $validated = $request->validate([
            'jumlah' => ['required', 'integer', 'min:10000', 'max:'.max($saldoUtuh, 10000)],
            'pin' => ['required', 'string'],
        ], [
            'jumlah.max' => 'Saldo kamu tidak mencukupi untuk jumlah penarikan ini.',
            'jumlah.min' => 'Minimal penarikan adalah Rp10.000.',
        ]);

        if (! $partner->pin || ! Hash::check($validated['pin'], $partner->pin)) {
            return back()->withErrors(['pin' => 'PIN yang kamu masukkan salah.']);
        }

        $rekening = RekeningBank::where('user_id', $partner->id)->first();

        if (! $rekening) {
            return back()->withErrors(['jumlah' => 'Silakan tambahkan rekening bank terlebih dahulu.']);
        }

        $jumlahDiminta = $validated['jumlah'];

        $penarikan = Penarikan::create([
            'user_id' => $partner->id,
            'jumlah' => $jumlahDiminta,
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