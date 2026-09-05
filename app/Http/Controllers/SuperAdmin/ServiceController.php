<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman "Layanan" di panel Super Admin: daftar SEMUA layanan dari
 * SEMUA vendor (lintas kategori: barang, kendaraan, bangunan, pindahan),
 * beda dengan Mitra\ServiceController yang cuma menampilkan layanan
 * milik satu mitra yang sedang login.
 *
 * Aksi verifikasi (approve/reject) sengaja dibuatkan endpoint sendiri di
 * sini (bukan pakai Admin\PartnerController@updateServiceStatus) supaya
 * Super Admin bisa langsung bertindak dari daftar lintas-vendor tanpa
 * harus masuk ke halaman detail mitra satu-satu.
 */
class ServiceController extends Controller
{
    private const KATEGORI = ['barang', 'kendaraan', 'bangunan', 'pindahan'];
    private const STATUS = ['pendaftar', 'verifikasi_akun', 'terverifikasi', 'ditolak', 'ditangguhkan'];

    /**
     * GET /super-admin/layanan
     */
    public function index(Request $request): Response
    {
        $request->validate([
            'kategori' => 'nullable|in:' . implode(',', self::KATEGORI),
            'status' => 'nullable|in:' . implode(',', self::STATUS),
            'search' => 'nullable|string|max:100',
        ]);

        $layanan = Service::query()
            ->with('user:id,name,email,phone')
            ->when($request->filled('kategori'), fn ($q) => $q->where('kategori', $request->kategori))
            ->when($request->filled('status'), fn ($q) => $q->where('verification_status', $request->status))
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->search;
                $q->where(function ($q2) use ($search) {
                    $q2->where('nama', 'like', "%{$search}%")
                        ->orWhere('nama_usaha', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q3) use ($search) {
                            $q3->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->select(['id', 'user_id', 'kategori', 'nama', 'nama_usaha', 'kota', 'harga', 'is_active', 'verification_status', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SuperAdmin/Layanan/Index', [
            'layanan' => $layanan,
            'filters' => $request->only(['kategori', 'status', 'search']),
        ]);
    }

    /**
     * GET /super-admin/layanan/{layanan}
     */
    public function show(Service $layanan): Response
    {
        $layanan->load('user:id,name,email,phone,city');
        $layanan->foto_url = $layanan->foto ? Storage::url($layanan->foto) : null;

        if ($layanan->kategori === 'barang' && is_array($layanan->foto_lahan)) {
            $layanan->foto_lahan_url = array_map(fn ($path) => Storage::url($path), $layanan->foto_lahan);
        }

        return Inertia::render('SuperAdmin/Layanan/Show', [
            'layanan' => $layanan,
        ]);
    }

    /**
     * PATCH /super-admin/layanan/{layanan}/status
     * Approve / tolak / tangguhkan satu layanan.
     */
    public function updateStatus(Request $request, Service $layanan): RedirectResponse
    {
        $validated = $request->validate([
            'verification_status' => 'required|in:' . implode(',', self::STATUS),
            'rejection_reason' => 'nullable|string|required_if:verification_status,ditolak,ditangguhkan',
        ]);

        $layanan->update([
            'verification_status' => $validated['verification_status'],
            'rejection_reason' => in_array($validated['verification_status'], ['ditolak', 'ditangguhkan'], true)
                ? $validated['rejection_reason']
                : null,
        ]);

        return redirect()->back()->with('success', 'Status verifikasi layanan berhasil diperbarui.');
    }

    /**
     * PATCH /super-admin/layanan/{layanan}/toggle-active
     * Buka/tutup paksa satu layanan. Beda dari Mitra\ServiceController@toggleAktif:
     * Super Admin TIDAK terikat aturan "Fitur Penuh" milik mitra — ini
     * override langsung, dipakai untuk kasus darurat (mis. laporan
     * pelanggan, penyalahgunaan layanan).
     */
    public function toggleActive(Service $layanan): RedirectResponse
    {
        $layanan->update(['is_active' => ! $layanan->is_active]);

        return redirect()->back()->with(
            'success',
            $layanan->is_active ? 'Layanan diaktifkan kembali.' : 'Layanan ditutup paksa oleh Super Admin.'
        );
    }
        public function destroy(Service $layanan): RedirectResponse
    {
        $layanan->delete();

        return redirect()->back()->with('success', 'Layanan berhasil dipindahkan ke Sampah.');
    }
}