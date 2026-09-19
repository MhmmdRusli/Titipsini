<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test search method with kota=Yogyakarta
$kotaFilter = 'Yogyakarta';
$searchQuery = '';
$kategori = 'barang';

$provinsi = \App\Models\Kota::where('nama', $kotaFilter)
    ->where('is_active', true)
    ->value('provinsi');

echo "Provinsi for {$kotaFilter}: " . ($provinsi ?? 'N/A') . "\n";

if ($provinsi) {
    $targetKotas = \App\Models\Kota::where('provinsi', $provinsi)
        ->where('is_active', true)
        ->pluck('nama')
        ->toArray();
    
    echo "Target kotas from kota table: " . implode(', ', $targetKotas) . "\n";
    
    $serviceKotas = \App\Models\Service::where('kategori', $kategori)
        ->where('is_active', true)
        ->whereIn('provinsi', [$provinsi])
        ->distinct('kota')
        ->pluck('kota')
        ->filter()
        ->toArray();
    
    echo "Service kotas in provinsi: " . implode(', ', $serviceKotas) . "\n";
    
    $targetKotas = array_unique(array_merge($targetKotas, $serviceKotas));
    echo "Final target kotas: " . implode(', ', $targetKotas) . "\n";
    
    $services = \App\Models\Service::query()
        ->where('kategori', $kategori)
        ->where('is_active', true)
        ->whereIn('kota', $targetKotas)
        ->get();
    
    echo "\nServices found:\n";
    foreach ($services as $s) {
        $orderable = $s->isOrderable();
        echo "  ID:{$s->id} | {$s->nama} | kota:{$s->kota} | provinsi:{$s->provinsi} | orderable: " . ($orderable ? 'true' : 'false') . "\n";
    }
}