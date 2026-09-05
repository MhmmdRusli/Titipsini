<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman "User" di panel Super Admin Titipsini: Customer, Vendor,
 * Finance, Admin, dan form "Tambah Akun".
 *
 * PENTING: Vendor BUKAN model terpisah — sama seperti di
 * Admin\PartnerController, vendor adalah User dengan role='partner'.
 * (Versi sebelumnya controller ini salah asumsi memakai model Partner
 * tersendiri — sudah diperbaiki di sini.)
 */
class UserController extends Controller
{
    /* ─────────────────────────────────────────────
       CUSTOMER
    ───────────────────────────────────────────── */

    public function customerIndex(Request $request): Response
    {
        $request->validate([
            'status' => 'nullable|in:pendaftar,verifikasi_akun,terverifikasi,ditolak',
            'search' => 'nullable|string|max:100',
        ]);

        $users = User::query()
            ->where('role', 'customer')
            ->when($request->filled('status'), fn ($q) => $q->where('verification_status', $request->status))
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->search;
                $q->where(function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->select(['id', 'name', 'phone', 'email', 'verification_status', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SuperAdmin/User/CustomerIndex', [
            'users' => $users,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function customerShow(User $user): Response
    {
        abort_unless($user->role === 'customer', 404);

        $user->load(['ordersAsCustomer' => function ($query) {
            $query->select(['id', 'customer_id', 'order_code', 'service_type', 'total_price', 'status', 'created_at'])
                ->latest();
        }]);

        return Inertia::render('SuperAdmin/User/CustomerShow', [
            'user' => $user,
        ]);
    }

    public function updateCustomerStatus(Request $request, User $user): RedirectResponse
    {
        abort_unless($user->role === 'customer', 404);

        $validated = $request->validate([
            'verification_status' => 'required|in:pendaftar,verifikasi_akun,terverifikasi,ditolak',
            'rejection_reason' => 'nullable|string|required_if:verification_status,ditolak',
        ]);

        $user->update([
            'verification_status' => $validated['verification_status'],
            'rejection_reason' => $validated['verification_status'] === 'ditolak' ? $validated['rejection_reason'] : null,
            'verified_at' => $validated['verification_status'] === 'terverifikasi' ? now() : $user->verified_at,
        ]);

        return redirect()->back()->with('success', 'Status customer berhasil diperbarui.');
    }

    /* ─────────────────────────────────────────────
       VENDOR (MITRA)
       Sama seperti Admin\PartnerController: vendor = User dengan
       role='partner'. Parameter route tetap dinamai {partner} untuk
       konsistensi URL/penamaan, tapi type-hint-nya User — Laravel route
       model binding otomatis resolve berdasarkan primary key, nama
       parameter tidak harus sama dengan nama class model.
    ───────────────────────────────────────────── */

    public function vendorIndex(Request $request): Response
    {
        $request->validate([
            'status' => 'nullable|in:pendaftar,verifikasi_akun,terverifikasi,ditolak,ditangguhkan',
            'search' => 'nullable|string|max:100',
        ]);

        $partners = User::query()
            ->where('role', 'partner')
            ->when($request->filled('status'), function ($q) use ($request) {
                if ($request->status === 'ditangguhkan') {
                    $q->whereNotNull('suspended_at');
                } else {
                    $q->where('verification_status', $request->status)->whereNull('suspended_at');
                }
            })
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->search;
                $q->where(function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->select(['id', 'name', 'phone', 'email', 'city', 'verification_status', 'suspended_at', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SuperAdmin/User/VendorIndex', [
            'partners' => $partners,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function vendorShow(User $partner): Response
    {
        abort_unless($partner->role === 'partner', 404);

        $partner->load('services');

        return Inertia::render('SuperAdmin/User/VendorShow', [
            'partner' => $partner,
        ]);
    }

    /**
     * PATCH /super-admin/user/vendor/{partner}/status
     * Setujui / tolak / tangguhkan identitas vendor — persis logic
     * Admin\PartnerController@updateStatus.
     */
    public function updateVendorStatus(Request $request, User $partner): RedirectResponse
    {
        abort_unless($partner->role === 'partner', 404);

        $validated = $request->validate([
            'verification_status' => 'required|in:pendaftar,verifikasi_akun,terverifikasi,ditolak,ditangguhkan',
            'rejection_reason' => 'nullable|string|required_if:verification_status,ditolak,ditangguhkan',
        ]);

        $partner->update([
            'verification_status' => $validated['verification_status'],
            'rejection_reason' => in_array($validated['verification_status'], ['ditolak', 'ditangguhkan'], true)
                ? $validated['rejection_reason']
                : null,
            'suspended_at' => $validated['verification_status'] === 'ditangguhkan' ? now() : null,
            'verified_at' => $validated['verification_status'] === 'terverifikasi' ? now() : $partner->verified_at,
        ]);

        return redirect()->back()->with('success', 'Status identitas vendor berhasil diperbarui.');
    }

    /**
     * PATCH /super-admin/user/vendor/{partner}/services/{service}/status
     * Setujui / tolak validasi lahan satu layanan vendor — persis logic
     * Admin\PartnerController@updateServiceStatus.
     */
    public function updateVendorServiceStatus(Request $request, User $partner, Service $service): RedirectResponse
    {
        abort_unless($partner->role === 'partner', 404);
        abort_unless($service->user_id === $partner->id, 403);

        $validated = $request->validate([
            'verification_status' => 'required|in:pendaftar,verifikasi_akun,terverifikasi,ditolak,ditangguhkan',
            'rejection_reason' => 'nullable|string|required_if:verification_status,ditolak,ditangguhkan',
        ]);

        $service->update([
            'verification_status' => $validated['verification_status'],
            'rejection_reason' => in_array($validated['verification_status'], ['ditolak', 'ditangguhkan'], true)
                ? $validated['rejection_reason']
                : null,
        ]);

        return redirect()->back()->with('success', 'Status validasi lahan berhasil diperbarui.');
    }

    /**
     * PATCH /super-admin/user/vendor/{partner}/restore
     * Pulihkan akun vendor yang ditangguhkan — persis logic
     * Admin\PartnerController@restore.
     */
    public function restoreVendor(User $partner): RedirectResponse
    {
        abort_unless($partner->role === 'partner', 404);

        $partner->update([
            'suspended_at' => null,
            'restoration_requested_at' => null,
            'rejection_reason' => null,
            'verification_status' => 'terverifikasi',
        ]);

        return redirect()->back()->with('success', 'Akun vendor berhasil dipulihkan.');
    }

    /* ─────────────────────────────────────────────
       FINANCE (staf internal, tanpa alur verifikasi)
    ───────────────────────────────────────────── */

    public function financeIndex(Request $request): Response
    {
        $request->validate(['search' => 'nullable|string|max:100']);

        $users = $this->staffQuery('finance', $request)->paginate(10)->withQueryString();

        return Inertia::render('SuperAdmin/User/FinanceIndex', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function financeShow(User $user): Response
    {
        abort_unless($user->role === 'finance', 404);

        return Inertia::render('SuperAdmin/User/FinanceShow', [
            'user' => $user,
        ]);
    }

    /* ─────────────────────────────────────────────
       ADMIN (staf internal, tanpa alur verifikasi)
    ───────────────────────────────────────────── */

    public function adminIndex(Request $request): Response
    {
        $request->validate(['search' => 'nullable|string|max:100']);

        $users = $this->staffQuery('admin', $request)->paginate(10)->withQueryString();

        return Inertia::render('SuperAdmin/User/AdminIndex', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function adminShow(User $user): Response
    {
        abort_unless($user->role === 'admin', 404);

        return Inertia::render('SuperAdmin/User/AdminShow', [
            'user' => $user,
        ]);
    }

    private function staffQuery(string $role, Request $request)
    {
        return User::query()
            ->where('role', $role)
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->search;
                $q->where(function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->select(['id', 'name', 'phone', 'email', 'is_active', 'created_at'])
            ->orderBy('created_at', 'desc');
    }

    public function toggleActive(User $user): RedirectResponse
    {
        abort_unless(in_array($user->role, ['finance', 'admin'], true), 404);

        $user->update(['is_active' => ! $user->is_active]);

        return redirect()->back()->with(
            'success',
            $user->is_active ? 'Akun diaktifkan kembali.' : 'Akun dinonaktifkan.'
        );
    }

    /* ─────────────────────────────────────────────
       TAMBAH AKUN
    ───────────────────────────────────────────── */

    public function create(): Response
    {
        return Inertia::render('SuperAdmin/User/AccountCreate');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:finance,admin',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        return redirect()
            ->route('super-admin.user.' . $validated['role'] . '.index')
            ->with('success', 'Akun ' . $validated['role'] . ' baru berhasil dibuat.');
    }
        public function destroy(User $user): RedirectResponse
    {
        abort_if($user->role === 'super_admin', 403, 'Akun Super Admin tidak dapat dihapus.');
        abort_if($user->id === auth()->id(), 403, 'Anda tidak dapat menghapus akun Anda sendiri.');

        $user->delete();

        return redirect()->back()->with('success', 'Akun berhasil dipindahkan ke Sampah.');
    }
}