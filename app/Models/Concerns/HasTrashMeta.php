<?php

namespace App\Models\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasTrashMeta
{
    protected static function bootHasTrashMeta(): void
    {
        static::deleting(function ($model) {
            if (method_exists($model, 'isForceDeleting') && $model->isForceDeleting()) {
                return;
            }

            $model->deleted_by = auth()->id();
            $model->saveQuietly();
        });
    }

    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    public function getSisaHariAttribute(): int
    {
        if (! $this->deleted_at) {
            return 30;
        }

        $hariTerlewat = (int) $this->deleted_at->copy()->startOfDay()->diffInDays(now()->startOfDay());

        return max(0, 30 - $hariTerlewat);
    }

    public function getSisaWaktuLabelAttribute(): string
    {
        $sisa = $this->sisa_hari;

        return $sisa <= 0 ? 'Hari ini' : "{$sisa} hari lagi";
    }
}