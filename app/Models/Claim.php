<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Claim extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'claims';

    protected $fillable = [
        'order_id',
        'customer_id',
        'mitra_id',
        'status',
        'alasan',
        'foto_urls',
        'jumlah_klaim',
        'persentase_refund',
        'jumlah_refund',
        'admin_validator_id',
        'admin_validated_at',
        'admin_catatan',
        'mitra_klarifikasi',
        'mitra_foto_urls',
        'mitra_responded_at',
        'finance_processor_id',
        'finance_processed_at',
        'finance_catatan',
        'super_admin_id',
        'super_admin_decided_at',
        'super_admin_keputusan',
    ];

    protected function casts(): array
    {
        return [
            'foto_urls' => 'array',
            'mitra_foto_urls' => 'array',
            'admin_validated_at' => 'datetime',
            'mitra_responded_at' => 'datetime',
            'finance_processed_at' => 'datetime',
            'super_admin_decided_at' => 'datetime',
            'jumlah_klaim' => 'decimal:2',
            'jumlah_refund' => 'decimal:2',
            'persentase_refund' => 'integer',
            'deleted_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function mitra(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mitra_id');
    }

    public function adminValidator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_validator_id');
    }

    public function financeProcessor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'finance_processor_id');
    }

    public function superAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'super_admin_id');
    }

    public static function statusLabels(): array
    {
        return [
            'klaim_diajukan' => 'Klaim Diajukan',
            'menunggu_pemeriksaan_admin' => 'Menunggu Pemeriksaan Admin',
            'menunggu_klarifikasi_mitra' => 'Menunggu Klarifikasi Mitra',
            'disetujui' => 'Disetujui',
            'diproses_finance' => 'Diproses Finance',
            'refund_berhasil' => 'Refund Berhasil',
            'ditolak' => 'Ditolak',
            'sengketa' => 'Sengketa',
        ];
    }

    public function getStatusLabelAttribute(): string
    {
        return self::statusLabels()[$this->status] ?? $this->status;
    }
}