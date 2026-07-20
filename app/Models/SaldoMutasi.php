<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaldoMutasi extends Model
{
    protected $table = 'saldo_mutasi';

    protected $fillable = ['user_id', 'type', 'jumlah', 'deskripsi', 'reference_type', 'reference_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}