<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController as AdminAuthenticatedSessionController;
use App\Http\Controllers\Admin\Auth\PasswordResetLinkController as AdminPasswordResetLinkController;
use App\Http\Controllers\Admin\Auth\NewPasswordController as AdminNewPasswordController;
use App\Http\Controllers\Admin\PartnerController as AdminPartnerController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\KotaController;
use App\Http\Controllers\Admin\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome');
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
});

Route::middleware('auth')->post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

/*
|--------------------------------------------------------------------------
| Admin routes  -> /admin/* (role: admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Halaman Pengguna (Manajemen Pelanggan)
    Route::get('/pengguna', [AdminUserController::class, 'index'])->name('pengguna.index');
    Route::get('/pengguna/{user}', [AdminUserController::class, 'show'])->name('pengguna.show');
    Route::patch('/pengguna/{user}/status', [AdminUserController::class, 'updateStatus'])->name('pengguna.updateStatus');

    // Halaman Vendor / Partner (Sudah di dalam grup Admin)
    Route::get('/partners', [AdminPartnerController::class, 'index'])->name('partners.index');
    Route::get('/partners/{partner}', [AdminPartnerController::class, 'show'])->name('partners.show');
    Route::patch('/partners/{partner}/status', [AdminPartnerController::class, 'updateStatus'])->name('partners.updateStatus');
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

Route::get('/admin/profil', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('admin.profil.edit');
Route::put('/admin/profil', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('admin.profil.update');

Route::prefix('admin/pengaturan')->name('admin.pengaturan.')->group(function () {
    Route::get('keamanan', [PengaturanController::class, 'keamanan'])->name('keamanan');
    Route::put('keamanan', [PengaturanController::class, 'updateKeamanan'])->name('keamanan.update');

    Route::get('qris', [PengaturanController::class, 'qris'])->name('qris');
    Route::post('qris', [PengaturanController::class, 'updateQris'])->name('qris.update');
});



Route::resource('admin/kota', KotaController::class)
    ->except(['show', 'create', 'edit']);




Route::get('admin/orders', [OrderController::class, 'index'])->name('admin.orders.index');
Route::patch('admin/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');