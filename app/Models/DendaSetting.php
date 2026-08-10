<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DendaSetting extends Model
{
    protected $fillable = [
        'service_type',
        'persen_per_hari',
        'max_persen',
    ];

    protected function casts(): array
    {
        return [
            'persen_per_hari' => 'decimal:2',
            'max_persen' => 'decimal:2',
        ];
    }

    /**
     * Ambil (atau buat dengan default aman) pengaturan denda untuk 1 kategori
     * layanan. Pola sama seperti PaymentSetting::current() untuk komisi.
     */
    public static function current(string $serviceType): self
    {
        return static::firstOrCreate(
            ['service_type' => $serviceType],
            ['persen_per_hari' => 2, 'max_persen' => 100]
        );
    }
}