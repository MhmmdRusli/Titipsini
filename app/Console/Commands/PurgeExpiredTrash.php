<?php

namespace App\Console\Commands;

use App\Support\Trash\TrashRegistry;
use Illuminate\Console\Command;

class PurgeExpiredTrash extends Command
{
    protected $signature = 'trash:purge-expired';

    protected $description = 'Hapus permanen data di Sampah yang sudah melewati 30 hari sejak soft delete';

    public function handle(): int
    {
        $batasWaktu = now()->subDays(30);
        $totalDihapus = 0;

        foreach (TrashRegistry::types() as $key => $config) {
            $model = $config['model'];

            $query = $model::onlyTrashed()->where('deleted_at', '<=', $batasWaktu);
            $jumlah = $query->count();

            if ($jumlah === 0) {
                continue;
            }

            $query->get()->each(fn ($record) => $record->forceDelete());

            $totalDihapus += $jumlah;
            $this->info("{$config['label']}: {$jumlah} data dihapus permanen.");
        }

        $this->info("Selesai. Total {$totalDihapus} data dihapus permanen dari Sampah.");

        return self::SUCCESS;
    }
}