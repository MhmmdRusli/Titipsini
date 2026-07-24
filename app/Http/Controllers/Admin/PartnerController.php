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
            'suspended_at' => $validated['verification_status'] === 'ditangguhkan'
                ? now()
                : null,
            'verified_at' => $validated['verification_status'] === 'terverifikasi'
                ? now()
                : $partner->verified_at,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Status mitra berhasil diperbarui.');
    }

    /**
     * Memulihkan akun mitra yang ditangguhkan.
     * PATCH /admin/partners/{partner}/restore
     */
    public function restore(User $partner): RedirectResponse
    {
        abort_unless($partner->role === 'partner', 404);

        $partner->update([
            'suspended_at' => null,
            'restoration_requested_at' => null,
            'rejection_reason' => null,
            'verification_status' => 'terverifikasi',
        ]);

        return redirect()
            ->back()
            ->with('success', 'Akun mitra berhasil dipulihkan.');
    }

    /**
     * Menghapus satu data mitra.
     * DELETE /admin/partners/{partner}
     */
    public function destroy(User $partner): RedirectResponse
    {
        abort_unless($partner->role === 'partner', 404);

        $partner->delete();

        return redirect()
            ->back()
            ->with('success', 'Data mitra berhasil dihapus.');
    }

    /**
     * Menghapus banyak data mitra sekaligus (Bulk Delete).
     * POST /admin/partners/bulk-destroy
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id',
        ]);

        User::where('role', 'partner')
            ->whereIn('id', $request->ids)
            ->delete();

        return redirect()
            ->back()
            ->with('success', 'Data mitra terpilih berhasil dihapus.');
    }

    /**
     * Menampilkan halaman peringatan penangguhan untuk mitra yang login.
     * GET /mitra/ditangguhkan
     */
    public function suspendedNotice(): Response|RedirectResponse
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'partner' || !$user->suspended_at) {
            return redirect('/mitra/dashboard');
        }

        return Inertia::render('Auth/SuspendedNotice', [
            'reason' => $user->rejection_reason,
            'alreadyRequested' => (bool) $user->restoration_requested_at,
        ]);
    }

    /**
     * Menangani permintaan pemulihan akun dari mitra yang ditangguhkan.
     * POST /mitra/ajukan-pemulihan
     */
    public function requestRestoration(Request $request): RedirectResponse
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'partner') {
            return redirect()->route('login');
        }

        if (! $user->restoration_requested_at) {
            $user->update(['restoration_requested_at' => now()]);
        }

        return back()->with('success', 'Permintaan pemulihan akun berhasil dikirim ke administrator.');
    }
}