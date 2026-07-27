<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\RekeningBank;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class RekeningController extends Controller
{
    /**
     * Menyimpan rekening bank baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_bank' => ['required', 'string', 'max:100'],
            'nomor_rekening' => ['required', 'string', 'max:50', 'unique:rekening_bank,nomor_rekening'],
            'nama_pemilik' => ['required', 'string', 'max:255'],
        ]);

        // Simpan data rekening baru dengan relasi user_id
        RekeningBank::create([
            'user_id' => Auth::id(),
            'nama_bank' => $validated['nama_bank'],
            'nomor_rekening' => $validated['nomor_rekening'],
            'nama_pemilik' => $validated['nama_pemilik'],
        ]);

        return back()->with('success', 'Rekening bank berhasil ditambahkan.');
    }

    /**
     * Memperbarui rekening bank berdasarkan ID.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        // Pastikan rekening yang diubah adalah milik user yang sedang login
        $rekening = RekeningBank::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'nama_bank' => ['required', 'string', 'max:100'],
            'nomor_rekening' => [
                'required', 
                'string', 
                'max:50', 
                Rule::unique('rekening_bank', 'nomor_rekening')->ignore($rekening->id)
            ],
            'nama_pemilik' => ['required', 'string', 'max:255'],
        ]);

        $rekening->update($validated);

        return back()->with('success', 'Rekening bank berhasil diperbarui.');
    }
}