<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController as AdminAuthenticatedSessionController;
use App\Http\Controllers\Admin\Auth\PasswordResetLinkController as AdminPasswordResetLinkController;
use App\Http\Controllers\Admin\Auth\NewPasswordController as AdminNewPasswordController;
use App\Http\Controllers\Admin\PartnerController as AdminPartnerController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\ProfileController as CustomerProfileController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\KotaController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Customer\LengkapiDataController;
use App\Http\Controllers\WilayahController;
use App\Http\Controllers\Customer\PinController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Customer\ServiceController;
use App\Http\Controllers\Mitra\OnboardingController as MitraOnboardingController;
use App\Http\Controllers\Customer\BeritaController;
use App\Http\Controllers\Customer\NotifikasiController;
use App\Http\Controllers\Customer\NotificationSettingController;
use App\Http\Controllers\Customer\TentangController;
use App\Http\Controllers\Customer\BantuanController;
use App\Http\Controllers\Customer\SecurityController;
use App\Http\Controllers\Mitra\DashboardController as MitraDashboardController;
use App\Http\Controllers\Mitra\OrderController as MitraOrderController;
use App\Http\Controllers\Mitra\NotifikasiController as MitraNotifikasiController;
use App\Http\Controllers\Mitra\ProfileController as MitraProfileController;
use App\Http\Controllers\Mitra\ServiceController as MitraServiceController;
use App\Http\Controllers\Mitra\AlamatController;
use App\Http\Controllers\Mitra\JamOperasionalController;
use App\Http\Controllers\Mitra\RekeningController;
use App\Http\Controllers\Mitra\PenarikanController;
use App\Http\Controllers\Mitra\KeamananController;
use App\Http\Controllers\Mitra\KebijakanPrivasiController;
use App\Http\Controllers\Mitra\BantuanController as MitraBantuanController;
use App\Http\Controllers\Mitra\Auth\RegisteredUserController as MitraRegisteredUserController;
use App\Http\Controllers\Mitra\Auth\AuthenticatedSessionController as MitraAuthenticatedSessionController;
use App\Http\Controllers\Mitra\Auth\PasswordResetLinkController as MitraPasswordResetLinkController;
use App\Http\Controllers\Mitra\Auth\NewPasswordController as MitraNewPasswordController;
use App\Http\Controllers\Mitra\Auth\EmailVerificationPromptController as MitraEmailVerificationPromptController;
use App\Http\Controllers\Mitra\Auth\EmailVerificationNotificationController as MitraEmailVerificationNotificationController;
use App\Http\Controllers\Mitra\Auth\VerifyEmailController as MitraVerifyEmailController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    if (auth()->check()) {
        return match (auth()->user()->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'partner' => redirect()->route('mitra.dashboard'),
            default => redirect()->route('customer.dashboard'),
        };
    }

    return Inertia::render('Onboarding');
})->name('welcome');

// Auth routes (customer login lewat sini; admin & mitra ditolak & diarahkan ke halaman masing-masing)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::get('/forgot-password', [ForgotPasswordController::class, 'showEmailForm'])->name('password.email.form');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp'])->name('password.email.send');
    Route::get('/forgot-password/verify', [ForgotPasswordController::class, 'showVerifyForm'])->name('password.verify.form');
    Route::post('/forgot-password/verify', [ForgotPasswordController::class, 'verifyOtp'])->name('password.verify');
    Route::get('/forgot-password/reset', [ForgotPasswordController::class, 'showResetForm'])->name('password.reset.form');
    Route::post('/forgot-password/reset', [ForgotPasswordController::class, 'resetPassword'])->name('password.reset');
});

Route::middleware('auth')->post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// Login khusus admin -> /admin/login
Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AdminAuthenticatedSessionController::class, 'store']);

    Route::get('/forgot-password', [AdminPasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [AdminPasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('/reset-password/{token}', [AdminNewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [AdminNewPasswordController::class, 'store'])->name('password.store');
});

/*
|--------------------------------------------------------------------------
| Mitra - Onboarding & Auth (belum login)  -> /mitra/*
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->prefix('mitra')->name('mitra.')->group(function () {
    Route::get('/', [MitraOnboardingController::class, 'index'])->name('onboarding');

    Route::get('/daftar', [MitraRegisteredUserController::class, 'create'])->name('register');
    Route::post('/daftar', [MitraRegisteredUserController::class, 'store'])->name('register.store');

    Route::get('/masuk', [MitraAuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/masuk', [MitraAuthenticatedSessionController::class, 'store'])->name('login.store');

    Route::get('/lupa-password', [MitraPasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/lupa-password', [MitraPasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('/reset-password/{token}', [MitraNewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [MitraNewPasswordController::class, 'store'])->name('password.update');
});

// Verifikasi email mitra (butuh login, tapi belum tentu sudah full ke-approve admin)
Route::middleware(['auth'])->prefix('mitra')->name('mitra.')->group(function () {
    Route::get('/verifikasi-email', [MitraEmailVerificationPromptController::class, '__invoke'])
        ->name('verify-email.notice');

    Route::post('/verifikasi-email/kirim-ulang', [MitraEmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verify-email.send');

    Route::get('/registrasi-sukses', [MitraVerifyEmailController::class, 'success'])
        ->name('register.success');
});

Route::get('/mitra/verifikasi-email/{id}/{hash}', [MitraVerifyEmailController::class, 'verify'])
    ->middleware(['auth', 'signed'])
    ->name('mitra.verification.verify');

/*
|--------------------------------------------------------------------------
| Admin routes  -> /admin/* (role: admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/pengguna', [AdminUserController::class, 'index'])->name('pengguna.index');
    Route::get('/pengguna/{user}', [AdminUserController::class, 'show'])->name('pengguna.show');
    Route::patch('/pengguna/{user}/status', [AdminUserController::class, 'updateStatus'])->name('pengguna.updateStatus');

    Route::get('/partners', [AdminPartnerController::class, 'index'])->name('partners.index');
    Route::get('/partners/{partner}', [AdminPartnerController::class, 'show'])->name('partners.show');
    Route::patch('/partners/{partner}/status', [AdminPartnerController::class, 'updateStatus'])->name('partners.updateStatus');

    Route::get('/profil', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profil.edit');
    Route::put('/profil', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profil.update');

    Route::prefix('pengaturan')->name('pengaturan.')->group(function () {
        Route::get('keamanan', [PengaturanController::class, 'keamanan'])->name('keamanan');
        Route::put('keamanan', [PengaturanController::class, 'updateKeamanan'])->name('keamanan.update');
        Route::get('qris', [PengaturanController::class, 'qris'])->name('qris');
        Route::post('qris', [PengaturanController::class, 'updateQris'])->name('qris.update');
    });

    Route::resource('kota', KotaController::class)->except(['show', 'create', 'edit']);

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('export', [ReportController::class, 'export'])->name('export');
        Route::get('{report}', [ReportController::class, 'show'])->name('show');
        Route::put('{report}/suspend', [ReportController::class, 'suspend'])->name('suspend');
        Route::put('{report}/restore', [ReportController::class, 'restore'])->name('restore');
        Route::get('{report}/penangguhan', [ReportController::class, 'penangguhan'])->name('penangguhan');
    });
});

/*
|--------------------------------------------------------------------------
| Mitra routes  -> /mitra/* (role: partner, sudah login)
| Semua digabung jadi SATU grup - sebelumnya kepisah di banyak grup
| terpisah dengan nama 'partner.' yang bahkan ada duplikat /dashboard 3x.
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:partner'])->prefix('mitra')->name('mitra.')->group(function () {
    Route::get('/dashboard', [MitraDashboardController::class, 'index'])->name('dashboard');

    Route::get('/notifikasi', [MitraNotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::patch('/notifikasi/{notifikasi}/read', [MitraNotifikasiController::class, 'markAsRead'])->name('notifikasi.read');
    Route::patch('/notifikasi/tandai-semua', [MitraNotifikasiController::class, 'markAllAsRead'])->name('notifikasi.readAll');

    Route::get('/profil', [MitraProfileController::class, 'index'])->name('profil.index');
    Route::get('/profil/saya', [MitraProfileController::class, 'edit'])->name('profil.edit');
    Route::post('/profil/saya', [MitraProfileController::class, 'update'])->name('profil.update');

    Route::get('/pesanan', [MitraOrderController::class, 'index'])->name('orders.index');
    Route::get('/pesanan/{order}', [MitraOrderController::class, 'show'])->name('orders.show');

    Route::get('/alamat', [AlamatController::class, 'edit'])->name('alamat.edit');
    Route::put('/alamat', [AlamatController::class, 'update'])->name('alamat.update');

    Route::get('/layanan/jam-operasional', [JamOperasionalController::class, 'edit'])->name('jam-operasional.edit');
    Route::put('/layanan/jam-operasional', [JamOperasionalController::class, 'update'])->name('jam-operasional.update');

    // Kelola Layanan (Barang/Bangunan/Kendaraan/Pindahan) yang partner tawarkan
    Route::resource('layanan', MitraServiceController::class)->except(['show', 'create', 'edit']);

    Route::get('/rekening', [RekeningController::class, 'edit'])->name('rekening.edit');
    Route::put('/rekening', [RekeningController::class, 'update'])->name('rekening.update');

    Route::get('/pendapatan/penarikan', [PenarikanController::class, 'index'])->name('penarikan.index');
    Route::get('/pendapatan/penarikan/tarik', [PenarikanController::class, 'create'])->name('penarikan.create');
    Route::post('/pendapatan/penarikan', [PenarikanController::class, 'store'])->name('penarikan.store');
    Route::get('/pendapatan/penarikan/{penarikan}/sukses', [PenarikanController::class, 'sukses'])->name('penarikan.sukses');

    Route::get('/keamanan', [KeamananController::class, 'edit'])->name('keamanan.edit');
    Route::put('/keamanan', [KeamananController::class, 'update'])->name('keamanan.update');

    Route::get('/kebijakan-privasi', [KebijakanPrivasiController::class, 'index'])->name('kebijakan-privasi.index');

    Route::get('/bantuan', [MitraBantuanController::class, 'index'])->name('bantuan.index');
});

/*
|--------------------------------------------------------------------------
| Customer routes  -> /app/* (role: customer)
| Digabung jadi SATU grup juga - sebelumnya kepisah di banyak grup terpisah
| dengan prefix & name yang sama persis.
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
    Route::get('/services/barang/paket-pilihan', [ServiceController::class, 'pilihPaket'])
    ->name('services.barang.pilihPaket');
    Route::get('/services/barang', [ServiceController::class, 'formBarang'])->name('services.barang.form');
    Route::post('/services/barang', [ServiceController::class, 'simpanBarang'])->name('services.barang.store');
    Route::get('/services/barang/pemesanan', [ServiceController::class, 'pemesanan'])
    ->name('services.barang.pemesanan');
    Route::post('/services/barang/konfirmasi', [ServiceController::class, 'konfirmasiPesanan'])
    ->name('services.barang.konfirmasi');
    Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');

    Route::get('/orders', [CustomerOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [CustomerOrderController::class, 'show'])->name('orders.show');

    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::patch('/notifikasi/{notifikasi}/read', [NotifikasiController::class, 'markAsRead'])->name('notifikasi.read');

    Route::get('/profile', [CustomerProfileController::class, 'index'])->name('profile.index');

    Route::get('/profile/notifikasi', [NotificationSettingController::class, 'edit'])->name('profile.notifikasi.edit');
    Route::patch('/profile/notifikasi', [NotificationSettingController::class, 'update'])->name('profile.notifikasi.update');

    Route::get('/profile/bantuan', [BantuanController::class, 'index'])->name('profile.bantuan');

    Route::get('/profile/tentang', [TentangController::class, 'index'])->name('profile.tentang');
    Route::get('/profile/tentang/syarat-ketentuan', [TentangController::class, 'syaratKetentuan'])->name('profile.tentang.syarat');
    Route::get('/profile/tentang/kebijakan-privasi', [TentangController::class, 'kebijakanPrivasi'])->name('profile.tentang.privasi');

    Route::get('/profile/keamanan', [SecurityController::class, 'edit'])->name('profile.keamanan');
    Route::put('/profile/keamanan/password', [SecurityController::class, 'updatePassword'])->name('profile.keamanan.password');
    Route::put('/profile/keamanan/pin', [SecurityController::class, 'updatePin'])->name('profile.keamanan.pin');
});

// Rute Lengkapi Data: user baru (status pendaftar) tetap bisa akses, tanpa role:customer
Route::middleware(['auth'])->prefix('lengkapi-data')->name('customer.lengkapi-data.')->group(function () {
    Route::get('/', [LengkapiDataController::class, 'intro'])->name('intro');
    Route::get('/form', [LengkapiDataController::class, 'form'])->name('form');
    Route::post('/', [LengkapiDataController::class, 'store'])->name('store');
});

// Wilayah & Pin
Route::get('/api/wilayah/provinces', [WilayahController::class, 'provinces']);
Route::get('/api/wilayah/regencies/{provinceId}', [WilayahController::class, 'regencies']);
Route::get('/api/wilayah/districts/{regencyId}', [WilayahController::class, 'districts']);

Route::middleware(['auth', 'role:customer'])->prefix('buat-pin')->name('customer.pin.')->group(function () {
    Route::get('/', [PinController::class, 'create'])->name('create');
    Route::post('/', [PinController::class, 'store'])->name('store');
});