<?php

namespace App\Http\Controllers\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
                $item->foto_url = $item->foto ? Storage::url($item->foto) : null;
                return $item;
            });

        return Inertia::render('Mitra/Layanan/Index', [
            'layanan' => $layanan,
            'daftarKota' => \App\Models\Kota::where('is_active', true)->orderBy('nama')->pluck('nama'),
        ]);
    }

    /**
     * GET /mitra/layanan/{kategori}
     * Menampilkan halaman kelola khusus 1 kategori (barang/kendaraan/bangunan/pindahan)
     */
    public function kategori(Request $request, string $kategori): Response
    {
        $halamanPerKategori = [
            'barang' => 'Mitra/Layanan/KelolaBarang',
            'kendaraan' => 'Mitra/Layanan/KelolaKendaraan',
            'bangunan' => 'Mitra/Layanan/KelolaBangunan',
            'pindahan' => 'Mitra/Layanan/KelolaPickUp',
        ];

        abort_unless(array_key_exists($kategori, $halamanPerKategori), 404);

        $layanan = Service::query()
            ->where('user_id', $request->user()->id)
            ->where('kategori', $kategori)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->foto_url = $item->foto ? Storage::url($item->foto) : null;
                return $item;
            });

        return Inertia::render($halamanPerKategori[$kategori], [
            'layanan' => $layanan,
            'daftarKota' => \App\Models\Kota::where('is_active', true)->orderBy('nama')->pluck('nama'),
            'menungguVerifikasi' => false,
        ]);
    }

    /**
     * POST /mitra/layanan
     */
        public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);

        // Kategori 'barang' tidak punya field 'nama' terpisah di form -
        // pakai nama_usaha sebagai nilainya, karena kolom 'nama' di
        // tabel services wajib diisi (NOT NULL).
        if ($validated['kategori'] === 'barang') {
            $validated['nama'] = $validated['nama_usaha'];
        }

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

        if ($validated['kategori'] === 'barang') {
            $validated['nama'] = $validated['nama_usaha'];
        }

        if ($request->hasFile('foto')) {
            if ($layanan->foto) {
                Storage::delete($layanan->foto);
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
            Storage::delete($layanan->foto);
        }

        $layanan->delete();

        return redirect()->back()->with('success', 'Layanan berhasil dihapus.');
    }

    /**
     * Validasi berbeda tergantung kategori:
     * - barang        -> field alamat gudang lengkap (provinsi/kabupaten/kecamatan/dst)
     * - kendaraan/bangunan/pindahan -> field lama (nama, kota, kecamatan, harga, foto)
     */
    protected function validated(Request $request): array
    {
        $kategori = $request->input('kategori');

        if ($kategori === 'barang') {
            return $request->validate([
                'kategori' => ['required', 'in:barang,bangunan,kendaraan,pindahan'],
                'nama_usaha' => ['required', 'string', 'max:150'],
                'provinsi' => ['required', 'string', 'max:100'],
                'kabupaten_kota' => ['required', 'string', 'max:100'],
                'kecamatan' => ['required', 'string', 'max:100'],
                'alamat_lengkap' => ['required', 'string', 'max:500'],
                'catatan_alamat' => ['nullable', 'string', 'max:500'],
                'foto_lahan' => ['required', 'string', 'max:500'],
                'panjang' => ['required', 'integer', 'min:1'],
                'lebar' => ['required', 'integer', 'min:1'],
            ]);
        }

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