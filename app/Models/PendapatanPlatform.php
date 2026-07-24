<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PendapatanPlatform extends Model
{
    use HasFactory;

    // Nama tabel di database (jika tidak mengikuti penamaan jamak bawaan Laravel)
    protected $table = 'pendapatan_platform';

    // Kolom yang boleh diisi
    protected $fillable = [
        'order_id',
        'partner_id',
        'gross_amount',
        'commission_rate',
        'commission_fee',
        'app_service_fee',
        'net_revenue',
        'partner_earnings',
        'status',
    ];

    /**
     * Relasi ke Order
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Relasi ke Partner / User
     */
    public function partner()
    {
        return $this->belongsTo(User::class, 'partner_id');
    }
}