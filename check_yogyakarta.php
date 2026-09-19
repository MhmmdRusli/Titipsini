<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check if old services (ID 1) are included
$services = \App\Models\Service::query()
    ->where('kategori', 'barang')
    ->where('is_active', true)
    ->whereIn('kota', ['Yogyakarta', 'KABUPATEN BANTUL', 'KOTA YOGYAKARTA'])
    ->get();

echo "Services in Yogyakarta-related kotas:\n";
foreach ($services as $s) {
    echo "  ID:{$s->id} | {$s->nama} | kota:{$s->kota} | provinsi:{$s->provinsi}\n";
}