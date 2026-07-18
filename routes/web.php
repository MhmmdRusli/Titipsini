<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
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

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

/*
|--------------------------------------------------------------------------
| Admin routes  -> /admin/*   (role: admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // TODO: tambahkan resource routes sesuai Daftar Modul Aplikasi Bab 3 (MOD-A03..MOD-A10)
    // Route::resource('users', UserController::class);
    // Route::resource('partners', PartnerController::class);
    // Route::resource('orders', OrderController::class);
    // Route::resource('payments', PaymentController::class)->only(['index', 'show']);
    // Route::resource('promotions', PromotionController::class);
    // Route::resource('complaints', ComplaintController::class)->only(['index', 'show', 'update']);
    // Route::get('reports', [ReportController::class, 'index'])->name('reports');
});

/*
|--------------------------------------------------------------------------
| Customer web app routes  -> /app/*   (role: customer)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');

    // TODO: tambahkan routes sesuai Daftar Modul Aplikasi Bab 3 (MOD-C03..MOD-C13)
    // Route::get('services', [ServiceController::class, 'index'])->name('services');
    // Route::resource('orders', OrderController::class)->only(['index', 'store', 'show']);
    // Route::get('notifications', [NotificationController::class, 'index'])->name('notifications');
    // Route::get('profile', [ProfileController::class, 'edit'])->name('profile');
});

/*
|--------------------------------------------------------------------------
| Partner (Mitra) routes  -> /mitra/*   (role: partner)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:partner'])->prefix('mitra')->name('partner.')->group(function () {
    // Route::get('/dashboard', [Partner\DashboardController::class, 'index'])->name('dashboard');
});
