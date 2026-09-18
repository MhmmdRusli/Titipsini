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

echo "Current time (Jakarta): {$now->format('l H:i:s')}\n\n";

foreach ($services as $i => $service) {
    echo "--- ID: {$service->id} | {$service->nama} ---\n";
    echo "Mitra: " . ($service->vendor?->name ?? 'none') . "\n";
    
    if ($service->vendor && $service->vendor->jadwal_operasional) {
        $schedule = $service->vendor->jadwal_operasional[$day] ?? null;
        echo "Today ({$day}) schedule: ";
        if ($schedule && $schedule['aktif']) {
            echo "ACTIVE\n";
            foreach ($schedule['slots'] as $slot) {
                if ($slot['aktif'] && $slot['jam_buka'] && $slot['jam_tutup']) {
                    $buka = substr($slot['jam_buka'], 0, 5);
                    $tutup = substr($slot['jam_tutup'], 0, 5);
                    $isOpen = $nowTime >= $buka && $nowTime <= $tutup;
                    echo "  Slot: {$buka} - {$tutup} | Now: {$nowTime} | Open: " . ($isOpen ? 'YES' : 'NO') . "\n";
                }
            }
        } else {
            echo "NOT ACTIVE\n";
        }
    }
    echo "\n";
}