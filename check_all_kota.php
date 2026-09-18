<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check ALL services for ALL kota
$services = \App\Models\Service::where('kategori', 'barang')
    ->where('is_active', true)
    ->with('vendor:id,name,verification_status,jadwal_operasional')
    ->latest()
    ->get();

echo "ALL active barang services by kota:\n";
$byKota = $services->groupBy('kota');
foreach ($byKota as $kota => $items) {
    echo "\n=== KOTA: " . ($kota ?? '(empty)') . " ===\n";
    foreach ($items as $service) {
        $orderable = $service->isOrderable();
        echo "  ID:{$service->id} | {$service->nama} | verif:{$service->verification_status} | mitra:{$service->vendor?->verification_status} | jadwal: " . (!empty($service->vendor->jadwal_operasional) && $service->vendor->jadwal_operasional !== '[]' ? 'ada' : 'kosong') . " | isOrderable: " . ($orderable ? 'true' : 'false') . " | created: {$service->created_at}\n";
    }
}