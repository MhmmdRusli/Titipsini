<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$services = \App\Models\Service::where('kategori', 'barang')
    ->where('is_active', true)
    ->where('kota', 'KABUPATEN BANTUL')
    ->with('vendor:id,name,verification_status,jadwal_operasional')
    ->get();

foreach ($services as $service) {
    echo "--- ID: {$service->id} ---\n";
    echo "Nama: {$service->nama}\n";
    echo "kota: {$service->kota}\n";
    echo "verification_status: {$service->verification_status}\n";
    echo "is_active: " . ($service->is_active ? 'true' : 'false') . "\n";
    
    $mitra = $service->vendor;
    if ($mitra) {
        echo "Mitra: {$mitra->name}\n";
        echo "Mitra verification_status: {$mitra->verification_status}\n";
        echo "Mitra jadwal_operasional: " . json_encode($mitra->jadwal_operasional) . "\n";
    }
    
    // Check isOrderable
    echo "isOrderable: " . ($service->isOrderable() ? 'true' : 'false') . "\n";
    
    // Check the CASE condition
    $caseMatch = $service->verification_status === 'terverifikasi' 
        && $mitra 
        && $mitra->verification_status === 'terverifikasi'
        && !empty($mitra->jadwal_operasional)
        && $mitra->jadwal_operasional !== '[]';
    echo "CASE match: " . ($caseMatch ? 'true (ORDER 1)' : 'false (ORDER 2)') . "\n";
}