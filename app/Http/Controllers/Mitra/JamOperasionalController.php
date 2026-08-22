<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class JamOperasionalController extends Controller
{
    private const HARI_LIST = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

    public function edit(): Response
    {
        $user = Auth::user();

        return Inertia::render('Mitra/JamOperasional', [
            'jamOperasional' => $user->jadwal_operasional ?? [],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        // 1. Validasi struktur dasar dulu (longgar, belum cek jam)
        $validator = Validator::make($request->all(), [
            'jadwal' => ['required', 'array'],
            'jadwal.*.aktif' => ['required', 'boolean'],
            'jadwal.*.slots' => ['required', 'array'],
            'jadwal.*.slots.*.aktif' => ['required', 'boolean'],
            'jadwal.*.slots.*.jam_buka' => ['nullable', 'date_format:H:i'],
            'jadwal.*.slots.*.jam_tutup' => ['nullable', 'date_format:H:i'],
        ]);

        $validator->after(function ($validator) use ($request) {
            $jadwal = $request->input('jadwal', []);

            foreach (self::HARI_LIST as $hari) {
                $hariData = $jadwal[$hari] ?? null;

                // Kalau hari itu tidak dikirim atau memang dimatikan, tidak perlu cek jam sama sekali
                if (! $hariData || empty($hariData['aktif'])) {
                    continue;
                }

                $slots = $hariData['slots'] ?? [];

                foreach ($slots as $index => $slot) {
                    // Slot yang nonaktif juga tidak wajib diisi jamnya
                    if (empty($slot['aktif'])) {
                        continue;
                    }

                    $jamBuka = $slot['jam_buka'] ?? null;
                    $jamTutup = $slot['jam_tutup'] ?? null;

                    if (empty($jamBuka)) {
                        $validator->errors()->add("jadwal.$hari.slots.$index.jam_buka", 'Jam buka wajib diisi.');
                    }

                    if (empty($jamTutup)) {
                        $validator->errors()->add("jadwal.$hari.slots.$index.jam_tutup", 'Jam tutup wajib diisi.');
                    }

                    if ($jamBuka && $jamTutup && $jamTutup <= $jamBuka) {
                        $validator->errors()->add("jadwal.$hari.slots.$index.jam_tutup", 'Jam tutup harus lebih besar dari jam buka.');
                    }
                }
            }
        });

        $validated = $validator->validate();

        // 2. Bersihkan data: hanya key hari yang valid, buang field "id" (dipakai React key doang)
        $jadwal = collect($validated['jadwal'])
            ->only(self::HARI_LIST)
            ->map(function ($hari) {
                return [
                    'aktif' => (bool) $hari['aktif'],
                    'slots' => collect($hari['slots'])->map(fn ($slot) => [
                        'jam_buka' => $slot['jam_buka'] ?? null,
                        'jam_tutup' => $slot['jam_tutup'] ?? null,
                        'aktif' => (bool) $slot['aktif'],
                    ])->values()->all(),
                ];
            })
            ->all();

        $user->update([
            'jadwal_operasional' => $jadwal,
        ]);

        return back()->with('success', 'Jam operasional berhasil diperbarui.');
    }
}