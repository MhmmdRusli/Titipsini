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
            ->get();

        return Inertia::render('Mitra/Layanan/Index', [
            'layanan' => $layanan,
        ]);
    }

    /**
     * POST /mitra/layanan
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);

        $request->user()->services()->create($validated);

        return redirect()->back()->with('success', 'Layanan berhasil ditambahkan.');
    }

    /**
     * PUT /mitra/layanan/{service}
     */
    public function update(Request $request, Service $service): RedirectResponse
    {
        $this->authorizeOwnership($request, $service);

        $validated = $this->validated($request);

        $service->update($validated);

        return redirect()->back()->with('success', 'Layanan berhasil diperbarui.');
    }

    /**
     * DELETE /mitra/layanan/{service}
     */
    public function destroy(Request $request, Service $service): RedirectResponse
    {
        $this->authorizeOwnership($request, $service);

        $service->delete();

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
            'kota' => ['required', 'string', 'max:100'],
            'kecamatan' => ['required', 'string', 'max:100'],
            'harga' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);
    }

    // Mencegah partner mengedit/menghapus layanan milik partner lain lewat
    // manipulasi ID di request.
    protected function authorizeOwnership(Request $request, Service $service): void
    {
        abort_unless($service->user_id === $request->user()->id, 403);
    }
}