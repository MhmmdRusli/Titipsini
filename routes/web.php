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
use App\Http\Controllers\Mitra\AlamatController;
use App\Http\Controllers\Mitra\JamOperasionalController;
use App\Http\Controllers\Mitra\RekeningController;
use App\Http\Controllers\Mitra\PenarikanController;
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
            'partner' => redirect('/mitra/dashboard'),
            default => redirect()->route('customer.dashboard'),
        };
    }

    return Inertia::render('Onboarding');
})->name('welcome');

// Auth routes (customer & partner login lewat sini; admin ditolak & diarahkan ke /admin/login)
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

    // Lupa password khusus admin
    Route::get('/forgot-password', [AdminPasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [AdminPasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('/reset-password/{token}', [AdminNewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [AdminNewPasswordController::class, 'store'])->name('password.store');
});

// Onboarding & auth publik khusus mitra -> /mitra/*
Route::middleware('guest')->prefix('mitra')->name('mitra.')->group(function () {
    Route::get('/', [MitraOnboardingController::class, 'index'])->name('onboarding');

    Route::get('/daftar', [\App\Http\Controllers\Mitra\Auth\RegisteredUserController::class, 'create'])->name('register');
    Route::post('/daftar', [\App\Http\Controllers\Mitra\Auth\RegisteredUserController::class, 'store'])->name('register.store');

    Route::get('/masuk', [\App\Http\Controllers\Mitra\Auth\AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/masuk', [\App\Http\Controllers\Mitra\Auth\AuthenticatedSessionController::class, 'store'])->name('login.store');

    Route::get('/lupa-password', [\App\Http\Controllers\Mitra\Auth\PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/lupa-password', [\App\Http\Controllers\Mitra\Auth\PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('/reset-password/{token}', [\App\Http\Controllers\Mitra\Auth\NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [\App\Http\Controllers\Mitra\Auth\NewPasswordController::class, 'store'])->name('password.update');
});

// Verifikasi email mitra (butuh login, tapi belum tentu role:partner ke-assign penuh / belum ke-approve admin)
Route::middleware(['auth'])->prefix('mitra')->name('mitra.')->group(function () {
    Route::get('/verifikasi-email', [\App\Http\Controllers\Mitra\Auth\EmailVerificationPromptController::class, '__invoke'])
        ->name('verify-email.notice');

    Route::post('/verifikasi-email/kirim-ulang', [\App\Http\Controllers\Mitra\Auth\EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verify-email.send');

    Route::get('/registrasi-sukses', [\App\Http\Controllers\Mitra\Auth\VerifyEmailController::class, 'success'])
        ->name('register.success');
});

Route::get('/mitra/verifikasi-email/{id}/{hash}', [\App\Http\Controllers\Mitra\Auth\VerifyEmailController::class, 'verify'])
    ->middleware(['auth', 'signed'])
    ->name('verification.verify');

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
| Partner (Mitra) routes  -> /mitra/* (role: partner)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:partner'])->prefix('mitra')->name('partner.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Mitra\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/notifikasi', [\App\Http\Controllers\Mitra\NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::patch('/notifikasi/{notifikasi}/read', [\App\Http\Controllers\Mitra\NotifikasiController::class, 'markAsRead'])->name('notifikasi.read');
    Route::patch('/notifikasi/tandai-semua', [\App\Http\Controllers\Mitra\NotifikasiController::class, 'markAllAsRead'])->name('notifikasi.readAll');
});

Route::middleware(['auth', 'role:partner'])->prefix('mitra')->name('partner.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Mitra\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/notifikasi', [\App\Http\Controllers\Mitra\NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::patch('/notifikasi/{notifikasi}/read', [\App\Http\Controllers\Mitra\NotifikasiController::class, 'markAsRead'])->name('notifikasi.read');
    Route::patch('/notifikasi/tandai-semua', [\App\Http\Controllers\Mitra\NotifikasiController::class, 'markAllAsRead'])->name('notifikasi.readAll');

    Route::get('/profil', [\App\Http\Controllers\Mitra\ProfileController::class, 'index'])->name('profil.index');
    Route::get('/profil/saya', [\App\Http\Controllers\Mitra\ProfileController::class, 'edit'])->name('profil.edit');
    Route::post('/profil/saya', [\App\Http\Controllers\Mitra\ProfileController::class, 'update'])->name('profil.update');
});

/*
|--------------------------------------------------------------------------
| Customer routes  -> /app/* (role: customer)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');

    // Halaman list layanan (dipakai untuk kategori barang/bangunan/kendaraan/pindahan)
    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
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



Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
    Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
});


Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
    Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
    Route::get('/orders', [CustomerOrderController::class, 'index'])->name('orders.index');
});

Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    // ...route yang sudah ada
    Route::get('/orders/{order}', [CustomerOrderController::class, 'show'])->name('orders.show');
});


Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    // ...route yang sudah ada
    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::patch('/notifikasi/{notifikasi}/read', [NotifikasiController::class, 'markAsRead'])->name('notifikasi.read');
});


Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    // ...route yang sudah ada
    Route::get('/profile', [CustomerProfileController::class, 'index'])->name('profile.index');
});



Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    // ...route yang sudah ada
    Route::get('/profile/notifikasi', [NotificationSettingController::class, 'edit'])->name('profile.notifikasi.edit');
    Route::patch('/profile/notifikasi', [NotificationSettingController::class, 'update'])->name('profile.notifikasi.update');
});




Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    // ...route yang sudah ada
    Route::get('/profile/bantuan', [BantuanController::class, 'index'])->name('profile.bantuan');
});



Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    // ...route yang sudah ada
    Route::get('/profile/tentang', [TentangController::class, 'index'])->name('profile.tentang');
    Route::get('/profile/tentang/syarat-ketentuan', [TentangController::class, 'syaratKetentuan'])->name('profile.tentang.syarat');
    Route::get('/profile/tentang/kebijakan-privasi', [TentangController::class, 'kebijakanPrivasi'])->name('profile.tentang.privasi');
});


Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    // ...route yang sudah ada
    Route::get('/profile/keamanan', [SecurityController::class, 'edit'])->name('profile.keamanan');
    Route::put('/profile/keamanan/password', [SecurityController::class, 'updatePassword'])->name('profile.keamanan.password');
    Route::put('/profile/keamanan/pin', [SecurityController::class, 'updatePin'])->name('profile.keamanan.pin');
});
Route::middleware(['auth', 'role:partner'])->prefix('mitra')->name('partner.')->group(function () {
    Route::get('/dashboard', [MitraDashboardController::class, 'index'])->name('dashboard');
    Route::get('/pesanan', [MitraOrderController::class, 'index'])->name('orders.index');
    Route::get('/pesanan/{order}', [MitraOrderController::class, 'show'])->name('orders.show');
});
Route::middleware(['auth', 'role:partner'])->prefix('mitra')->name('partner.')->group(function () {
    Route::get('/alamat', [AlamatController::class, 'edit'])->name('alamat.edit');
    Route::put('/alamat', [AlamatController::class, 'update'])->name('alamat.update');

    Route::get('/layanan/jam-operasional', [JamOperasionalController::class, 'edit'])->name('jam-operasional.edit');
    Route::put('/layanan/jam-operasional', [JamOperasionalController::class, 'update'])->name('jam-operasional.update');
});
Route::middleware(['auth', 'role:partner'])->prefix('mitra')->name('partner.')->group(function () {
    Route::get('/rekening', [RekeningController::class, 'edit'])->name('rekening.edit');
    Route::put('/rekening', [RekeningController::class, 'update'])->name('rekening.update');

    Route::get('/pendapatan/penarikan', [PenarikanController::class, 'index'])->name('penarikan.index');
    Route::get('/pendapatan/penarikan/tarik', [PenarikanController::class, 'create'])->name('penarikan.create');
    Route::post('/pendapatan/penarikan', [PenarikanController::class, 'store'])->name('penarikan.store');
    Route::get('/pendapatan/penarikan/{penarikan}/sukses', [PenarikanController::class, 'sukses'])->name('penarikan.sukses');
});