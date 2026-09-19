<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test the actual search method logic
$searchQuery = 'Yogyakarta';
$kategori = 'barang';

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

echo "Provinsi from services: " . $provinsiFromServices->implode(', ') . "\n";
echo "Provinsi from kota table: " . $provinsiFromKotaTable->implode(', ') . "\n";

$allProvinsi = $provinsiFromServices->merge($provinsiFromKotaTable)->unique()->values();
echo "All provinsi: " . $allProvinsi->implode(', ') . "\n";

if ($allProvinsi->isNotEmpty()) {
    $targetProvinsi = $allProvinsi->toArray();
    $targetKotas = \App\Models\Kota::where('is_active', true)
        ->whereIn('provinsi', $targetProvinsi)
        ->pluck('nama')
        ->toArray();
    
    echo "\nTarget kotas from kota table: " . implode(', ', $targetKotas) . "\n";
    
    $serviceKotas = \App\Models\Service::where('kategori', $kategori)
        ->where('is_active', true)
        ->whereIn('provinsi', $targetProvinsi)
        ->distinct('kota')
        ->pluck('kota')
        ->filter()
        ->toArray();
    
    echo "Service kotas in target provinsi: " . implode(', ', $serviceKotas) . "\n";
    
    $targetKotas = array_unique(array_merge($targetKotas, $serviceKotas));
    echo "\nFinal target kotas: " . implode(', ', $targetKotas) . "\n";
}