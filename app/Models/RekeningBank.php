<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RekeningBank extends Model
{
    protected $table = 'rekening_bank';

    protected $fillable = ['user_id', 'nama_bank', 'nomor_rekening', 'nama_pemilik', 'utama'];

    protected $casts = [
        'utama' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}