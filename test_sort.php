<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test search for KABUPATEN BANTUL with sorting
$services = \App\Models\Service::query()
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

// Transform like the controller
$collection = $services->getCollection()->map(function ($service) {
    $formatted = app(\App\Http\Controllers\Customer\ServiceController::class)->formatMitraKendaraan($service);
    
    // Check sedang_tutup_hari_ini
    $sedangTutup = false;
    if ($formatted['is_orderable'] !== false) {
        $controller = app(\App\Http\Controllers\Customer\ServiceController::class);
        $sedangTutup = $controller->sedangTutupHariIni($service);
    }
    $formatted['sedang_tutup_hari_ini'] = $sedangTutup;
    
    $formatted['sort_priority'] = match (true) {
        $formatted['is_orderable'] !== false && !$formatted['sedang_tutup_hari_ini'] => 1,
        $formatted['is_orderable'] !== false && $formatted['sedang_tutup_hari_ini'] => 2,
        default => 3,
    };
    return $formatted;
});

$sorted = $collection->sortBy('sort_priority')->values();

echo "Sorted results:\n";
foreach ($sorted as $i => $s) {
    $status = match($s['sort_priority']) {
        1 => 'BUKA',
        2 => 'SEDANG TUTUP',
        3 => 'SEGERA TERSEDIA',
    };
    echo "{$i}. ID:{$s['id']} | {$s['nama']} | is_orderable: " . ($s['is_orderable'] !== false ? 'true' : 'false') 
        . " | sedang_tutup: " . ($s['sedang_tutup_hari_ini'] ? 'true' : 'false') 
        . " | priority: {$s['sort_priority']} ({$status})\n";
}