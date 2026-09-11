<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KondisiAwal extends Model
{
    use HasFactory;

    protected $table = 'kondisi_awal';

    protected $fillable = [
        'order_id',
        'mitra_id',
        'foto_urls',
        'catatan',
        'dokumentasi_at',
    ];

    protected function casts(): array
    {
        return [
            'foto_urls' => 'array',
            'dokumentasi_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function mitra(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mitra_id');
    }
}