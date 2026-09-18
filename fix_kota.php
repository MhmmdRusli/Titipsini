<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$services = \App\Models\Service::where('kategori', 'barang')
    ->where(function($q) {
        $q->whereNull('kota')->orWhere('kota', '');
    })
    ->whereNotNull('kabupaten_kota')
    ->where('kabupaten_kota', '!=', '')
    ->get();

echo "Found {$services->count()} services to fix\n";

foreach ($services as $service) {
    $oldKota = $service->kota;
    $service->kota = $service->kabupaten_kota;
    $service->save();
    echo "Fixed ID {$service->id}: kota '{$oldKota}' -> '{$service->kota}'\n";
}

echo "Done!\n";