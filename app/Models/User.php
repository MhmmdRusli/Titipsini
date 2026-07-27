<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * role: admin | customer | partner
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

    public function getVendorIdAttribute(): string
    {
        return 'VDR-'.str_pad((string) $this->id, 5, '0', STR_PAD_LEFT);
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
     
    public function topups(): HasMany
    {
        return $this->hasMany(Topup::class);
    }

    /**
     * Menghitung sisa saldo bersih mitra yang siap ditarik/cair
     */
    public function saldoMitra(): int
{
    // 1. Total Pendapatan Kotor dari Order Selesai
    $totalKotor = \App\Models\Order::where('partner_id', $this->id)
        ->whereIn('status', ['selesai', 'completed', 'success'])
        ->sum('total_price');

    // 2. Ambil Persentase Komisi dari PaymentSetting
    $paymentSetting = \App\Models\PaymentSetting::first();
    
    $komisiPersen = $paymentSetting->komisi_persen 
        ?? $paymentSetting->persen_komisi 
        ?? $paymentSetting->platform_fee 
        ?? 0;

    // 3. Hitung Hak Saldo Bersih Mitra
    $persentaseMitra = max(0, (100 - $komisiPersen) / 100);
    $saldoBersih = $totalKotor * $persentaseMitra;

    // 4. Hitung Total Penarikan (Hanya menggunakan user_id)
    $totalPenarikan = \App\Models\Penarikan::where('user_id', $this->id)
        ->whereNotIn('status', ['ditolak', 'rejected', 'failed', 'gagal'])
        ->sum('jumlah');

    // 5. Kembalikan Sisa Saldo Bersih
    return (int) max(0, $saldoBersih - $totalPenarikan);
}
// Di dalam class User
public function rekeningBank()
{
    // Pastikan memanggil class RekeningBank::class
    return $this->hasMany(RekeningBank::class); 
}
}