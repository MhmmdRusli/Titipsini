<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Concerns\HasTrashMeta;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable implements MustVerifyEmail
{
   
       use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasTrashMeta;

    /**
     * role: admin | finance | super_admin | customer | partner
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'pin',
        'avatar',
        'cover_photo',
        'foto',
        'foto_ktp',
        'gender',
        'birth_date',
        'tanggal_lahir',
        'address',
        'role',
        'phone',
        'city',
        'provinsi',
        'kecamatan',
        'wilayah',
        'postal_code',
        'toko_buka',
        'jam_buka',
        'jam_tutup',
        'layanan_kategori',
        'jadwal_operasional',
        'fitur_penuh_kategori',
        'verification_status',
        'rejection_reason',
        'suspended_at',
        'suspension_reason',
        'restoration_requested_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'pin',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'verified_at' => 'datetime',
            'birth_date' => 'date',
            'password' => 'hashed',
            'pin' => 'hashed',
            'toko_buka' => 'boolean',
            'layanan_kategori' => 'array',
            'jadwal_operasional' => 'array',
            'fitur_penuh_kategori' => 'array',
            'deleted_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function isPartner(): bool
    {
        return $this->role === 'partner';
    }

    public function isVerifiedPartner(): bool
    {
        return $this->role === 'partner' && $this->verification_status === 'terverifikasi';
    }

    /**
     * True kalau mitra sudah memasang jam operasional dengan BENAR:
     * ada minimal satu hari yang `aktif = true` dan punya minimal satu slot
     * dengan jam buka & jam tutup terisi. Tanpa ini, scopeOrderable() salah
     * menganggap mitra yang data jadwal_operasional-nya ada tapi tidak ada
     * hari aktif/slot aktif sebagai "sudah lengkap" - padahal customer
     * tetap tidak punya jam operasional yang valid.
     */
    public function jadwalOperasionalValid(): bool
    {
        $jadwal = $this->jadwal_operasional;

        if (! is_array($jadwal) || empty($jadwal)) {
            return false;
        }

        foreach ($jadwal as $hari) {
            if (empty($hari['aktif'])) {
                continue;
            }

            foreach ($hari['slots'] ?? [] as $slot) {
                if (! empty($slot['aktif']) && ! empty($slot['jam_buka']) && ! empty($slot['jam_tutup'])) {
                    return true;
                }
            }
        }

        return false;
    }

    public function getVendorIdAttribute(): string
    {
        return 'VDR-'.str_pad((string) $this->id, 5, '0', STR_PAD_LEFT);
    }

        public function getCustomerCodeAttribute(): string
    {
        return 'CU'.str_pad((string) $this->id, 4, '0', STR_PAD_LEFT);
    }

    public function ordersAsCustomer(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function notifikasi(): HasMany
    {
        return $this->hasMany(\App\Models\Notifikasi::class);
    }

    public function ordersAsPartner(): HasMany
    {
        return $this->hasMany(Order::class, 'partner_id');
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    // 👇 DITAMBAHKAN: relasi ke alamat pengiriman/penitipan milik customer.
    // Dipakai oleh Customer\AddressController (index, store, dst).
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function topups(): HasMany
    {
        return $this->hasMany(Topup::class);
    }

    /**
     * Menghitung sisa saldo bersih mitra yang siap ditarik/cair.
     *
     * Terdiri dari 2 komponen:
     * 1. Hasil transaksi normal (total_price) SETELAH dipotong komisi platform.
     * 2. Denda keterlambatan (Order::hitungDenda()) - masuk 100% ke mitra,
     *    TIDAK dipotong komisi sama sekali, karena mitra yang dirugikan
     *    langsung oleh keterlambatan (gudang/kendaraan tertahan lebih lama).
     *
     * Keduanya hanya dihitung dari order yang statusnya SUDAH 'selesai' -
     * konsisten dengan titik finalisasi keuangan yang sama dipakai
     * Admin\OrderController::catatPendapatanPlatform().
     */
    public function saldoMitra(): int
{
    // 1. Ambil semua order selesai milik mitra ini SEKALI saja, dipakai
    // ulang untuk hitung total kotor maupun total denda - supaya query-nya
    // tidak dobel dan datanya pasti konsisten (order yang sama).
    $ordersSelesai = \App\Models\Order::where('partner_id', $this->id)
        ->whereIn('status', ['selesai', 'completed', 'success'])
        ->get();

    // 2. Total Pendapatan Kotor dari Order Selesai
    $totalKotor = $ordersSelesai->sum('total_price');

    // 3. Ambil Persentase Komisi dari PaymentSetting
    $paymentSetting = \App\Models\PaymentSetting::first();
    
    $komisiPersen = $paymentSetting->komisi_persen 
        ?? $paymentSetting->persen_komisi 
        ?? $paymentSetting->platform_fee 
        ?? 0;

    // 4. Hitung Hak Saldo Bersih Mitra dari transaksi normal (kena komisi)
    $persentaseMitra = max(0, (100 - $komisiPersen) / 100);
    $saldoBersihTransaksi = $totalKotor * $persentaseMitra;

    // 5. Total denda keterlambatan - 100% masuk mitra, TIDAK kena komisi.
    // PENTING: cuma dihitung kalau denda_paid_at sudah terisi (customer
    // benar-benar sudah bayar) - order dengan denda tapi belum dibayar
    // TIDAK menambah saldo mitra, supaya platform tidak "membayar duluan"
    // pakai uang yang belum ditagih dari customer.
    $totalDenda = $ordersSelesai->sum(fn ($order) => $order->denda_paid_at ? $order->hitungDenda() : 0);

    $saldoBersih = $saldoBersihTransaksi + $totalDenda;

    // 6. Hitung Total Penarikan (Hanya menggunakan user_id)
    $totalPenarikan = \App\Models\Penarikan::where('user_id', $this->id)
        ->whereNotIn('status', ['ditolak', 'rejected', 'failed', 'gagal'])
        ->sum('jumlah');

    // 7. Kembalikan Sisa Saldo Bersih
    return (int) max(0, $saldoBersih - $totalPenarikan);
}

}