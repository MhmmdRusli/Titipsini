<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Concerns\HasTrashMeta;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kota extends Model
{
        use HasFactory, SoftDeletes, HasTrashMeta;

    protected $table = 'kota';

    protected $fillable = [
    'nama',
    'provinsi',
    'foto',
    'is_active',
];

    protected $casts = [
        'is_active' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    // Vendors aren't linked by foreign key — `users.city` is a free-text
    // column matched against `kota.nama`. Case/typo mismatches between the
    // two will under-count, since this isn't a real relational constraint.
    public function vendors(): HasMany
    {
        return $this->hasMany(User::class, 'city', 'nama')->where('role', 'partner');
    }
}