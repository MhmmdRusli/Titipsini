<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\RekeningBank;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RekeningController extends Controller
{
    public function edit(Request $request): Response
    {
        $rekening = RekeningBank::where('user_id', Auth::id())
            ->orderByDesc('utama')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Mitra/Rekening', [
            'rekening' => $rekening,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_bank' => ['required', 'string', 'max:100'],
            'nomor_rekening' => ['required', 'string', 'max:50', 'unique:rekening_bank,nomor_rekening'],
            'nama_pemilik' => ['required', 'string', 'max:255'],
            'utama' => ['nullable', 'boolean'],
        ]);

        $userId = Auth::id();
        $jadikanUtama = (bool) ($validated['utama'] ?? false);

        $sudahPunyaRekening = RekeningBank::where('user_id', $userId)->exists();
        if (! $sudahPunyaRekening) {
            $jadikanUtama = true;
        }

        DB::transaction(function () use ($userId, $validated, $jadikanUtama) {
            if ($jadikanUtama) {
                RekeningBank::where('user_id', $userId)->update(['utama' => false]);
            }

            RekeningBank::create([
                'user_id' => $userId,
                'nama_bank' => $validated['nama_bank'],
                'nomor_rekening' => $validated['nomor_rekening'],
                'nama_pemilik' => $validated['nama_pemilik'],
                'utama' => $jadikanUtama,
            ]);
        });

        return back()->with('success', 'Rekening bank berhasil ditambahkan.');
    }

    // Langkah 1 alur UBAH: validasi data baru, simpan sementara di session,
    // kirim kode verifikasi ke email, tampilkan halaman verifikasi.
    // Rekening BELUM diubah di sini.
    public function verifikasi(Request $request, $id): Response
    {
        $rekening = RekeningBank::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'nama_bank' => ['required', 'string', 'max:100'],
            'nomor_rekening' => [
                'required',
                'string',
                'max:50',
                Rule::unique('rekening_bank', 'nomor_rekening')->ignore($rekening->id),
            ],
            'nama_pemilik' => ['required', 'string', 'max:255'],
            'utama' => ['nullable', 'boolean'],
        ]);

        $user = Auth::user();
        $this->buatDanKirimKode($rekening->id, $validated, $user->email);

        return Inertia::render('Mitra/VerifikasiRekening', [
            'rekeningId' => $rekening->id,
            'email' => $user->email,
        ]);
    }

    public function verifikasiKirimUlang(Request $request, $id): RedirectResponse
    {
        $rekening = RekeningBank::where('user_id', Auth::id())->findOrFail($id);

        $dataPending = session('ubah_rekening_pending');
        $idPending = session('ubah_rekening_id');

        if (! $dataPending || (int) $idPending !== (int) $rekening->id) {
            return back()->withErrors(['kode' => 'Sesi verifikasi tidak ditemukan, silakan ulangi dari awal.']);
        }

        $user = Auth::user();
        $this->buatDanKirimKode($rekening->id, $dataPending, $user->email);

        return back()->with('success', 'Kode verifikasi baru telah dikirim.');
    }

    // Langkah 2: cek kode. Kalau benar, baru di sini rekening di-update.
    public function verifikasiKonfirmasi(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'kode' => ['required', 'string'],
        ]);

        $rekening = RekeningBank::where('user_id', Auth::id())->findOrFail($id);

        $kodeTersimpan = session('ubah_rekening_kode');
        $kadaluarsa = session('ubah_rekening_kode_expired');
        $dataPending = session('ubah_rekening_pending');
        $idPending = session('ubah_rekening_id');

        if (! $kodeTersimpan || ! $dataPending || (int) $idPending !== (int) $rekening->id) {
            return back()->withErrors(['kode' => 'Sesi verifikasi tidak ditemukan, silakan ulangi dari awal.']);
        }

        if (now()->greaterThan($kadaluarsa)) {
            return back()->withErrors(['kode' => 'Kode verifikasi sudah kedaluwarsa, silakan kirim ulang.']);
        }

        if ((string) $request->kode !== (string) $kodeTersimpan) {
            return back()->withErrors(['kode' => 'Kode verifikasi salah.']);
        }

        $jadikanUtama = (bool) ($dataPending['utama'] ?? false);

        DB::transaction(function () use ($rekening, $dataPending, $jadikanUtama) {
            if ($jadikanUtama) {
                RekeningBank::where('user_id', $rekening->user_id)
                    ->where('id', '!=', $rekening->id)
                    ->update(['utama' => false]);
            }

            $rekening->update([
                'nama_bank' => $dataPending['nama_bank'],
                'nomor_rekening' => $dataPending['nomor_rekening'],
                'nama_pemilik' => $dataPending['nama_pemilik'],
                'utama' => $jadikanUtama,
            ]);
        });

        session()->forget([
            'ubah_rekening_pending',
            'ubah_rekening_id',
            'ubah_rekening_kode',
            'ubah_rekening_kode_expired',
        ]);

        return redirect('/mitra/rekening')->with('success', 'Rekening bank berhasil diubah.');
    }

    public function destroy($id): RedirectResponse
    {
        $rekening = RekeningBank::where('user_id', Auth::id())->findOrFail($id);
        $userId = $rekening->user_id;
        $adalahUtama = $rekening->utama;

        $rekening->delete();

        if ($adalahUtama) {
            $penggantiUtama = RekeningBank::where('user_id', $userId)->orderBy('created_at')->first();
            $penggantiUtama?->update(['utama' => true]);
        }

        return back()->with('success', 'Rekening bank berhasil dihapus.');
    }

    private function buatDanKirimKode(int $rekeningId, array $dataPending, string $email): string
    {
        $kode = (string) random_int(100000, 999999);

        session([
            'ubah_rekening_pending' => $dataPending,
            'ubah_rekening_id' => $rekeningId,
            'ubah_rekening_kode' => $kode,
            'ubah_rekening_kode_expired' => now()->addMinutes(5),
        ]);

        Mail::raw("Kode verifikasi ubah rekening bank Anda: {$kode}. Kode berlaku 5 menit.", function ($message) use ($email) {
            $message->to($email)->subject('Kode Verifikasi Ubah Rekening - Titipsini');
        });

        return $kode;
    }
}