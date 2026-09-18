<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test all kota that have services
$kotas = \App\Models\Service::where('kategori', 'barang')
    ->where('is_active', true)
    ->distinct('kota')
    ->pluck('kota')
    ->filter()
    ->values();

foreach ($kotas as $kota) {
    $services = \App\Models\Service::query()
        ->where('kategori', 'barang')
        ->where('is_active', true)
        ->with('vendor:id,name,verification_status,jadwal_operasional')
        ->where('kota', $kota)
        ->orderByRaw("
            CASE 
                WHEN services.verification_status = 'terverifikasi' 
                     AND EXISTS (
                         SELECT 1 FROM users 
                         WHERE users.id = services.user_id 
                         AND users.verification_status = 'terverifikasi'
                         AND users.jadwal_operasional IS NOT NULL
                         AND users.jadwal_operasional <> '[]'
                     ) THEN 1
                ELSE 2
            END
        ")
        ->latest()
        ->paginate(10);
    
    echo "=== {$kota} ===\n";
    foreach ($services as $i => $service) {
        $orderable = $service->isOrderable();
        echo "  {$i}. ID:{$service->id} | {$service->nama} | verif:{$service->verification_status} | isOrderable: " . ($orderable ? 'true' : 'false') . "\n";
    }
}