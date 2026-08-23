<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Service extends Model
{
    protected $fillable = [
        'user_id',
        'kategori',
        'jenis_kendaraan',
        'jenis_bangunan',
        'nama',
        'foto',
        'kota',
        'kecamatan',
        'harga',
        'is_active',
        // Kolom baru khusus kategori Barang (alamat gudang)
        'nama_usaha',
        'provinsi',
        'kabupaten_kota',
        'alamat_lengkap',
        'catatan_alamat',
        'foto_lahan',
        'panjang',
        'lebar',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'harga' => 'decimal:2',
            'panjang' => 'integer',
            'lebar' => 'integer',
        ];
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}