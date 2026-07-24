<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengaturan extends Model
{
    use HasFactory;

    // Sesuaikan dengan nama tabel di database kamu (misal: 'pengaturan' atau 'settings')
    protected $table = 'pengaturan';

    protected $fillable = [
        'key',
        'value',
    ];
}