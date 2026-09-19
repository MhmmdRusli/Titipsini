<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Simulate the search query logic
$searchQuery = 'Yogyakarta';
$kategori = 'barang';

// 1. Get provinces from matching services
$provinsiFromServices = \App\Models\Service::where('kategori', $kategori)
    ->where('is_active', true)
    ->where(function ($q) use ($searchQuery) {
        $q->where('kota', 'like', "%{$searchQuery}%")
            ->orWhere('kecamatan', 'like', "%{$searchQuery}%")
            ->orWhere('provinsi', 'like', "%{$searchQuery}%");
    })
    ->whereNotNull('provinsi')
    ->where('provinsi', '!=', '')
    ->distinct('provinsi')
    ->pluck('provinsi');

$provinsiFromKotaTable = \App\Models\Kota::where('is_active', true)
    ->where('nama', 'like', "%{$searchQuery}%")
    ->pluck('provinsi');

$allProvinsi = $provinsiFromServices->merge($provinsiFromKotaTable)->unique()->values();

$targetProvinsi = [];
$targetKotas = [];
if ($allProvinsi->isNotEmpty()) {
    $targetProvinsi = $allProvinsi->toArray();
    $targetKotas = \App\Models\Kota::where('is_active', true)
        ->whereIn('provinsi', $targetProvinsi)
        ->pluck('nama')
        ->toArray();
    
    $serviceKotas = \App\Models\Service::where('kategori', $kategori)
        ->where('is_active', true)
        ->whereIn('provinsi', $targetProvinsi)
        ->distinct('kota')
        ->pluck('kota')
        ->filter()
        ->toArray();
    
    $targetKotas = array_unique(array_merge($targetKotas, $serviceKotas));
}

echo "Target kotas: " . implode(', ', $targetKotas) . "\n";
echo "Target provinsi: " . implode(', ', $targetProvinsi) . "\n\n";

// Build query like controller
$services = \App\Models\Service::query()
    ->where('kategori', $kategori)
    ->where('is_active', true)
    ->when($targetKotas || $targetProvinsi, function ($query) use ($targetKotas, $targetProvinsi, $searchQuery) {
        if ($targetKotas) {
            $query->whereIn('kota', $targetKotas);
        }
        if ($targetProvinsi && empty($targetKotas)) {
            $query->whereIn('provinsi', $targetProvinsi);
        }
        if ($searchQuery) {
            $query->orWhere(function ($q) use ($searchQuery) {
                $q->where('kota', 'like', "%{$searchQuery}%")
                    ->orWhere('kecamatan', 'like', "%{$searchQuery}%")
                    ->orWhere('provinsi', 'like', "%{$searchQuery}%");
            });
        }
    })
    ->get();

echo "Services found:\n";
foreach ($services as $s) {
    $orderable = $s->isOrderable();
    echo "  ID:{$s->id} | {$s->nama} | kota:{$s->kota} | provinsi:{$s->provinsi} | orderable: " . ($orderable ? 'true' : 'false') . "\n";
}