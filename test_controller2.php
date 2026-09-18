<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test the query exactly as in controller
$kota = 'KABUPATEN BANTUL';
$kategori = 'barang';

$services = \App\Models\Service::query()
    ->where('kategori', $kategori)
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

// Now apply the exact same logic as in controller
$collection = $services->getCollection()->transform(function ($service) use ($app) {
    $controller = app(\App\Http\Controllers\Customer\ServiceController::class);
    $formatted = $controller->formatMitraKendaraan($service);
    $formatted['sort_priority'] = match (true) {
        $formatted['is_orderable'] !== false && !$formatted['sedang_tutup_hari_ini'] => 1,
        $formatted['is_orderable'] !== false && $formatted['sedang_tutup_hari_ini'] => 2,
        default => 3,
    };
    return $formatted;
})->sortBy('sort_priority')->values();

$services->setCollection($collection);

echo "Test results:\n";
foreach ($services->items() as $i => $m) {
    $status = match($m['sort_priority'] ?? 99) {
        1 => 'BUKA',
        2 => 'SEDANG TUTUP',
        3 => 'SEGERA TERSEDIA',
        default => 'UNKNOWN',
    };
    echo "{$i}. ID:{$m['id']} | {$m['nama']} | is_orderable: " . ($m['is_orderable'] !== false ? 'true' : 'false') 
        . " | sedang_tutup: " . ($m['sedang_tutup_hari_ini'] ? 'true' : 'false') 
        . " | priority: {$m['sort_priority']} ({$status})\n";
}