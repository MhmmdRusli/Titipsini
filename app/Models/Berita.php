<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\HasTrashMeta;
use Illuminate\Database\Eloquent\SoftDeletes;

class Berita extends Model
{
     use HasFactory, SoftDeletes, HasTrashMeta;

    protected $table = 'berita';

    protected $fillable = [
        'judul',
        'konten',
        'foto',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}