<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = \App\Models\Service::where('kategori', 'barang')->where('is_active', true)->latest()->first();
if ($service) {
    echo 'Service ID: ' . $service->id . PHP_EOL;
    echo 'Nama: ' . $service->nama . PHP_EOL;
    echo 'Kota: ' . $service->kota . PHP_EOL;
    echo 'is_active: ' . ($service->is_active ? 'true' : 'false') . PHP_EOL;
    echo 'verification_status: ' . $service->verification_status . PHP_EOL;
    echo 'Mitra ID: ' . $service->user_id . PHP_EOL;
    $mitra = $service->vendor;
    if ($mitra) {
        echo 'Mitra Name: ' . $mitra->name . PHP_EOL;
        echo 'Mitra verification_status: ' . $mitra->verification_status . PHP_EOL;
        echo 'Mitra jadwal_operasional: ' . json_encode($mitra->jadwal_operasional) . PHP_EOL;
        echo 'isOrderable: ' . ($service->isOrderable() ? 'true' : 'false') . PHP_EOL;
    }
} else {
    echo 'No active barang service found' . PHP_EOL;
}