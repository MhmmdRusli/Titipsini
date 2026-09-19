<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test nearby search for "Yogyakarta"
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

echo "Provinsi from services matching '{$searchQuery}':\n";
foreach ($provinsiFromServices as $p) {
    echo "  - {$p}\n";
}

// 2. Also check kota table for matching city names
$provinsiFromKotaTable = \App\Models\Kota::where('is_active', true)
    ->where('nama', 'like', "%{$searchQuery}%")
    ->pluck('provinsi');

echo "\nProvinsi from kota table matching '{$searchQuery}':\n";
foreach ($provinsiFromKotaTable as $p) {
    echo "  - {$p}\n";
}

$allProvinsi = $provinsiFromServices->merge($provinsiFromKotaTable)->unique()->values();

if ($allProvinsi->isNotEmpty()) {
    $targetProvinsi = $allProvinsi->toArray();
    echo "\nAll target provinsi:\n";
    foreach ($targetProvinsi as $p) {
        echo "  - {$p}\n";
    }
    
    $targetKotas = \App\Models\Kota::where('is_active', true)
        ->whereIn('provinsi', $targetProvinsi)
        ->pluck('nama')
        ->toArray();
    
    echo "\nTarget kotas from kota table:\n";
    foreach ($targetKotas as $k) {
        echo "  - {$k}\n";
    }
    
    // Also include cities from services that match the province
    $serviceKotas = \App\Models\Service::where('kategori', $kategori)
        ->where('is_active', true)
        ->whereIn('provinsi', $targetProvinsi)
        ->distinct('kota')
        ->pluck('kota')
        ->filter()
        ->toArray();
    
    echo "\nService kotas in target provinsi:\n";
    foreach ($serviceKotas as $k) {
        echo "  - {$k}\n";
    }
    
    $targetKotas = array_unique(array_merge($targetKotas, $serviceKotas));
    
    echo "\nFinal target kotas:\n";
    foreach ($targetKotas as $k) {
        echo "  - {$k}\n";
    }
    
    // Test services query
    $services = \App\Models\Service::query()
        ->where('kategori', $kategori)
        ->where('is_active', true)
        ->whereIn('kota', $targetKotas)
        ->with('vendor:id,name,verification_status,jadwal_operasional')
        ->get();
    
    echo "\nServices found:\n";
    foreach ($services as $s) {
        $orderable = $s->isOrderable();
        echo "  ID:{$s->id} | {$s->nama} | {$s->kota} | provinsi:{$s->provinsi} | orderable: " . ($orderable ? 'true' : 'false') . "\n";
    }
}