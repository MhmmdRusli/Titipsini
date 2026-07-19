<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetOtp extends Model
{
    protected $fillable = ['email', 'otp_code', 'verified', 'expires_at'];

    protected function casts(): array
    {
        return [
            'verified'   => 'boolean',
            'expires_at' => 'datetime',
        ];
    }
}