<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check ALL services for this kota
$services = \App\Models\Service::where('kategori', 'barang')
    ->where('is_active', true)
    ->where('kota', 'KABUPATEN BANTUL')
    ->with('vendor:id,name,verification_status,jadwal_operasional')
    ->latest()
    ->get();

echo "ALL services for KABUPATEN BANTUL (is_active=true):\n";
foreach ($services as $service) {
    $orderable = $service->isOrderable();
    $case = $service->verification_status === 'terverifikasi' 
        && $service->vendor 
        && $service->vendor->verification_status === 'terverifikasi'
        && !empty($service->vendor->jadwal_operasional)
        && $service->vendor->jadwal_operasional !== '[]' ? 1 : 2;
    echo "ID:{$service->id} | {$service->nama} | verification:{$service->verification_status} | mitra:{$service->vendor?->verification_status} | jadwal: " . (!empty($service->vendor->jadwal_operasional) && $service->vendor->jadwal_operasional !== '[]' ? 'ada' : 'kosong') . " | isOrderable: " . ($orderable ? 'true' : 'false') . " | CASE: {$case} | created: {$service->created_at}\n";
}

echo "\n\nNow with ORDER BY CASE:\n";
$services2 = \App\Models\Service::query()
    ->where('kategori', 'barang')
    ->where('is_active', true)
    ->with('vendor:id,name,verification_status,jadwal_operasional')
    ->where('kota', 'KABUPATEN BANTUL')
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
    echo "{$i}. ID:{$service->id} | {$service->nama} | isOrderable: " . ($orderable ? 'true' : 'false') . "\n";
}