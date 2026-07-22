<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kota extends Model
{
    use HasFactory;

    protected $table = 'kota';

    protected $fillable = [
    'nama',
    'provinsi',
    'foto',
    'is_active',
];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Vendors aren't linked by foreign key — `users.city` is a free-text
    // column matched against `kota.nama`. Case/typo mismatches between the
    // two will under-count, since this isn't a real relational constraint.
    public function vendors(): HasMany
    {
        return $this->hasMany(User::class, 'city', 'nama')->where('role', 'partner');
    }
}