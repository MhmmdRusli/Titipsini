<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Concerns\HasTrashMeta;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
      use SoftDeletes, HasTrashMeta;
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
        'jumlah_tampung',
        'verification_status',
        'rejection_reason',
        'nama_penjaga',
        'nomor_telepon',
        'tanggal_lahir',
        'status_kepemilikan',
        'upload_berkas',
        // Kolom khusus kategori Pindahan (identitas kendaraan)
        'nomor_polisi',
        'nomor_kir',
        'merek_kendaraan',
        'jenis_pickup',
    ];

            protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'harga' => 'decimal:2',
            'panjang' => 'integer',
            'lebar' => 'integer',
            'jumlah_tampung' => 'integer',
            'foto_lahan' => 'array',
            'deleted_at' => 'datetime',
        ];
    }
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope: hanya layanan yang BENAR-BENAR siap dipesan customer, yaitu
     * - layanan aktif & sudah divalidasi (verification_status = terverifikasi)
     * - mitra (vendor) sudah verifikasi KTP (verification_status = terverifikasi)
     * - mitra sudah memasang jam operasional (jadwal_operasional terisi)
     * Dipakai di semua titik customer (list, search, detail, pemesanan) supaya
     * layanan yang masih proses verifikasi tidak bisa dilihat/dipesan.
     */
    public function scopeOrderable($query)
    {
        return $query
            ->where('services.is_active', true)
            ->where('services.verification_status', 'terverifikasi')
            ->whereHas('vendor', function ($q) {
                $q->where('verification_status', 'terverifikasi');
            })
            ->whereHas('vendor', function ($q) {
                $q->whereNotNull('jadwal_operasional')
                    ->where('jadwal_operasional', '<>', '[]');
            });
    }

    /**
     * Cek kesiapan layanan di sisi PHP (mirip scopeOrderable tapi untuk
     * validasi objek yang sudah di-load, mis. saat menyimpan pesanan).
     */
    public function isOrderable(): bool
    {
        return $this->is_active
            && $this->verification_status === 'terverifikasi'
            && $this->vendor
            && $this->vendor->verification_status === 'terverifikasi'
            && $this->vendor->jadwalOperasionalValid();
    }
    public function user()
{
    return $this->belongsTo(\App\Models\User::class);
}
}