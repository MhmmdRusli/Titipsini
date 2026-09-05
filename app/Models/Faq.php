<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\HasTrashMeta;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faq extends Model

{

   use SoftDeletes, HasTrashMeta;

    protected $table = 'faq';

    protected $fillable = [
        'pertanyaan',
        'jawaban',
        'urutan',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }
}