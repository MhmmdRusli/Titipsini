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
 * Finance, Admin, dan form "Tambah Akun" — sesuai grup menu di
 * SuperAdminLayout.jsx.
 *
 * Customer & Vendor memakai alur verifikasi (KTP/lahan) yang sudah ada
 * (verification_status). Finance & Admin adalah akun staf internal
 * biasa, jadi tidak melalui alur verifikasi — cukup aktif/nonaktif.
 */
class UserController extends Controller
{
    /* ─────────────────────────────────────────────
       CUSTOMER
    ───────────────────────────────────────────── */

    /**
     * GET /super-admin/user/customer
     */
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

    /**
     * GET /super-admin/user/customer/{user}
     */
    public function customerShow(User $user): Response
    {
        abort_unless($user->role === 'customer', 404);

        // Relasi camelCase (ordersAsCustomer) otomatis diserialisasi
        // Laravel jadi snake_case (orders_as_customer) saat dikirim ke
        // Inertia — sesuai field yang dibaca CustomerShow.jsx.
        $user->load(['ordersAsCustomer' => function ($query) {
            $query->select(['id', 'customer_id', 'order_code', 'service_type', 'total_price', 'status', 'created_at'])
                ->latest();
        }]);

        return Inertia::render('SuperAdmin/User/CustomerShow', [
            'user' => $user,
        ]);
    }

    /**
     * PATCH /super-admin/user/customer/{user}/status
     */
    public function updateCustomerStatus(Request $request, User $user): RedirectResponse
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

        return redirect()->back()->with('success', 'Status customer berhasil diperbarui.');
    }

    /* ─────────────────────────────────────────────
       VENDOR (MITRA)
       Vendor disimpan sebagai baris tabel `users` dengan
       role='partner' — sama seperti Admin\PartnerController.
       TIDAK ada model Partner terpisah, jadi query & update di
       sini memakai User::where('role', 'partner') supaya tetap
       satu sumber data yang sama dengan panel Admin biasa.
    ───────────────────────────────────────────── */

    /**
     * GET /super-admin/user/vendor
     */
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
                    $q->whereNull('suspended_at')->where('verification_status', $request->status);
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

    /**
     * GET /super-admin/user/vendor/{partner}
     */
    public function vendorShow(User $partner): Response
    {
        abort_unless($partner->role === 'partner', 404);

        $partner->load('services');

        return Inertia::render('SuperAdmin/User/VendorShow', [
            'partner' => $partner,
        ]);
    }

    /**
     * Update status verifikasi identitas / penangguhan vendor.
     * PATCH /super-admin/user/vendor/{partner}/status
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

        return redirect()->back()->with('success', 'Status identitas vendor berhasil diperbarui.');
    }

    /**
     * Update status verifikasi layanan/lahan milik vendor.
     * PATCH /super-admin/user/vendor/{partner}/services/{service}/status
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
            'rejection_reason' => in_array($validated['verification_status'], ['ditolak', 'ditangguhkan'])
                ? $validated['rejection_reason']
                : null,
        ]);

        return redirect()->back()->with('success', 'Status validasi lahan berhasil diperbarui.');
    }

    /**
     * Memulihkan akun vendor yang ditangguhkan.
     * PATCH /super-admin/user/vendor/{partner}/restore
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

    /**
     * GET /super-admin/user/finance
     */
    public function financeIndex(Request $request): Response
    {
        $request->validate(['search' => 'nullable|string|max:100']);

        $users = $this->staffQuery('finance', $request)->paginate(10)->withQueryString();

        return Inertia::render('SuperAdmin/User/FinanceIndex', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * GET /super-admin/user/finance/{user}
     */
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

    /**
     * GET /super-admin/user/admin
     */
    public function adminIndex(Request $request): Response
    {
        $request->validate(['search' => 'nullable|string|max:100']);

        $users = $this->staffQuery('admin', $request)->paginate(10)->withQueryString();

        return Inertia::render('SuperAdmin/User/AdminIndex', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * GET /super-admin/user/admin/{user}
     */
    public function adminShow(User $user): Response
    {
        abort_unless($user->role === 'admin', 404);

        return Inertia::render('SuperAdmin/User/AdminShow', [
            'user' => $user,
        ]);
    }

    /**
     * Query dasar untuk daftar staf internal (finance/admin) — nggak
     * ada tab status karena akun staf cukup aktif/nonaktif, bukan
     * alur verifikasi identitas seperti customer/vendor.
     */
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

    /**
     * Aktifkan / nonaktifkan akun staf (finance/admin). Dipakai lewat
     * tombol toggle di FinanceShow.jsx / AdminShow.jsx.
     * PATCH /super-admin/user/{user}/toggle-active
     */
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
       Form untuk membuat akun staf baru (finance/admin) — dipicu dari
       tombol "Tambah Akun" di sidebar. Sengaja dibatasi hanya boleh
       membuat role finance/admin: akun customer & vendor dibuat lewat
       alur registrasi masing-masing (bukan dibuatkan manual di sini).
    ───────────────────────────────────────────── */

    /**
     * GET /super-admin/user/tambah
     */
    public function create(): Response
    {
        return Inertia::render('SuperAdmin/User/AccountCreate');
    }

    /**
     * POST /super-admin/user/tambah
     */
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
}