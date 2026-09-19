<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test nearby search for "Yogyakarta"
$searchQuery = 'Yogyakarta';

$matchedKotas = \App\Models\Kota::where('is_active', true)
    ->where(function ($q) use ($searchQuery) {
        $q->where('nama', 'like', "%{$searchQuery}%");
    })
    ->pluck('provinsi')
    ->unique();

echo "Matched provinsi for '{$searchQuery}':\n";
foreach ($matchedKotas as $prov) {
    echo "  - {$prov}\n";
}

if ($matchedKotas->isNotEmpty()) {
    $targetKotas = \App\Models\Kota::where('is_active', true)
        ->whereIn('provinsi', $matchedKotas)
        ->pluck('nama')
        ->toArray();
    
    echo "\nTarget kotas (same province):\n";
    foreach ($targetKotas as $kota) {
        echo "  - {$kota}\n";
    }
    
    // Test services query
    $services = \App\Models\Service::query()
        ->where('kategori', 'barang')
        ->where('is_active', true)
        ->whereIn('kota', $targetKotas)
        ->with('vendor:id,name,verification_status,jadwal_operasional')
        ->get();
    
    echo "\nServices found:\n";
    foreach ($services as $s) {
        $orderable = $s->isOrderable();
        echo "  ID:{$s->id} | {$s->nama} | {$s->kota} | orderable: " . ($orderable ? 'true' : 'false') . "\n";
    }
}