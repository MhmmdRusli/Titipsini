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
     * GET /mitra/layanan/{layanan}
     */
    public function show(Request $request, Service $layanan): Response
    {
        $this->authorizeOwnership($request, $layanan);

        $layanan->foto_url = $layanan->foto ? Storage::url($layanan->foto) : null;

        return Inertia::render('Mitra/Layanan/Detail', [
            'layanan' => $layanan,
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
            'fiturPenuhAktif' => (bool) (($request->user()->fitur_penuh_kategori ?? [])[$kategori] ?? false),
            'edit' => $request->query('edit'),
        ]);
    }

        /**
     * PATCH /mitra/layanan/{kategori}/fitur-penuh
     * Aktif/nonaktifkan fitur "tutup otomatis saat penuh" untuk 1 kategori layanan.
     */
    public function toggleFiturPenuh(Request $request, string $kategori): RedirectResponse
{
    abort_unless(in_array($kategori, ['barang', 'kendaraan', 'bangunan', 'pindahan']), 404);

    $validated = $request->validate([
        'aktif' => ['required', 'boolean'],
    ]);

    $user = $request->user();
    $pengaturan = $user->fitur_penuh_kategori ?? [];
    $pengaturan[$kategori] = $validated['aktif'];
    $user->update(['fitur_penuh_kategori' => $pengaturan]);

    return back()->with('success', 'Pengaturan fitur berhasil diperbarui.');
}


    /**
 * PATCH /mitra/layanan/{layanan}/toggle-aktif
 * Buka/tutup manual 1 gudang/layanan tertentu (terpisah dari fitur "tutup otomatis saat penuh").
 */
    public function toggleAktif(Request $request, Service $layanan): RedirectResponse
    {
        $this->authorizeOwnership($request, $layanan);

        $layanan->update(['is_active' => ! $layanan->is_active]);

        return back()->with('success', $layanan->is_active
            ? 'Layanan berhasil diaktifkan kembali.'
            : 'Layanan berhasil ditutup sementara.'
        );
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

            $validated['foto_lahan'] = $request->hasFile('foto_lahan')
                ? $this->simpanFotoLahan($request)
                : [];
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

        $validated = $this->validated($request, isUpdate: true);

        if ($validated['kategori'] === 'barang') {
            $validated['nama'] = $validated['nama_usaha'];

            if ($request->hasFile('foto_lahan')) {
                // Ada foto baru diupload -> hapus foto lama, ganti dengan yang baru.
                $this->hapusFotoLahan($layanan);
                $validated['foto_lahan'] = $this->simpanFotoLahan($request);
            } else {
                // Tidak ada foto baru -> jangan sentuh foto yang sudah ada.
                unset($validated['foto_lahan']);
            }
        }

        $validated['verification_status'] = 'pending';
        $validated['rejection_reason'] = null;

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

        $this->hapusFotoLahan($layanan);

        $layanan->delete();

        return redirect()->back()->with('success', 'Layanan berhasil dihapus.');
    }

    /**
     * Simpan semua file foto_lahan yang diupload, kembalikan array path-nya.
     */
    protected function simpanFotoLahan(Request $request): array
    {
        $paths = [];

        foreach ($request->file('foto_lahan') as $foto) {
            $paths[] = $foto->store('foto-lahan', 'public');
        }

        return $paths;
    }

    /**
     * Hapus semua file foto_lahan milik layanan dari storage.
     */
    protected function hapusFotoLahan(Service $layanan): void
    {
        if (! is_array($layanan->foto_lahan)) {
            return;
        }

        foreach ($layanan->foto_lahan as $path) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Validasi berbeda tergantung kategori:
     * - barang        -> field alamat gudang lengkap (provinsi/kabupaten/kecamatan/dst)
     * - kendaraan/bangunan/pindahan -> field lama (nama, kota, kecamatan, harga, foto)
     */
    protected function validated(Request $request, bool $isUpdate = false): array
    {
        $kategori = $request->input('kategori');

        if ($kategori === 'barang') {
            $fotoLahanRule = $isUpdate
                ? ['nullable', 'array', 'max:8']
                : ['required', 'array', 'min:1', 'max:8'];

            return $request->validate([
                'kategori' => ['required', 'in:barang,bangunan,kendaraan,pindahan'],
                'nama_usaha' => ['required', 'string', 'max:150'],
                'provinsi' => ['required', 'string', 'max:100'],
                'kabupaten_kota' => ['required', 'string', 'max:100'],
                'kecamatan' => ['required', 'string', 'max:100'],
                'alamat_lengkap' => ['required', 'string', 'max:500'],
                'catatan_alamat' => ['nullable', 'string', 'max:500'],
                'foto_lahan' => $fotoLahanRule,
                'foto_lahan.*' => ['image', 'max:5120'],
                'panjang' => ['required', 'integer', 'min:1'],
                'lebar' => ['required', 'integer', 'min:1'],
                'jumlah_tampung' => ['required', 'integer', 'min:1'],
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