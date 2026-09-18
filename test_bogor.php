<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test search for "Bogor"
$services = \App\Models\Service::query()
    ->where('kategori', 'barang')
    ->where('is_active', true)
    ->with('vendor:id,name,verification_status,jadwal_operasional')
    ->where('kota', 'Bogor')
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

echo "Search for 'Bogor':\n";
foreach ($services as $i => $service) {
    $orderable = $service->isOrderable();
    echo "{$i}. ID:{$service->id} | {$service->nama} | kota:{$service->kota} | verif:{$service->verification_status} | isOrderable: " . ($orderable ? 'true' : 'false') . "\n";
}

echo "\nSearch for 'KOTA BOGOR':\n";
$services2 = \App\Models\Service::query()
    ->where('kategori', 'barang')
    ->where('is_active', true)
    ->with('vendor:id,name,verification_status,jadwal_operasional')
    ->where('kota', 'KOTA BOGOR')
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

foreach ($services2 as $i => $service) {
    $orderable = $service->isOrderable();
    echo "{$i}. ID:{$service->id} | {$service->nama} | kota:{$service->kota} | verif:{$service->verification_status} | isOrderable: " . ($orderable ? 'true' : 'false') . "\n";
}