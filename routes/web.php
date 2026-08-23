<?php

use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController as AdminAuthenticatedSessionController;
use App\Http\Controllers\Admin\Auth\NewPasswordController as AdminNewPasswordController;
use App\Http\Controllers\Admin\Auth\PasswordResetLinkController as AdminPasswordResetLinkController;
use App\Http\Controllers\Admin\BeritaController as AdminBeritaController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Admin\KotaController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PartnerController as AdminPartnerController;
use App\Http\Controllers\Admin\PendapatanController as AdminPendapatanController;
use App\Http\Controllers\Admin\PenarikanController as AdminPenarikanController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\TopupVerifikasiController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Finance\DashboardController as FinanceDashboardController;
use App\Http\Controllers\Finance\PayoutController as FinancePayoutController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Customer\AddressController;
use App\Http\Controllers\Customer\BantuanController;
use App\Http\Controllers\Customer\BeritaController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Customer\LengkapiDataController;
use App\Http\Controllers\Customer\NotificationSettingController;
use App\Http\Controllers\Customer\NotifikasiController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\PinController;
use App\Http\Controllers\Customer\ProfileController as CustomerProfileController;
use App\Http\Controllers\Customer\ReportController as CustomerReportController;
use App\Http\Controllers\Customer\SecurityController;
use App\Http\Controllers\Customer\ServiceController;
use App\Http\Controllers\Customer\TentangController;
use App\Http\Controllers\Customer\TopUpController;
use App\Http\Controllers\Mitra\AlamatController;
use App\Http\Controllers\Mitra\Auth\AuthenticatedSessionController as MitraAuthenticatedSessionController;
use App\Http\Controllers\Mitra\Auth\EmailVerificationNotificationController as MitraEmailVerificationNotificationController;
use App\Http\Controllers\Mitra\Auth\EmailVerificationPromptController as MitraEmailVerificationPromptController;
use App\Http\Controllers\Mitra\Auth\NewPasswordController as MitraNewPasswordController;
use App\Http\Controllers\Mitra\Auth\PasswordResetLinkController as MitraPasswordResetLinkController;
use App\Http\Controllers\Mitra\Auth\RegisteredUserController as MitraRegisteredUserController;
use App\Http\Controllers\Mitra\Auth\VerifyEmailController as MitraVerifyEmailController;
use App\Http\Controllers\Mitra\BantuanController as MitraBantuanController;
use App\Http\Controllers\Mitra\DashboardController as MitraDashboardController;
use App\Http\Controllers\Mitra\JamOperasionalController;
use App\Http\Controllers\Mitra\KeamananController;
use App\Http\Controllers\Mitra\KebijakanPrivasiController;
use App\Http\Controllers\Mitra\LegalitasController;
use App\Http\Controllers\Mitra\NotifikasiController as MitraNotifikasiController;
use App\Http\Controllers\Mitra\OnboardingController as MitraOnboardingController;
use App\Http\Controllers\Mitra\OrderController as MitraOrderController;
use App\Http\Controllers\Mitra\PenarikanController;
use App\Http\Controllers\Mitra\PendapatanController as MitraPendapatanController;
use App\Http\Controllers\Mitra\ProfileController as MitraProfileController;
use App\Http\Controllers\Mitra\RekeningController;
use App\Http\Controllers\Mitra\ServiceController as MitraServiceController;
use App\Http\Controllers\WilayahController;
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
            'finance' => redirect('/finance/dashboard'),
            'super_admin' => redirect('/super-admin/dashboard'),
            'partner' => redirect()->route('mitra.dashboard'),
            default => redirect()->route('customer.dashboard'),
        };
    }

    // Landing page desktop (marketing) - halaman pertama yang dilihat
    // pengunjung, menggantikan Onboarding di posisi ini.
    return Inertia::render('Landing');
})->name('welcome');

// Onboarding mobile (splash + slide + tombol Daftar/Masuk) - sekarang
// diakses lewat tombol "Mulai Sekarang" di Landing page, bukan langsung di '/'.
Route::get('/mulai', function () {
    if (auth()->check()) {
        return match (auth()->user()->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'finance' => redirect('/finance/dashboard'),
            'super_admin' => redirect('/super-admin/dashboard'),
            'partner' => redirect()->route('mitra.dashboard'),
            default => redirect()->route('customer.dashboard'),
        };
    }

    return Inertia::render('Onboarding');
})->name('onboarding');


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
| Mitra - Onboarding & Auth (belum login) -> /mitra/*
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

// Verifikasi email mitra
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
    ->name('verification.verify');

Route::middleware(['auth', 'role:finance,super_admin'])->prefix('finance')->name('finance.')->group(function () {
    Route::get('/dashboard', [FinanceDashboardController::class, 'index'])->name('dashboard');
    Route::get('/payouts', [FinancePayoutController::class, 'index'])->name('payouts.index');
    Route::post('/payouts/{payout}/approve', [FinancePayoutController::class, 'approve'])->name('payouts.approve');
    Route::post('/payouts/{payout}/reject', [FinancePayoutController::class, 'reject'])->name('payouts.reject');
});

Route::middleware(['auth', 'role:super_admin'])->prefix('super-admin')->name('super-admin.')->group(function () {
    Route::get('/dashboard', [SuperAdminDashboardController::class, 'index'])->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Admin routes -> /admin/* (role: admin)
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

    Route::patch('/partners/{partner}/restore', [AdminPartnerController::class, 'restore'])->name('partners.restore');
    Route::post('/partners/bulk-destroy', [AdminPartnerController::class, 'bulkDestroy'])->name('partners.bulkDestroy');

    Route::get('/profil', [AdminProfileController::class, 'edit'])->name('profil.edit');
    Route::put('/profil', [AdminProfileController::class, 'update'])->name('profil.update');

    Route::prefix('pengaturan')->name('pengaturan.')->group(function () {
        Route::get('komisi', [PengaturanController::class, 'komisi'])->name('komisi');
        Route::put('komisi', [PengaturanController::class, 'updateKomisi'])->name('komisi.update');

        Route::get('keamanan', [PengaturanController::class, 'keamanan'])->name('keamanan');
        Route::put('keamanan', [PengaturanController::class, 'updateKeamanan'])->name('keamanan.update');
        Route::delete('keamanan/sessions/{sessionId}', [PengaturanController::class, 'destroySession'])->name('keamanan.sessions.destroy');
        Route::get('qris', [PengaturanController::class, 'qris'])->name('qris');
        Route::post('qris', [PengaturanController::class, 'updateQris'])->name('qris.update');
        Route::delete('qris', [PengaturanController::class, 'destroyQris'])->name('qris.destroy');
        Route::get('denda', [PengaturanController::class, 'denda'])->name('denda');
        Route::put('denda', [PengaturanController::class, 'updateDenda'])->name('denda.update');
    });

    Route::resource('berita', AdminBeritaController::class)
        ->except(['show', 'create', 'edit'])
        ->parameters(['berita' => 'berita']);

    Route::resource('kota', KotaController::class)->except(['show', 'create', 'edit']);
    Route::resource('faq', AdminFaqController::class)->except(['show', 'create', 'edit']);

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    Route::patch('orders/{order}/approve-denda', [OrderController::class, 'approveDenda'])->name('orders.approveDenda');
    Route::delete('orders/bulk-delete', [OrderController::class, 'bulkDestroy'])->name('orders.bulkDestroy');
    Route::delete('orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
    Route::get('/orders/{order}/lapor', [CustomerReportController::class, 'create'])->name('orders.lapor');
    Route::post('/orders/{order}/lapor', [CustomerReportController::class, 'store'])->name('orders.lapor.store');
    Route::post('orders/{order}/konfirmasi-cash', [OrderController::class, 'confirmCashPayment'])->name('orders.konfirmasiCash');

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('export', [ReportController::class, 'export'])->name('export');
        Route::get('{report}', [ReportController::class, 'show'])->name('show');
        Route::put('{report}/suspend', [ReportController::class, 'suspend'])->name('suspend');
        Route::put('{report}/restore', [ReportController::class, 'restore'])->name('restore');
        Route::get('{report}/penangguhan', [ReportController::class, 'penangguhan'])->name('penangguhan');
    });

    Route::prefix('topup')->name('topup.')->group(function () {
        Route::get('/', [TopupVerifikasiController::class, 'index'])->name('index');
        Route::get('/{topup}', [TopupVerifikasiController::class, 'show'])->name('show');
        Route::post('/{topup}/approve', [TopupVerifikasiController::class, 'approve'])->name('approve');
        Route::post('/{topup}/reject', [TopupVerifikasiController::class, 'reject'])->name('reject');
    });

    Route::get('pendapatan', [AdminPendapatanController::class, 'index'])->name('pendapatan.index');
    Route::prefix('penarikan')->name('penarikan.')->group(function () {
        Route::get('/', [AdminPenarikanController::class, 'index'])->name('index');
        Route::post('/{penarikan}/approve', [AdminPenarikanController::class, 'approve'])->name('approve');
        Route::post('/{penarikan}/reject', [AdminPenarikanController::class, 'reject'])->name('reject');
    });
});

/*
|--------------------------------------------------------------------------
| Mitra routes -> /mitra/* (role: partner, sudah login)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:partner', 'partner.suspended'])->prefix('mitra')->name('mitra.')->group(function () {
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

     /* Verifikasi Legalitas (KTP + PIN pertama kali) */
    Route::get('/legalitas', [LegalitasController::class, 'edit'])->name('legalitas.edit');
    Route::post('/legalitas', [LegalitasController::class, 'storeKtp'])->name('legalitas.store');
    Route::post('/legalitas/pin', [LegalitasController::class, 'storePin'])->name('legalitas.pin.store');


    Route::resource('layanan', MitraServiceController::class)->except(['show', 'create', 'edit']);
    Route::get('/layanan/barang', [MitraServiceController::class, 'kategori'])->name('layanan.barang')->defaults('kategori', 'barang');
    Route::get('/layanan/kendaraan', [MitraServiceController::class, 'kategori'])->name('layanan.kendaraan')->defaults('kategori', 'kendaraan');
    Route::get('/layanan/bangunan', [MitraServiceController::class, 'kategori'])->name('layanan.bangunan')->defaults('kategori', 'bangunan');
    Route::get('/layanan/pindahan', [MitraServiceController::class, 'kategori'])->name('layanan.pindahan')->defaults('kategori', 'pindahan');
    Route::patch('/layanan/{kategori}/fitur-penuh', [MitraServiceController::class, 'toggleFiturPenuh'])->name('layanan.fiturPenuh');
    Route::get('/layanan/{layanan}', [MitraServiceController::class, 'show'])->name('layanan.show');

    /* Rekening Bank Mitra */
    Route::get('/rekening', [RekeningController::class, 'edit'])->name('rekening.edit');
    Route::post('/rekening', [RekeningController::class, 'store'])->name('rekening.store');
    Route::put('/rekening/{id}', [RekeningController::class, 'update'])->name('rekening.update');
    Route::delete('/rekening/{id}', [RekeningController::class, 'destroy'])->name('rekening.destroy');
    Route::post('/rekening/{id}/verifikasi', [RekeningController::class, 'verifikasi'])
    ->name('rekening.verifikasi');
    Route::post('/rekening/{id}/verifikasi/kirim-ulang', [RekeningController::class, 'verifikasiKirimUlang'])
    ->name('rekening.verifikasi.kirim-ulang');
    Route::post('/rekening/{id}/verifikasi/konfirmasi', [RekeningController::class, 'verifikasiKonfirmasi'])
    ->name('rekening.verifikasi.konfirmasi');

    /* Penarikan Dana Mitra */
    Route::get('/penarikan', [PenarikanController::class, 'index'])->name('penarikan.index');
    Route::get('/penarikan/tarik', [PenarikanController::class, 'create'])->name('penarikan.create');
    Route::post('/penarikan/tarik', [PenarikanController::class, 'store'])->name('penarikan.store');
    Route::get('/penarikan/{penarikan}/sukses', [PenarikanController::class, 'sukses'])->name('penarikan.sukses');

    Route::get('/pendapatan/penarikan', [PenarikanController::class, 'index'])->name('pendapatan.penarikan.index');
    Route::get('/pendapatan/penarikan/tarik', [PenarikanController::class, 'create'])->name('pendapatan.penarikan.create');
    Route::post('/pendapatan/penarikan', [PenarikanController::class, 'store'])->name('pendapatan.penarikan.store');
    Route::get('/pendapatan/penarikan/{penarikan}/sukses', [PenarikanController::class, 'sukses'])->name('pendapatan.penarikan.sukses');

    Route::get('/keamanan', [KeamananController::class, 'edit'])->name('keamanan.edit');
    Route::put('/keamanan', [KeamananController::class, 'update'])->name('keamanan.update');
    Route::put('/keamanan/pin', [KeamananController::class, 'updatePin'])->name('keamanan.pin.update');
    Route::put('/keamanan/pin/lupa', [KeamananController::class, 'lupaPin'])->name('keamanan.pin.lupa');

    Route::get('/kebijakan-privasi', [KebijakanPrivasiController::class, 'index'])->name('kebijakan-privasi.index');

    Route::get('/bantuan', [MitraBantuanController::class, 'index'])->name('bantuan.index');

    Route::patch('/pesanan/{order}/verifikasi-pembayaran', [MitraOrderController::class, 'verifikasiPembayaran'])->name('orders.verifikasiPembayaran');

    // 👇 DITAMBAHKAN: route ini sebelumnya belum terdaftar, menyebabkan
    // klik tombol "Verifikasi Denda" di halaman Mitra selalu 404.
    Route::patch('/pesanan/{order}/verifikasi-denda', [MitraOrderController::class, 'verifikasiDenda'])->name('orders.verifikasiDenda');

    // 👇 DITAMBAHKAN: verifikasi perpanjangan penitipan yang dibayar via
    // transfer manual (bukan saldo). Baru di titik ini end_date & total_price
    // order benar-benar diperbarui - lihat Mitra\OrderController::verifikasiPerpanjangan().
    Route::patch('/pesanan/{order}/verifikasi-perpanjangan', [MitraOrderController::class, 'verifikasiPerpanjangan'])->name('orders.verifikasiPerpanjangan');

    Route::patch('/pesanan/{order}/fase', [\App\Http\Controllers\Mitra\OrderController::class, 'updateFase'])
        ->name('orders.updateFase');

    Route::get('/pendapatan/riwayat', [MitraPendapatanController::class, 'riwayat'])->name('pendapatan.riwayat');
});

/*
|--------------------------------------------------------------------------
| Rute Tambahan untuk Mitra Ditangguhkan (Suspended Notice & Pemulihan)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->prefix('mitra')->name('mitra.')->group(function () {
    Route::get('/ditangguhkan', [AdminPartnerController::class, 'suspendedNotice'])->name('suspended.notice');
    Route::post('/ajukan-pemulihan', [AdminPartnerController::class, 'requestRestoration'])->name('request.restoration');
});

/*
|--------------------------------------------------------------------------
| Customer routes -> /app/* (role: customer)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer'])->prefix('app')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');

    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
    Route::get('/services/barang/paket-pilihan', [ServiceController::class, 'pilihPaket'])->name('services.barang.pilihPaket');
    Route::get('/services/barang', [ServiceController::class, 'formBarang'])->name('services.barang.form');
    Route::post('/services/barang', [ServiceController::class, 'simpanBarang'])->name('services.barang.store');
    Route::get('/services/barang/{order}/invoice', [ServiceController::class, 'invoiceBarang'])->name('services.barang.invoice');
    Route::get('/services/{service}', [ServiceController::class, 'show'])->name('services.show');
    Route::post('/services/{service}/pesan', [ServiceController::class, 'storePesanan'])->name('services.pesan');
    Route::get('/services/{service}/metode-pembayaran', [ServiceController::class, 'metodePembayaranLayanan'])->name('services.metodePembayaranLayanan');
    Route::post('/services/{service}/konfirmasi', [ServiceController::class, 'konfirmasiLayanan'])->name('services.konfirmasiLayanan');

    Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
    Route::get('/berita/{berita}', [BeritaController::class, 'show'])->name('berita.show');

    Route::get('/orders', [CustomerOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [CustomerOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/batalkan', [CustomerOrderController::class, 'cancel'])->name('orders.batalkan');

    Route::get('/orders/{order}/lapor', [CustomerReportController::class, 'create'])->name('orders.lapor');
    Route::post('/orders/{order}/lapor', [CustomerReportController::class, 'store'])->name('orders.lapor.store');

    Route::get('/orders/{order}/sukses', [CustomerOrderController::class, 'success'])->name('orders.success');
    Route::get('/orders/{order}/pembayaran', [CustomerOrderController::class, 'pembayaran'])->name('orders.pembayaran');
    Route::get('/orders/{order}/bukti-pembayaran', [CustomerOrderController::class, 'buktiPembayaran'])->name('orders.buktiPembayaran');
    Route::post('/orders/{order}/upload-bukti', [CustomerOrderController::class, 'uploadBukti'])->name('orders.uploadBukti');
    Route::post('/orders/{order}/bayar-saldo', [CustomerOrderController::class, 'bayarSaldo'])->name('orders.bayarSaldo');
    Route::post('/orders/{order}/bayar-denda', [CustomerOrderController::class, 'bayarDenda'])->name('orders.bayarDenda');
    Route::post('/orders/{order}/upload-bukti-denda', [CustomerOrderController::class, 'uploadBuktiDenda'])->name('orders.uploadBuktiDenda');


    Route::get('/orders/{order}/extend', [CustomerOrderController::class, 'extendForm'])->name('orders.extend.form');
    Route::post('/orders/{order}/extend', [CustomerOrderController::class, 'extendStore'])->name('orders.extend.store');
    Route::get('/orders/{order}/extend/invoice', [CustomerOrderController::class, 'extendInvoice'])->name('orders.extend.invoice');
    Route::post('/orders/{order}/extend/bayar-saldo', [CustomerOrderController::class, 'extendBayarSaldo'])->name('orders.extend.bayarSaldo');
    Route::post('/orders/{order}/extend/upload-bukti', [CustomerOrderController::class, 'extendUploadBukti'])->name('orders.extend.uploadBukti');

    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::patch('/notifikasi/{notifikasi}/read', [NotifikasiController::class, 'markAsRead'])->name('notifikasi.read');

    Route::get('/profile', [CustomerProfileController::class, 'index'])->name('profile.index');
    Route::get('/profile/edit', [CustomerProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [CustomerProfileController::class, 'update'])->name('profile.update');
    Route::get('/profile/notifikasi', [NotificationSettingController::class, 'edit'])->name('profile.notifikasi.edit');
    Route::patch('/profile/notifikasi', [NotificationSettingController::class, 'update'])->name('profile.notifikasi.update');
    Route::get('/profile/bantuan', [BantuanController::class, 'index'])->name('profile.bantuan');
    Route::get('/profile/tentang', [TentangController::class, 'index'])->name('profile.tentang');
    Route::get('/profile/tentang/syarat-ketentuan', [TentangController::class, 'syaratKetentuan'])->name('profile.tentang.syarat');
    Route::get('/profile/tentang/kebijakan-privasi', [TentangController::class, 'kebijakanPrivasi'])->name('profile.tentang.privasi');

    Route::get('/profile/keamanan', [SecurityController::class, 'edit'])->name('profile.keamanan');


    Route::get('/profile/keamanan/password', [SecurityController::class, 'editPassword'])->name('profile.keamanan.password.edit');
    Route::put('/profile/keamanan/password', [SecurityController::class, 'updatePassword'])->name('profile.keamanan.password');

    Route::get('/profile/keamanan/pin', [SecurityController::class, 'editPin'])->name('profile.keamanan.pin.edit');
    Route::put('/profile/keamanan/pin', [SecurityController::class, 'updatePin'])->name('profile.keamanan.pin');


    Route::prefix('profile/alamat')->name('profile.alamat.')->group(function () {
        Route::get('/', [AddressController::class, 'index'])->name('index');
        Route::get('/tambah', [AddressController::class, 'create'])->name('create');
        Route::post('/', [AddressController::class, 'store'])->name('store');
        Route::get('/{alamat}/edit', [AddressController::class, 'edit'])->name('edit');
        Route::put('/{alamat}', [AddressController::class, 'update'])->name('update');
        Route::delete('/{alamat}', [AddressController::class, 'destroy'])->name('destroy');
    });

    Route::get('/saldo/topup', [TopUpController::class, 'create'])->name('topup.create');
    Route::post('/saldo/topup', [TopUpController::class, 'store'])->name('topup.store');
    Route::get('/saldo/topup/{topup}/instruksi', [TopUpController::class, 'instruksi'])->name('topup.instruksi');
    Route::post('/saldo/topup/{topup}/konfirmasi', [TopUpController::class, 'konfirmasi'])->name('topup.konfirmasi');
    Route::get('/saldo/topup/{topup}/menunggu', [TopUpController::class, 'menunggu'])->name('topup.menunggu');
    Route::get('/saldo/topup/{topup}/sukses', [TopUpController::class, 'sukses'])->name('topup.sukses');
    Route::get('/saldo/riwayat', [TopUpController::class, 'riwayat'])->name('topup.riwayat');

    
});

Route::middleware(['auth'])->prefix('lengkapi-data')->name('customer.lengkapi-data.')->group(function () {
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