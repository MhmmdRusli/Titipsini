<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrivacyPolicy extends Model
{
    protected $fillable = ['content'];

    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1]);
    }
}