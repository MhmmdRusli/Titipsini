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

    public function notifikasi(): \Illuminate\Database\Eloquent\Relations\HasMany
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

}