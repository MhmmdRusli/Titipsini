<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'customer_id',
        'partner_id',
        'service_type',
        'item_name',
        'start_date',
        'end_date',
        'is_pickup',
        'city',
        'status',
        'cancel_reason',
        'total_price',
        'payment_method',
        'payment_receipt', // 🟢 Ditambahkan agar bukti pembayaran dapat disimpan
    ];

    protected function casts(): array
    {
        return [
            'is_pickup' => 'boolean',
            'total_price' => 'decimal:2',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'partner_id');
    }
}