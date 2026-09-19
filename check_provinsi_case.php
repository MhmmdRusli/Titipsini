<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check kota table provinsi values
$kotas = \App\Models\Kota::where('is_active', true)->get(['nama', 'provinsi']);
echo "Kota table:\n";
foreach ($kotas as $k) {
    echo "  {$k->nama} | {$k->provinsi}\n";
}

// Check service provinsi values
$services = \App\Models\Service::where('kategori', 'barang')
    ->where('is_active', true)
    ->whereNotNull('provinsi')
    ->where('provinsi', '!=', '')
    ->distinct('provinsi')
    ->pluck('provinsi');

echo "\nService provinsi values:\n";
foreach ($services as $p) {
    echo "  {$p}\n";
}