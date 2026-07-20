<?php
namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Penarikan;
use App\Models\RekeningBank;
use App\Models\SaldoMutasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PenarikanController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $tipe = $request->query('tipe', 'semua');
        $dari = $request->query('dari');
        $sampai = $request->query('sampai');

        $query = SaldoMutasi::where('user_id', $user->id)->orderByDesc('created_at');

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
            'saldo' => $user->saldo,
            'mutasi' => $mutasi,
            'filter' => ['tipe' => $tipe, 'dari' => $dari, 'sampai' => $sampai],
        ]);
    }

    public function create(): Response
    {
        $user = Auth::user();
        $rekening = RekeningBank::where('user_id', $user->id)->first();

        return Inertia::render('Mitra/Penarikan/Create', [
            'saldo' => $user->saldo,
            'rekening' => $rekening ? [
                'nama_bank' => $rekening->nama_bank,
                'nomor_rekening' => $rekening->nomor_rekening,
                'nama_pemilik' => $rekening->nama_pemilik,
            ] : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'jumlah' => ['required', 'integer', 'min:100000', 'max:'.max($user->saldo, 100000)],
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

        $penarikan = DB::transaction(function () use ($user, $validated, $rekening) {
            $penarikan = Penarikan::create([
                'user_id' => $user->id,
                'jumlah' => $validated['jumlah'],
                'nama_bank' => $rekening->nama_bank,
                'nomor_rekening' => $rekening->nomor_rekening,
                'nama_pemilik' => $rekening->nama_pemilik,
                'status' => 'pending',
            ]);

            $user->decrement('saldo', $validated['jumlah']);

            SaldoMutasi::create([
                'user_id' => $user->id,
                'type' => 'penarikan',
                'jumlah' => $validated['jumlah'],
                'deskripsi' => 'Penarikan ke '.$rekening->nama_bank.' •••• '.substr($rekening->nomor_rekening, -4),
                'reference_type' => Penarikan::class,
                'reference_id' => $penarikan->id,
            ]);

            return $penarikan;
        });

        return redirect()->route('partner.penarikan.sukses', $penarikan->id);
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