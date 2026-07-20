<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentSetting extends Model
{
    protected $fillable = [
        'qris_image',
    ];

    /**
     * Ambil (atau buat) satu-satunya baris pengaturan pembayaran.
     */
    public static function current(): self
    {
        return static::firstOrCreate([]);
    }
}