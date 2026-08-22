<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\RekeningBank;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RekeningController extends Controller
{
    /**
     * Menampilkan halaman daftar rekening bank milik mitra.
     * Rekening utama selalu ditampilkan paling atas.
     */
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

    /**
     * Menyimpan rekening bank baru (mitra bisa punya lebih dari satu).
     */
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

        // Kalau ini rekening PERTAMA milik mitra, otomatis jadi utama walau checkbox tidak dicentang
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

    /**
     * Memperbarui rekening bank berdasarkan ID.
     */
    public function update(Request $request, $id): RedirectResponse
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

        $jadikanUtama = (bool) ($validated['utama'] ?? false);

        DB::transaction(function () use ($rekening, $validated, $jadikanUtama) {
            if ($jadikanUtama) {
                RekeningBank::where('user_id', $rekening->user_id)
                    ->where('id', '!=', $rekening->id)
                    ->update(['utama' => false]);
            }

            $rekening->update([
                'nama_bank' => $validated['nama_bank'],
                'nomor_rekening' => $validated['nomor_rekening'],
                'nama_pemilik' => $validated['nama_pemilik'],
                'utama' => $jadikanUtama,
            ]);
        });

        return back()->with('success', 'Rekening bank berhasil diperbarui.');
    }

    /**
     * Menghapus rekening bank. Kalau yang dihapus adalah rekening utama
     * dan mitra masih punya rekening lain, otomatis promosikan salah satu
     * rekening tersisa jadi rekening utama baru.
     */
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
}