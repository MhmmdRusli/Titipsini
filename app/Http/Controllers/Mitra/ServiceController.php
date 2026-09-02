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
            'fiturPenuhAktif' => (bool) (($request->user()->fitur_penuh_kategori ?? [])[$layanan->kategori] ?? false),
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

        Service::where('user_id', $user->id)
            ->where('kategori', $kategori)
            ->update(['is_active' => $validated['aktif']]);

        return back()->with('success', $validated['aktif']
            ? 'Fitur Penuh diaktifkan. Semua gudang kembali menerima pesanan.'
            : 'Fitur Penuh dinonaktifkan. Semua gudang otomatis ditutup sementara.'
        );
    }

    /**
     * PATCH /mitra/layanan/{layanan}/toggle-aktif
     */
    public function toggleAktif(Request $request, Service $layanan): RedirectResponse
    {
        $this->authorizeOwnership($request, $layanan);

        $fiturPenuhAktif = (bool) (($request->user()->fitur_penuh_kategori ?? [])[$layanan->kategori] ?? false);

        abort_unless(
            $fiturPenuhAktif,
            400,
            'Aktifkan "Fitur Penuh" untuk kategori ini terlebih dahulu sebelum mengubah status gudang secara manual.'
        );

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

        // Form alamat lahan (dipakai barang & kendaraan, kemungkinan juga
        // bangunan/pindahan) — deteksi lewat keberadaan 'nama_usaha'.
        if (isset($validated['nama_usaha'])) {
            $validated['nama'] = $validated['nama_usaha'];
            $validated['kota'] = $validated['kabupaten_kota'];

            $validated['foto_lahan'] = $request->hasFile('foto_lahan')
                ? $this->simpanFotoLahan($request)
                : [];
        }

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('services', 'public');
        }

        $fiturPenuhAktif = (bool) (($request->user()->fitur_penuh_kategori ?? [])[$validated['kategori']] ?? false);
        $validated['is_active'] = $fiturPenuhAktif;

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
            $this->hapusFotoLahan($layanan);
            $validated['foto_lahan'] = $this->simpanFotoLahan($request);
        } else {
            unset($validated['foto_lahan']);
        }
    }

    // 👇 DITAMBAHKAN: sama seperti store(), untuk kategori Bangunan.
    if ($validated['kategori'] === 'bangunan') {
        $validated['nama'] = $validated['nama_usaha'];
        $validated['status_kepemilikan'] = $validated['status'];
        unset($validated['status']);
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

    protected function simpanFotoLahan(Request $request): array
    {
        $paths = [];

        foreach ($request->file('foto_lahan') as $foto) {
            $paths[] = $foto->store('foto-lahan', 'public');
        }

        return $paths;
    }

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
     * Dua bentuk validasi tergantung form yang dipakai:
     * - Form alamat lahan (barang, kendaraan, dan kategori lain yang sudah
     *   pakai FormAlamatLahanParkir/sejenisnya) — dideteksi dari field
     *   'nama_usaha' yang cuma ada di form ini.
     * - Form generik lama (modal bawaan KategoriLayananView) — masih
     *   dipakai kategori yang belum punya FormKustom.
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

    // 👇 DITAMBAHKAN: kategori Bangunan pakai form Identitas Penjaga,
    // field-nya beda total dari modal standar - dipisah jadi cabang sendiri.
    if ($kategori === 'bangunan') {
        return $request->validate([
            'kategori' => ['required', 'in:bangunan'],
            'jenis_bangunan' => ['nullable', 'in:rumah,apartemen,kosan,gudang,kamar'],
            'nama_usaha' => ['required', 'string', 'max:150'],
            'nama_penjaga' => ['required', 'string', 'max:150'],
            'nomor_telepon' => ['required', 'string', 'max:20'],
            'tanggal_lahir' => ['required', 'string', 'max:20'],
            'provinsi' => ['required', 'string', 'max:100'],
            'kabupaten_kota' => ['required', 'string', 'max:100'],
            'kecamatan' => ['required', 'string', 'max:100'],
            'alamat_lengkap' => ['required', 'string', 'max:500'],
            'status' => ['required', 'in:pemilik,penyewa,pengelola'],
            'upload_berkas' => ['required', 'string', 'max:500'],
        ]);
    }

    // Kendaraan & Pindahan tetap pakai modal standar (KategoriLayananView).
    return $request->validate([
        'kategori' => ['required', 'in:kendaraan,pindahan'],
        'jenis_kendaraan' => [
            'nullable',
            'required_if:kategori,kendaraan',
            'in:motor,mobil,truk,becak,sepeda,bus,mobil_pick_up',
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

    protected function authorizeOwnership(Request $request, Service $service): void
    {
        abort_unless($service->user_id === $request->user()->id, 403);
    }
}