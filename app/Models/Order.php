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
        'order_number',
        'customer_id',
        'partner_id',
        'service_type',
        'item_name',
        'item_description',
        'start_date',
        'end_date',
        'duration',
        'is_pickup',
        'pickup_status',
        'pickup_address',
        'dropoff_address',
        'city',
        'status',
        'cancel_reason',
        'subtotal',
        'discount',
        'pickup_fee',
        'total_price',
        'total',
        'payment_method',
        'payment_receipt',
        'payment_verified_at',
    ];

    protected function casts(): array
    {
        return [
            'is_pickup' => 'boolean',
            'total_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'pickup_fee' => 'decimal:2',
            'total' => 'decimal:2',
            'payment_verified_at' => 'datetime',
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