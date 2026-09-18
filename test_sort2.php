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

echo "Before sorting:\n";
foreach ($services as $i => $service) {
    $isOrderable = $service->isOrderable();
    $sedangTutup = false;
    if ($isOrderable) {
        $sedangTutup = $service->vendor->jadwalOperasionalValid() && !$service->isOpenNow();
    }
    echo "{$i}. ID:{$service->id} | {$service->nama} | isOrderable: " . ($isOrderable ? 'true' : 'false') 
        . " | sedangTutup: " . ($sedangTutup ? 'true' : 'false') . "\n";
}

// Check current time
$now = now('Asia/Jakarta');
echo "\nCurrent time (Jakarta): " . $now->format('l H:i:s') . "\n";
echo "Day: " . $now->format('l') . "\n";

// Check each service's schedule for today
foreach ($services as $service) {
    if ($service->vendor && $service->vendor->jadwal_operasional) {
        $day = strtolower($now->format('l'));
        $schedule = $service->vendor->jadwal_operasional[$day] ?? null;
        if ($schedule && $schedule['aktif']) {
            echo "\n{$service->nama} - Today ({$day}): ACTIVE\n";
            foreach ($schedule['slots'] as $slot) {
                if ($slot['aktif'] && $slot['jam_buka'] && $slot['jam_tutup']) {
                    echo "  Slot: {$slot['jam_buka']} - {$slot['jam_tutup']}\n";
                    $buka = substr($slot['jam_buka'], 0, 5);
                    $tutup = substr($slot['jam_tutup'], 0, 5);
                    $nowTime = $now->format('H:i');
                    $isOpen = $nowTime >= $buka && $nowTime <= $tutup;
                    echo "  Now: {$nowTime} | Open: " . ($isOpen ? 'YES' : 'NO') . "\n";
                }
            }
        } else {
            echo "\n{$service->nama} - Today ({$day}): NOT ACTIVE\n";
        }
    }
}