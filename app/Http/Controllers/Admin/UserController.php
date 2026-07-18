<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman Pengguna (Manajemen Pelanggan) di panel Admin Titipsini.
 * Lihat BRD bagian "Admin > Customer".
 */
class UserController extends Controller
{
    /**
     * Daftar pelanggan, dengan filter tab status dan search bar.
     * GET /admin/pengguna
     */
    public function index(Request $request): Response
    {
        $request->validate([
            'status' => 'nullable|in:pendaftar,verifikasi_akun,terverifikasi,ditolak',
            'search' => 'nullable|string|max:100',
        ]);

        $users = User::query()
            ->where('role', 'customer')
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('verification_status', $request->status);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->select(['id', 'name', 'phone', 'email', 'verification_status', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Pengguna/Index', [
            'users' => $users,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Detail satu pelanggan (dipakai saat admin klik tombol "Detail").
     * GET /admin/pengguna/{user}
     */
    public function show(User $user): Response
    {
        abort_unless($user->role === 'customer', 404);

        return Inertia::render('Admin/Pengguna/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Update status verifikasi pelanggan (setujui / tolak).
     * PATCH /admin/pengguna/{user}/status
     */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        abort_unless($user->role === 'customer', 404);

        $validated = $request->validate([
            'verification_status' => 'required|in:pendaftar,verifikasi_akun,terverifikasi,ditolak',
            'rejection_reason' => 'nullable|string|required_if:verification_status,ditolak',
        ]);

        $user->update([
            'verification_status' => $validated['verification_status'],
            'rejection_reason' => $validated['verification_status'] === 'ditolak'
                ? $validated['rejection_reason']
                : null,
            'verified_at' => $validated['verification_status'] === 'terverifikasi'
                ? now()
                : $user->verified_at,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Status pengguna berhasil diperbarui.');
    }
}