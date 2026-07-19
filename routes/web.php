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
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\KotaController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Customer\LengkapiDataController;
use App\Http\Controllers\WilayahController;
use App\Http\Controllers\Customer\PinController;
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

Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminAuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AdminAuthenticatedSessionController::class, 'store']);

    Route::get('/forgot-password', [AdminPasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [AdminPasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('/reset-password/{token}', [AdminNewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [AdminNewPasswordController::class, 'store'])->name('password.store');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

Route::middleware('auth')->post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

/*
|--------------------------------------------------------------------------
| Admin routes  -> /admin/* (role: admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Pengguna
    Route::get('/pengguna', [AdminUserController::class, 'index'])->name('pengguna.index');
    Route::get('/pengguna/{user}', [AdminUserController::class, 'show'])->name('pengguna.show');
    Route::patch('/pengguna/{user}/status', [AdminUserController::class, 'updateStatus'])->name('pengguna.updateStatus');

    // Vendor / Partner
    Route::get('/partners', [AdminPartnerController::class, 'index'])->name('partners.index');
    Route::get('/partners/{partner}', [AdminPartnerController::class, 'show'])->name('partners.show');
    Route::patch('/partners/{partner}/status', [AdminPartnerController::class, 'updateStatus'])->name('partners.updateStatus');

    // Profil
    Route::get('/profil', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profil.edit');
    Route::put('/profil', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profil.update');

    // Pengaturan
    Route::prefix('pengaturan')->name('pengaturan.')->group(function () {
        Route::get('keamanan', [PengaturanController::class, 'keamanan'])->name('keamanan');
        Route::put('keamanan', [PengaturanController::class, 'updateKeamanan'])->name('keamanan.update');
        Route::get('qris', [PengaturanController::class, 'qris'])->name('qris');
        Route::post('qris', [PengaturanController::class, 'updateQris'])->name('qris.update');
    });

    // Kota
    Route::resource('kota', KotaController::class)->except(['show', 'create', 'edit']);

    // Pesanan
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');

    // Reports
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
| Customer web app routes  -> /app/* (role: customer)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Partner (Mitra) routes  -> /mitra/* (role: partner)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:partner'])->prefix('mitra')->name('partner.')->group(function () {
});

Route::middleware(['auth', 'role:customer'])->prefix('lengkapi-data')->name('customer.lengkapi-data.')->group(function () {
    Route::get('/', [LengkapiDataController::class, 'intro'])->name('intro');
    Route::get('/form', [LengkapiDataController::class, 'form'])->name('form');
    Route::post('/', [LengkapiDataController::class, 'store'])->name('store');
});



Route::get('/api/wilayah/provinces', [WilayahController::class, 'provinces']);
Route::get('/api/wilayah/regencies/{provinceId}', [WilayahController::class, 'regencies']);
Route::get('/api/wilayah/districts/{regencyId}', [WilayahController::class, 'districts']);



Route::middleware(['auth', 'role:customer'])->prefix('buat-pin')->name('customer.pin.')->group(function () {
    Route::get('/', [PinController::class, 'create'])->name('create');
    Route::post('/', [PinController::class, 'store'])->name('store');
});