<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\RekeningBank;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RekeningController extends Controller
{
    public function edit(): Response
    {
        $rekening = RekeningBank::where('user_id', Auth::id())->first();

        return Inertia::render('Mitra/Rekening', [
            'rekening' => $rekening ? [
                'nama_bank' => $rekening->nama_bank,
                'nomor_rekening' => $rekening->nomor_rekening,
                'nama_pemilik' => $rekening->nama_pemilik,
            ] : null,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_bank' => ['required', 'string', 'max:100'],
            'nomor_rekening' => ['required', 'string', 'max:50'],
            'nama_pemilik' => ['required', 'string', 'max:255'],
        ]);

        RekeningBank::updateOrCreate(['user_id' => Auth::id()], $validated);

        return back()->with('success', 'Rekening bank berhasil disimpan.');
    }
}