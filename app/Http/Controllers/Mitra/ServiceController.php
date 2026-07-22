<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * GET /mitra/layanan
     */
    public function index(Request $request): Response
{
    $layanan = Service::query()
        ->where('user_id', $request->user()->id)
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($item) {
            $item->foto_url = $item->foto ? \Illuminate\Support\Facades\Storage::url($item->foto) : null;
            return $item;
        });

    return Inertia::render('Mitra/Layanan/Index', [
        'layanan' => $layanan,
        'daftarKota' => \App\Models\Kota::where('is_active', true)->orderBy('nama')->pluck('nama'),
    ]);
}

    /**
     * POST /mitra/layanan
     */
    public function store(Request $request): RedirectResponse
{
    $validated = $this->validated($request);

    if ($request->hasFile('foto')) {
        $validated['foto'] = $request->file('foto')->store('services', 'public');
    }

    $request->user()->services()->create($validated);

    return redirect()->back()->with('success', 'Layanan berhasil ditambahkan.');
}

    /**
     * PUT /mitra/layanan/{service}
     */
    public function update(Request $request, Service $layanan): RedirectResponse
{
    $this->authorizeOwnership($request, $layanan);

    $validated = $this->validated($request);

    if ($request->hasFile('foto')) {
        if ($layanan->foto) {
            \Illuminate\Support\Facades\Storage::delete($layanan->foto);
        }
        $validated['foto'] = $request->file('foto')->store('services', 'public');
    }

    $layanan->update($validated);

    return redirect()->back()->with('success', 'Layanan berhasil diperbarui.');
}

    /**
     * DELETE /mitra/layanan/{service}
     */
    public function destroy(Request $request, Service $layanan): RedirectResponse
{
    $this->authorizeOwnership($request, $layanan);

    if ($layanan->foto) {
        \Illuminate\Support\Facades\Storage::delete($layanan->foto);
    }

    $layanan->delete();

    return redirect()->back()->with('success', 'Layanan berhasil dihapus.');
}

    protected function validated(Request $request): array
{
    return $request->validate([
        'kategori' => ['required', 'in:barang,bangunan,kendaraan,pindahan'],
        'jenis_kendaraan' => [
            'nullable',
            'required_if:kategori,kendaraan',
            'in:motor,mobil,truk,becak,sepeda,bus,mobil_pick_up',
        ],
        'jenis_bangunan' => [
            'nullable',
            'required_if:kategori,bangunan',
            'in:rumah,apartemen,kosan,gudang,kamar',
        ],
        'nama' => ['required', 'string', 'max:150'],
        'kota' => ['required', 'string', 'max:100', \Illuminate\Validation\Rule::exists('kota', 'nama')->where('is_active', true)],
        'kecamatan' => ['required', 'string', 'max:100'],
        'harga' => ['nullable', 'numeric', 'min:0'],
        'is_active' => ['boolean'],
        'foto' => ['nullable', 'image', 'max:2048'],
    ], [
        'kota.exists' => 'Kota belum terdaftar atau tidak aktif. Hubungi Admin untuk menambahkan kota ini.',
    ]);
}

    // Mencegah partner mengedit/menghapus layanan milik partner lain lewat
    // manipulasi ID di request.
    protected function authorizeOwnership(Request $request, Service $service): void
    {
        abort_unless($service->user_id === $request->user()->id, 403);
    }
}