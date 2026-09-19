<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test capacity methods
$service = \App\Models\Service::where('kategori', 'barang')->where('jumlah_tampung', '>', 0)->first();

if ($service) {
    echo "Service: {$service->nama}\n";
    echo "Total capacity: {$service->jumlah_tampung}\n";
    echo "Active orders: " . $service->getActiveOrdersCount() . "\n";
    echo "Remaining: " . $service->getRemainingCapacity() . "\n";
    echo "Is full: " . ($service->isFull() ? 'true' : 'false') . "\n";
    
    $capData = $service->getCapacityData();
    echo "\nCapacity data for frontend:\n";
    print_r($capData);
} else {
    echo "No service with jumlah_tampung found\n";
}