<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Penarikan extends Model
{
    protected $table = 'penarikan';

    protected $fillable = [
        'user_id', 'jumlah', 'nama_bank', 'nomor_rekening', 'nama_pemilik',
        'status', 'catatan', 'processed_at',
    ];

    protected function casts(): array
    {
        return ['processed_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}