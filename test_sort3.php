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

$now = now('Asia/Jakarta');
$day = strtolower($now->format('l'));
$nowTime = $now->format('H:i');

echo "Current time (Jakarta): {$now->format('l H:i:s')}\n";
echo "Day: {$day}\n\n";

echo "Before sorting:\n";
foreach ($services as $i => $service) {
    $isOrderable = $service->isOrderable();
    $sedangTutup = false;
    
    if ($isOrderable && $service->vendor && $service->vendor->jadwal_operasional) {
        $schedule = $service->vendor->jadwal_operasional[$day] ?? null;
        if ($schedule && $schedule['aktif']) {
            // Check if any slot is currently active
            foreach ($schedule['slots'] as $slot) {
                if ($slot['aktif'] && $slot['jam_buka'] && $slot['jam_tutup']) {
                    $buka = substr($slot['jam_buka'], 0, 5);
                    $tutup = substr($slot['jam_tutup'], 0, 5);
                    if ($nowTime >= $buka && $nowTime <= $tutup) {
                        $sedangTutup = false; // Currently OPEN
                        break;
                    }
                }
            }
            // If we got here and no slot matched, it's closed for now
            $sedangTutup = true;
        } else {
            $sedangTutup = true; // Today not active
        }
    }
    
    $status = $isOrderable ? ($sedangTutup ? 'SEDANG TUTUP' : 'BUKA') : 'SEGERA TERSEDIA';
    echo "{$i}. ID:{$service->id} | {$service->nama} | isOrderable: " . ($isOrderable ? 'true' : 'false') 
        . " | sedangTutup: " . ($sedangTutup ? 'true' : 'false') 
        . " | {$status}\n";
}