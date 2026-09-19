<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check all provinsi in kota table and services
echo "Kota table provinsi:\n";
$kotas = \App\Models\Kota::where('is_active', true)->get(['nama', 'provinsi']);
foreach ($kotas as $k) {
    echo "  {$k->nama} | {$k->provinsi}\n";
}

echo "\nService provinsi:\n";
$services = \App\Models\Service::where('kategori', 'barang')
    ->where('is_active', true)
    ->whereNotNull('provinsi')
    ->where('provinsi', '!=', '')
    ->distinct('provinsi')
    ->pluck('provinsi');
foreach ($services as $p) {
    echo "  {$p}\n";
}