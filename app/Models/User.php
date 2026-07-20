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
        'email',
        'password',
        'role',
        'phone',
        'city',
        'verification_status',
        'gender',
        'address',
        'pin',
        'rejection_reason',
        'verified_at',
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
            'password' => 'hashed',
            'pin' => 'hashed',
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

<<<<<<< HEAD
    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }
=======
    
>>>>>>> ef50b43f4f829777c3d15ddfca8e992aa2b87152
}