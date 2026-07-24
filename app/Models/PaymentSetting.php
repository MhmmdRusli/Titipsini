<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentSetting extends Model
{
    protected $fillable = [
        'qris_image',
        'komisi_persen',
    ];

    protected function casts(): array
    {
        return [
            'komisi_persen' => 'decimal:2',
        ];
    }

    /**
     * Ambil (atau buat) satu-satunya baris pengaturan pembayaran.
     */
    public static function current(): self
    {
        return static::firstOrCreate([]);
    }
}