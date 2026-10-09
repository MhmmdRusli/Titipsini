<?php

namespace App\Models;

use App\Models\Concerns\HasTrashMeta;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Service extends Model
{
    use HasTrashMeta, SoftDeletes;

    protected static function booted(): void
    {
        static::forceDeleted(function (Service $service): void {
            $fotoLahan = $service->foto_lahan ?? [];
            $fotos = array_filter(
                array_merge([$service->foto, $service->foto_kendaraan], $fotoLahan),
                static fn ($path) => is_string($path) && $path !== ''
            );

            if ($fotos !== []) {
                Storage::disk('public')->delete($fotos);
            }
        });
    }

    protected $fillable = [
        'user_id',
        'kategori',
        'jenis_kendaraan',
        'jenis_bangunan',
        'nama',
        'foto',
        'foto_kendaraan',
        'kota',
        'kecamatan',
        'latitude',
        'longitude',
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
            'foto_kendaraan' => 'string',
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
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'service_id');
    }

    /**
     * Hitung order aktif yang memakai slot kapasitas.
     * Order aktif = status baru sampai diterima_mitra, dan end_date >= today.
     */
    public function getActiveOrdersCount(): int
    {
        return $this->orders()
            ->whereIn('status', ['baru', 'diproses', 'diterima', 'dijemput', 'diterima_mitra'])
            ->where('end_date', '>=', now()->toDateString())
            ->count();
    }

    /**
     * Kapasitas tersisa (bisa negatif jika overbooking manual).
     */
    public function getRemainingCapacity(): int
    {
        if (! $this->jumlah_tampung) {
            return 999; // unlimited jika tidak set
        }

        return max(0, $this->jumlah_tampung - $this->getActiveOrdersCount());
    }

    /**
     * Apakah kapasitas penuh?
     */
    public function isFull(): bool
    {
        if (! $this->jumlah_tampung) {
            return false;
        }

        return $this->getActiveOrdersCount() >= $this->jumlah_tampung;
    }

    /**
     * Data kapasitas untuk frontend.
     */
    public function getCapacityData(): array
    {
        if (! $this->jumlah_tampung) {
            return [
                'total' => null,
                'used' => $this->getActiveOrdersCount(),
                'remaining' => null,
                'is_full' => false,
                'is_unlimited' => true,
            ];
        }
        $used = $this->getActiveOrdersCount();

        return [
            'total' => $this->jumlah_tampung,
            'used' => $used,
            'remaining' => max(0, $this->jumlah_tampung - $used),
            'is_full' => $used >= $this->jumlah_tampung,
            'is_unlimited' => false,
        ];
    }
}
