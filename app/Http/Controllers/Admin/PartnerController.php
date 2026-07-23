<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman Mitra (Manajemen Vendor) di panel Admin Titipsini.
 * Lihat BRD bagian "Admin > Vendor".
 */
class PartnerController extends Controller
{
    /**
     * Daftar mitra, dengan filter tab status dan search bar.
     * GET /admin/partners
     */
    public function index(Request $request): Response
    {
        $request->validate([
            'status' => 'nullable|in:pendaftar,verifikasi_akun,terverifikasi,ditolak,ditangguhkan',
            'search' => 'nullable|string|max:100',
        ]);

        $partners = User::query()
            ->where('role', 'partner')
            ->when($request->filled('status'), function ($query) use ($request) {
                if ($request->status === 'ditangguhkan') {
                    // Filter berdasarkan kolom suspended_at
                    $query->whereNotNull('suspended_at');
                } else {
                    // Filter standar berdasarkan verification_status untuk tab lainnya
                    $query->where('verification_status', $request->status)
                          ->whereNull('suspended_at');
                }
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            // Tambahkan 'suspended_at' ke dalam select agar terbaca oleh frontend
            ->select(['id', 'name', 'phone', 'email', 'city', 'verification_status', 'suspended_at', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Mitra/Index', [
            'partners' => $partners,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Detail satu mitra (dipakai saat admin klik tombol "Detail").
     * GET /admin/partners/{partner}
     */
    public function show(User $partner): Response
    {
        abort_unless($partner->role === 'partner', 404);

        return Inertia::render('Admin/Mitra/Show', [
            'partner' => $partner,
        ]);
    }

    /**
     * Update status verifikasi / penangguhan mitra.
     * PATCH /admin/partners/{partner}/status
     */
    public function updateStatus(Request $request, User $partner): RedirectResponse
    {
        abort_unless($partner->role === 'partner', 404);

        $validated = $request->validate([
            'verification_status' => 'required|in:pendaftar,verifikasi_akun,terverifikasi,ditolak,ditangguhkan',
            'rejection_reason' => 'nullable|string|required_if:verification_status,ditolak,ditangguhkan',
        ]);

        $partner->update([
            'verification_status' => $validated['verification_status'],
            'rejection_reason' => in_array($validated['verification_status'], ['ditolak', 'ditangguhkan'])
                ? $validated['rejection_reason']
                : null,
            'verified_at' => $validated['verification_status'] === 'terverifikasi'
                ? now()
                : $partner->verified_at,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Status mitra berhasil diperbarui.');
    }
}